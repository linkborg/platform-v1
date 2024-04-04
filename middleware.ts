import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {_SiteSlugData} from "@/types";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.linkb.org, demo.localhost:3000)
  const hostname = req.headers.get("host") || "linkb.org";

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.linkb.org`, "")
      : hostname.replace(`.localhost:3000`, "");


  // rewrites for app pages
  if (currentHost == "app") {
    if (
      url.pathname === "/login" &&
      (req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (hostname === "localhost:3000" || hostname === "linkb.org") {
    const exclude_patterns = [
      /^\/home(\/.*)?$/,
      /^\/blog(\/.*)?$/,
      /^\/tutorials(\/.*)?$/,
      /^\/terms(\/.*)?$/,
      /^\/privacy(\/.*)?$/,
      /^\/themes(\/.*)?$/,
      /^\/sitemap(\/.*)?$/,
      /^\/backgrounds(\/.*)?$/,
      /^\/(\/.*)?$/,
      /^\/links(\/.*)?$/,
      /^\/settings(\/.*)?$/,
      /^\/_vercel(\/.*)?$/,
      /^\/_next(\/.*)?$/
    ]
    const isMatch = exclude_patterns.some((pattern) => pattern.test(path));

    if (!isMatch) {
      return NextResponse.rewrite(
        new URL(`/_sites${path}.${hostname}`, req.url)
      );
    }
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  return NextResponse.rewrite(
    new URL(`/_sites/${currentHost}${path}`, req.url)
  );
}
