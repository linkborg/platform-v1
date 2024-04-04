import React, {useEffect, useState} from 'react';
import { useRouter } from "next/router";
import {
    Breadcrumbs,
    Button, ButtonGroup,
    Card,
    Description,
    Divider, Dot,
    Grid,
    Link, Select,
    Spacer,
    Spinner,
    Text, Tooltip,
    useTheme
} from '@geist-ui/core';
import Head from 'next/head';

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

import {getSiteDataFromAckee} from "@/lib/ackee-queries";
import {initializeApollo} from "@/lib/ackee-graphql";
import prisma from "@/lib/prisma";
import {PlusCircle, Save, BarChart2, TrendingUp} from "@geist-ui/icons";
import {ChartBuilder} from "@/components/app/charts";

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

    const [range, setRange] = useState("month");
    const [viewsChartType, setViewsChartType] = useState("bar");
    const [durationsChartType, setDurationsChartType] = useState("bar");

    return (
        <>
            <Head>
                <title>{`${siteData ? siteData?.name : "Site"} - LinkBorg - Ultimate link sharing platform`}</title>
            </Head>
            <div className="page__wrapper">
                <div className="page__content">
                    <div className="page__header">
                        <Text h2>Analytics</Text>
                        <Select type={"secondary"} value={range} onChange={(value) => {console.log(value); setRange(value)}}>
                            <Select.Option value="today">Today</Select.Option>
                            <Select.Option value="week">Last 7 Days</Select.Option>
                            <Select.Option value="month">Last 30 Days</Select.Option>
                        </Select>
                    </div>
                    <Spacer />
                    <Grid.Container direction={"row"} gap={2}>
                        <Grid xs={24} sm={12} md={8} lg={6}>
                            <Card width={"100%"}>
                                <Card.Content>
                                    <Text h1>1</Text>
                                </Card.Content>
                                <Card.Footer>
                                    Sites
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
                                    Block Visits
                                </Card.Footer>
                            </Card>
                        </Grid>
                        <Grid xs={24} sm={12} md={8} lg={6}>
                            <Card width={"100%"}>
                                <Card.Content>
                                    <Text h1>{ackeeData ? Math.round(ackeeData?.data?.domain?.facts?.averageDuration.count / 1000) : 0}</Text>
                                </Card.Content>
                                <Card.Footer>
                                    Average Duration (in seconds)
                                </Card.Footer>
                            </Card>
                        </Grid>
                        <Grid xs={24} sm={12} md={8} lg={6}>
                            <Card width={"100%"}>
                                <Card.Content>
                                    <Text h1>{ackeeData ? ackeeData?.data?.domain?.facts?.viewsToday : 0}</Text>
                                </Card.Content>
                                <Card.Footer>
                                    Views today
                                </Card.Footer>
                            </Card>
                        </Grid>
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
                                    <Text h1>{ackeeData ? ackeeData?.data?.domain?.facts?.viewsYear : 0}</Text>
                                </Card.Content>
                                <Card.Footer>
                                    Views in Year
                                </Card.Footer>
                            </Card>
                        </Grid>
                        <Grid xs={24} sm={12} md={8} lg={6}>
                            <Card width={"100%"}>
                                <Card.Content>
                                    <Text h1>{ackeeData ? ackeeData?.data?.domain?.facts?.averageViews.count : 0}</Text>
                                </Card.Content>
                                <Card.Footer>
                                    Average Views per day
                                </Card.Footer>
                            </Card>
                        </Grid>
                        <Grid xs={24} sm={24} md={24} lg={24}>
                            <Card shadow width={"100%"}>
                                <div className="page__header">
                                    <Text h3>Views</Text>
                                    <ButtonGroup scale={0.6}>
                                        <Tooltip scale={0.6} text={'Bar Chart'}>
                                            <Button scale={0.6} px={0.6} iconRight={<BarChart2 />} onClick={() => setViewsChartType("bar")}>{ viewsChartType === "bar" && <Dot  scale={0.6} type="success" />}</Button>
                                        </Tooltip>
                                        <Tooltip scale={0.6} text={'Line Chart'}>
                                            <Button scale={0.6} px={0.6} iconRight={<TrendingUp />} onClick={() => setViewsChartType("line")}>{ viewsChartType === "line" && <Dot scale={0.6} type="success" />}</Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </div>
                                <ChartBuilder chartType={viewsChartType} label={"Views"} type={"views"} range={range} chartData={ackeeData ? ackeeData?.data?.domain?.statistics?.views : []} />
                            </Card>
                        </Grid>
                        <Grid xs={24} sm={24} md={24} lg={24}>
                            <Card shadow width={"100%"}>
                                <div className="page__header">
                                    <Text h3>Durations</Text>
                                    <ButtonGroup>
                                        <Tooltip scale={0.6} text={'Bar Chart'}>
                                            <Button  scale={0.6} px={0.6} iconRight={<BarChart2 />} onClick={() => setDurationsChartType("bar")}>{ durationsChartType === "bar" && <Dot scale={0.6} type="success" />}</Button>
                                        </Tooltip>
                                        <Tooltip scale={0.6} text={'Line Chart'}>
                                            <Button scale={0.6} px={0.6} iconRight={<TrendingUp />} onClick={() => setDurationsChartType("line")}>{ durationsChartType === "line" && <Dot scale={0.6} type="success" />}</Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </div>
                                <ChartBuilder chartType={durationsChartType} label={"Durations"} type={"durations"} range={range} chartData={ackeeData ? ackeeData?.data?.domain?.statistics?.durations : []} />
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
              .page__header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: ${theme.layout.pageWidthWithMargin};
                max-width: 100%;
              }

            `}</style>
        </>
    )
}

export default Page;
