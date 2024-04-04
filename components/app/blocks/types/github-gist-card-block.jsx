import {Avatar, Button, Card, Code, Spacer, Text, useClipboard, useToasts} from "@geist-ui/core";
import { Share2 } from "@geist-ui/icons";
import React, {useEffect, useRef, useState} from "react";
import Head from "next/head";

import Gist from "react-gist";

function extractGistId(url) {
    const urlObject = new URL(url);
    const path = urlObject.pathname;

    // Remove leading slash
    return path.startsWith("/") ? path.slice(1) : path;
}

const GithubGistCardBlock = ({data, layout}) => {
    const { setToast } = useToasts();
    const { copy } = useClipboard();
    const copyHandler = (text) => {
        copy(text);
        setToast({ text: 'Link copied.' });
    }

    const [code, setCode] = useState("");
    const [gistId, setGistId] = useState("");

    useEffect(() => {
        const gistId = extractGistId(data.gist_url);
        setGistId(gistId);
    }, [data.gist_url]);

    return (
        <>
            <Card style={{width: layout === "column" ? "90%" : "100%", maxWidth: layout === "column" ? "450px" : "350px"}} mb={1.5}>
                <Text mb={0.6}>{data?.title}</Text>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Gist id={gistId} />
                </div>
            </Card>
        </>
    )
}

export default GithubGistCardBlock;
