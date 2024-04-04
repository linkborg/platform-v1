import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";
import {Session} from "next-auth";

export default async function SaveSiteSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== HttpMethod.POST) {
    res.setHeader("Allow", [HttpMethod.POST]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const data = JSON.parse(req.body);

  try {
    const response = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        image: data.image,
        bio: data.bio,
        newsletter: data.newsletter,
        theme: data.theme
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).end(error);
  }
}
