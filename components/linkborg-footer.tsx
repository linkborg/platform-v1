import {Display, Divider, Dot, Link, Spacer, Tag, Text, useTheme} from "@geist-ui/core";
import NiceLink from "@/components/NiceLink";
import React, {useEffect, useState} from "react";
import Image from "next/image"
import {useRouter} from "next/router";

export const LinkborgFooter = () => {
    const theme = useTheme();
    const router = useRouter();

    const [pageType, setPageType] = useState("home");

    useEffect(() => {
        if (router.pathname.startsWith("/app")){
            setPageType("app")
        }
        else if (router.pathname.startsWith("/_sites")){
            setPageType("user")
        }
        else if (router.pathname.startsWith("/home")){
            setPageType("home");
        }
    }, [router])

    return (
        <>
            { pageType !== "user" &&
                <div className={"footer_wrapper"}>
                    <div className="footer_content">
                        <Tag type={"lite"} scale={1.5} style={{display: "flex", justifyContent: "center", flexDirection: "row", filter: "grayscale(100%)", alignItems: "center"}}>
                            <Image src={"/favicon.ico"} alt={"logo"} width={22} height={22} unoptimized={true} />
                            <Text small ml={0.5}>linkborg</Text>
                        </Tag>
                        <div>
                            &copy; <NiceLink href={"https://linkb.org"}>linkborg</NiceLink>
                            <Text mx={0.25} span>&middot;</Text>
                            <NiceLink href={"https://linkb.org/privacy"}>Privacy</NiceLink>
                            <Text mx={0.25} span>&middot;</Text>
                            <NiceLink href={"https://linkb.org/terms"}>Terms</NiceLink>
                        </div>
                    </div>
                    <Spacer />
                </div>
            }
            <style jsx>{`
              .footer_wrapper {
                width: ${theme.layout.pageWidthWithMargin};
                max-width: 100vw;
                margin: 0 auto;
                padding: 2rem 1rem;
              }
              .footer_wrapper :global(.view-all) {
                font-size: 0.875rem;
                font-weight: 700;
                text-align: center;
              }
              .footer_content {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              }
              @media (max-width: ${theme.breakpoints.sm.max}) {
                .footer_wrapper {
                  flex-direction: column;
                  justify-content: flex-start;
                  align-items: stretch;
                }
                .footer_content {
                  width: 90%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                }
              }
              @media (max-width: ${theme.breakpoints.md.max}) {
                .footer_content {
                  width: 95%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                }
              }
              
            `}</style>
        </>
    )
}