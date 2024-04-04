import { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        let favicon = $('link[rel="shortcut icon"]').attr('href')
            || $('link[rel="icon"]').attr('href')
            || $('link[rel="apple-touch-icon"]').attr('href');

        if (favicon && !favicon.startsWith('http')) {
            const urlObj = new URL(url);
            favicon = urlObj.protocol + '//' + urlObj.hostname + '/' + favicon;
        }

        // If no favicon found, try the default favicon paths
        if (!favicon) {
            const faviconPaths = ['/favicon.ico', '/favicon.png', '/favicon.jpg', '/favicon.svg'];
            for (const path of faviconPaths) {
                const faviconResponse = await fetch(`${url}${path}`);
                if (faviconResponse.ok) {
                    favicon = `${url}${path}`;
                    break;
                }
            }
        }

        return res.status(200).json({ favicon });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching favicon' });
    }
}
