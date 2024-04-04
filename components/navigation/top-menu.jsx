import React, {useEffect, useState} from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import {Avatar, Button, useTheme, Popover, Text, User, Breadcrumbs, Link, Progress} from '@geist-ui/core';
import Image from 'next/image';
import UserSettings from '@/components/navigation/user-settings';
import { usePrefers } from '@/lib/use-prefers';
import {Sun, Moon, Home} from '@geist-ui/icons'
import { useSession } from "next-auth/react";
import {useRouter} from "next/router";
import NiceLink from "@/components/NiceLink";
import AppSubmenu from "@/components/navigation/app-submenu";
import SiteSubmenu from "@/components/navigation/site-submenu";

const TopMenu = () => {
    const theme = useTheme();
    const prefers = usePrefers();
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const host = typeof window !== 'undefined' ? window.location.host : '';
    const [homePage, setHomePage] = useState(false);
    const [userPage, setUserPage] = useState(true);
    const [appPage, setAppPage] = useState(false);
    const [sitePage, setSitePage] = useState(false);

    const [siteId, setSiteId] = useState("");
    const [lastPath, setLastPath] = useState("");

    const subMenuDisplay = false;

    useEffect(() => {
        const handleStart = () => { setLoading(true); };
        const handleComplete = () => { setLoading(false); };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    useEffect(() => {
        if (router.pathname === "/app/site/[id]"){
            let { id } = router.query;
            setLastPath("");
            setSiteId(id);
        }
        else if (router.pathname.startsWith("/app/site/[id]")){
            let { id } = router.query;
            let temp_lastPath = router.asPath.split('/').pop();
            setLastPath(temp_lastPath);
            setSiteId(id);
        }
        else {
            setSiteId("");
            setLastPath("");
        }
    }, [router])

    useEffect(() => {
        if (host) {
            if (
                (host === "linkb.org") ||
                (host === "app.linkb.org") ||
                (host === "app.localhost:3000") ||
                (host === "localhost:3000")
            ){
                setHomePage(false);
                setUserPage(false);
                setSitePage(false);
                setAppPage(false);

                if((host === "linkb.org") || (host === "localhost:3000")){
                    setHomePage(true);
                }

                if (
                    ((host === "app.linkb.org") || (host === "app.localhost:3000")) &&
                    ((router.pathname === "/app") || (router.pathname === "/app/settings"))
                ){
                    setAppPage(true);
                    setSitePage(false);
                    setHomePage(false);
                }
                else if (
                    ((host === "app.linkb.org") || (host === "app.localhost:3000")) &&
                    (router.pathname.startsWith("/app/site/[id]"))
                ){
                    setSitePage(true);
                    setAppPage(false);
                    setHomePage(false);
                }
            }
            else {
                setUserPage(true);
                setSitePage(false);
                setAppPage(false);
                setHomePage(false);
            }
        }
    }, [host, router])

    const session = useSession();

    return (
        <>
            {
                !userPage &&
                <>
                    <Head>
                        <title>
                            Linkborg
                        </title>
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
                    <nav className="menu-nav">
                        <div className="navbar-left">
                            <NextLink href={"/"} style={{display: "flex", alignItems: "center"}}>
                                <Image src="/favicon.ico" height={32} width={32} alt={"LinkBorg Logo"} />
                            </NextLink>
                            {
                                session.data ? (
                                    <Breadcrumbs marginLeft={1}>
                                        { session.data?.user?.name ?
                                            <Breadcrumbs.Item>
                                                { homePage ?
                                                    <NiceLink href={`https://app.${host}/`}>{`${session.data?.user?.name?.split(" ")[0]}`}</NiceLink>
                                                    :
                                                    <NiceLink href={"/"}>{`${session.data?.user?.name?.split(" ")[0]}`}</NiceLink>
                                                }
                                            </Breadcrumbs.Item>
                                            :
                                            <Breadcrumbs.Item>
                                                { homePage ?
                                                    <NiceLink href={`https://app.${host}/`}>Home</NiceLink>
                                                    :
                                                    <NiceLink href={"/"}>Home</NiceLink>
                                                }
                                            </Breadcrumbs.Item>
                                        }
                                        {
                                            router.pathname === "/app/settings" &&
                                            <Breadcrumbs.Item>
                                                <NiceLink href={`/settings`}>Settings</NiceLink>
                                            </Breadcrumbs.Item>
                                        }
                                        {
                                            router.pathname.startsWith("/app/site/[id]") &&
                                            <Breadcrumbs.Item>
                                                <NiceLink href={`/site/${siteId}`}>{siteId}</NiceLink>
                                            </Breadcrumbs.Item>
                                        }
                                        {
                                            (router.pathname.startsWith("/app/site/[id]") && lastPath?.length > 0) &&
                                            <Breadcrumbs.Item>
                                                <NiceLink  href={`/site/${siteId}/${lastPath}`}>
                                                    {lastPath}
                                                </NiceLink>
                                            </Breadcrumbs.Item>
                                        }
                                    </Breadcrumbs>
                                ) : (
                                    <Breadcrumbs marginLeft={1}>
                                        <Breadcrumbs.Item>
                                            <NiceLink href={"/"}>Linkborg</NiceLink>
                                        </Breadcrumbs.Item>
                                    </Breadcrumbs>
                                )
                            }
                        </div>
                        <div className="navbar-right">
                            { session.data ?
                                (
                                    <>
                                    <Popover content={<UserSettings />} placement="bottomEnd" portalClassName="user-settings__popover">
                                        <Button
                                            aria-label="User profile"
                                            icon={<Image style={{borderRadius: "9999px"}} src={ session.data.user?.image ? session.data.user?.image : "/avatar.png" } height={32} width={32} alt={"User profile picture"} />}
                                            auto scale={2/3} px={0.6} style={{borderRadius: "9999px", marginLeft: "0.5rem", padding: "0", display: "inherit"}}
                                        />
                                    </Popover>
                                    </>
                                ) : (
                                    homePage ?
                                        <NiceLink href={`https://app.${host}/login`}><Button scale={0.66} auto type='secondary'>Log In</Button></NiceLink>
                                        :
                                        <NiceLink href={`/login`}><Button scale={0.66} auto type='secondary'>Log In</Button></NiceLink>
                                )
                            }
                            <Button
                                aria-label="Toggle Dark mode"
                                iconRight={theme.type !== 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                onClick={() => prefers.switchTheme(theme.type === 'dark' ? 'light' : 'dark')}
                                auto scale={2/3} px={0.6} style={{borderRadius: "9999px", marginLeft: "0.5rem"}}
                            />
                        </div>
                    </nav>
                    {
                        appPage && (
                            <AppSubmenu loading={loading}/>
                        )
                    }
                    {
                        sitePage && (
                            <SiteSubmenu loading={loading}/>
                        )
                    }

                </>
            }

            <style jsx>{`
              .menu-nav {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: ${theme.layout.pageWidthWithMargin};
                max-width: 100%;
                margin: 0 auto;
                padding: 0 ${theme.layout.pageMargin};
                background-color: ${theme.palette.background};
                font-size: 16px;
                height: 54px;
                box-sizing: border-box;
                box-shadow: ${ (appPage || sitePage) ? "" : "inset 0 -1px " + theme.palette.border }
              }
              :global(.user-settings__popover) {
                width: 180px !important;
              }
              .navbar-left,
              .navbar-right {
                display: flex;
                align-items: center;
              }
            `}</style>
        </>
    );
};

export default TopMenu;
