import React, {useEffect, useState} from 'react';
import { useRouter } from "next/router";
import {Breadcrumbs, Card, Description, Divider, Grid, Link, Spacer, Spinner, Text, useTheme} from '@geist-ui/core';
import Head from 'next/head';

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

import NiceLink from "@/components/NiceLink";

import { gql } from '@apollo/client';
import {initializeApollo} from "@/lib/ackee-graphql";
import prisma from "@/lib/prisma";

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

    const siteId = context.params.id;

    let siteData = await prisma.site.findFirst({
        where: {
            id: siteId,
            user: {
                id: session?.user?.id,
            },
        },
    });

    const blocks = await prisma.block.findMany({
        where: {
            siteId: siteId
        },
    });

    siteData.blocksCount = blocks?.length;
    siteData.blocksVisits = blocks?.reduce((sum, block) => sum + block.visits, 0);

    const apolloClient = initializeApollo();

    const getSiteDataFromAckee = gql`
        query getDomainsFacts($id: ID!) {
            domain(id: $id) {
                id
                title
                facts {
                    activeVisitors
                    averageViews{
                        count, change
                    }
                    averageDuration {
                        count, change
                    }
                    viewsToday
                    viewsMonth
                    viewsYear
                }
            }
        }
     `;

    const ackeeData = await apolloClient.query({
        query: getSiteDataFromAckee,
        variables: { id: siteData?.ackee_tracking_id },
    });

    return {
        props: {
            session_json: JSON.stringify(session),
            siteData_json: JSON.stringify(siteData),
            ackeeData_json: JSON.stringify(ackeeData)
        },
    }
}

const Page = ({ session_json, siteData_json, ackeeData_json }) => {

    const session = JSON.parse(session_json);
    const siteData = JSON.parse(siteData_json);
    const ackeeData = JSON.parse(ackeeData_json);

    const theme = useTheme()

    const router = useRouter();
    const { id: siteId } = router.query;

    return (
        <>
            <Head>
                <title>{`${siteData ? siteData?.name : "Site"} - LinkBorg - Ultimate link sharing platform`}</title>
            </Head>
            <div className="page__wrapper">
                <div className="page__content">
                    <Text h2>Dashboard</Text>
                    <Spacer />
                    { siteData && siteData?.blocksCount === 0 && (
                        <>
                            <Grid.Container direction={"row"} gap={2}>
                                <Grid xs={24} sm={18}>
                                    <Card width={"100%"} type="cyan">
                                        <Text span>Welcome, add <NiceLink href={`/site/${siteData?.subdomain}/blocks`}>blocks</NiceLink> to get started!</Text>
                                    </Card>
                                </Grid>
                            </Grid.Container>
                            <Spacer />
                        </>
                    )}
                    <Grid.Container direction={"row"} gap={2}>
                        <Grid xs={24} sm={12} md={8} lg={6}>
                            <Card width={"100%"}>
                                <Card.Content>
                                    <Text h1>{ackeeData ? ackeeData?.data?.domain?.facts?.viewsMonth : 0}</Text>
                                </Card.Content>
                                <Card.Footer>
                                    Views in month
                                </Card.Footer>
                            </Card>
                        </Grid>
                        <Grid xs={24} sm={12} md={8} lg={6}>
                            <Card width={"100%"}>
                                <Card.Content>
                                    <Text h1>{siteData ? siteData?.blocksCount : 0}</Text>
                                </Card.Content>
                                <Card.Footer>
                                    Blocks
                                </Card.Footer>
                            </Card>
                        </Grid>
                        <Grid xs={24} sm={12} md={8} lg={6}>
                            <Card width={"100%"}>
                                <Card.Content>
                                    <Text h1>{siteData ? siteData?.blocksVisits : 0}</Text>
                                </Card.Content>
                                <Card.Footer>
                                    Blocks Visits
                                </Card.Footer>
                            </Card>
                        </Grid>
                    </Grid.Container>
                    <Spacer />
                    <Grid.Container direction={"row"} gap={2}>
                        <Grid xs={24} sm={18}>
                            <Card width={"100%"}>
                                <Card.Content>
                                    <Text h3>{siteData ? siteData?.name : "Site Name"}</Text>
                                    <Divider />
                                    <Text p>{siteData ? siteData?.description: "Description"}</Text>
                                </Card.Content>
                                <Card.Footer>
                                    {siteData?.subdomain && (
                                        <Link color underline icon block target={"_blank"} href={"https://" + siteData.subdomain + ".linkb.org"}>
                                            {siteData.subdomain + ".linkb.org"}
                                        </Link>
                                    )}
                                    {siteData?.customDomain && (
                                        <Link color underline icon block target={"_blank"} href={"https://" + siteData.customDomain}>
                                            {siteData.customDomain}
                                        </Link>
                                    )}
                                </Card.Footer>
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
    )
}

export default Page;
