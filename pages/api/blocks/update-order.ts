import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== HttpMethod.PUT) {
        res.setHeader("Allow", [HttpMethod.PUT]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { siteId} = req.query;

    const {
        blocks: blocksData
    } = req.body;

    const block_siteId = (siteId as string).replace(/[^a-zA-Z0-9/-]+/g, "");

    try {
        const blockUpdates = blocksData.map((block: any) => ({
            where: { blockid_site_constraint: { id: block.id, siteId: block_siteId }},
            data: { order: block.order },
        }));

        await prisma.$transaction(blockUpdates.map((blockUpdate: any) => prisma.block.update(blockUpdate)));

        return res.status(200).json({"message": "ok"});
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
