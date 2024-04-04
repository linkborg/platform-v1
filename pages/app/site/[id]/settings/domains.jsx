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
import DomainCard from "@/components/app/DomainCard";
import {ArrowDown, CheckInCircleFill, ChevronDown, PenTool, XCircleFill} from "@geist-ui/icons";
import R2Uploader from "@/components/r2uploader";
import { ThemePreviewCard } from "@/components/app/ThemePreviewCard";
import ValidatedInput from "@/components/ValidatedInput";
import Link from "next/link";
import useBetterMediaQuery from "../../../../../lib/use-better-media-query";

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
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingSite, setDeletingSite] = useState(false);

    const [tempImage, setTempImage] = useState("");
    const [imageUploading, setImageUploading] = useState(false);

    const [previewTheme, setPreviewTheme] = useState("dark");

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
            setPreviewTheme(settings.theme)
        }
    }, [settings]);

    const handleImageUpload = (url) => {
        setData({
            ...data,
            image: url,
        })
        setImageUploading(false);
        setTempImage("");
    }

    const handleTempImageUpload = (data) => {
        setTempImage(data);
    }

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
    const [debouncedSubdomain] = useDebounce(data?.subdomain, 1500);
    const [subdomainError, setSubdomainError] = useState(null);

    useEffect(() => {
        async function checkSubdomain() {
            try {
                const response = await fetch(
                    `/api/domain/check?domain=${debouncedSubdomain}&subdomain=1`
                );

                const available = await response.json();

                setSubdomainError(
                    available ? null : `${debouncedSubdomain}.linkb.org`
                );
            } catch (error) {
                console.error(error);
            }
        }

        if (
            debouncedSubdomain !== settings?.subdomain &&
            debouncedSubdomain &&
            debouncedSubdomain?.length > 0
        )
            checkSubdomain();
    }, [debouncedSubdomain, settings?.subdomain]);

    async function handleCustomDomain() {
        const customDomain = data.customDomain;

        setAdding(true);

        try {
            const response = await fetch(
                `/api/domain?domain=${customDomain}&siteId=${siteId}`,
                {
                    method: "POST",
                }
            );

            if (!response.ok)
                throw {
                    code: response.status,
                    domain: customDomain,
                };
            setError(null);
            mutate(`/api/site?siteId=${siteId}`);
        } catch (error) {
            setError(error);
        } finally {
            setAdding(false);
        }
    }

    return (
        <>
            <Head>
                <title>Settings - LinkBorg - Ultimate link sharing platform</title>
            </Head>
            <div className="page__wrapper">
                <div className="page__content">
                    {settings?.customDomain ? (
                        <DomainCard data={data} />
                    ) : (
                        <Card width={"100%"}>
                            <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                                <Text h4>Custom Domain</Text>
                                <Spacer />
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        await handleCustomDomain();
                                    }}
                                >
                                    <ValidatedInput
                                        name={"customDomain"}
                                        type={"domain"}
                                        onValidation={handleValidation}
                                        onChange={(e) => {
                                            setData((data) => ({
                                                ...data,
                                                customDomain: e.target.value,
                                            }));
                                        }}
                                        width={"100%"}
                                        required={true}
                                        autoComplete="false"
                                        pattern="^(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
                                        placeholder="example.com"
                                        value={data.customDomain || ""}
                                        htmlType="text"
                                    />
                                </form>
                            </Card.Content>
                            <Card.Footer>
                                <div className="card__action">
                                    <Text span>
                                        { error && (
                                            error.code === 403 ? (
                                                <p>
                                                    <b>{error.domain}</b> is already owned by another team.
                                                </p>
                                            ) : (
                                                <p>
                                                    Cannot add <b>{error.domain}</b> since it&apos;s already
                                                    assigned to another project.
                                                </p>
                                            )
                                        )}
                                    </Text>
                                    <Button
                                        auto
                                        ghost
                                        onClick={async () => {
                                            await handleCustomDomain();
                                        }}
                                        htmlType={"submit"}
                                        loading={adding}
                                        disabled={adding}
                                    >Add</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    )}
                    <Spacer />
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
