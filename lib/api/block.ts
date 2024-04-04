import prisma from "@/lib/prisma";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import type { Block, Site } from ".prisma/client";
import type { Session } from "next-auth";
import { revalidate } from "@/lib/revalidate";
import cuid from 'cuid';



import type {WithSiteBlock, WithSiteLink} from "@/types";

interface AllBlocks {
    blocks: Array<Block>;
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
export async function getBlock(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<AllBlocks | (WithSiteBlock | null)>> {
    const { blockId, siteId} = req.query;

    if (
        Array.isArray(blockId) ||
        Array.isArray(siteId) ||
        !session.user.id
    )
        return res.status(400).end("Bad request. Query parameters are not valid.");

    try {
        if (blockId) {
            const block = await prisma.block.findFirst({
                where: {
                    id: blockId,
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

            return res.status(200).json(block);
        }

        const site = await prisma.site.findFirst({
            where: {
                id: siteId,
                user: {
                    id: session.user.id,
                },
            },
        });

        const blocks = !site
            ? []
            : await prisma.block.findMany({
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
            blocks,
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
export async function createBlock(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<{
    linkId: string;
}>> {
    const { siteId } = req.query;

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
        include: {
            blocks: {
                select: {
                    id: true
                }
            }
        }
    });
    if (!site) return res.status(404).end("Site not found");

    const blockId = cuid();

    try {
        const response = await prisma.block.create({
            data: {
                id: blockId,
                title: "Untitled Block",
                slug: blockId,
                type: "card",
                image: "/placeholder.png",
                order: site.blocks.length + 1,
                site: {
                    connect: {
                        id: siteId,
                    },
                },
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
export async function deleteBlock(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse> {
    const { blockId } = req.query;

    if (!blockId || typeof blockId !== "string" || !session?.user?.id) {
        return res
            .status(400)
            .json({ error: "Missing or misconfigured site ID or session ID" });
    }

    const site = await prisma.site.findFirst({
        where: {
            blocks: {
                some: {
                    id: blockId,
                },
            },
            user: {
                id: session.user.id,
            },
        },
    });
    if (!site) return res.status(404).end("Site not found");

    try {
        const response = await prisma.block.delete({
            where: {
                id: blockId,
            },
            include: {
                site: {
                    select: { subdomain: true, customDomain: true },
                },
            },
        });

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
export async function updateBlock(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<Block>> {
    const {
        title,
        slug,
        description,
        hidden,
        type,
        image,
        data
    } = req.body;

    const { blockId } = req.query;

    if (!blockId || typeof blockId !== "string" || !session?.user?.id) {
        return res
            .status(400)
            .json({ error: "Missing or misconfigured link ID or session ID" });
    }

    const site = await prisma.site.findFirst({
        where: {
            blocks: {
                some: {
                    id: blockId as string,
                },
            },
            user: {
                id: session.user.id,
            },
        },
    });
    if (!site) return res.status(404).end("Site not found");

    try {
        const block = await prisma.block.update({
            where: {
                id: blockId as string,
            },
            data: {
                title,
                description,
                slug,
                hidden,
                type,
                image,
                data: data ? data : {},
            },
        });
        return res.status(200).json(block);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
