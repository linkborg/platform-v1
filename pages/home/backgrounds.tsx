import React, { useEffect, useState, useRef } from 'react'
import {
    useTheme,
    Spinner,
    useKeyboard,
    KeyCode,
    Tag,
    Text,
    Spacer,
    Card,
    Keyboard,
    Button,
    Link,
    GeistProvider, CssBaseline
} from '@geist-ui/core'
import Image from 'next/image'
import Head from 'next/head'
import NiceLink from "@/components/NiceLink"
import {useDrag} from "@use-gesture/react";
import useBetterMediaQuery from "@/lib/use-better-media-query";
import * as ExifReader from 'exifreader';
import {Download, FullScreen, FullScreenClose, Code} from "@geist-ui/icons";

import jwt from 'jsonwebtoken';
import * as ackeeTracker from "ackee-tracker";
import Script from "next/script";

export async function getServerSideProps() {
    const token = jwt.sign({ foo: 'bar' }, process.env.BG_SECRET_KEY as string, { algorithm: 'HS256' });
    return { props: { token } };
}


const Home: React.FC = ({token} : any ) => {
    const theme = useTheme();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentImage, setCurrentImage] = useState<any>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const idleTimer = useRef<NodeJS.Timeout | null>(null)
    const [metadata, setMetadata] = useState<any>(null);

    const isAboveSM = useBetterMediaQuery('(min-width: 650px)')

    const bindDrag = useDrag((state) => {
        let direction = "none"

        if((state.swipe[0] === 0) && (state.swipe[1] === -1)){ direction = "up" }
        else if((state.swipe[0] === 0) && (state.swipe[1] === 1)){ direction = "down" }
        else if((state.swipe[0] === -1) && (state.swipe[1] === 0)){ direction = "left" }
        else if((state.swipe[0] === 1) && (state.swipe[1] === 0)){ direction = "right" }

        if (direction === "up") {
            fetchBackground();
        }
    }, {threshold: 10})

    const resetTimer = (): void => {
        setIsVisible(true)
        if (idleTimer.current) clearTimeout(idleTimer.current)
        idleTimer.current = setTimeout(() => setIsVisible(false), 3000)
    }

    const fetchBackground = async (): Promise<any> => {
        if ((typeof window !== 'undefined') && !loading) {
            setLoading(true)
            const width = window.innerWidth
            const height = window.innerHeight
            const imgUrl = `https://bg.linkb.org/generate/${width}/${height}?t=${Date.now()}`;
            // const imgUrl = `http://localhost:8080/generate/${width}/${height}?t=${Date.now()}`;
            const response = await fetch(imgUrl,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const blob = await response.blob();
            setCurrentImage(URL.createObjectURL(blob))
            const arrayBuffer = await new Response(blob).arrayBuffer();
            const metadata = ExifReader.load(arrayBuffer);
            setMetadata(metadata);
        }
    }

    const handleImageLoad = (event: any): void => {
        setLoading(false);
    }

    useKeyboard(
        () => {
            fetchBackground()
        },
        [KeyCode.Space]
    )

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', resetTimer)
            window.addEventListener('mousedown', resetTimer)
            // window.addEventListener('touchstart', resetTimer)
            fetchBackground()

            document.addEventListener('fullscreenchange', (event) => {
                if (document.fullscreenElement) {
                    setIsFullscreen(true);
                    // We’re going fullscreen
                } else {
                    setIsFullscreen(false);
                    // We’re exiting fullscreen
                }
            });
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('mousemove', resetTimer)
                window.removeEventListener('mousedown', resetTimer)
                // window.removeEventListener('touchstart', resetTimer)
            }
            if (idleTimer.current) clearTimeout(idleTimer.current)
        }
    }, [])

    const toggleFullscreen = () => {
        if(isFullscreen) {
            document.exitFullscreen();
        }else{
            document.body.requestFullscreen()
        }
    }

    useEffect(()=> {
        ackeeTracker.create(
            'https://analytics.linkb.org', {
                ignoreOwnVisits: false,
                detailed: true
            }
        ).record('b43ed6a0-6d55-4832-a6a0-956049a784f0')
    }, [])

    return (
        <>
            <Head>
                <title>Backgrounds - linkb.org</title>
                <link rel="icon" href={"/favicon.ico"} />
                <link rel="shortcut icon" type="image/x-icon" href={"/favicon.ico"} />
                <link rel="apple-touch-icon" sizes="180x180" href={"/logo.png"} />
                <meta name="theme-color" content="#7b46f6" />

                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <meta itemProp="name" content="linkborg" />
                <meta itemProp="description" content={"linkborg"} />
                <meta itemProp="image" content={"/logo.png"} />
                <meta name="description" content={"linkborg"} />
                <meta property="og:title" content={"linkborg"} />
                <meta property="og:description" content={"linkborg"} />
                <meta property="og:image" content={"/logo.png"}/>
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@xprilion" />
                <meta name="twitter:creator" content="@xprilion" />
                <meta name="twitter:title" content={"linkborg"} />
                <meta name="twitter:description" content={"linkborg"} />
                <meta name="twitter:image" content={"/logo.png"} />
            </Head>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-LSEF1MW8EG"
                strategy="afterInteractive"
                defer={true}
            />
            <Script id="google-analytics" strategy="afterInteractive" defer={true}>
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());
        
                  gtag('config', 'G-LSEF1MW8EG');
                `}
            </Script>
            <GeistProvider themeType={"dark"}>
                <CssBaseline />
            <div className="full-bg">
                <div className={"overlay-content"}
                     style={{
                         height: "auto",
                         width: "90vw",
                         top: "1rem",
                         flexDirection: "row",
                         background: "unset"
                     }}
                >
                    <Card style={{
                        width: "100%",
                        background: "rgba(0,0,0,0.5)",
                    }}>
                        <div style={{display: 'flex',
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            alignItems: "center"}}>
                            <div>
                                { isAboveSM ? (
                                    <Link href={currentImage} target={"_blank"} download={true}><Button scale={0.6} disabled={loading} auto icon={<Download />}>Download</Button></Link>
                                ) : (
                                    <Link href={currentImage} target={"_blank"} download={true}><Button scale={0.6} disabled={loading} auto icon={<Download />}></Button></Link>
                                ) }
                                <Link href={"https://bg.linkb.org"} target={"_blank"}><Button ml={1} scale={0.6} auto icon={<Code />}>API</Button></Link>

                            </div>
                            <Button
                                aria-label="Toggle Full Screen"
                                iconRight={ isFullscreen ? <FullScreenClose /> : <FullScreen />}
                                onClick={() => toggleFullscreen()}
                                auto scale={2/3} px={0.6} style={{borderRadius: "9999px", marginLeft: "0.5rem"}}
                            />
                        </div>
                    </Card>
                </div>

                <div className={"overlay-content"}
                     {...bindDrag()}
                     style={{
                         height: "auto",
                         width: "auto",
                         margin: "auto",
                         flexDirection: "row",
                         background: "unset"
                     }}
                >
                    <Card style={{
                        width: "100%",
                        background: "rgba(0,0,0,0.5)",
                        zIndex: -1
                    }}>
                        <div style={{display: 'flex',
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            alignItems: "center"}}>
                            <div>
                                { isAboveSM ? (<Text span style={{color: "white"}}>Press <Keyboard>Space</Keyboard> for next image</Text>) :
                                    (<Text span style={{color: "white"}}>Swipe Up for next image</Text>)}
                            </div>
                        </div>
                    </Card>
                </div>

                <div
                    {...bindDrag()}
                    style={{
                        display:  "flex" ,
                        opacity: loading ? 1 : 0,
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100vw",
                        zIndex: 999,
                        background: "rgba(0, 0, 0, 0.8)",
                        transition: "opacity 1s",
                        touchAction: "none"
                    }}
                >
                    <Spinner scale={2} style={{position: "fixed", margin: "auto", color: "white"}} />
                </div>
                {currentImage !== "" && (
                    <div className="image-container">
                        <Image
                            src={currentImage}
                            onLoadStart={() => setLoading(true)}
                            onLoadingComplete={handleImageLoad}
                            layout="fill"
                            objectFit="cover"
                            alt="Background image"
                            quality={100}
                            unoptimized={true}
                        />
                    </div>
                )}

                <div className={"overlay-content"}
                     style={{
                         height: "auto",
                         width: "90vw",
                         bottom: "5rem",
                         background: "unset"
                     }}
                >
                    { !isAboveSM && <a href="https://www.producthunt.com/posts/backgrounds-by-linkborg?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-backgrounds&#0045;by&#0045;linkborg" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=402699&theme=dark" alt="Backgrounds&#0032;by&#0032;Linkborg - A&#0032;free&#0044;&#0032;keyless&#0032;API&#0032;for&#0032;randomly&#0032;generated&#0032;abstract&#0032;images&#0046; | Product Hunt" style={{width: "250px", height: "54px"}} width="250" height="54" /></a> }

                </div>

                <div className={"overlay-content"}
                     style={{
                         height: "auto",
                         width: "90vw",
                         bottom: "1rem",
                         background: "unset"
                     }}
                >
                    <div className="footer_content">
                        <Tag type={"lite"} scale={1.5} style={{display: "flex", justifyContent: "center", flexDirection: "row", filter: "grayscale(100%)", alignItems: "center"}}>
                            <Image src={"/favicon.ico"} alt={"logo"} width={22} height={22} unoptimized={true} />
                            <Text  small ml={0.5}>linkborg</Text>
                        </Tag>
                        { isAboveSM && <a href="https://www.producthunt.com/posts/backgrounds-by-linkborg?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-backgrounds&#0045;by&#0045;linkborg" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=402699&theme=dark" alt="Backgrounds&#0032;by&#0032;Linkborg - A&#0032;free&#0044;&#0032;keyless&#0032;API&#0032;for&#0032;randomly&#0032;generated&#0032;abstract&#0032;images&#0046; | Product Hunt" style={{width: "250px", height: "54px"}} width="250" height="54" /></a> }
                        <div style={{
                            background: "rgba(0, 0, 0, 0.8)",
                            padding: "0.25rem 1rem",
                            borderRadius: theme.layout.radius
                        }}>
                            <Text span style={{color: "white"}}>&copy; <NiceLink href={"https://linkb.org"}>linkborg</NiceLink></Text>
                            <Text mx={0.25} span>&middot;</Text>
                            <NiceLink href={"https://linkb.org/terms"}>Terms</NiceLink>
                        </div>
                    </div>
                </div>
            </div>
            </GeistProvider>
            <style jsx>{`
              .full-bg {
                position: fixed;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .image-container {
                position: absolute;
                width: 100%;
                height: 100%;
              }
              .overlay-content {
                display: flex;
                position: fixed;
                opacity: ${isVisible ? 1 : 0};
                justify-content: center;
                align-items: center;
                z-index: 9999;
                background: rgba(0, 0, 0, 0.5);
                transition: opacity 1s;
              }
              .footer_content {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              }
            `}</style>
        </>
    )
}

export default Home
