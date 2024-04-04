import {Image, Card, Spacer, Text, useTheme, Display} from "@geist-ui/core";
import React from "react";

const ImageCardBlock = ({data, layout}) => {

    const theme = useTheme();

    const width = layout === "column" ? "90%" : "100%";
    const maxWidth = layout === "column" ? "450px" : "350px";

    return (
        <>
            {data.full_width === true || layout === "column" ?
                <div style={{width: layout === "column" ? "90%" : "100%", maxWidth: layout === "column" ? "450px": "375px", marginBottom: "0.5rem"}}>
                        <Image src={data.image_url} alt={"image"} style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: maxWidth,
                            maxHeight: maxWidth,
                            marginLeft: "auto", marginRight: "auto",
                            borderRadius: theme.layout.radius,
                        }} />
                </div>
                :
                <div style={{marginBottom: "0.5rem"}}>
                    <Card
                        width={10}
                        height={10}
                        style={{
                            marginRight: "auto",
                            marginLeft: "auto",
                            backgroundImage: `url(${data.image_url})`,
                            backgroundSize: "cover"
                        }}>
                        &nbsp;
                    </Card>
                    <Spacer />
                </div>
            }
        </>
    );
}

export default ImageCardBlock;
