import React, {useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {Button, Input, Image, useTheme, ButtonGroup, Text, Spacer} from '@geist-ui/core';
import { useRef } from "react";
import getCroppedImg from "@/lib/get-cropped-image";
import ReactCrop, {centerCrop, makeAspectCrop} from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'


import Resizer from "react-image-file-resizer";
// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer = (Resizer.default || Resizer);

const R2Uploader = ({
    folder="",
    width=250,
    height=250,
    quality=90,
    aspect=1,
    imageUrl,
    saveFunction = () => {}
}) => {

    const theme = useTheme();

    const [selectedFile, setSelectedFile] = useState();
    const fileInputRef = useRef();

    const profileImageRef = useRef();
    const fileUrl = useRef();

    const [tempImage, setTempImage] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [croppedImage, setCroppedImage] = useState("");

    const [crop, setCrop] = useState({
        unit: 'px', // Can be 'px' or '%'
        x: 0,
        y: 0,
        width: width/3,
        height: height/3
    });

    function centerAspectCrop(
        mediaWidth,
        mediaHeight,
        aspect,
    ) {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight,
            ),
            mediaWidth,
            mediaHeight,
        )
    }

    function handleImageLoad(e) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
        makeClientCrop(crop);
    }

    async function makeClientCrop(crop) {
        if (profileImageRef && crop.width && crop.height) {
            const croppedImage = await getCroppedImg(
                profileImageRef.current,
                crop,
                'profile.jpeg'
            );
            setCroppedImage(croppedImage);
        }
    }

    const onCropComplete = crop => {
        makeClientCrop(crop);
    };

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                width,
                height,
                "JPEG",
                quality,
                0,
                (uri) => {
                    resolve(uri)
                },
                "base64"
            );
        });

    const handleChange = (e) => {
        setSelectedFile(URL.createObjectURL(e.target.files[0]));
        setTempImage(URL.createObjectURL(e.target.files[0]));
    };


    const handleSelectButtonClick = () => {
        fileInputRef.current.click();
    };


    const handleUpload = async () => {
        setImageUploading(true);

        const file = croppedImage;
        const uuid = uuidv4();
        let fileName = `${uuid}.jpeg`;

        if (folder.length > 0){
            fileName = folder + "/" + fileName
        }

        try {
            const base64String = await resizeFile(file);

            const response = await fetch('/api/r2presign', {
                method: 'POST',
                body: JSON.stringify({ filename: fileName, contenttype: 'image/jpeg' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const presignedUrl = await response.json();

            const responseToBlob = await fetch(base64String);
            const blob = await responseToBlob.blob();

            await fetch(presignedUrl, {
                method: 'PUT',
                body: blob,
                headers: {
                    "Content-Type": 'image/jpeg',
                },
            });

            const imageUrl = `https://linkborgcdn.xpri.dev/${fileName}`;
            saveFunction(imageUrl);
            setSelectedFile(null);
            setCroppedImage(null);
            setImageUploading(false);
        } catch (err) {
            console.log("Upload error", err);
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => handleChange(e)}
                style={{ display: 'none' }}
            />
            {selectedFile ? (
                <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    keepSelection={true}
                    aspect={aspect}
                    minWidth={50}
                    minHeight={50}
                    maxWidth={20000}
                    maxHeight={20000}
                    onComplete={onCropComplete}
                >
                    <img
                        src={tempImage}
                        style={{
                            height: "auto",
                            width: "auto",
                            maxWidth: "350px",
                            maxHeight: "200px",
                            minHeight: "75px",
                            minWidth: "75px"
                        }}
                        alt={"pic"}
                        ref={profileImageRef}
                        crossOrigin={"anonymous"}
                        onLoad={handleImageLoad}
                    />
                </ReactCrop>
            ) : (
                <Image
                    src={imageUrl}
                    style={{
                        maxWidth: "350px",
                        maxHeight: "200px",
                        minHeight: "75px",
                        minWidth: "75px"
                    }}
                    alt={"pic"}
                />
            )}
            <Spacer />
            <ButtonGroup disabled={imageUploading} type={"secondary-light"}>
                <Button scale={2/3} onClick={(e) => handleSelectButtonClick(e)}>Select</Button>
                <Button loading={imageUploading} disabled={!croppedImage} scale={2/3} onClick={()=>handleUpload()}>Save</Button>
            </ButtonGroup>
        </div>
    );
};

export default R2Uploader;