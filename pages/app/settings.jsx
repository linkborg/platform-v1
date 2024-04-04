import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useRouter } from "next/router";
import {
    Card,
    Text,
    Button,
    useTheme,
    Grid,
    Input,
    Divider,
    Spacer,
    Image,
    useToasts,
    ButtonGroup, Display, Modal, Loading, Textarea, ButtonDropdown, Spinner, Snippet, Toggle, Tag
} from '@geist-ui/core';
import Head from 'next/head';

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import {HttpMethod, UserSettings} from "@/types";
import {CheckInCircleFill, Globe, PenTool, PlusCircle, Save, Trash, XCircleFill} from "@geist-ui/icons";
import { SocialIcon } from 'react-social-icons';
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import {sanitizeLink} from "@/lib/sanitize-link";
import R2Uploader from "@/components/r2uploader";
import ValidatedInput from "@/components/ValidatedInput";
import NextLink from "next/link";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session_json: JSON.stringify(session),
    },
  }
}
const Page = ( { session_json }) => {

    const session = JSON.parse(session_json)

    const theme = useTheme()
    const { setToast } = useToasts()
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [addingSocialLink, setAddingSocialLink] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();

    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState(session?.user);
    const [socialLinkData, setSocialLinkData] = useState(null);
    const [socialLink, setSocialLink] = useState("");
    const [deletingSocialLink, setDeletingSocialLink] = useState("");

    const [newsletterUpdate, setNewsletterUpdate] = useState(false);

    const [isFormValid, setIsFormValid] = useState(true);
    const [dataChanged, setDataChanged] = useState(false);

    const handleValidation = useCallback((isValid) => {
        setIsFormValid(isValid);
    }, []);

    useEffect(() => {
        if (!showModal){
            setIsFormValid(true);
        }else{
            setIsFormValid(false);
        }
    }, [showModal])

    const { data } = useSWR(`/api/social-link`, fetcher,
        {
            onSuccess: (data) => setSocialLinkData(data),
        }
    );

    useEffect( () => {
        if (newsletterUpdate) {
            const updateNewsletter = async () => {
                if (userData.newsletter) {
                    try {
                        const response = await fetch('/api/newsletter/lists', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const data = await response.json();
                    } catch (error) {
                        console.error('Failed to add subscriber:', error);
                    }
                } else {
                    try {
                        const response = await fetch('/api/newsletter/lists', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const data = await response.json();
                    } catch (error) {
                        console.error('Failed to remove subscriber:', error);
                    }
                }
            }
            updateNewsletter();
        }
    }, [newsletterUpdate])

    async function saveSettings(saveData) {
        setSaving(true);
        const response = await fetch("/api/save-settings", {
            method: HttpMethod.POST,
            body: JSON.stringify({
                ...saveData,
            }),
        });
        if (response.ok) {
            setDataChanged(false);
            setSaving(false);
            setToast({
                text: "Changes Saved",
                type: "success",
                delay: 3000
            })
        }
    }

    const saveProfileImage = (imgUrl) => {
        setUserData({
            ...userData,
            image: imgUrl
        })
        saveSettings({
            ...userData,
            image: imgUrl
        });
    }

    async function addSocialLink() {
        setAddingSocialLink(true);
        const response = await fetch("/api/social-link", {
            method: HttpMethod.POST,
            body: JSON.stringify({
                linkType: "social",
                linkIcon: "any",
                linkLink: sanitizeLink(socialLink)
            }),
        });
        if (response.ok) {
            const data = await response.json();  // Read and parse the response body
            const socialLinkId = data.socialLinkId;

            setSocialLinkData((current) => [...current, {
                id: socialLinkId,
                type: "social",
                icon: "any",
                link: sanitizeLink(socialLink)
            }]);
            setSocialLink("");
            setAddingSocialLink(false);
            setShowModal(false);
            setToast({
                text: "Added social link",
                type: "success",
                delay: 1500
            })
        }
    }

    return (
    <>
    <Head>
        <title>Settings - LinkBorg - Ultimate link sharing platform</title>
    </Head>
      <div className="page__wrapper">
        <div className="page__content">
            <div className="page__header">
                <Text h2>Settings</Text>
                <div>
                    <Button
                        iconRight={<Save />}
                        type={"secondary-light"}
                        disabled={!dataChanged || saving || !isFormValid }
                        loading={saving}
                        onClick={()=> saveSettings(userData)}
                        auto
                        mr={1}
                    >
                        Save
                    </Button>
                </div>
            </div>
            <Spacer />
            <Grid.Container gap={2}>
                <Grid xs direction={"column"}>
                    <Card width={"100%"}>
                        <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                            <ValidatedInput
                                type={"text"}
                                required={true}
                                onValidation={handleValidation}
                                placeholder="John Doe"
                                width="100%"
                                value={userData?.name ? userData?.name : ""}
                                onChange={(e) => {
                                    setDataChanged(true);
                                setUserData({
                                    ...userData,
                                    name: e.target.value,
                                })}}
                            >
                                <Text h4>Name</Text>
                                <Spacer />
                            </ValidatedInput>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Your very cool name.</Text>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                            <ValidatedInput
                                type={"text"}
                                placeholder="Theoritical Physicist, 29 M (he/him), Pasadena, has a friend Leonard"
                                width="100%"
                                value={userData?.bio ? userData?.bio : ""}
                                onChange={(e) =>{
                                    setDataChanged(true);
                                setUserData({
                                    ...userData,
                                    bio: e.target.value,
                                })}}
                                onValidation={handleValidation}
                            >
                                <Text h4>Bio</Text>
                                <Spacer />
                            </ValidatedInput>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>A bit about you to display on your page.</Text>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                            <Input
                                placeholder="johndoe@example.com"
                                width="100%"
                                disabled={true}
                                value={userData?.email ? userData?.email : ""}
                            >
                                <Text h4>Email</Text>
                                <Spacer />
                            </Input>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Cannot be modified.</Text>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                            <Text h4>Display Picture</Text>
                            <R2Uploader
                                folder="profile"
                                width={200}
                                height={200}
                                quality={90}
                                aspect={1}
                                imageUrl={userData?.image}
                                saveFunction={saveProfileImage}
                            />
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Select Image &gt; Save. Preferred dimension: 250x250.</Text>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content>
                            <Text h4>Newsletter</Text>
                            <Spacer />
                            <Toggle
                                scale={2}
                                checked={userData?.newsletter ? userData?.newsletter : false}
                                onChange={(e) => {setDataChanged(true); setUserData({...userData,
                                    newsletter: !userData.newsletter
                                })}}
                            />
                            <Text p>
                                Product Newsletter - product updates, company updates, customized updates about your sites and links.
                            </Text>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>You will continue receiving critical updates and transactional emails.</Text>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                </Grid>
            </Grid.Container>
            <div className="page__header">
                <Text h2>&nbsp;</Text>
                <div>
                    <Button
                        iconRight={<Save />}
                        type={"secondary-light"}
                        disabled={!dataChanged || saving || !isFormValid }
                        loading={saving}
                        onClick={()=> saveSettings(userData)}
                        auto
                        mr={1}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
      </div>
        <Modal visible={showModal} onClose={setShowModal}>
            <Modal.Title>Add Social Link</Modal.Title>
            <Modal.Content>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        addSocialLink();
                    }}
                >
                    <Spacer />
                    <ValidatedInput
                        width={"100%"}
                        type={"link"}
                        label={<SocialIcon url={socialLink} style={{ height: 24, width: 24 }}/>}
                        name={"link"}
                        required={true}
                        placeholder={"https://example.com/username"}
                        htmlType={"url"}
                        value={socialLink}
                        onChange={(e) => setSocialLink(e.target.value)}
                        onValidation={handleValidation}
                    />
                    <Spacer />
                </form>
            </Modal.Content>
            <Modal.Action passive onClick={() => { setError(null); setShowModal(false)}}>Cancel</Modal.Action>
            <Modal.Action
                loading={addingSocialLink}
                disabled={!isFormValid ||addingSocialLink || error !== null}
                htmlType={"submit"}
                onClick={()=> {addSocialLink()}}
            >Submit</Modal.Action>
        </Modal>
      <style jsx>{`
        .page__wrapper {
          background-color: ${theme.palette.accents_1};
        }
        .page__content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: calc(${theme.layout.gap} * 2) ${theme.layout.pageMargin} calc(${theme.layout.gap} * 4);
          transform: translateY(-15px);
          box-sizing: border-box;
        }
        .page__content :global(.view-all) {
          font-size: 0.875rem;
          font-weight: 700;
          margin: calc(1.5 * ${theme.layout.gap}) 0;
          text-align: center;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .page__content {
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
          }
        }
        .page__header{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
        }
        .card__action{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </>
    )
}

export default Page;
