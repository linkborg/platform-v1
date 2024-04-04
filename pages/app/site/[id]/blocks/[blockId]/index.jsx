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
    Textarea, Toggle, useMediaQuery,
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
import {blockTypes} from "@/lib/block-types";
import useBetterMediaQuery from "@/lib/use-better-media-query";
import NiceTooltip from "@/components/NiceTooltip";
import prisma from "../../../../../../lib/prisma";

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

    const { id: siteId, blockId } = context.params;

    const block = await prisma.block.findFirst({
        where: {
            id: blockId,
            site: {
                user: {
                    id: session?.user?.id,
                },
            },
        },
        include: {
            site: true,
        },
    });

    return {
        props: {
            block_json: JSON.stringify(block),
        },
    }
}

const Page = ({block_json}) => {

    const settings = JSON.parse(block_json)

    const theme = useTheme()
    const isAboveSM = useBetterMediaQuery('(min-width: 650px)')
    const [loading, setLoading] = useState(false)
    const { setToast } = useToasts();

    const router = useRouter();
    const { id: siteId, blockId } = router.query;


    const [isFormValid, setIsFormValid] = useState(true);

    const handleValidation = useCallback((isValid) => {
        setIsFormValid(isValid);
    }, []);

    const [blockData, setBlockData] = useState(settings?.data);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingBlock, setDeletingBlock] = useState(false)
    const [modalSiteName, setModalSiteName] = useState("")

    const [data, setData] = useState(settings);

    const [blockSlug, setBlockSlug] = useState(settings?.slug);
    const [debouncedBlockSlug] = useDebounce(blockSlug , 1000);
    const [slugAvailable, setSlugAvailable] = useState(0);


    useEffect(() => {
        if (blockData) {
            setData({...data, data: blockData});
        }
    }, [blockData])

    useEffect(() => {
        async function checkBlockSlug() {
            if (debouncedBlockSlug.length > 0) {
                setSlugAvailable(1);

                let url = `/api/blocks/check?slug=${debouncedBlockSlug}&siteId=${siteId}&blockId=${blockId}`;
                const response = await fetch(url);
                const available = await response.json();
                if (available) {
                    setError(null);
                    setSlugAvailable(2);
                } else {
                    setSlugAvailable(3);
                    setError(`${debouncedBlockSlug}`);
                }
            }
        }
        checkBlockSlug();
    }, [debouncedBlockSlug]);

    async function saveBlockSettings(data) {
        setSaving(true);

        try {
            const response = await fetch(`/api/block?siteId=${siteId}&blockId=${blockId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    slug: blockSlug
                }),
            });

            if (response.ok) {
                setSaving(false);
                setToast({
                    text: "Saved.",
                    type: "success",
                    delay: 3000
                })
            }
        } catch (error) {
            setToast({
                text: "Failed to save block.",
                type: "error",
                delay: 3000
            })
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    async function deleteBlock() {
        setDeletingBlock(true);

        try {
            const response = await fetch(`/api/block?siteId=${siteId}&blockId=${blockId}`, {
                method: "DELETE",
            });

            if (response.ok) router.push(`/site/${siteId}/blocks`);
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingBlock(false);
        }
    }

    return (
        <>
            <Head>
                <title>Block Settings - LinkBorg - Ultimate link sharing platform</title>
            </Head>
            <div className="page__wrapper">
                <div className="page__content">
                    <Card width={"100%"}>
                        <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                            <Text h4>Title</Text>
                            <ValidatedInput
                                type={"text"}
                                placeholder="John Doe"
                                width="100%"
                                value={data?.title || ""}
                                onChange={(e) =>{
                                    setData({
                                        ...data,
                                        title: e.target.value,
                                    })}
                                }
                                onValidation={handleValidation}
                            >
                            </ValidatedInput>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Name of your block. This name is only displayed to you.</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveBlockSettings(data);
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
                            <Text h4>Block Slug</Text>
                            <ValidatedInput
                                type={"slug"}
                                onValidation={handleValidation}
                                minLength={1}
                                maxLength={50}
                                label={settings?.site?.customDomain ? `${settings?.site?.customDomain}/` : `${siteId}.linkb.org/`}
                                width={"100%"}
                                iconRight={ slugAvailable === 1 ? <Loading />
                                    : slugAvailable === 2 ? <CheckInCircleFill color={"green"}/>
                                        : slugAvailable === 3 ? <XCircleFill color={"red"}/>
                                            : <></>}
                                name={"slug"}
                                required={true}
                                placeholder={"slug"}
                                value={blockSlug}
                                onChange={((e) => setBlockSlug(e.target.value))}
                                htmlType={"text"}
                            >
                            </ValidatedInput>
                            <div className="grid gap-y-5 w-5/6 mx-auto">
                                {error && (
                                    <Text small type={"error"}>
                                        <b>{error}</b> is not available. Try another.
                                    </Text>
                                )}
                            </div>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Slug of your block. You can share this link for people to directly access this block.</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveBlockSettings(data);
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
                            <Text h4>Type</Text>
                            <ButtonDropdown>
                                <ButtonDropdown.Item main={data.type==="card"} onClick={() => setData({...data, type: "card"})}>Card</ButtonDropdown.Item>
                                <ButtonDropdown.Item main={data.type==="link"} onClick={() => setData({...data, type: "link"})}>Link</ButtonDropdown.Item>
                                <ButtonDropdown.Item main={data.type==="image"} onClick={() => setData({...data, type: "image"})}>Image</ButtonDropdown.Item>
                                <ButtonDropdown.Item main={data.type==="tweet"} onClick={() => setData({...data, type: "tweet"})}>Tweet</ButtonDropdown.Item>
                                <ButtonDropdown.Item main={data.type==="youtube-video"} onClick={() => setData({...data, type: "youtube-video"})}>YouTube Video</ButtonDropdown.Item>
                                <ButtonDropdown.Item main={data.type==="github-gist"} onClick={() => setData({...data, type: "github-gist"})}>Github Gist</ButtonDropdown.Item>
                                <ButtonDropdown.Item main={data.type==="threads-post"} onClick={() => setData({...data, type: "threads-post"})}>Threads Post</ButtonDropdown.Item>
                            </ButtonDropdown>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Block type.</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveBlockSettings(data);
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
                            <Text h4>{data.type} settings</Text>
                            {
                                blockTypes[data.type ? data.type : "card"].fields.map((field, index) => {
                                    const fieldName = field.name;
                                    const fieldId = field.id;
                                    const fieldType = field.type;
                                    return (
                                        <div key={`block-${blockId}-field-${index}`}>
                                            {
                                                fieldType === "boolean" ? (
                                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                                        <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                                            <Toggle checked={blockData ? blockData[fieldId] : false} onChange={(e) => setBlockData({
                                                                ...blockData,
                                                                [fieldId]: e.target.checked,
                                                            })} scale={1.5} />
                                                            <Text span mt={0.4} ml={0.5}>{field.prompt}</Text>
                                                        </div>
                                                        <div style={{marginLeft: "1rem", marginTop: "0.7rem"}}>
                                                            <NiceTooltip>
                                                                <Text h4>{fieldName}</Text>
                                                                <Text p>{field.description}</Text>
                                                            </NiceTooltip>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <ValidatedInput
                                                        type={fieldType}
                                                        placeholder={field.placeholder}
                                                        width="100%"
                                                        value={blockData ? blockData[fieldId] : ""}
                                                        onChange={(e) =>
                                                            setBlockData({
                                                                ...blockData,
                                                                [fieldId]: e.target.value,
                                                            })}
                                                        onValidation={handleValidation}
                                                    >
                                                        <div className={"card__action"}>
                                                            <Text h5>{fieldName}</Text>
                                                            <NiceTooltip>
                                                                <Text h4>{fieldName}</Text>
                                                                <Text p>{field.description}</Text>
                                                            </NiceTooltip>
                                                        </div>
                                                    </ValidatedInput>
                                                )
                                            }
                                        <Spacer />
                                        </div>
                                    )
                                })
                            }
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>{data.type} block settings</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveBlockSettings(data);
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
                            <Text h4>Hidden</Text>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Toggle checked={data.hidden} onChange={(e) => setData({...data, hidden: !data.hidden})} scale={1.5} />
                                    <Text span mt={0.4} ml={0.5}>Hide this on your page?</Text>
                                </div>
                                <div style={{marginLeft: "1rem", marginTop: "0.7rem"}}>
                                    <NiceTooltip>
                                        <Text h4>Hidden Blocks</Text>
                                        <Text p>You can hide blocks from your profile page - these blocks work just like any other blocks except that they are not shown in your list of blocks.</Text>
                                    </NiceTooltip>
                                </div>
                            </div>
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Hide block</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveBlockSettings(data);
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
                            <Text h4>Delete Block</Text>
                            <Text p>
                                Permanently delete your block and all of its contents from our
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
                                    Delete Block
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Modal visible={showDeleteModal} onClose={setShowDeleteModal}>
                        <Modal.Title>Delete Block</Modal.Title>
                        <Modal.Content>
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    await deleteBlock();
                                }}
                                className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
                            >
                                Are you sure you want to delete this block? This action is not
                                reversible. Type in the full name of your block (<b>{data.title}</b>
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
                                    placeholder={data.title ?? ""}
                                    pattern={data.title ?? "Block Name"}
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
                        <Modal.Action passive onClick={() => { setError(null); setDeletingBlock(false); setShowDeleteModal(false)}}>Cancel</Modal.Action>
                        <Modal.Action
                            loading={deletingBlock}
                            disabled={deletingBlock || error !== null || !isFormValid}
                            htmlType={"submit"}
                            type={"error"}
                            onClick={ async () => await deleteBlock()}
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
