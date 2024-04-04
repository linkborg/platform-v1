import { getTutorialsBySlug, getAllTutorials } from '@/lib/tutorials-api'
import markdownToHtml from '@/lib/markdownToHtml'
import type PostType from '@/types/blog-posts'

import { useRouter } from "next/router";
import PostBody from "@/components/tutorials/post-body";
import Head from 'next/head'
import Script from "next/script";
import React from "react";
import {Display, Divider, Image, Link, Page, Spacer, useTheme} from "@geist-ui/core";
import {LinkborgFooter} from "@/components/linkborg-footer";

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter();

  const title = `${post.title} | LinkBorg Blog`
  const theme = useTheme();

  return (
      <>
        <Head>
          <title>LinkBorg - Ultimate link sharing platform</title>
          <meta property="og:image" content={post.ogImage.url} />
        </Head>
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-LSEF1MW8EG"
            strategy="afterInteractive"
            defer={true}
        />
        <Script id="google-analytics" strategy="afterInteractive" defer={true}>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-LSEF1MW8EG');
          `}
        </Script>
          {router.isFallback ? (
              <>Loading</>
          ) : (
              <div className="content">
                <div className="centered_content">
                  <Spacer />
                  <Page dotBackdrop={true}>
                    <Page.Header paddingBottom={"1rem"}>
                      <Image src={post.ogImage.url} width={"100%"} alt={"Cover Image"} />
                      <Spacer />
                      <Spacer />
                      <h1>{post.title}</h1>
                    </Page.Header>
                    <Page.Content paddingTop={"0"}>
                      <PostBody content={post.content} />
                    </Page.Content>
                  </Page>
                </div>
                <Divider />
              </div>
          )}

        <style jsx>{`
          .content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: ${theme.layout.pageWidthWithMargin};
            max-width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
          }
          .centered_content {
            display: flex;
            flex-direction: column;
            justify-content: left;
            flex-grow: 1;
            text-align: left
          }
          .footer_content {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
        `}</style>
      </>
  );
}


type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {

  const post = getTutorialsBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])

  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllTutorials(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
