import { addSubscriberToList, removeSubscriberFromList } from "@/lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function site(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).end();

    switch (req.method) {
        case HttpMethod.POST:
            return addSubscriberToList(req, res, session);
        case HttpMethod.DELETE:
            return removeSubscriberFromList(req, res, session);
        default:
            res.setHeader("Allow", [
                HttpMethod.POST,
                HttpMethod.DELETE,
            ]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
