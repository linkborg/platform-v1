import {
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const key = req.body.filename; // get the filename from the request body

    try {
        const data =   await getSignedUrl(
            S3,
            new PutObjectCommand(
                {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    ContentType: req.body.contenttype
                }
            ),
            { expiresIn: 3600 }
        )

        res.status(200).json(data);
    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ error: 'Error creating presigned URL' });
    }
}
