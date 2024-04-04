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

import { fetcher } from "@/lib/fetcher";
import R2Uploader from "@/components/r2uploader";
import { ThemePreviewCard } from "@/components/app/ThemePreviewCard";
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
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState(null);
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

    return (
        <>
            <Head>
                <title>Settings - LinkBorg - Ultimate link sharing platform</title>
            </Head>
            <div className="page__wrapper">
                <div className="page__content">
                    <Card width={"100%"}>
                        <Card.Content style={{width: "100%", maxWidth: "400px"}}>
                            <Text h4>Cover Image</Text>
                            <Display>
                                <Image
                                    src={tempImage ? tempImage : data?.image}
                                    height={"200px"}
                                />
                                <Spacer />
                                <R2Uploader folder="cover" height={300} width={900} onUpload={handleImageUpload} onTempUpload={handleTempImageUpload} setImageUploading={setImageUploading} />
                            </Display>
                        </Card.Content>
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>A personal touch for your page. Select Image &gt; Upload &gt; Save</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveSiteSettings(data);
                                    }}
                                    disabled={saving || tempImage}
                                    loading={saving || imageUploading}
                                >
                                    Save
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Spacer />
                    <Card width={"100%"}>
                        <Card.Content>
                            <Text h4>Site Layout</Text>
                            <Spacer />
                            <Grid.Container gap={2} direction={"row"} padding={1} justify={"flex-start"} alignItems={"flex-start"}>
                                <Grid>
                                    <Fieldset style={{cursor: "pointer"}} onClick={() => setData({
                                        ...data,
                                        layout: "column",
                                    })}>
                                        <Fieldset.Content>
                                            <Image src={"/column-layout.png"} width={"10rem"} alt={"column-layout"} />
                                        </Fieldset.Content>
                                        <Fieldset.Footer>
                                            <Dot style={{ marginRight: '20px' }} type={ data?.layout ? data.layout === "column" ? "success" : "" : ""}>Column</Dot>
                                        </Fieldset.Footer>
                                    </Fieldset>
                                </Grid>
                                <Grid>
                                    <Fieldset style={{cursor: "pointer"}} onClick={() => setData({
                                        ...data,
                                        layout: "grid",
                                    })}>
                                        <Fieldset.Content>
                                            <Image src={"/grid-layout.png"} width={"10rem"} alt={"grid-layout"} />
                                        </Fieldset.Content>
                                        <Fieldset.Footer>
                                            <Dot style={{ marginRight: '20px' }} type={ data?.layout ? data.layout === "grid" ? "success" : "" : ""}>Grid</Dot>
                                        </Fieldset.Footer>
                                    </Fieldset>
                                </Grid>
                            </Grid.Container>
                            <Spacer />
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Layout of your website.</Text>
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
                            <Text h4>Site Theme <Tag type={"warning"}>Experimental</Tag></Text>
                            <Spacer />
                            <div style={{width: "100%"}}>
                                <select
                                    value={ previewTheme }
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setPreviewTheme(e.target.value);
                                    }}
                                    style={{
                                        display: "inline-block",
                                        height: "40px",
                                        width: "100%",
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
                                        // appearance: "none",
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
                                {/*<Button style={{display: "inline-block"}} scale={0.6} padding={0.6} auto iconRight={<ArrowDown />}></Button>*/}
                            </div>
                            <Spacer />
                            Preview:
                            { previewTheme && <ThemePreviewCard themeType={previewTheme} />}
                        </Card.Content>
                        <Spacer />
                        <Card.Footer>
                            <div className="card__action">
                                <Text span>Theme of your website. This will not change the color scheme on this dashboard.</Text>
                                <Button
                                    type={"secondary"}
                                    auto
                                    ghost
                                    onClick={() => {
                                        saveSiteSettings({
                                            ...data,
                                            theme: previewTheme
                                        });
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
