import cuid from "cuid";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

import type { Social, Site } from ".prisma/client";
import type { Session } from "next-auth";

/**
 * Get Social
 *
 * Fetches & returns either a single or all social links available for current user
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getSocialLink(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<Array<Social> | (Social | null)>> {

    if (!session.user.id)
        return res.status(500).end("Server failed to get session user ID");

    try {
        const socialLinks = await prisma.social.findMany({
            where: {
                user: {
                    id: session.user.id,
                },
            },
        });

        return res.status(200).json(socialLinks);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}

/**
 * Create Social Link
 *
 * Creates a new social link from a set of provided query parameters.
 * These include:
 *  - link
 *
 * Once created, the social Links new `socialLinkId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function createSocialLink(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<{
    socialLinkId: string;
}>> {

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { linkType, linkIcon, linkLink } = body;

    if (!session.user.id)
        return res.status(500).end("Server failed to get session user ID");

    try {
        const response = await prisma.social.create({
            data: {
                type: linkType,
                icon: linkIcon,
                link: linkLink,
                user: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
        });

        return res.status(201).json({
            socialLinkId: response.id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}

/**
 * Delete Social Link
 *
 * Deletes a social Link from the database using a provided `socialLinkId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function deleteSocialLink(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse> {
    if (!session?.user.id) return res.status(401).end("Unauthorized");

    const { socialLinkId } = req.query;

    if (!socialLinkId || typeof socialLinkId !== "string") {
        return res.status(400).json({ error: "Missing or misconfigured socialLinkId" });
    }

    const socialLink = await prisma.social.findFirst({
        where: {
            id: socialLinkId,
            user: {
                id: session.user.id,
            },
        },
    });
    if (!socialLink) return res.status(404).end("Social Link not found");

    if (Array.isArray(socialLink))
        return res
            .status(400)
            .end("Bad request. socialLinkId parameter cannot be an array.");

    try {
        await prisma.$transaction([
            prisma.social.delete({
                where: {
                    id: socialLinkId,
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
 * @param session - NextAuth.js session
 */
export async function updateSocialLink(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<Site>> {
    if (!session?.user.id) return res.status(401).end("Unauthorized");

    const {
        id,
        currentSubdomain,
        name,
        description,
        font,
        image,
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
                font,
                subdomain,
                image,
            },
        });

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
