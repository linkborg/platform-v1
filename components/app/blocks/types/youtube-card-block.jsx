import {Avatar, Button, Card, Spacer, Text, useClipboard, useToasts} from "@geist-ui/core";
import {Share2} from "@geist-ui/icons";
import React from "react";
import { useState } from 'react';

const YouTubeCardBlock = ({data, layout}) => {
    const { setToast } = useToasts()
    const { copy } = useClipboard()
    const copyHandler = (text) => {
        copy(text);
        setToast({ text: 'Link copied.' })
    }

    const getYouTubeId = (url) => {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const videoId = getYouTubeId(data.video_url);

    return (
        <>
            <Card style={{width: layout === "column" ? "90%" : "100%", maxWidth: layout === "column" ? "450px" : "350px"}} mb={1.5}>
                <Text>{data?.title}</Text>
                <div style={{position: 'relative', paddingBottom: '56.25%'}}>
                    <iframe
                        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
            </Card>
        </>
    )
}

export default YouTubeCardBlock;
