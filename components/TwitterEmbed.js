import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@geist-ui/react'

const TwitterEmbed = ({ tweetId }) => {
    const [embedHtml, setEmbedHtml] = useState(null);

    useEffect(() => {
        axios
            .get(`https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/${tweetId}`)
            .then(response => setEmbedHtml(response.data.html))
            .catch(error => console.error('Error:', error));
    }, [tweetId]);

    return (
        <Card shadow style={{ width: '100%' }}>
            <div dangerouslySetInnerHTML={{ __html: embedHtml || '' }} />
        </Card>
    );
};

export default TwitterEmbed;
