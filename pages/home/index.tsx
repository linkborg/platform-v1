import React, {useEffect} from 'react';
import {Text, Link, useTheme, Grid, Card, Input, Spacer, Button, Display, Divider} from '@geist-ui/core';
import {useSession} from "next-auth/react";
import Head from "next/head";
import Script from 'next/script'
import {LinkborgFooter} from "@/components/linkborg-footer";
import * as ackeeTracker from 'ackee-tracker'
import {getServerSession} from "next-auth/next";
import {authOptions} from "../api/auth/[...nextauth]";

export async function getServerSideProps(context : any) {
    const session = await getServerSession(context.req, context.res, authOptions);
    
    return {
        props: {
            session,
        },
    };
}


const Page = ( { session } : {session: any}) => {
    const theme = useTheme();

    useEffect(()=> {
        ackeeTracker.create(
            'https://analytics.linkb.org', {
                ignoreOwnVisits: false
            }
        ).record('b43ed6a0-6d55-4832-a6a0-956049a784f0')
    }, [])

    return (
        <>
            <Head>
                <title>LinkBorg - Ultimate link sharing platform</title>
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
            <div className="content">
                <div className="centered_content">
                    <Display>
                        <h2>The Ultimate Link Sharing Platform</h2>
                        <Spacer />
                        <Link href={"https://app.linkb.org/login"}>
                            <Button scale={1.5} auto type={"success"}>
                                Get Started
                            </Button>
                        </Link>
                    </Display>
                </div>
                <Divider />
            </div>

            <style jsx>{`
              .content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: ${theme.layout.pageWidthWithMargin};
                max-width: 100%;
                margin: 0 auto;
                box-sizing: border-box;
                height:75vh;
              }
              .centered_content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex-grow: 1;
                text-align: center;
              }
              .footer_content {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
              }
            `}</style>
        </>
    );
};

export default Page;
