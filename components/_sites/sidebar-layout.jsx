import {Button, Grid, Text, Avatar, Link, Card, Display, Spacer, Divider} from '@geist-ui/core';
import { Share2 } from '@geist-ui/icons';
import Image from 'next/image';
import { SocialIcon, keyFor } from 'react-social-icons';
import NextLink from 'next/link';
import { useTheme } from '@geist-ui/core';
import {sanitizeLink} from "@/lib/sanitize-link";
import React from "react";

export default function SidebarLayout({data, socialLinks, visibleLinks, copyHandler}) {
    const theme = useTheme();

    return (
        <Grid.Container direction="row" justify="center" alignItems="center">
            <Grid xs={24} height={"200px"}>
                <Card shadow width={"100%"} style={{
                    backgroundImage: data?.image !== "/placeholder.png" ? "url(" + data?.image?.toString() + ")" : "url(https://source.unsplash.com/random/1024x200/?abstract)",
                    backgroundSize: "cover",
                    // filter: "grayscale(100%)"
                    zIndex: 9
                }}>
                </Card>
            </Grid>
            <Grid xs={24} style={{background: theme.palette.accents_1}}>
                <Grid.Container direction="column" justify="center" alignItems="center">
                    <Image
                        unoptimized={true}
                        src={data.user?.image ? data.user?.image : "/favicon.ico"}
                        height={100}
                        width={100}
                        style={{
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
                                            {data.user.bio}
                                        </Text>
                                        <Spacer/>
                                    </>
                                )
                            }
                        </>
                    </div>
                    {
                        (data.user?.socials?.length > 0 || socialLinks.length > 0) &&
                        <Display style={{padding: "0", margin: "0"}}>
                            {
                                data.user?.socials.map((item) => (
                                    <SocialIcon bgColor={theme.type.endsWith("dark") ? "white" : ""} url={item.link}
                                                key={item.id} style={{height: 35, width: 35, margin: "0.25rem"}}/>
                                ))
                            }
                            {
                                socialLinks.map((link) => (
                                    <SocialIcon bgColor={theme.type.endsWith("dark") ? "white" : ""}
                                                url={"https://" + data.subdomain + ".linkb.org" + "/" + link.slug}
                                                key={link.id} style={{height: 35, width: 35, margin: "0.25rem"}}
                                                network={keyFor(link.longurl)}/>
                                ))
                            }
                        </Display>
                    }
                </Grid.Container>
            </Grid>
            <Grid xs={24}>
                <Grid.Container direction="column" justify="center" alignItems="center" width={"100%"}>
                    <Spacer/>
                    <Divider/>
                    {
                        visibleLinks.length > 0 && visibleLinks.map((link) => {
                                const hostname = new URL(sanitizeLink(link.longurl)).hostname
                                let linkImageUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
                                return (
                                    !link.hidden && <div key={link.id} style={{width: "90%", maxWidth: "450px"}}>
                                        <NextLink href={"https://" + data.subdomain + ".linkb.org" + "/" + link.slug}>
                                            <Card width={"100%"}>
                                                <Card.Content style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <div className={"card__left"}>
                                                        <Avatar isSquare={true} scale={1} mr={0.5}
                                                                src={link.image && link.image !== "/placeholder.png" ? link.image : linkImageUrl}
                                                                alt={`${hostname}-icon`}/>
                                                        <Text span font={"1rem"}>{link.title}</Text>
                                                    </div>
                                                    <div className={"card__right"}>
                                                        <Button scale={0.5} px={0.6} auto iconRight={<Share2/>}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    copyHandler("https://" + data.subdomain + ".linkb.org" + "/" + link.slug);
                                                                }}/>
                                                    </div>
                                                </Card.Content>
                                            </Card>
                                        </NextLink>
                                        <Spacer/>
                                    </div>
                                )
                            }
                        )
                    }
                </Grid.Container>
            </Grid>
        </Grid.Container>
    );
}
