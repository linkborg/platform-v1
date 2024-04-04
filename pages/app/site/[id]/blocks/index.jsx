import React, {useState, useEffect} from 'react';
import {useRouter} from "next/router";
import {
    Button,
    Card,
    Grid,
    Link,
    Select,
    Spacer,
    Text,
    useClipboard,
    useTheme,
    useToasts,
    GeistProvider,
    ButtonGroup,
    Divider, Tag, Badge, Dot, Tooltip, Collapse, Fieldset
} from '@geist-ui/core';
import Head from 'next/head';

import { ReactSortable } from 'react-sortablejs';

import {authOptions} from 'pages/api/auth/[...nextauth]'
import {getServerSession} from "next-auth/next"

import {Copy, Eye, EyeOff, Move, PlusCircle, Save} from "@geist-ui/icons";
import prisma from "@/lib/prisma";

import {
    bwDarkTheme, bwLightTheme,
    cityLightsThemeDark, cityLightsThemeLight,
    DraculaTheme,
    GreenDarkTheme,
    GreenLightTheme,
    GruvboxDarkTheme,
    GruvboxLightTheme,
    HighContrastDarkTheme,
    HighContrastLightTheme, MaterialDarkTheme,
    MaterialLightTheme,
    MonokaiTheme, PaperDarkTheme, PaperLightTheme,
    RedDarkTheme,
    RedLightTheme,
    SapphireBlueDarkTheme,
    sapphireBlueTheme, SolarizedDarkTheme, SolarizedLightTheme, twitterThemeDark, twitterThemeLight
} from "@/lib/themes";

import PreviewSiteContent from "@/components/app/blocks/preview";
import useBetterMediaQuery from "@/lib/use-better-media-query";
import BlockCard from "@/components/app/blocks/block-card";

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
            user: true,
            blocks: true,
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
    const isAboveSM = useBetterMediaQuery('(min-width: 650px)')
    const [themeType, setThemeType] = useState(data.site.theme);
    const [layout, setLayout] = useState(data.site.layout);

    const router = useRouter();
    const { id: siteId } = router.query;

    const [blocksData, setBlocksData] = useState(data.site.blocks.sort((a,b) => a.order - b.order));

    const { setToast } = useToasts()
    const { copy } = useClipboard()
    const copyHandler = (text) => {
        copy(text);
        setToast({ text: 'Link copied.' })
    }

    const [orderChanged, setOrderChanged] = useState(false);
    const [creatingBlock, setCreatingBlock] = useState(false);
    const [updatingBlocksOrder, setUpdatingBlocksOrder] = useState(false);

    const createBlock = async () => {
        setCreatingBlock(true);
        try {
            const res = await fetch(`/api/block?siteId=${siteId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                const blockSlug = data.slug;
                await router.push(`/site/${siteId}/blocks/${blockSlug}`)
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateBlockOrder() {
        setUpdatingBlocksOrder(true);
        const payload = blocksData.map((block, index) => ({ id: block.id, order: index+1 }));

        try {
            const res = await fetch(`/api/blocks/update-order?siteId=${siteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({blocks: payload}),
            });

            if (res.ok) {
                setToast({text: "Order updated!", type: "success"})
            }
        } catch (error) {
            setToast({text: "Order update failed.", type: "error"})
            console.error(error);
        } finally {
            setUpdatingBlocksOrder(false);
        }
    }

    return (
        <>
            <Head>
                <title>Blocks - LinkBorg - Ultimate link sharing platform</title>
            </Head>
            <div className="page__wrapper">
                <div className="page__content">
                    <div className="page__header">
                        <Text h2>Blocks</Text>
                        {
                            isAboveSM ? (
                                <div>
                                    <Button
                                        iconRight={<Save />}
                                        type={"secondary-light"}
                                        loading={updatingBlocksOrder}
                                        onClick={()=> updateBlockOrder()}
                                        auto
                                        mr={1}
                                        disabled={!orderChanged}
                                    >
                                        Save Order
                                    </Button>
                                    <Button
                                        iconRight={<PlusCircle />}
                                        type={"secondary-light"}
                                        loading={creatingBlock}
                                        disabled={creatingBlock}
                                        onClick={() => createBlock()}
                                        auto
                                    >
                                        New Block
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Button
                                        iconRight={<Save />}
                                        type={"secondary-light"}
                                        loading={updatingBlocksOrder}
                                        onClick={()=> updateBlockOrder()}
                                        auto
                                        mr={1}
                                        disabled={!orderChanged}
                                    >
                                    </Button>
                                    <Button
                                        iconRight={<PlusCircle />}
                                        type={"secondary-light"}
                                        loading={creatingBlock}
                                        disabled={creatingBlock}
                                        onClick={() => createBlock()}
                                        auto
                                    >
                                    </Button>
                                </div>
                            )
                        }

                    </div>
                    <Spacer />
                    <Grid.Container gap={2}>
                        <Grid xs={24} sm={12} md={10} lg={12}>
                            <Card width={"100%"} style={{maxHeight: "80vh", overflowY: "scroll"}}>
                                <Text p>Blocks</Text>
                                <Grid.Container gap={2}>
                                    <ReactSortable
                                        style={{width: "100%"}}
                                        list={blocksData}
                                        setList={setBlocksData}
                                        group="blocks"
                                        animation={500} // Increase this value
                                        forceFallback={true} // Enable SortableJS fallback
                                        ghostClass={'sortable-ghost'}
                                        chosenClass={'sortable-chosen'}
                                        onChoose={(evt) => {
                                            evt.item.style.background = theme.palette.accents_2;
                                            evt.item.style.opacity = "0.5";
                                        }}
                                        onUnchoose={(evt) => {
                                            evt.item.style.background = "transparent";
                                            evt.item.style.opacity = "1";
                                        }}
                                        dragoverBubble={true}
                                        dropBubble={true}
                                        easing={"ease-in-out"}
                                        onSort={() => setOrderChanged(true)}
                                        delay={200}
                                        delayOnTouchOnly={0}
                                    >
                                        {blocksData.map((block, index) => {
                                            let link = "";
                                            link += data?.site?.customDomain ? data?.site?.customDomain : `${siteId}.linkb.org` ;
                                            link += "/" + block.slug;
                                            return (
                                                <Grid xs={24} key={`item-${index}`} index={index}>
                                                    <BlockCard block={block} siteId={siteId} link={link} />
                                                </Grid>
                                            )
                                        })}
                                    </ReactSortable>
                                </Grid.Container>
                            </Card>
                        </Grid>
                        <Grid xs={0} sm={12} md={14} lg={12}>
                            <Card width={"100%"} style={{maxHeight: "80vh", overflowY: "scroll"}}>
                                <div className={"page__header"}>
                                <Text small>Theme</Text>
                                    <select
                                        value={ themeType }
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setThemeType(e.target.value);
                                        }}
                                        style={{
                                            display: "inline-block",
                                            height: "20px",
                                            padding: "0 12px",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            color: "#333",
                                            backgroundColor: "#fff",
                                            border: "1px solid #eaeaea",
                                            borderRadius: "5px",
                                            outline: "none",
                                            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
                                            transition: "border .2s ease, box-shadow .2s ease",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="blue-light">Blue Light</option>
                                        <option value="blue-dark">Blue Dark</option>
                                        <option value="red-light">Red Light</option>
                                        <option value="red-dark">Red Dark</option>
                                        <option value="green-light">Green Light</option>
                                        <option value="green-dark">Green Dark</option>
                                        <option value="high-contrast-light">High Contrast Light</option>
                                        <option value="high-contrast-dark">High Contrast Dark</option>
                                        <option value="dracula">Dracula</option>
                                        <option value="monokai">Monokai</option>
                                        <option value="gruvbox-light">Gruvbox Light</option>
                                        <option value="gruvbox-dark">Gruvbox Dark</option>
                                        <option value="material-light">Material Light</option>
                                        <option value="material-dark">Material Dark</option>
                                        <option value="solarized-light">Solarized Light</option>
                                        <option value="solarized-dark">Solarized Dark</option>
                                        <option value="paper-light">Paper Light</option>
                                        <option value="paper-dark">Paper Dark</option>
                                        <option value="twitter-light">Twitter Light</option>
                                        <option value="twitter-dark">Twitter Dark</option>
                                        <option value="city-lights-light">City Lights Light</option>
                                        <option value="city-lights-dark">City Lights Dark</option>
                                        <option value="bw-light">BW Light</option>
                                        <option value="bw-dark">BW Dark</option>
                                    </select>
                                <Text span small>Layout:</Text>
                                    <select
                                        value={ layout }
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setLayout(e.target.value);
                                        }}
                                        style={{
                                            display: "inline-block",
                                            height: "20px",
                                            padding: "0 12px",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            color: "#333",
                                            backgroundColor: "#fff",
                                            border: "1px solid #eaeaea",
                                            borderRadius: "5px",
                                            outline: "none",
                                            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
                                            transition: "border .2s ease, box-shadow .2s ease",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <option value="grid">Grid</option>
                                        <option value="column">Column</option>
                                    </select>
                                </div>
                                <Spacer />
                                <GeistProvider themes={[
                                    GreenLightTheme, GreenDarkTheme,
                                    RedLightTheme, RedDarkTheme,
                                    sapphireBlueTheme, SapphireBlueDarkTheme,
                                    HighContrastLightTheme, HighContrastDarkTheme,
                                    DraculaTheme, MonokaiTheme,
                                    GruvboxLightTheme, GruvboxDarkTheme,
                                    MaterialLightTheme, MaterialDarkTheme,
                                    SolarizedLightTheme, SolarizedDarkTheme,
                                    PaperLightTheme, PaperDarkTheme,
                                    cityLightsThemeDark, cityLightsThemeLight,
                                    twitterThemeDark, twitterThemeLight,
                                    bwDarkTheme, bwLightTheme
                                ]} themeType={ themeType }>
                                    <PreviewSiteContent data={{...data.site, layout: layout, blocks: blocksData}} />
                                </GeistProvider>
                            </Card>
                        </Grid>
                    </Grid.Container>
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
                padding-bottom: 0;
                transform: translateY(-15px);
                box-sizing: border-box;
                overflow-x: hidden;
              }
              .page__content :global(.view-all) {
                font-size: 0.875rem;
                font-weight: 700;
                margin: calc(1.5 * ${theme.layout.gap}) 0;
                padding-bottom: 0;
                text-align: center;
              }
              .page__header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: ${theme.layout.pageWidthWithMargin};
                max-width: 100%;
              }
              .card__header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              }
            `}</style>
        </>
    )
}

export default Page;
