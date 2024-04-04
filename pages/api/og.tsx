import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import {SiteOgImage} from "@/components/_sites/OgImage";

export const config = {
    runtime: 'edge',
};

export default async function handler(request: NextRequest) {

    try {
        const { searchParams } = new URL(request.url);

        // ?title=<title>
        const hasName = searchParams.has('name');
        const name = hasName
            ? searchParams.get('name')?.slice(0, 40)
            : 'My Name';

        // ?title=<title>
        const hasImage = searchParams.has('image');
        const image = hasImage
            ? searchParams.get('image')?.slice(0, 255)
            : 'https://linkborgcdn.xpri.dev/linkborg/favicon.png';

        // ?title=<title>
        const hasCover = searchParams.has('cover');
        const cover = hasCover
            ? searchParams.get('cover')?.slice(0, 255)
            : 'https://linkborgcdn.xpri.dev/cover/cc806756-06f6-424d-ab9c-8d484682f247.jpeg';

        // ?title=<title>
        const hasBio = searchParams.has('bio');
        const bio = hasBio
            ? searchParams.get('bio')?.slice(0, 300)
            : 'My default bio';

        // ?title=<title>
        const hasSite = searchParams.has('site');
        const site = hasSite
            ? searchParams.get('site')?.slice(0, 80)
            : 'main.linkb.org';

        return new ImageResponse(
            (
                <SiteOgImage
                    name={decodeURIComponent(name as string)}
                    bio={decodeURIComponent(bio as string)}
                    socials = {{}}
                    site={decodeURIComponent(site as string)}
                    image={decodeURIComponent(image as string)}
                    cover={decodeURIComponent(cover as string)}
                />
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}