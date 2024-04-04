import Head from "next/head";
import Script from "next/script";
import {
    Button,
    Card,
    Display,
    Divider,
    Grid,
    Link,
    Spacer,
    Text,
    useTheme,
    Image as GeistImage,
    useToasts,
    useClipboard,
    Avatar, Drawer, ButtonGroup, Snippet
} from "@geist-ui/core";
import {SocialIcon} from "react-social-icons";
import {Copy, Share} from "@geist-ui/icons";
import React, {useEffect, useState} from "react";
import * as ackeeTracker from 'ackee-tracker'
import ColumnLayout from "@/components/_sites/column-layout";
import SidebarLayout from "@/components/_sites/sidebar-layout";
import GridLayout from "@/components/_sites/grid-layout";


export default function SiteContent({ data }) {
    const theme = useTheme();

    useEffect(()=> {
        ackeeTracker.create(
            'https://analytics.linkb.org', {
                ignoreOwnVisits: false,
                detailed: true
            }
        ).record(data?.ackee_tracking_id);
    }, [data])

    const visibleBlocks = data.blocks.filter((block) => block.hidden !== true);
    const socialLinks = data.blocks.filter(block => block.type === "link" && block.data.social === true);

    const [shareDrawer, setShareDrawer] = useState(false);

    const { setToast } = useToasts()
    const { copy } = useClipboard()

    const copyHandler = (text) => {
        copy(text)
        setToast({ text: 'Link copied.', type: "success" })
    }


    const shareUrl = encodeURIComponent(data.customDomain ? data.customDomain : `${data.subdomain}.linkb.org`);
    const ogImage = `https://linkb.org/api/og?name=${encodeURIComponent(data.user.name ? data.user.name : data.user.email.split("@")[0])}&bio=${encodeURIComponent(data.user.bio)}&site=${shareUrl}&image=${encodeURIComponent(data.user.image)}&cover=${encodeURIComponent(data.image)}`;

    return (<>
        <Head>
            <title>{`${data.user?.name ? data.user?.name : data?.name}`}</title>
            <link rel="icon" href={data.user?.image ? data.user?.image : "/favicon.ico"} />
            <link rel="shortcut icon" type="image/x-icon" href={data.user?.image ? data.user?.image : "/favicon.ico"} />
            <link rel="apple-touch-icon" sizes="180x180" href={data.user?.image ? data.user?.image : "/favicon.ico"} />
            <meta name="theme-color" content="#7b46f6" />

            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <meta itemProp="name" content={ data.user.name ? data.user.name : "linkborg" }/>
            <meta itemProp="description" content={data.description ? data.description : "Linkborg" } />
            <meta itemProp="image" content={ogImage} />
            <meta property="og:title" content={ data.user.name ? data.user.name : "linkborg" } />
            <meta property="og:description" content={data.description ? data.description : "Linkborg" } />
            <meta property="og:image" content={ogImage}/>
            <meta property="og:type" content="website" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@linkbdotorg" />
            <meta name="twitter:creator" content="@xprilion" />
            <meta name="twitter:title" content={ data.user.name ? data.user.name : "linkborg" } />
            <meta name="twitter:description" content={data.description ? data.description : "Linkborg" } />
            <meta name="twitter:image" content={ogImage} />
        </Head>
        {
            data && data?.analytics_code && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${data?.analytics_code}`}
                        strategy="afterInteractive"
                        defer={true}
                    />
                    <Script id="google-analytics" strategy="afterInteractive" defer={true}>
                        {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());
        
                  gtag('config', '${data?.analytics_code}');
                `}
                    </Script>
                </>
            )
        }
        {
            data && (
                <>
                    <Button
                        aria-label="Share drawer"
                        iconRight={<Share />}
                        onClick={() => setShareDrawer(true)}
                        auto scale={2/3} px={0.6}
                        style={{
                            borderRadius: "9999px",
                            marginLeft: "0.5rem",
                            position: "fixed",
                            top: "0.5rem",
                            right: "0.5rem",
                            zIndex: 9999
                        }}
                    />
                    <div className="page__wrapper">
                        <div className="page__content">
                            {
                                data.layout === "column" && <ColumnLayout data={data} socialLinks={socialLinks} copyHandler={copyHandler} visibleBlocks={visibleBlocks} />
                            }
                            {
                                data.layout === "grid" && <GridLayout data={data} socialLinks={socialLinks} copyHandler={copyHandler} visibleBlocks={visibleBlocks} />
                            }
                            <div className="footer_content">
                                <Display>
                                    <Link href={"https://linkb.org"} color block>&copy; linkborg</Link>
                                </Display>
                            </div>
                            <Drawer style={{width: "100%", maxWidth: "500px"}} mx={"auto"} visible={shareDrawer} onClose={() => setShareDrawer(false)} placement={"bottom"}>
                                <Drawer.Title>Share this page</Drawer.Title>
                                <Drawer.Content>
                                    <Display>
                                        <GeistImage alt={"qr-code"} width={"200px"} height={"200px"} src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://${shareUrl}`} />
                                        <Spacer />
                                        <ButtonGroup vertical>
                                            <Button onClick={() => copyHandler(`https://${shareUrl}`)} style={{textTransform: "none"}} icon={<Copy size={24} />} auto>{shareUrl}</Button>
                                            <Link target={"_blank"} href={`https://www.facebook.com/sharer/sharer.php?u=https://${shareUrl}`}>
                                                <Button icon={<SocialIcon bgColor={ theme.type.endsWith("dark") ? "white" : ""} style={{height: 24, width: 24, marginRight: "0.5rem"}} network={"facebook"} />} auto>
                                                    Share on Facebook
                                                </Button>
                                            </Link>
                                            <Link target={"_blank"} href={`https://twitter.com/intent/tweet?url=https://${shareUrl}&text=${encodeURIComponent("Check out my @linkbdotorg page!")}`}>
                                                <Button icon={<SocialIcon bgColor={ theme.type.endsWith("dark") ? "white" : ""} style={{height: 24, width: 24, marginRight: "0.5rem"}} network={"twitter"} />} auto>
                                                    Share on Twitter
                                                </Button>
                                            </Link>
                                            <Link target={"_blank"} href={`https://wa.me/?text=${encodeURIComponent("Check out my linkb.org page: https://" + shareUrl)}`}>
                                                <Button icon={<SocialIcon bgColor={ theme.type.endsWith("dark") ? "white" : ""} style={{height: 24, width: 24, marginRight: "0.5rem"}} network={"whatsapp"} />} auto>
                                                    Share on Whatsapp
                                                </Button>
                                            </Link>
                                            <Link target={"_blank"} href={`https://www.linkedin.com/sharing/share-offsite/?url=https://${shareUrl}`}>
                                                <Button icon={<SocialIcon bgColor={ theme.type.endsWith("dark") ? "white" : ""} style={{height: 24, width: 24, marginRight: "0.5rem"}} network={"linkedin"} />} auto>
                                                    Share on LinkedIn
                                                </Button>
                                            </Link>
                                        </ButtonGroup>
                                        {/*<Button icon={< />} auto>Share to Facebook</Button>*/}
                                    </Display>
                                </Drawer.Content>
                            </Drawer>
                        </div>
                    </div>
                </>
            )
        }

        <style jsx>{`
          .page__content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            flex-wrap: wrap;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            transform: translateY(-15px);
            box-sizing: border-box;
          }
          .profile_image img {
            border-radius: 9999px;
          }
          .card__right{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          }
        `}</style>
    </>)
}