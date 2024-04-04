import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

import type { Site } from ".prisma/client";

/**
 * Get All Site
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getAllSites(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void | NextApiResponse<Array<Site> | (Site | null)>> {
    try {
        const sites = await prisma.site.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        bio: true,
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