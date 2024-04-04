import {
    Avatar,
    Badge,
    Button,
    Card,
    Display,
    Divider,
    Grid,
    Spacer,
    Text,
    useClipboard,
    useToasts
} from "@geist-ui/core";
import Image from "next/image";
import {keyFor, SocialIcon} from "react-social-icons";
import {sanitizeLink} from "@/lib/sanitize-link";
import NextLink from "next/link";
import {Share2} from "@geist-ui/icons";
import React, { useState } from 'react';
import { useTheme } from '@geist-ui/core';
import CardBlock from "@/components/app/blocks/types/card-block";
import LinkBlock from "@/components/app/blocks/types/link-block";
import TwitterCardBlock from "@/components/app/blocks/types/twitter-card-block";
import YouTubeCardBlock from "@/components/app/blocks/types/youtube-card-block";
import GithubGistCardBlock from "@/components/app/blocks/types/github-gist-card-block";
import ImageCardBlock from "@/components/app/blocks/types/image-card-block";
import useAbstractArt from "@/lib/bg-generator/useAbstractArt";
import ThreadsCardBlock from "@/components/app/blocks/types/threads-card-block";

export default function ColumnLayout({data, socialLinks, visibleBlocks, copyHandler}) {
    const theme = useTheme();
    const [shareDrawer, setShareDrawer] = useState(false);
    const shareUrl = `${data.subdomain}.linkb.org`;

    // const coverUrl = useAbstractArt(900, 300, 30);

    const coverUrl = "https://bg-gen-a6ottir2fa-uc.a.run.app/generate/900/300";

    return (
        <Grid.Container direction="row" justify="center" alignItems="center">
            <Grid xs={24} height={"200px"}>
                <Card shadow width={"100%"} style={{
                    backgroundImage: data?.image !== "/placeholder.png" ? "url(" + data?.image?.toString() + ")" : `url(${coverUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // filter: "grayscale(100%)"
                    zIndex: 9
                }}>
                </Card>
            </Grid>
            <Grid xs={24} style={{background: theme.palette.accents_1}} px={1}>
                <Grid.Container direction="column" justify="center" alignItems="center">
                    <Image
                        unoptimized={true}
                        src={data.user?.image ? data.user?.image : "/favicon.ico"}
                        height={100}
                        width={100}
                        style={{
                            width: "100px",
                            borderRadius: "9999px",
                            transform: "translateY(-50px)",
                            zIndex: 999,
                            border: `4px solid ${theme.palette.accents_2}`,
                            boxShadow: `0px 1px 4px 0px ${theme.palette.accents_3}`
                        }}
                        alt={"User profile"}
                        blurDataURL={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAABdJREFUGFdj/P///38mplcMjCAGAxAAAGIVCOmaJNLtAAAAAElFTkSuQmCC"}
                        placeholder="blur"
                    />
                    <div style={{marginTop: "-50px"}}>
                        <>
                            <Spacer/>
                            <Text h3 style={{display: "block", textAlign: "center"}}>{data.user?.name}</Text>
                            {
                                data.user?.bio?.length > 0 && (
                                    <>
                                        <Text span small style={{display: "block", textAlign: "center"}}>
                                            {data.user?.bio}
                                        </Text>
                                        <Spacer/>
                                    </>
                                )
                            }
                        </>
                    </div>
                    {
                        (socialLinks.length > 0) &&
                        <Display style={{padding: "0", margin: "0"}}>
                            {
                                socialLinks.map((link) => (
                                    <SocialIcon bgColor={theme.type.endsWith("dark") ? "white" : ""}
                                                url={"https://" + data.subdomain + ".linkb.org" + "/" + link.slug}
                                                key={link.id} style={{height: 35, width: 35, margin: "0.25rem"}}
                                                network={keyFor(link.data.longurl)}/>
                                ))
                            }
                        </Display>
                    }
                    <div>
                        {
                            data.keywords?.split(",").map((keyword, index) => <Badge mx={0.25} key={`keyword-${index}`} type={"secondary"} style={{display: "inline-block"}}>{keyword}</Badge>)
                        }
                    </div>
                    <Spacer />
                </Grid.Container>
            </Grid>
            <Grid xs={24}>
                <Grid.Container direction="column" justify="center" alignItems="center" width={"100%"}>
                    <Spacer/>
                    <Divider/>
                    {
                        visibleBlocks?.map((block, index) => {
                            if(block.type === "card"){
                                return (
                                    <CardBlock key={`block-${block.id}-index-${index}`} data={block.data} layout={"column"} />
                                )
                            }
                            else if(block.type === "link"){
                                return (
                                    <LinkBlock
                                        key={`block-${block.id}-index-${index}`}
                                        layout={"column"}
                                        block={block}
                                        site={{
                                        subdomain: data.subdomain,
                                    }} />
                                )
                            }
                            else if(block.type === "tweet"){
                                return (
                                    <TwitterCardBlock key={`block-${block.id}-index-${index}`} layout={"column"} data={block.data}/>
                                )
                            }
                            else if(block.type === "youtube-video"){
                                return (
                                    <YouTubeCardBlock key={`block-${block.id}-index-${index}`} layout={"column"} data={block.data}/>
                                )
                            }
                            else if(block.type === "github-gist"){
                                return (
                                    <GithubGistCardBlock key={`block-${block.id}-index-${index}`} layout={"column"} data={block.data}/>
                                )
                            }
                            else if(block.type === "image"){
                                return (
                                    <ImageCardBlock key={`block-${block.id}-index-${index}`} layout={"column"} data={block.data}/>
                                )
                            }
                            else if(block.type === "threads-post"){
                                return (
                                    <ThreadsCardBlock key={`block-${block.id}-index-${index}`} layout={"column"} data={block.data}/>
                                )
                            }
                        })
                    }
                </Grid.Container>
            </Grid>
        </Grid.Container>
    )
}