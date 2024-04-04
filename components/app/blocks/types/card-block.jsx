import {Avatar, Button, Card, Spacer, Text, useClipboard, useToasts} from "@geist-ui/core";
import {Share2} from "@geist-ui/icons";
import React from "react";

const CardBlock = ({data, layout}) => {
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
                        <Card width={"100%"}>
                            <Text h3>{data?.title}</Text>
                            <Text p>{data?.content}</Text>
                        </Card>
                        <Spacer />
                    </div>
                )
            }

            {
                layout === "grid" && (
                    <div style={{marginBottom: "0.5rem"}}>
                        <Card width={10} height={10} style={{ marginRight: "auto", marginLeft: "auto"}}>
                            <Card.Content style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                <Text h3>{data?.title}</Text>
                                <Text p small>{data?.content}</Text>
                            </Card.Content>
                        </Card>
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

export default CardBlock;