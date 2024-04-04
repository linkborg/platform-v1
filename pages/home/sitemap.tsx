// Date format is YYYY-MM-DD
function generateSiteMap(sites: any[], baseUrl: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${baseUrl}</loc>        
        <lastmod>2023-06-01</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
     </url>
     <url>
       <loc>${baseUrl}/terms</loc>        
        <lastmod>2023-06-01</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
     </url>
     <url>
       <loc>${baseUrl}/privacy</loc>        
        <lastmod>2023-06-01</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
     </url>
     ${sites.map(({ id, updatedAt }) => {
            return `
               <url>
                   <loc>https://${id}.linkb.org</loc>
                   <priority>0.6</priority>
                   <lastmod>${updatedAt}</lastmod>
               </url>
             `;
        }).join("")
    }
   </urlset>
 `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ req, res }: any) {
    let baseUrl = "https://linkb.org";
    if (req.headers.host === "localhost:3000") {
        baseUrl = "http://localhost:3000"
    }
    // We make an API call to gather the URLs for our site
    const request = await fetch(`${baseUrl}/api/sitemap`);
    const sites = await request.json();

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(sites, baseUrl);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;