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
        links: linksData
    } = req.body;

    const link_siteId = (siteId as string).replace(/[^a-zA-Z0-9/-]+/g, "");

    try {
        const linkUpdates = linksData.map((link: any) => ({
            where: { linkid_site_constraint: { id: link.id, siteId: link_siteId }},
            data: { order: link.order },
        }));

        await prisma.$transaction(linkUpdates.map((linkUpdate: any) => prisma.link.update(linkUpdate)));

        return res.status(200).json({"message": "ok"});
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
