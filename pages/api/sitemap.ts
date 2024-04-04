import { getAllSites } from "@/lib/api";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function site(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case HttpMethod.GET:
            return getAllSites(req, res);
        default:
            res.setHeader("Allow", [
                HttpMethod.GET
            ]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
