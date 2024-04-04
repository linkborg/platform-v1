
import {
    useTheme,
    useToasts,
    useClipboard,
    Text, Spacer
} from "@geist-ui/core";
import React, {useEffect, useState} from "react";
import ColumnLayout from "../../_sites/column-layout";
import GridLayout from "../../_sites/grid-layout";
import CardBlock from "./types/card-block";
import LinkBlock from "./types/link-block";

export default function PreviewSiteContent({ data }) {

    const theme = useTheme();
    const visibleBlocks = data.blocks.filter((block) => block.hidden !== true);
    const socialLinks = data.blocks.filter(block => block.type === "link" && block.data.social === true);

    const { setToast } = useToasts()
    const { copy } = useClipboard()

    const copyHandler = (text) => {
        copy(text)
        setToast({ text: 'Link copied.', type: "success" })
    }

    const shareUrl = encodeURIComponent(data.customDomain ? data.customDomain : `${data.subdomain}.linkb.org`);

    return (<>
        <div className="page__wrapper">
            <div className="page__content">
                {
                    data.layout === "column" && <ColumnLayout data={data} socialLinks={socialLinks} copyHandler={copyHandler} visibleBlocks={visibleBlocks} />
                }
                {
                    data.layout === "grid" && <GridLayout data={data} socialLinks={socialLinks} copyHandler={copyHandler} visibleBlocks={visibleBlocks} />
                }
            </div>
        </div>
        <style jsx>{`
          .page__content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            width: 100%;
            margin: 0 auto;
            padding: 0;
            box-sizing: border-box;
            color: ${theme.palette.foreground};
          }
          .profile_image img {
            border-radius: 9999px;
          }
          .card__action{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        `}</style>
    </>)
}