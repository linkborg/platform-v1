import {Card, Text, Spinner, useClipboard, useTheme, useToasts} from "@geist-ui/core";
import React from "react";
import {TwitterTweetEmbed} from "react-twitter-embed";

function getTweetId(url) {
    const matches = url.match(/status\/(\d+)/);
    return matches ? matches[1] : null;
}

const TwitterCardBlock = ({data, layout}) => {

    const theme = useTheme();
    const twitter_theme = theme.type.endsWith("dark") ? "dark": "light";

    const { setToast } = useToasts()
    const { copy } = useClipboard()
    const copyHandler = (text) => {
        copy(text);
        setToast({ text: 'Link copied.' })
    }

    const tweet_id = getTweetId(data.tweet_url)

    return (
        theme &&
        <Card style={{width: layout === "column" ? "90%" : "100%", maxWidth: layout === "column" ? "450px" : "350px"}} mb={1.5}>
            <Text>{data?.title}</Text>
            <TwitterTweetEmbed
                tweetId={tweet_id}
                placeholder={<Spinner />}
                options={{
                    width : "100%",
                    maxWidth : layout === "column" ? 450 : 350,
                    theme: twitter_theme,
                }}
            />
        </Card>

    )
}

export default TwitterCardBlock;