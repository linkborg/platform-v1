import React, {useEffect, useState} from 'react'
import {
    Text,
    Tag,
    useTheme,
    Select,
    Spacer,
    Divider,
    Grid,
    Button,
    Card,
    Tabs,
    Link,
    Progress,
    Table, CssBaseline, GeistProvider
} from '@geist-ui/core'
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
} from "../../lib/themes";

import { useApollo } from '@/lib/ackee-graphql';
import { gql, useQuery } from '@apollo/client';

const MY_QUERY = gql`
query getDomainsFacts($title: TITLE!) {
    domains (title: $title) {
        facts {
            activeVisitors
            averageViews
            averageDuration
            viewsToday
            viewsMonth
            viewsYear
        }
    }
}
`;

const Home = () => {

    const theme = useTheme();
    const client = useApollo();

    const title = "linkb.org";

    const { loading, error, data } = useQuery(MY_QUERY, { variables: title, client });

    useEffect(() => {
        if(data) {
            console.log(data);
        }else {
            console.log("No Data")
        }
    }, [data])

    const [themeType, setThemeType] = useState("dark");
    const types = ['secondary', 'success', 'warning', 'error', 'dark', 'alert', 'purple', 'violet', 'cyan']


    const data2 = [
        { property: 'type', description: 'Content type', type: 'secondary | warning', default: '-' },
        { property: 'Component', description: 'DOM element to use', type: 'string', default: '-' },
        { property: 'bold', description: 'Bold style', type: 'boolean', default: 'true' },
    ]

    return (
        <>
            <div className="content">
                <div className="centered_content">
                    <Spacer />
                    <Select value={themeType} style={{maxWidth: "300px"}} onChange={(e) => setThemeType(e)}>
                        <Select.Option value="light">Light</Select.Option>
                        <Select.Option value="dark">Dark</Select.Option>
                        <Select.Option value="blue-light">Blue Light</Select.Option>
                        <Select.Option value="blue-dark">Blue Dark</Select.Option>
                        <Select.Option value="red-light">Red Light</Select.Option>
                        <Select.Option value="red-dark">Red Dark</Select.Option>
                        <Select.Option value="green-light">Green Light</Select.Option>
                        <Select.Option value="green-dark">Green Dark</Select.Option>
                        <Select.Option value="high-contrast-light">High Contrast Light</Select.Option>
                        <Select.Option value="high-contrast-dark">High Contrast Dark</Select.Option>
                        <Select.Option value="dracula">Dracula</Select.Option>
                        <Select.Option value="monokai">Monokai</Select.Option>
                        <Select.Option value="gruvbox-light">Gruvbox Light</Select.Option>
                        <Select.Option value="gruvbox-dark">Gruvbox Dark</Select.Option>
                        <Select.Option value="material-light">Material Light</Select.Option>
                        <Select.Option value="material-dark">Material Dark</Select.Option>
                        <Select.Option value="solarized-light">Solarized Light</Select.Option>
                        <Select.Option value="solarized-dark">Solarized Dark</Select.Option>
                        <Select.Option value="paper-light">Paper Light</Select.Option>
                        <Select.Option value="paper-dark">Paper Dark</Select.Option>
                        <Select.Option value="twitter-light">Twitter Light</Select.Option>
                        <Select.Option value="twitter-dark">Twitter Dark</Select.Option>
                        <Select.Option value="city-lights-light">City Lights Light</Select.Option>
                        <Select.Option value="city-lights-dark">City Lights Dark</Select.Option>
                        <Select.Option value="bw-light">BW Light</Select.Option>
                        <Select.Option value="bw-dark">BW Dark</Select.Option>
                    </Select>
                    {/*<ThemeBuilder />*/}
                    <Spacer />
                    <Divider />
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
                    ]} themeType={themeType}>
                    <Grid.Container gap={1.5}>
                        <Grid><Button auto type="secondary">Secondary</Button></Grid>
                        <Grid><Button auto type="success">Success</Button></Grid>
                        <Grid><Button auto type="warning">Warning</Button></Grid>
                        <Grid><Button auto type="error">Error</Button></Grid>
                        <Grid><Button auto type="abort">Abort</Button></Grid>
                        <Grid><Button auto type="secondary-light">Secondary Light</Button></Grid>
                        <Grid><Button auto type="success-light">Success Light</Button></Grid>
                        <Grid><Button auto type="warning-light">Warning Light</Button></Grid>
                        <Grid><Button auto type="error-light">Error Light</Button></Grid>
                    </Grid.Container>
                    <Spacer/>
                    <Spacer/>
                    <Grid.Container gap={1.5}>
                        {types.map(type => (
                            <Grid xs={8} key={type}>
                                <Card type={type} width="100%">
                                    <Text h4 my={0} style={{ textTransform: 'uppercase' }}>{type}</Text>
                                    <Text>{type}</Text>
                                </Card>
                            </Grid>
                        ))}
                    </Grid.Container>
                    <Tabs initialValue="1">
                        <Tabs.Item label="http" value="1">HTTP is stateless, but not sessionless.</Tabs.Item>
                        <Tabs.Item label="proxies" value="2">Between the Web browser and the server, numerous computers and machines relay the HTTP messages.</Tabs.Item>
                    </Tabs>
                    <Spacer />
                    <Spacer />
                    <>
                        <Link href="#" icon>HTTP is stateless, but not sessionless.</Link>
                        <Spacer h={.5} />
                        <Link href="#" icon color>HTTP is stateless, but not sessionless.</Link>
                    </>
                    <Spacer />
                    <Spacer />
                    <>
                        <Progress type="secondary" value={10} />
                        <Spacer />
                        <Progress type="success" value={45} />
                        <Spacer />
                        <Progress type="warning" value={100} />
                        <Spacer />
                        <Progress type="error" value={21} />
                    </>
                    <Spacer />
                    <Spacer />
                    <Table data={data2}>
                        <Table.Column prop="property" label="property" />
                        <Table.Column prop="description" label="description" />
                        <Table.Column prop="type" label="type" />
                        <Table.Column prop="default" label="default" />
                    </Table>
                    <Divider />
                    </GeistProvider>
                </div>
                <Divider />
            </div>
            <style jsx>{`
              .content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: ${theme.layout.pageWidthWithMargin};
                max-width: 100%;
                margin: 0 auto;
                box-sizing: border-box;
              }
              .centered_content {
                display: flex;
                flex-direction: column;
                justify-content: left;
                flex-grow: 1;
                text-align: left
              }
              .footer_content {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
              }
            `}</style>
        </>
    )
}

export default Home