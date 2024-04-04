import { useRouter } from "next/router";
import PostBody from "@/components/blog/post-body";
import Head from 'next/head'
import Script from "next/script";
import React from "react";
import {Display, Divider, Image, Link, Page, Spacer, useTheme} from "@geist-ui/core";
import NiceLink from "@/components/NiceLink";
import {LinkborgFooter} from "@/components/linkborg-footer";
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



export default function Terms( { session } : {session: any}) {
    const router = useRouter();

    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Privacy Policy - linkborg</title>
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
                    <Spacer />
                    <Page dotBackdrop={true}>
                        <Page.Header paddingBottom={"1rem"}>
                            <h1>Linkborg Privacy Policy</h1>
                        </Page.Header>
                        <Page.Content paddingTop={"0"}>
                            <p>Effective Date: June 7, 2023</p>

                            <h2>1. Information We Collect</h2>
                            <p>We explicitly gather personal information including your name, email, phone number, and social media links. The collection of this data is indispensable for the fundamental functionality of our platform.</p>

                            <h2>2. Purpose and Legal Basis for Processing Your Information</h2>
                            <p>The personal data we acquire is processed with the purpose of delivering our services, and for comprehending the utilization of our platform. This understanding assists us in refining Linkborg and in the development of new features.</p>

                            <h2>3. Disclosure of Your Information</h2>
                            <p>Presently, we abstain from sharing your information with any third-party entities. However, we retain the right to engage in such sharing in the future for analytical or commercial purposes. Prior to such sharing, we shall notify our users and provide an option for dissent. Please note that we engage Google Analytics for data scrutiny, and they may independently collect data about your usage.</p>

                            <h2>4. Cookies and Tracking</h2>
                            <p>We utilize session cookies on our site to uphold user logins. We abstain from the use of tracking cookies, however, Google Analytics may employ cookies to amass data for analysis.</p>

                            <h2>5. Opting Out of Data Collection</h2>
                            <p>You retain the right to delete your account at any moment, thus terminating data collection. If we decide to share your data with third parties in the future, we shall provide an option for you to dissent.</p>

                            <h2>6. Protection of Your Data</h2>
                            <p>We prioritize data security and employ SSL encryption on all our pages and APIs. We utilize OAuth or magic links for user login to augment data security.</p>

                            <h2>7. Compliance with Data Protection Regulations</h2>
                            <p>We commit to the adherence of all applicable data protection laws and regulations. If you are domiciled within the European Union, you retain certain rights under the General Data Protection Regulation (GDPR). If you are domiciled within California, you retain certain rights under the California Consumer Privacy Act (CCPA). We shall fully cooperate with authorities in the protection of personal data.</p>

                            <h2>8. Children&apos;s Privacy</h2>
                            <p>While our service is accessible to users of all ages, we do not knowingly collect personal information from children under 13 without parental consent, in adherence to the Children&apos;s Online Privacy Protection Act (COPPA). If you believe we might have information from or about a child under 13, please contact us at data@linkb.org.</p>

                            <h2>9. Accessing and Updating Your Information</h2>
                            <p>You may request a copy of your personal data by emailing us at data@linkb.org. We commit to provide this information within three working days. In the event of a change in your personal data, or if you no longer require our service, you may correct, update, or delete your information by making the change on your user account settings page.</p>

                            <h2>10. Data Transfers</h2>
                            <p>While we do not directly engage in international data transfers, our service providers may do so. We trust that our service providers are in compliance with applicable data transfer laws, and ensure the protection of user data.</p>

                        </Page.Content>
                    </Page>
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
          }
          .centered_content {
            display: flex;
            flex-direction: column;
            justify-content: left;
            flex-grow: 1;
            text-align: left
          }
          .footer_content {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
        `}</style>
        </>
    );
}