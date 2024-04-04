import cuid from "cuid";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

import type { User } from ".prisma/client";
import type { Session } from "next-auth";
import {
    addSubscriber,
    removeSubscriber,
    addSubscriberToList as listmonk_addSubscriberToList,
    updateSubscriber as listmonk_updateSubscriber,
    removeSubscriberFromList as listmonk_removeSubscriberFromList
} from "@/lib/listmonk";

export async function getSubscriber(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<Array<User>>> {

    if (!session.user.id)
        return res.status(500).end("Server failed to get session user ID");

    const user = session.user;

    return res.json(user);
}

export async function createSubscriber(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<{
    socialLinkId: string;
}>> {

    if (!session.user.id)
        return res.status(500).end("Server failed to get session user ID");

    const email = session.user.email || "";
    let name = session.user.name || "";

    if (name.length === 0){
        name = email.split("@")[0]
    }

    const data = {
        email,
        name,
        status: "enabled",
        lists: [4],
        preconfirm_subscriptions: true
    }

    try {
        const response = await addSubscriber(data);

        const user = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                newsletter_id: response.data.id,
            },
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
export async function deleteSubscriber(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse> {
    if (!session?.user.id) return res.status(401).end("Unauthorized");

    const subscriber_id = session.user.newsletter_id || "";
    try {
        // const response = await listmonk_update_subscriber(subscriber_id, data);
        const response = await removeSubscriber(subscriber_id);
        console.log(response);

        return res.status(201);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
export async function updateSubscriber(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<User>> {
    if (!session?.user.id) return res.status(401).end("Unauthorized");

    console.log("kets begind update")

    const email = session.user.email || "";
    const subscriber_id = session.user.newsletter_id || "";
    let name = session.user.name || "";

    if (name.length === 0){
        name = email.split("@")[0]
    }

    const data = {
        email,
        name,
        status: "enabled",
        lists: [4],
        preconfirm_subscriptions: true
    }

    console.log("so far so good, data: ", data)

    try {
        const response = await listmonk_updateSubscriber(subscriber_id, data);

        console.log("result", response);

        return res.status(201).json(response);
    } catch (error) {
        console.error("error", error);
        return res.status(500).end(error);
    }
}

export async function addSubscriberToList(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse> {
    if (!session?.user.id) return res.status(401).end("Unauthorized");

    const subscriber_id = session.user.newsletter_id || "";

    try {
        const response = await listmonk_addSubscriberToList(subscriber_id);

        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}

export async function removeSubscriberFromList(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse> {
    if (!session?.user.id) return res.status(401).end("Unauthorized");

    const subscriber_id = session.user.newsletter_id || "";

    try {
        const response = await listmonk_removeSubscriberFromList(subscriber_id);

        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}


