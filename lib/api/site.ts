import cuid from "cuid";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

import type { Site } from ".prisma/client";
import type { Session } from "next-auth";

import { initializeApollo } from '@/lib/ackee-graphql';
import { gql } from '@apollo/client';

/**
 * Get Site
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getSite(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Site> | (Site | null)>> {
  const { siteId } = req.query;

  if (Array.isArray(siteId))
    return res
      .status(400)
      .end("Bad request. siteId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  try {
    if (siteId) {
      const settings = await prisma.site.findFirst({
        where: {
          id: siteId,
          user: {
            id: session.user.id,
          },
        },
      });

      let results  = <any> settings;
      const links = await prisma.link.findMany({
        where: {
          siteId: siteId
        },
      });

      results.linksCount = links?.length;
      results.linksVisits = links?.reduce((sum, link) => sum + link.visits, 0);

      return res.status(200).json(results);
    }

    const sites = await prisma.site.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            bio: true,
            email: true,
            image: true,
          },
        }
      }
    });

    return res.status(200).json(sites);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Site
 *
 * Creates a new site from a set of provided query parameters.
 * These include:
 *  - name
 *  - description
 *  - subdomain
 *  - userId
 *
 * Once created, the sites new `siteId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createSite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  siteId: string;
}>> {
  const { name, subdomain, description, userId } = req.body;

  const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");

  try {

    const apolloClient = initializeApollo();

    const addSiteToAckee = gql`
        mutation createDomain($input: CreateDomainInput!) {
            createDomain(input: $input) {
                payload {
                    id
                }
            }
        }
     `;

    const { data } = await apolloClient.mutate({
      mutation: addSiteToAckee,
      variables: { input: { title: `${ sub.length > 0 ? sub : cuid() }.linkb.org` }},
    });

    const domain = data.createDomain.payload;

    const response = await prisma.site.create({
      data: {
        id: sub,
        name: name,
        description: description,
        subdomain: sub.length > 0 ? sub : cuid(),
        logo: "/logo.png",
        image: `/placeholder.png`,
        ackee_tracking_id: domain.id,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(201).json({
      siteId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Site
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteSite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.id) return res.status(401).end("Unauthorized");
  const { siteId } = req.query;

  if (!siteId || typeof siteId !== "string") {
    return res.status(400).json({ error: "Missing or misconfigured site ID" });
  }

  const site = await prisma.site.findFirst({
    where: {
      id: siteId,
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end("Site not found");

  if (Array.isArray(siteId))
    return res
      .status(400)
      .end("Bad request. siteId parameter cannot be an array.");

  try {

    const apolloClient = initializeApollo();

    const deleteSiteFromAckee = gql`
        mutation deleteDomain($id: ID!) {
            deleteDomain(id: $id) {
                success
            }
        }
     `;

    await apolloClient.mutate({
      mutation: deleteSiteFromAckee,
      variables: { id: site?.ackee_tracking_id },
    });

    await prisma.$transaction([
      prisma.link.deleteMany({
        where: {
          site: {
            id: siteId,
          },
        },
      }),
      prisma.site.delete({
        where: {
          id: siteId,
        },
      }),
    ]);

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update site
 *
 * Updates a site & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - currentSubdomain
 *  - name
 *  - description
 *  - image
 *  - imageBlurhash
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateSite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Site>> {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.id) return res.status(401).end("Unauthorized");

  const {
    id,
    currentSubdomain,
    name,
    description,
    analytics_code,
    keywords,
    font,
    image,
      theme,
      layout
  } = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or misconfigured site ID" });
  }

  const site = await prisma.site.findFirst({
    where: {
      id,
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end("Site not found");

  const sub = req.body.subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");
  const subdomain = sub.length > 0 ? sub : currentSubdomain;

  try {
    const response = await prisma.site.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        keywords,
        analytics_code,
        font,
        subdomain,
        image,
        theme,
        layout
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
