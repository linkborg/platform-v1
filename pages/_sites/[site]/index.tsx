import { useRouter } from "next/router";
import prisma from "@/lib/prisma";
import {
  Spinner,
  useToasts, useClipboard, GeistProvider, CssBaseline
} from '@geist-ui/core';

import type { GetStaticPaths, GetStaticProps } from "next";
import type { _SiteData, } from "@/types";
import type { ParsedUrlQuery } from "querystring";
import React from "react";
import {
  bwDarkTheme, bwLightTheme,
  cityLightsThemeDark, cityLightsThemeLight,
  DraculaTheme,
  GreenDarkTheme,
  GreenLightTheme,
  GruvboxDarkTheme,
  GruvboxLightTheme,
  HighContrastDarkTheme,
  HighContrastLightTheme, MaterialDarkTheme,
  MaterialLightTheme,
  MonokaiTheme, PaperDarkTheme, PaperLightTheme,
  RedDarkTheme,
  RedLightTheme,
  SapphireBlueDarkTheme,
  sapphireBlueTheme, SolarizedDarkTheme, SolarizedLightTheme, twitterThemeDark, twitterThemeLight
} from "@/lib/themes";
import SiteContent from "@/components/_sites/content";

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  stringifiedData: string;
}

export default function Index({ stringifiedData }: IndexProps) {

  const router = useRouter();
  if (router.isFallback) return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <Spinner style={{position: "fixed", margin: "auto"}} />
      </div>
  );

  const data = JSON.parse(stringifiedData) as _SiteData;

  return (
      <GeistProvider themes={[
        GreenLightTheme, GreenDarkTheme,
        RedLightTheme, RedDarkTheme,
        sapphireBlueTheme, SapphireBlueDarkTheme,
        HighContrastLightTheme, HighContrastDarkTheme,
        DraculaTheme, MonokaiTheme,
        GruvboxLightTheme, GruvboxDarkTheme,
        MaterialLightTheme, MaterialDarkTheme,
        SolarizedLightTheme, SolarizedDarkTheme,
        PaperLightTheme, PaperDarkTheme,
        cityLightsThemeDark, cityLightsThemeLight,
        twitterThemeDark, twitterThemeLight,
        bwDarkTheme, bwLightTheme
      ]} themeType={data.theme ? data.theme : "light"}>
        <CssBaseline />
        <SiteContent data={data ? data : {}} />
      </GeistProvider>
  );
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const [subdomains, customDomains] = await Promise.all([
    prisma.site.findMany({
      // you can remove this if you want to generate all sites at build time
      where: {
        subdomain: "demo",
      },
      select: {
        subdomain: true,
      },
    }),
    prisma.site.findMany({
      where: {
        NOT: {
          customDomain: null,
        },
        // you can remove this if you want to generate all sites at build time
        customDomain: "platformize.co",
      },
      select: {
        customDomain: true,
      },
    }),
  ]);

  const allPaths = [
    ...subdomains.map(({ subdomain }) => subdomain),
    ...customDomains.map(({ customDomain }) => customDomain),
  ].filter((path) => path) as Array<string>;

  return {
    paths: allPaths.map((path) => ({
      params: {
        site: path,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({
                                                                              params,
                                                                            }) => {
  if (!params) throw new Error("No path parameters found");

  let { site } = params;

  site =
      process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
          ? site
              .replace(`.linkb.org`, "")
          : site.replace(`.localhost:3000`, "");

  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    subdomain: site,
  };

  if (site.includes(".")) {
    filter = {
      customDomain: site,
    };
  }

  const data = (await prisma.site.findUnique({
    where: filter,
    include: {
      user: true,
      blocks : {
        orderBy: [
          {
            order: "asc",
          },
        ],
      },
    },
  })) as _SiteData;

  if (!data) return { notFound: true, revalidate: 10 };

  return {
    props: {
      stringifiedData: JSON.stringify(data),
    },
    revalidate: 60,
  };
};
