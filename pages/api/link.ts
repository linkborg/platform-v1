import { createLink, deleteLink, getLink, updateLink } from "@/lib/api";
import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function link(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).end();

    switch (req.method) {
        case HttpMethod.GET:
            return getLink(req, res, session);
        case HttpMethod.POST:
            return createLink(req, res, session);
        case HttpMethod.DELETE:
            return deleteLink(req, res, session);
        case HttpMethod.PUT:
            return updateLink(req, res, session);
        default:
            res.setHeader("Allow", [
                HttpMethod.GET,
                HttpMethod.POST,
                HttpMethod.DELETE,
                HttpMethod.PUT,
            ]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
