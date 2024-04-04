import React, { useState, useCallback } from 'react';
import {Card, Text, Button, useTheme, Grid, Input, Divider, Spacer, Image, Display} from '@geist-ui/core';
import { signIn } from "next-auth/react";
import { Github, Mail, ArrowLeft } from '@geist-ui/icons';
import Head from 'next/head';
import ValidatedInput from "@/components/ValidatedInput";
import NiceLink from "../../components/NiceLink";
import {LinkborgFooter} from "../../components/linkborg-footer";


const Page = () => {

    const theme = useTheme()
    const [loading, setLoading] = useState(false)
    const [emailForm, setEmailForm] = useState(false);
    const [error, setError] = useState('');
    const [showEmailVerificationPage, setShowEmailVerificationPage] = useState(false);

    const [isFormValid, setIsFormValid] = useState(true);

    const handleValidation = useCallback((isValid) => {
        setIsFormValid(isValid);
    }, []);

    const [email, setEmail] = useState("");

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
          const result = await signIn('email', { email, redirect: false })
          if (result.error) {
            setError("Something went wrong. Do you have access?")
          } else {
            setShowEmailVerificationPage(true);
          }
        } catch (error) {
            setError('An error occurred, please try again')
        } finally {
            setLoading(false);
        }
    }

    return (
    <>
    <Head>
        <title>Login - LinkBorg - Ultimate link sharing platform</title>
    </Head>
    <div className="content__wrapper">
        <div className="content">
            <Grid.Container  gap={2} justify="center" height="500px">
                <Grid xs >
                    <Card shadow width={"100%"}>
                        <Text h2>
                            Welcome
                        </Text>
                        { emailForm ? 
                            (
                                <>
                                { !showEmailVerificationPage ?
                                    (
                                        <form onSubmit={onEmailSubmit}>
                                            <ValidatedInput
                                                type={"email"}
                                                value={email}
                                                required={true}
                                                htmlType='email'
                                                width={"100%"}
                                                scale={4/3}
                                                placeholder='johndoe@example.com'
                                                onChange={(e) => setEmail(e.target.value)}
                                                onValidation={handleValidation}
                                            >
                                                <Text span>Email</Text>
                                            </ValidatedInput>
                                            { error && <Text span small type={"error"}>{error}</Text>}
                                            <Spacer h={1}/>
                                            <Button iconRight={<Mail />} htmlType='submit' disabled={!isFormValid || loading} loading={loading} width={"100%"}>Get magic link</Button>
                                        </form>
                                    ) : (
                                        <>
                                            <Mail size={40} />
                                            <Text h5>Click on the link we&apos;ve delivered to your inbox!</Text>
                                        </>
                                    )
                                }
                                
                                <Spacer h={1}/>
                                <Button scale={1/2} shadow={false} ghost={true} icon={<ArrowLeft />} onClick={() => {
                                    setEmailForm(false); 
                                    }} disabled={loading}>&nbsp;&nbsp;&nbsp;Use another method</Button>
                                </>
                            ) : 
                            (
                                <>
                                    <Text p>Choose any of the options below:</Text>
                                    <Button iconRight={<Mail />} onClick={() => {
                                        setEmailForm(true);
                                        }} disabled={loading} loading={loading} width={"100%"}>Login with Email</Button>
                                    <Spacer h={1}/>
                                    {/*<Button iconRight={<Github />} onClick={() => {*/}
                                    {/*    setLoading(true);*/}
                                    {/*    signIn("github");*/}
                                    {/*    }} disabled={loading} loading={loading} width={"100%"}>Login with Github</Button>*/}
                                    {/* <Spacer h={1}/>
                                    <Button iconRight={<Github />} onClick={() => {
                                        setLoading(true);
                                        signIn("google");
                                        }} disabled={loading} loading={loading} width={"100%"}>Login with Google</Button> */}
                                    <Divider />
                                    <Text p small>
                                        By creating an account on this website you agree to its <NiceLink href={"https://linkb.org/terms"} target={"_blank"} icon>Terms</NiceLink> and <NiceLink href={"https://linkb.org/privacy"} target={"_blank"} icon>Privacy policy</NiceLink>.
                                    </Text>
                                </>
                            )
                        }
                    </Card>
                </Grid>
                <Grid xs={0} sm >
                    <Card shadow width={"100%"} style={{
                        backgroundImage: "url(https://source.unsplash.com/random/900x900/?abstract)",
                        backgroundSize: "auto 125%",
                        }}>
                    </Card>
                </Grid>
            </Grid.Container>
        </div>
      </div>
    <style jsx>{`
        .content {
            display: block;
            flex-direction: row;
            width: ${theme.layout.pageWidthWithMargin};
            max-width: 100%;
            margin: 0 auto;
            padding: calc(${theme.layout.gap} * 2) ${theme.layout.pageMargin} calc(${theme.layout.gap} * 4);
            box-sizing: border-box;
            height: 80vh;
        }
    `}</style>
    </>
    )
}

export default Page;
