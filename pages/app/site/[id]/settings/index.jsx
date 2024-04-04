import React, {useCallback, useEffect, useState} from 'react';
import { useRouter } from "next/router";
import {
    Button, ButtonDropdown,
    ButtonGroup,
    Card,
    Display, Dot, Fieldset,
    Grid,
    Image,
    Input, Loading, Modal, Popover, Radio, Select,
    Spacer, Tag,
    Text,
    Textarea, useMediaQuery,
    useTheme,
    useToasts
} from '@geist-ui/core';
import Head from 'next/head';

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import useSWR, {mutate} from "swr";
import {useDebounce} from "use-debounce";

import { fetcher } from "@/lib/fetcher";
import {ArrowDown, CheckInCircleFill, ChevronDown, PenTool, XCircleFill} from "@geist-ui/icons";
import ValidatedInput from "@/components/ValidatedInput";
import Link from "next/link";
import useBetterMediaQuery from "@/lib/use-better-media-query";

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
            session,
        },
    }
}

const Page = () => {

    const theme = useTheme()
    const isAboveSM = useBetterMediaQuery('(min-width: 650px)')
    const [loading, setLoading] = useState(false)
    const { setToast } = useToasts();

    const router = useRouter();
    const { id } = router.query;

    const siteId = id;

    const [isFormValid, setIsFormValid] = useState(true);

    const handleValidation = useCallback((isValid) => {
        setIsFormValid(isValid);
    }, []);

    const { data: settings } = useSWR(
        siteId && `/api/site?siteId=${siteId}`,
        fetcher,
        {
            onError: () => router.push("/"),
            revalidateOnFocus: false,
        }
    );

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingSite, setDeletingSite] = useState(false);
    const [modalSiteName, setModalSiteName] = useState("");

    const [data, setData] = useState({
        id: "",
        name: null,
        description: null,
        font: "font-cal",
        subdomain: null,
        customDomain: null,
        image: null,
    });

    useEffect(() => {
        if (settings){
            setData(settings);
        }
    }, [settings]);

    async function saveSiteSettings(data) {
        setSaving(true);

        try {
            const response = await fetch("/api/site", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentSubdomain: settings?.subdomain ?? undefined,
                    ...data,
                    id: siteId,
                }),
            });

            if (response.ok) {
                setSaving(false);
                mutate(`/api/site?siteId=${siteId}`);
                setToast({
                    text: "Saved.",
                    type: "success",
                    delay: 3000
                })
            }
        } catch (error) {
            setToast({
                text: "Failed to save settings.",
                type: "error",
                delay: 3000
            })
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    async function deleteSite(siteId) {
        setDeletingSite(true);

        try {
            const response = await fetch(`/api/site?siteId=${siteId}`, {
                method: "DELETE",
            });

            if (response.ok) router.push("/");
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingSite(false);
        }
    }

    return (
        <>
            <Head>
                <title>Settings - LinkBorg - Ultimate link sharing platform</title>
            </Head>
            <div className="page__wrapper">
                <div className="page__content">
                    <Card width={"100%"}>
                        <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                            <ValidatedInput type={"text"} placeholder="John Doe" width="100%" value={data?.name || ""} onChange={(e) =>
                                setData({
                                    ...data,
                                    name: e.target.value,
                                })}
                                            onValidation={handleValidation}
                            >
                                <Text h4>Name</Text>
                                <Spacer />
                            </ValidatedInput>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Name of your website. Displayed on social meta images.</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveSiteSettings(data);
                                    }}
                                    disabled={saving}
                                    loading={saving}
                                >
                                    Save
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content>
                            <Text h4>Description</Text>
                            <Spacer />
                            <Textarea placeholder="Description" width="100%" initialValue={data?.description} onInput={(e) =>
                                setData({
                                    ...data,
                                    description: e.target.value,
                                })
                            } rows={3}
                            >
                            </Textarea>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Describe your page. This will be put in meta description.</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveSiteSettings(data);
                                    }}
                                    disabled={saving}
                                    loading={saving}
                                >
                                    Save
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content>
                            <Text h4>Keywords</Text>
                            <Spacer />
                            <Textarea placeholder="keywords" width="100%" value={data?.keywords || ""} onInput={(e) =>
                                setData({
                                    ...data,
                                    keywords: e.target.value,
                                })
                            } rows={3}
                            >
                            </Textarea>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Keywords for your page. Comma separated. This will be put in meta keywords.</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveSiteSettings(data);
                                    }}
                                    disabled={saving}
                                    loading={saving}
                                >
                                    Save
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                            <Text h4>Google Analytics</Text>
                            <Spacer />
                            <ValidatedInput
                                type={"text"}
                                onValidation={handleValidation}
                                placeholder="G-XXXXXXXXXX" width="100%" value={data?.analytics_code || ""} onChange={(e) =>
                                setData({
                                    ...data,
                                    analytics_code: e.target.value,
                                })}
                            />
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Connect your site with Google Analytics for deep insights.</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveSiteSettings(data);
                                    }}
                                    disabled={saving}
                                    loading={saving}
                                >
                                    Save
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content>
                            <Text h4>Delete Site</Text>
                            <Text p>
                                Permanently delete your site and all of its contents from our
                                platform. This action is not reversible – please continue with
                                caution.
                            </Text>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span type={"error"}>This action is irreversible.</Text>
                                <Button
                                    type={"error"}
                                    auto
                                    onClick={() => {
                                        setShowDeleteModal(true);
                                    }}
                                    disabled={saving}
                                    loading={saving}
                                >
                                    Delete Site
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Modal visible={showDeleteModal} onClose={setShowDeleteModal}>
                        <Modal.Title>Delete Site</Modal.Title>
                        <Modal.Content>
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    await deleteSite(siteId);
                                }}
                                className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
                            >
                                Are you sure you want to delete your site? This action is not
                                reversible. Type in the full name of your site (<b>{data.name}</b>
                                ) to confirm.
                                <Spacer />
                                <ValidatedInput
                                    type={"text"}
                                    onValidation={handleValidation}
                                    width={"100%"}
                                    icon={<PenTool />}
                                    name={"title"}
                                    required={true}
                                    value={modalSiteName}
                                    onChange={(e) => setModalSiteName(e.target.value)}
                                    placeholder={data.name ?? ""}
                                    pattern={data.name ?? "Site Name"}
                                    htmlType={"text"}/>
                                <Spacer />
                                <div className="grid gap-y-5 w-5/6 mx-auto">
                                    {error && (
                                        <Text small type={"error"}>
                                            <b>{error}</b> is not available. Try another.
                                        </Text>
                                    )}
                                </div>
                            </form>
                        </Modal.Content>
                        <Modal.Action passive onClick={() => { setError(null); setDeletingSite(false); setShowDeleteModal(false)}}>Cancel</Modal.Action>
                        <Modal.Action
                            loading={deletingSite}
                            disabled={deletingSite || error !== null || !isFormValid}
                            htmlType={"submit"}
                            type={"error"}
                            onClick={ async () => await deleteSite(siteId)}
                        >Delete</Modal.Action>
                    </Modal>
                </div>
            </div>
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
