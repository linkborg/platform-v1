import prisma from "@/lib/prisma";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import type { Link, Site } from ".prisma/client";
import type { Session } from "next-auth";
import { revalidate } from "@/lib/revalidate";

import type { WithSiteLink } from "@/types";

interface AllLinks {
    posts: Array<Link>;
    site: Site | null;
}

/**
 * Get Link
 *
 * Fetches & returns either a single or all links available depending on
 * whether a `linkId` query parameter is provided. If not all links are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getLink(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<AllLinks | (WithSiteLink | null)>> {
    const { linkId, siteId} = req.query;

    if (
        Array.isArray(linkId) ||
        Array.isArray(siteId) ||
        !session.user.id
    )
        return res.status(400).end("Bad request. Query parameters are not valid.");

    try {
        if (linkId) {
            const link = await prisma.link.findFirst({
                where: {
                    id: linkId,
                    site: {
                        user: {
                            id: session.user.id,
                        },
                    },
                },
                include: {
                    site: true,
                },
            });

            return res.status(200).json(link);
        }

        const site = await prisma.site.findFirst({
            where: {
                id: siteId,
                user: {
                    id: session.user.id,
                },
            },
        });

        const links = !site
            ? []
            : await prisma.link.findMany({
                where: {
                    site: {
                        id: siteId,
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        return res.status(200).json({
            links,
            site,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}

/**
 * Create Link
 *
 * Creates a new link from a provided `siteId` query parameter.
 *
 * Once created, the sites new `linkId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createLink(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<{
    linkId: string;
}>> {
    const { siteId } = req.query;

    const {
        title,
        longurl,
        slug,
        hidden,
        social,
        image
    } = req.body;

    if (!siteId || typeof siteId !== "string" || !session?.user?.id) {
        return res
            .status(400)
            .json({ error: "Missing or misconfigured site ID or session ID" });
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

    try {
        const response = await prisma.link.create({
            data: {
                title: title,
                longurl: longurl,
                slug: slug,
                image: image,
                site: {
                    connect: {
                        id: siteId,
                    },
                },
                hidden: hidden as boolean,
                social: social as boolean
            },
        });

        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}

/**
 * Delete Link
 *
 * Deletes a link from the database using a provided `linkId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteLink(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse> {
    const { linkId } = req.query;

    if (!linkId || typeof linkId !== "string" || !session?.user?.id) {
        return res
            .status(400)
            .json({ error: "Missing or misconfigured site ID or session ID" });
    }

    const site = await prisma.site.findFirst({
        where: {
            links: {
                some: {
                    id: linkId,
                },
            },
            user: {
                id: session.user.id,
            },
        },
    });
    if (!site) return res.status(404).end("Site not found");

    try {
        const response = await prisma.link.delete({
            where: {
                id: linkId,
            },
            include: {
                site: {
                    select: { subdomain: true, customDomain: true },
                },
            },
        });

        console.log("Link deleted!")

        if (response?.site?.subdomain) {
            // revalidate for subdomain
            await revalidate(
                `https://${response.site?.subdomain}.linkb.org`, // hostname to be revalidated
                response.site.subdomain, // siteId
                response.slug // slugname for the post
            );
        }
        if (response?.site?.customDomain)
            // revalidate for custom domain
            await revalidate(
                `https://${response.site.customDomain}`, // hostname to be revalidated
                response.site.customDomain, // siteId
                response.slug // slugname for the post
            );

        return res.status(200).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}

/**
 * Update Link
 *
 * Updates a link & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - title
 *  - description
 *  - longurl
 *  - slug
 *  - image
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateLink(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<Link>> {
    const {
        title,
        longurl,
        slug,
        hidden,
        social,
        image
    } = req.body;

    const { linkId } = req.query;

    if (!linkId || typeof linkId !== "string" || !session?.user?.id) {
        return res
            .status(400)
            .json({ error: "Missing or misconfigured link ID or session ID" });
    }

    const site = await prisma.site.findFirst({
        where: {
            links: {
                some: {
                    id: linkId as string,
                },
            },
            user: {
                id: session.user.id,
            },
        },
    });
    if (!site) return res.status(404).end("Site not found");

    try {
        const link = await prisma.link.update({
            where: {
                id: linkId as string,
            },
            data: {
                title,
                longurl,
                slug,
                hidden,
                social,
                image
            },
        });
        return res.status(200).json(link);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
