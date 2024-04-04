import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";
import block from "@/types/block";

/*
 * Note: This endpoint is to check if a domain still has its nameservers/record configured correctly.
 * To request access to a domain that belongs to another team, you need to use the
 * `/verify` endpoint: https://vercel.com/docs/rest-api#endpoints/projects/verify-project-domain
 * You can see an implementation example here: https://github.com/vercel/examples/tree/main/solutions/domains-api
 */

export default async function post(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== HttpMethod.GET) {
        res.setHeader("Allow", [HttpMethod.GET]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { slug, siteId, blockId } = req.query;

    const block_slug = (slug as string).replace(/[^a-zA-Z0-9/-]+/g, "");
    const block_siteId = (siteId as string).replace(/[^a-zA-Z0-9/-]+/g, "");

    if (Array.isArray(slug))
        return res
            .status(400)
            .end("Bad request. slug parameter cannot be an array.");

    try {
        if(blockId) {
            const data = await prisma.block.findFirst({
                where: {
                    slug: block_slug,
                    siteId: block_siteId,
                    id: {
                        not: blockId as string
                    }
                },
            });

            const available = data === null && block_slug.length !== 0;

            return res.status(200).json(available);
        } else {
            const data = await prisma.block.findFirst({
                where: {
                    slug: block_slug,
                    siteId: block_siteId
                },
            });

            const available = data === null && block_slug.length !== 0;

            return res.status(200).json(available);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
