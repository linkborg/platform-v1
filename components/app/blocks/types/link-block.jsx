import {sanitizeLink} from "@/lib/sanitize-link";
import NextLink from "next/link";
import {Avatar, Button, Card, Spacer, Text, useClipboard, useToasts} from "@geist-ui/core";
import {Share2} from "@geist-ui/icons";
import React from "react";

const LinkBlock = ({block, site, layout}) => {
    const hostname = new URL(sanitizeLink(block.data.longurl)).hostname
    let linkImageUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

    const { setToast } = useToasts()
    const { copy } = useClipboard()
    const copyHandler = (text) => {
        copy(text);
        setToast({ text: 'Link copied.' })
    }

    return (
        <>
            {
                layout === "column" && (
                    <div style={{width: "90%", maxWidth: "450px"}}>
                        <NextLink href={"https://" + site.subdomain + ".linkb.org" + "/" + block.slug}>
                            <Card width={"100%"}>
                                <Card.Content style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div className={"card__left"}>
                                        <Avatar isSquare={true} scale={1} mr={0.5}
                                                src={block.image && block.image !== "/placeholder.png" ? block.image : linkImageUrl}
                                                alt={`${hostname}-icon`}/>
                                        <Text span font={"1rem"}>{block.data?.title}</Text>
                                    </div>
                                    <div className={"card__right"}>
                                        <Button scale={0.5} px={0.6} auto iconRight={<Share2/>}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                copyHandler("https://" + site.subdomain + ".linkb.org" + "/" + block.slug);
                                            }}/>
                                    </div>
                                </Card.Content>
                            </Card>
                        </NextLink>
                        <Spacer />
                    </div>
                )
            }
            {
                layout === "grid" && (
                    <div style={{marginBottom: "0.5rem"}}>
                        <NextLink href={"https://" + site.subdomain + ".linkb.org" + "/" + block.slug}>
                            <Card width={10} height={10} style={{ marginRight: "auto", marginLeft: "auto"}}>
                                <Card.Content style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                    <div className="card__head">
                                        <Avatar
                                            isSquare={true}
                                            scale={2}
                                            mr={0.5}
                                            src={block.image && block.image !== "/placeholder.png" ? block.image : linkImageUrl}
                                            alt={`${hostname}-icon`}
                                        />
                                        <Button
                                            scale={0.5} px={0.6}
                                            auto
                                            iconRight={<Share2/>}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                copyHandler("https://" + site.subdomain + ".linkb.org" + "/" + block.slug);
                                            }}
                                        />
                                    </div>
                                    <Text span font={"1rem"}>{block?.title}</Text>
                                </Card.Content>
                            </Card>
                        </NextLink>
                        <Spacer />
                    </div>
                )
            }
            <style jsx>{`
              .card__head{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              }
            `}</style>
        </>
    )
}

export default LinkBlock;