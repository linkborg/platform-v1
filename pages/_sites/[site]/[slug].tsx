import { useRouter } from "next/router";

import prisma from "@/lib/prisma";

import type { Meta, _SiteSlugData } from "@/types";
import type {GetServerSideProps} from "next";
import {Spinner} from "@geist-ui/core";

export const getServerSideProps: GetServerSideProps<any> = async ({req, params}) => {
  if (!params) throw new Error("No path parameters found");

  const { site, slug } = params;
  const site_str = String(site);
  const slug_str = String(slug);

  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    subdomain: site_str,
  };

  if (site_str.includes(".")) {
    filter = {
      customDomain: site_str,
    };
  }

  const data = (await prisma.block.findFirst({
    where: {
      site: {
        ...filter,
      },
      slug: slug_str,
    },
  })) as _SiteSlugData | null;

  try {
    const update = await prisma.block.update({
      where: {
        id: data?.id,
      },
      data: {
        visits: {
          increment: 1
        }
      },
    });
  } catch (e) {
    console.log(e);
  }

  let return_object = {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    }
  } as any;

  if (data?.type === "link"){
    const linkData = data?.data as any;
    return_object = {
      redirect: {
        permanent: false,
        destination: linkData.longurl,
      },
      props: {
        data: JSON.parse(JSON.stringify(data)),
      }
    };
  }

  return return_object;
};

export default function Page({
  data,
}: any) {
  const router = useRouter();
  if (router.isFallback) return <Spinner />;

  const meta = {
    description: data.description,
    logo: "/logo.png",
    ogImage: data.image,
    ogUrl: `https://${data.site?.subdomain}.linkb.org/${data.slug}`,
    title: data.data.title,
  } as Meta;

  return (
      <>
        {
          data.type === "link" && <>Redirecting. <a href={data.data.longurl} target={"_blank"}>Click here</a> if not redirected.</>
        }
      </>
  );
}