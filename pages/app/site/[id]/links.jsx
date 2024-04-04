import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useRouter } from "next/router";
import {
    Button,
    Input,
    Loading,
    Modal,
    Spacer,
    Text,
    Textarea,
    useTheme,
    Image,
    Spinner, useToasts, useClipboard, Snippet, Popover, Toggle, Tooltip, Dot, Badge, Link, Card, Table, Keyboard, Avatar
} from '@geist-ui/core';
import Head from 'next/head';

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import {useDebounce} from "use-debounce";

import {
    CheckInCircleFill,
    Copy,
    Globe,
    MoreVertical,
    MoreHorizontal,
    PenTool,
    PlusCircle,
    XCircleFill,
    Github, QuestionCircle, Folder, Save, ChevronUp, ChevronsUp, ChevronDown, ChevronsDown, ChevronUpDown, Trash, Edit
} from "@geist-ui/icons";
import NiceLink from "@/components/NiceLink";
import {sanitizeLink} from "@/lib/sanitize-link";
import NiceTooltip from "@/components/NiceTooltip";
import prisma from "@/lib/prisma";
import ValidatedInput from "../../../../components/ValidatedInput";

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const siteId = context.params.id;

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    const siteData = await prisma.site.findUnique({
        where: {
            id: siteId,
        },
        include: {
            links: true
        }
    });

    return {
        props: {
            jsonData: JSON.stringify({
                "site": siteData
            })
        },
    }
}

const Page = ({jsonData}) => {

    const data = JSON.parse(jsonData);
    const theme = useTheme()

    const [showModal, setShowModal] = useState(false);
    const [creatingLink, setCreatingLink] = useState(false);
    const [linkImageFetching, setLinkImageFetching] = useState(false);
    const [deletingLink, setDeletingLink] = useState("");
    const [updatingLink, setUpdatingLink] = useState("");

    const [linksData, setLinksData] = useState(data.site.links.sort((a,b) => a.order - b.order))
    const [orderChanged, setOrderChanged] = useState(false);

    const [linkSlug, setLinkSlug] = useState("");
    const [linkName, setLinkName] = useState("");
    const [linkImage, setLinkImage] = useState("");
    const [linkLongurl, setLinkLongurl] = useState("");
    const [linkHidden, setLinkHidden] = useState(false);
    const [linkSocial, setLinkSocial] = useState(false);

    const [debouncedLinkslug] = useDebounce(linkSlug, 1000);
    const [debouncedLinkLongurl] = useDebounce(linkLongurl, 500);
    const [error, setError] = useState(null);
    const [linkAvailable, setLinkAvailable] = useState(0);

    const [isFormValid, setIsFormValid] = useState(true);

    const handleValidation = useCallback((isValid) => {
        setIsFormValid(isValid);
    }, []);

    const router = useRouter();
    const { id: siteId } = router.query;

    const { setToast } = useToasts()
    const { copy } = useClipboard()
    const copyHandler = (text) => {
        copy(text);
        setToast({ text: 'Link copied.' })
    }

    const resetForm = () => {
        setCreatingLink(false);
        setLinkAvailable(0);
        setLinkSlug("");
        setLinkName("");
        setLinkImage("");
        setLinkLongurl("");
        setUpdatingLink("");
        setLinkHidden(false);
        setLinkSocial(false);
        setUpdatingLink("");
    }

    const initializeOrderIfNecessary = (links) => {
        let areAllOrdersZero = links.every(link => link.order === 0);
        if (areAllOrdersZero) {
            links.forEach((link, index) => link.order = index);
        }
    }

    const moveToTop = (id) => {
        setLinksData(prevState => {
            let newState = [...prevState];
            initializeOrderIfNecessary(newState);
            let item = newState.find(link => link.id === id);
            if (!item) {
                return prevState; // id not found, no change
            }
            newState.forEach(link => {
                if (link.id !== id) {
                    link.order += 1;
                }
            });
            item.order = 0;
            newState.sort((a, b) => a.order - b.order);
            setOrderChanged(true);
            return newState;
        });
    }

    const moveUp = (id) => {
        setLinksData(prevState => {
            let newState = [...prevState];
            initializeOrderIfNecessary(newState);
            let itemIndex = newState.findIndex(link => link.id === id);
            if (itemIndex <= 0) {
                return prevState; // first item or id not found, no change
            }
            [newState[itemIndex].order, newState[itemIndex - 1].order] = [newState[itemIndex - 1].order, newState[itemIndex].order];
            newState.sort((a, b) => a.order - b.order);
            setOrderChanged(true);
            return newState;
        });
    }

    const moveDown = (id) => {
        setLinksData(prevState => {
            let newState = [...prevState];
            initializeOrderIfNecessary(newState);
            let itemIndex = newState.findIndex(link => link.id === id);
            if (itemIndex < 0 || itemIndex === newState.length - 1) {
                return prevState; // last item or id not found, no change
            }
            [newState[itemIndex].order, newState[itemIndex + 1].order] = [newState[itemIndex + 1].order, newState[itemIndex].order];
            newState.sort((a, b) => a.order - b.order);
            setOrderChanged(true);
            return newState;
        });
    }

    const moveToBottom = (id) => {
        setLinksData(prevState => {
            let newState = [...prevState];
            initializeOrderIfNecessary(newState);
            let item = newState.find(link => link.id === id);
            if (!item) {
                return prevState; // id not found, no change
            }
            newState.forEach(link => {
                if (link.id !== id) {
                    link.order -= 1;
                }
            });
            item.order = newState.length - 1;
            newState.sort((a, b) => a.order - b.order);
            setOrderChanged(true);
            return newState;
        });
    }


    const renderTableLinkTitle = (value, rowData, index) => {
        return (
            <Text key={index}>
                {value}
                { rowData.social && (
                    <Badge scale={0.5} ml={0.5}>social</Badge>
                )}
            </Text>
        )
    }

    const renderTableLongURLLink = (value, rowData, index) => {
        const hostname = new URL(sanitizeLink(value)).hostname
        let url = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
        return (
            <>
            <Avatar scale={0.8} mr={0.5} src={rowData.image && rowData.image !== "/placeholder.png" ? rowData.image : url} alt={`${hostname}-icon`} />
            <NiceLink key={index} href={value} icon target={"_blank"}>
                <Text span>{value}</Text>
            </NiceLink>
            </>
        )
    }

    const renderTableBooleanHidden = (value, rowData, index) => {
        return (
            value ? (
                <Dot style={{ marginRight: '20px' }}>
                    <Text small>Hidden</Text>
                </Dot>
            ) : (
                <Dot style={{ marginRight: '20px' }} type="success">
                    <Text small>Visible</Text>
                </Dot>
            )
        )
    }

    const renderTableSlugLink = (value, rowData, index) => {
        let link = data?.site?.customDomain ? data?.site?.customDomain : `${siteId}.linkb.org` ;
        link += "/" + value
        return (
            <Link key={index} block underline href={`https://${link}`} onClick={(e) => { e.preventDefault(); copyHandler(`https://${link}`)}}>
                {link}
                <Button auto type={"abort"} scale={0.6} px={0.3} iconRight={<Copy />}></Button>
            </Link>
        )
    }

    const renderTableAction = (value, rowData, index) => {

        const orderContent = () => (
            <>
                <Popover.Item onClick={() => moveToTop(value)}>
                    <ChevronsUp size={16} /><Text span ml={0.5}>Move to top</Text>
                </Popover.Item>
                <Popover.Item onClick={() => moveUp(value)}>
                    <ChevronUp size={16} /><Text span ml={0.5}>Move up</Text>
                </Popover.Item>
                <Popover.Item line />
                <Popover.Item onClick={() => moveDown(value)}>
                    <ChevronDown size={16} /><Text span ml={0.5}>Move down</Text>
                </Popover.Item>
                <Popover.Item onClick={() => moveToBottom(value)}>
                    <ChevronsDown size={16} /><Text span ml={0.5}>Move to bottom</Text>
                </Popover.Item>
            </>
        );
        const content = () => (<>
            <Popover.Item
                style={{minWidth: "150px"}}
                onClick={() => {
                    setUpdatingLink(rowData.id);
                    setLinkName(rowData.title);
                    setLinkImage(rowData.image);
                    setLinkSlug(rowData.slug);
                    setLinkLongurl(rowData.longurl.replace("http://", "").replace("https://", ""));
                    setLinkHidden(rowData.hidden);
                    setLinkSocial(rowData.social);
                    setLinkAvailable(true);
                    setShowModal(true);
                }}
            >
                <Edit size={16} /><Text span ml={0.5}>Edit</Text>
            </Popover.Item>
            <Popover.Item line />
            <Popover key={`order-${index}`} trigger={"hover"} placement={"left"} content={orderContent}>
                <Popover.Item disableAutoClose={false}>
                    <ChevronUpDown size={16} /><Text span ml={0.5}>Order</Text>
                </Popover.Item>
            </Popover>
            <Popover.Item line />
            <Popover.Item
                onClick={() => deleteLink(value)}
            >
                <Trash size={16} color={theme.palette.error} /><Text type={"error"} span ml={0.5}>Delete</Text>
            </Popover.Item>
        </>)
        return (
            deletingLink === value ? (
                <Spinner />
            ) : (
                <Popover key={index} content={content}>
                    <Button auto iconRight={<MoreHorizontal />} px={0.6} scale={2/3} />
                </Popover>
            )
        )
    }

    useEffect(() => {
        async function getLinkImage() {
            if (debouncedLinkLongurl.length > 0) {
                const hostname = new URL(sanitizeLink(debouncedLinkLongurl)).hostname
                let url = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
                setLinkImage(url);
            }
            else {
                setLinkImage("");
            }
        }
        getLinkImage();
    }, [debouncedLinkLongurl]);

    useEffect(() => {
        async function checkLinkSlug() {
            if (debouncedLinkslug.length > 0) {
                setLinkAvailable(1);

                let url = `/api/links/check?slug=${debouncedLinkslug}&siteId=${siteId}`;

                if (updatingLink !== ""){
                    url += "&linkId=" + updatingLink;
                }

                const response = await fetch(url);
                const available = await response.json();
                if (available) {
                    setError(null);
                    setLinkAvailable(2);
                } else {
                    setLinkAvailable(3);
                    setError(`${debouncedLinkslug}`);
                }
            }
        }
        checkLinkSlug();
    }, [debouncedLinkslug]);

    async function createLink() {
        try {
            const res = await fetch(`/api/link?siteId=${siteId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: linkName,
                    longurl: sanitizeLink(linkLongurl),
                    slug: linkSlug,
                    hidden: linkHidden,
                    social: linkSocial,
                    image: linkImage
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setLinksData(current => [...current, data]);
                setShowModal(false);
                resetForm();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateLink() {
        try {
            const res = await fetch(`/api/link?siteId=${siteId}&linkId=${updatingLink}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: linkName,
                    longurl: sanitizeLink(linkLongurl),
                    slug: linkSlug,
                    hidden: linkHidden,
                    social: linkSocial,
                    image: linkImage
                }),
            });

            if (res.ok) {
                const data = await res.json();
                let links = linksData.map((link) => {
                    if (link.id !== updatingLink){
                        return link
                    }
                    else{
                        return data
                    }
                })
                setLinksData(links);
                setShowModal(false);
                resetForm();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateLinkOrder() {
        const payload = linksData.map(link => ({ id: link.id, order: link.order }));
        setUpdatingLink("all");

        try {
            const res = await fetch(`/api/links/update-order?siteId=${siteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({links: payload}),
            });

            if (res.ok) {
                setToast({text: "Order updated!", type: "success"})
            }
        } catch (error) {
            setToast({text: "Order update failed.", type: "error"})
            console.error(error);
        } finally {
            setOrderChanged(false);
            setUpdatingLink("");
        }
    }

    async function deleteLink(linkId) {
        setDeletingLink(linkId)
        try {
            const res = await fetch(`/api/link?siteId=${siteId}&linkId=${linkId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: linkId
                }),
            });

            if (res.ok) {
                let links = linksData.filter((link) => link.id !== linkId)
                setLinksData(links);
            }
        } catch (error) {
            console.error(error);
        }
        setDeletingLink("")
    }
    
    return (
        <>
            <Head>
                <title>Links - LinkBorg - Ultimate link sharing platform</title>
            </Head>
            <div className="page__wrapper">
                <div className="page__content">
                    <div className="page__header">
                        <Text h2>Links</Text>
                        <div>
                            { orderChanged &&
                                <Button
                                    iconRight={<Save />}
                                    type={"secondary-light"}
                                    loading={updatingLink}
                                    onClick={()=> updateLinkOrder()}
                                    auto
                                    mr={1}
                                >
                                    Save
                                </Button>
                            }
                            <Button
                                iconRight={<PlusCircle />}
                                type={"secondary-light"}
                                onClick={() => setShowModal(true)}
                                loading={creatingLink}
                                auto
                            >
                                New Link
                            </Button>
                        </div>
                    </div>
                    <Spacer />
                    <div style={{ overflowX: 'auto', width: "100%", minHeight: "500px"}}>
                        <Table data={linksData} emptyText={"-"}>
                            <Table.Column prop="title" label="title" render={renderTableLinkTitle} />
                            <Table.Column prop="slug" label="slug" render={renderTableSlugLink} />
                            <Table.Column prop="hidden" label="visibility" render={renderTableBooleanHidden} />
                            <Table.Column prop="longurl" label="longurl" render={renderTableLongURLLink} />
                            <Table.Column prop="visits" label="visits" />
                            <Table.Column prop="id" label="" render={renderTableAction} style={{textAlign: "right"}} />
                        </Table>
                    </div>
                    <Modal visible={showModal} onClose={setShowModal}>
                        <Modal.Title>
                            { updatingLink !== "" ?  "Update Link" : "Create New Link" }
                        </Modal.Title>
                        <Modal.Content>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    if (updatingLink !== "") {
                                        updateLink();
                                    }
                                    else {
                                        createLink()
                                    }
                                }}
                            >
                                <ValidatedInput
                                    type={"text"}
                                    onValidation={handleValidation}
                                    width={"100%"}
                                    icon={<PenTool />}
                                    name={"title"}
                                    required={true}
                                    placeholder={"Link name"}
                                    htmlType={"text"}
                                    value={linkName}
                                    onChange={((e) => setLinkName(e.target.value))}
                                >
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                        <Text span>
                                            Link Name
                                        </Text>
                                        <div style={{marginLeft: "0.5rem"}}>
                                            <NiceTooltip>
                                                <Text h4>Link Name</Text>
                                                <Text p>This property sets the name by which your link will be displayed on the list of links on your profile page. Feel free to use emojis here!</Text>
                                            </NiceTooltip>
                                        </div>
                                    </div>
                                </ValidatedInput>
                                <Spacer />
                                <ValidatedInput
                                    type={"slug"}
                                    onValidation={handleValidation}
                                    minLength={1}
                                    maxLength={50}
                                    label={data?.site?.customDomain ? `${data?.site?.customDomain}/` : `${siteId}.linkb.org/`}
                                    width={"100%"}
                                    iconRight={ linkAvailable === 1 ? <Loading />
                                        : linkAvailable === 2 ? <CheckInCircleFill color={"green"}/>
                                            : linkAvailable === 3 ? <XCircleFill color={"red"}/>
                                                : <></>}
                                    name={"slug"}
                                    required={true}
                                    placeholder={"slug"}
                                    value={linkSlug}
                                    onChange={((e) => setLinkSlug(e.target.value))}
                                    htmlType={"text"}
                                >
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                        <Text span>
                                            Link Slug
                                        </Text>
                                        <div style={{marginLeft: "0.5rem"}}>
                                            <NiceTooltip>
                                                <Text h4>Link slug</Text>
                                                <Text p>This property sets the last part of the URL by which your longer URL can be masked on the list of links on your profile page.</Text>
                                            </NiceTooltip>
                                        </div>
                                    </div>
                                </ValidatedInput>
                                <div className="grid gap-y-5 w-5/6 mx-auto">
                                    {error && (
                                        <Text small type={"error"}>
                                            <b>{error}</b> is not available. Try another.
                                        </Text>
                                    )}
                                </div>
                                <Spacer />
                                <ValidatedInput
                                    type={"link"}
                                    onValidation={handleValidation}
                                    label={
                                        (linkImage.length > 0 && linkImage && linkImage !== "/placeholder.png") ? <Image src={linkImage} alt={"site-icon"} width={"20px"} /> : <Globe size={20} />
                                    }
                                    width={"100%"}
                                    name={"longurl"}
                                    required={true}
                                    placeholder={"https://example.com"}
                                    value={linkLongurl}
                                    onChange={((e) => setLinkLongurl(e.target.value))}
                                    htmlType={"url"}
                                >
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                        <Text span>
                                            Long URL
                                        </Text>
                                        <div style={{marginLeft: "0.5rem"}}>
                                            <NiceTooltip>
                                                <Text h4>Long URL</Text>
                                                <Text p>This is the link to which the above slug will redirect to.</Text>
                                            </NiceTooltip>
                                        </div>
                                    </div>
                                </ValidatedInput>
                                <Spacer />
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                        <Toggle checked={linkHidden} onChange={(e) => setLinkHidden(e.target.checked)} scale={1.5} />
                                        <Text span mt={0.4} ml={0.5}>Hide this on your page?</Text>
                                    </div>
                                    <div style={{marginLeft: "1rem", marginTop: "0.7rem"}}>
                                        <NiceTooltip>
                                            <Text h4>Hidden Links</Text>
                                            <Text p>You can hide links from your profile page - these links work just like any other link except that they are not shown in your list of links.</Text>
                                        </NiceTooltip>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                        <Toggle checked={linkSocial} onChange={(e) => setLinkSocial(e.target.checked)} scale={1.5} />
                                        <Text span mt={0.4} ml={0.5}>Display as social link?</Text>
                                    </div>
                                    <div style={{marginLeft: "1rem", marginTop: "0.7rem"}}>
                                        <NiceTooltip>
                                            <Text h4>Social Links</Text>
                                            <Text p>You can pin links to the top of your profile page - just below your bio in form of social icons.</Text>
                                        </NiceTooltip>
                                    </div>
                                </div>
                            </form>
                        </Modal.Content>
                        <Modal.Action passive onClick={() => {
                            setError(null);
                            setShowModal(false);
                            resetForm();
                        }}>Cancel</Modal.Action>
                        <Modal.Action
                            loading={creatingLink}
                            disabled={creatingLink || error !== null || !isFormValid}
                            htmlType={"submit"}
                            onClick={()=> {
                                setCreatingLink(true);
                                if (updatingLink !== "") {
                                    updateLink();
                                }
                                else {
                                    createLink()
                                }
                            }}
                        >Submit</Modal.Action>
                    </Modal>
                </div>
            </div>
            <style jsx>{`
              .page__wrapper {
                background-color: ${theme.palette.accents_1};
              }
              .page__content {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
                flex-wrap: wrap;
                width: ${theme.layout.pageWidthWithMargin};
                max-width: 100%;
                margin: 0 auto;
                padding: calc(${theme.layout.gap} * 2) ${theme.layout.pageMargin} calc(${theme.layout.gap} * 4);
                transform: translateY(-15px);
                box-sizing: border-box;
                overflow-x: hidden;
              }
              .page__content :global(.view-all) {
                font-size: 0.875rem;
                font-weight: 700;
                margin: calc(1.5 * ${theme.layout.gap}) 0;
                text-align: center;
              }
              .page__header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: ${theme.layout.pageWidthWithMargin};
                max-width: 100%;
              }
              .BaseTable .BaseTable__header, .BaseTable .BaseTable__body {
                background: ${theme.palette.background} !important;
              }
            `}</style>
        </>
    )
}

export default Page;
