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


export default function Terms( { session } : {session: any} ) {
    const router = useRouter();

    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Terms and Conditions - linkborg</title>
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
                            <h1>Terms and Conditions</h1>
                        </Page.Header>
                        <Page.Content paddingTop={"0"}>

                            <p>Thank you for choosing Linkborg, your go-to platform for URL shortening and link sharing, combining a range of useful features for a seamless online experience. The following terms and conditions (&quot;Terms&quot;) outline the rules and regulations for the use of Linkborg&apos;s Website, located at <a href={"https://linkb.org"}>https://linkb.org</a> (&quot;the Site&quot;).</p>

                            <p>By accessing the Site and creating an account, you (&quot;the Client&quot;) are agreeing to abide by these Terms. Do not continue to use Linkborg if you do not agree to all the Terms and conditions stated herein. In this document, &quot;The Company&quot;, &quot;Ourselves&quot;, &quot;We&quot;, &quot;Our&quot; and &quot;Us&quot;, refer to Linkborg.</p>

                            <h2>Cookies</h2>
                            <p>We employ the use of cookies to enhance your experience on our Site. By accessing Linkborg, you agreed to the use of cookies in accordance with <NiceLink href={"/privacy"} >Linkborg&apos;s Privacy Policy</NiceLink>.</p>

                            <h2>License</h2>
                            <p>Unless otherwise stated, Linkborg and/or its licensors own the intellectual property rights for all material on the Site. All intellectual property rights are reserved. You may access the Site for your own personal use subject to the restrictions set in these Terms.</p>

                            <p>Under these Terms, you must not republish, sell, rent, sub-license, reproduce, duplicate, copy or redistribute content from Linkborg. The commencement of this agreement is from the date you access the Site.</p>

                            <h2>Product Newsletter</h2>
                            <p>Once you create an account on the Site, we&apos;ll automatically sign you up for the product newsletter. You can unsubscribe from this newsletter at any time by going to your account settings or by clicking the Unsubscription link on any of the emails we send you. You will continue to receive transactional emails and other critical emails from our end, which will not be promotional in nature.</p>

                            <h2>User Comments</h2>
                            <p>Parts of the Site offer users the opportunity to post and exchange opinions and information in certain areas. Linkborg does not filter, edit, publish or review comments prior to their presence on the Site. Comments reflect the views and opinions of the person who posts them and not Linkborg. Linkborg shall not be liable for the Comments or any liability, damages or expenses caused as a result of any use of and/or posting of and/or appearance of the Comments on the Site.</p>

                            <p>Linkborg reserves the right to monitor all comments and to remove any Comments deemed inappropriate, offensive or causing a breach of these Terms.</p>

                            <p>By posting comments on the Site, you represent and warrant that you are entitled to do so and have all necessary licenses and consents; the comments do not infringe any intellectual property right or any other third party right; the comments do not contain any defamatory, libelous, offensive, indecent or unlawful material; and the comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</p>

                            <p>You hereby grant Linkborg a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any form, formats or media.</p>

                            <h2>Hyperlinking to our Content</h2>
                            <p>Organizations may link to our Site without prior written approval as long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party&apos;s site.</p>

                            <p>Approved organizations may hyperlink to our Site using our corporate name, uniform resource locator, or other descriptions that make sense within the context and format of content on the linking party&apos;s site. No use of Linkborg&apos;s logo or other artwork will be allowed for linking without a trademark license agreement.</p>

                            <h2>iFrames</h2>
                            <p>Without prior approval and written permission, you may not create frames around our Webpages that alter the visual presentation or appearance of our Site.</p>

                            <h2>Content Liability</h2>
                            <p>We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims arising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>

                            <h2>Reservation of Rights</h2>
                            <p>We reserve the right to request that you remove all links or any particular link to our Site. You agree to immediately remove all links to our Site upon request. We also reserve the right to amend these terms and conditions and it&apos;s linking policy at any time. By continuously linking to our Site, you agree to be bound to and follow these linking terms and conditions.</p>

                            <h2>Removal of links from our website</h2>
                            <p>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to do so or respond to you directly.</p>

                            <p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>

                            <h2>Disclaimer</h2>
                            <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>

                            <ul>
                                <li>limit or exclude our or your liability for death or personal injury;</li>
                                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                                <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                                <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                            </ul>

                            <p>The limitations and prohibitions of liability set in this section govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>

                            <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>

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