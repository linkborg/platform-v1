import React, {useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {
  Button,
  Modal,
  useTheme,
  Text,
  Image,
  Card,
  Input,
  Spacer,
  Textarea,
  Loading,
  ButtonGroup, Divider, Grid, Spinner, Code
} from "@geist-ui/core";
import NextLink from "next/link";
import Head from "next/head";

import {useDebounce} from "use-debounce";
import {HttpMethod} from "@/types";

import {authOptions} from "pages/api/auth/[...nextauth]";
import {getServerSession} from "next-auth/next";
import {CheckInCircleFill, XCircleFill, Globe, PenTool, PlusCircle, Link, Settings} from "@geist-ui/icons";
import NiceLink from "@/components/NiceLink";
import ValidatedInput from "@/components/ValidatedInput";
import NiceTooltip from "@/components/NiceTooltip";
import prisma from "@/lib/prisma";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const sites = await prisma.site.findMany({
    where: {
      user: {
        id: session?.user?.id,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          bio: true,
          email: true,
          image: true,
        },
      }
    }
  });

  return {
    props: {
      session_json: JSON.stringify(session),
      sites_json: JSON.stringify(sites)
    },
  };
}

const Page = ( {session_json, sites_json}) => {
  const session = JSON.parse(session_json)
  const sessionId = session?.user?.id;
  const sites = JSON.parse(sites_json);
  const theme = useTheme();

  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [creatingSite, setCreatingSite] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [siteDef, setSiteDef] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [debouncedSubdomain] = useDebounce(subdomain, 1000);
  const [error, setError] = useState(null);
  const [siteAvailable, setSiteAvailable] = useState(0);

  const [isFormValid, setIsFormValid] = useState(true);

  const handleValidation = useCallback((isValid) => {
    setIsFormValid(isValid);
  }, []);

  useEffect(() => {
    async function checkSubDomain() {
      if (debouncedSubdomain.length > 0) {
        setSiteAvailable(1);
        const response = await fetch(
            `/api/domain/check?domain=${debouncedSubdomain}&subdomain=1`
        );
        const available = await response.json();
        if (available) {
          setError(null);
          setSiteAvailable(2);
        } else {
          setSiteAvailable(3);
          setError(`${debouncedSubdomain}.linkb.org`);
        }
      }
    }
    checkSubDomain();
  }, [debouncedSubdomain]);

  async function createSite() {
    const res = await fetch("/api/site", {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionId,
        name: siteName,
        subdomain: subdomain,
        description: siteDef,
      }),
    });

    if (!res.ok) {
      alert("Failed to create site");
    }

    const data = await res.json();
    router.push(`/site/${data.siteId}`);
  }

  return (
      <>
        <Head>
          <title>Home - LinkBorg - Ultimate link sharing platform</title>
        </Head>
        <div className="page__wrapper">
          <div className="page__content">
            <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
              <Text h2>Sites</Text>
              <div className="my-10 grid gap-y-10">
                {sites ? (
                    sites.length > 0 ? (
                        sites.map((site) => {

                          const ogImage = `https://linkb.org/api/og?name=${encodeURIComponent(site.user.name ? site.user.name : site.user.email.split("@")[0])}&bio=${encodeURIComponent(site.user.bio)}&site=${encodeURIComponent(site.customDomain ? site.customDomain : site.subdomain + ".linkb.org")}&image=${encodeURIComponent(site.user.image)}&cover=${encodeURIComponent(site.image)}`;

                          return (
                          <Card key={site.id}>
                            <Card.Content>
                              <NextLink href={`/site/${site.id}`} key={site.id}>
                                <Image alt={"site-meta"} src={ogImage}
                                       height="200px" draggable={false} />
                                <Divider />
                                <Text h4>{site.name}</Text>
                                <Text type="secondary" small>{site.description}</Text>
                              </NextLink>
                              <Divider />
                              <NextLink href={`/site/${site.id}/settings`}>
                                <Button type={"secondary"} ghost scale={0.5} icon={<Settings />} px={0.6} auto />
                              </NextLink>
                              <Spacer w={1} inline={true} />
                              {site.subdomain && (
                                  <NiceLink color underline icon block target={"_blank"} href={"https://" + site.subdomain + ".linkb.org"}>
                                    {site.subdomain + ".linkb.org"}
                                  </NiceLink>
                              )}
                              &nbsp;
                              {site.customDomain && (
                                  <NiceLink color underline icon block target={"_blank"} href={"https://" + site.customDomain}>
                                    {site.customDomain}
                                  </NiceLink>
                              )}
                            </Card.Content>
                          </Card>
                        ) })
                    ) : (
                        <>
                          <Button
                              iconRight={<PlusCircle />}
                              type={"secondary-light"}
                              onClick={() => setShowModal(true)}
                              auto
                          >
                            Create new site
                          </Button>
                          <Text p>
                            Click &quot;Create New Site&quot; to create a site and get started!
                          </Text>
                        </>
                    )
                ) : (
                    <Spinner />
                )}
              </div>
            </div>
            <Modal visible={showModal} onClose={setShowModal}>
              <Modal.Title>Create a New Site</Modal.Title>
              <Modal.Content>
                <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setCreatingSite(true);
                      createSite();
                    }}
                >
                  <ValidatedInput
                      width={"100%"}
                      icon={<PenTool />}
                      name={"name"}
                      required={true}
                      placeholder={"Site name"}
                      htmlType={"text"}
                      type={"text"}
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      onValidation={handleValidation}
                  >
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                      <Text span>
                        Site Name
                      </Text>
                      <div style={{marginLeft: "0.5rem"}}>
                        <NiceTooltip>
                          <Text h4>Site Name</Text>
                          <Text p>The name of your website. This will be used in alternative to your name on the website title of your profile page. You can change it later from Site Settings.</Text>
                        </NiceTooltip>
                      </div>
                    </div>
                  </ValidatedInput>
                  <Spacer />
                  <ValidatedInput
                      labelRight={".linkb.org"}
                      width={"100%"}
                      icon={<Globe />}
                      iconRight={ siteAvailable === 1 ? <Loading />
                          : siteAvailable === 2 ? <CheckInCircleFill color={"green"}/>
                              : siteAvailable === 3 ? <XCircleFill color={"red"}/>
                                  : <></>}
                      name={"subdomain"}
                      required={true}
                      placeholder={"example"}
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      onValidation={handleValidation}
                      htmlType={"text"}
                      type={"subdomain"}
                  >
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                      <Text span>
                        Subdomain
                      </Text>
                      <div style={{marginLeft: "0.5rem"}}>
                        <NiceTooltip>
                          <Text h4>Site Subdomain</Text>
                          <Text p>This is the subdomain we&apos;ll provision for you. This will be permanent and changing it is not possible. However, you can later add your own custom domain name to mask it from Site Settings.</Text>
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
                  <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text span>
                      &nbsp;
                    </Text>
                    <div style={{marginLeft: "0.5rem"}}>
                      <NiceTooltip>
                        <Text span type={"secondary"} scale={0.5}>Site Description</Text>
                        <Text p>This is the text that will go in the <Code>meta:description</Code> of your profile page. This impact SEO and can be changed later from Site Settings.</Text>
                      </NiceTooltip>
                    </div>
                  </div>
                  <Textarea
                      width="100%"
                      name="description"
                      value={siteDef}
                      onChange={(e) => setSiteDef(e.target.value)}
                      placeholder="Description"
                      required
                      rows={3}
                  />
                </form>
              </Modal.Content>
              <Modal.Action passive onClick={() => { setError(null); setShowModal(false)}}>Cancel</Modal.Action>
              <Modal.Action
                  loading={creatingSite}
                  disabled={ !isFormValid || creatingSite || !siteAvailable || error !== null}
                  htmlType={"submit"}
                  onClick={()=> {setCreatingSite(true); createSite();}}
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
        `}</style>
      </>
  );
};

export default Page;
