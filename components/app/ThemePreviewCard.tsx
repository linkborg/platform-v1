import {GeistProvider, CssBaseline, Text, Card, Divider, Link, Button, Spacer, useTheme} from '@geist-ui/core';
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
import NiceLink from "@/components/NiceLink";
import React from "react";

export const ThemePreviewCard = ({themeType="dark"}) => {
    return (
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
                <Card>
                    {`${themeType}`}
                    <Divider />
                    Text:<br />
                    <Text type={"success"} span  scale={0.6}>Success</Text>
                    <Text type={"error"} span ml={1}  scale={0.6}>Error</Text>
                    <Text type={"secondary"} span ml={1}  scale={0.6}>Secondary</Text>
                    <Spacer />
                    Links:<br />
                    <Link type={"success"} color  scale={0.6} onClick={(e) => e.preventDefault()}>Success</Link>
                    <Link type={"error"} color ml={1}  scale={0.6} onClick={(e) => e.preventDefault()}>Error</Link>
                    <Link type={"secondary"} color ml={1}  scale={0.6} onClick={(e) => e.preventDefault()}>Secondary</Link>
                    <Spacer />
                    Buttons:<br />
                    <Button type={"success"} auto scale={0.6} onClick={(e) => e.preventDefault()}>Success</Button>
                    <Button type={"error"} ml={1} auto  scale={0.6} onClick={(e) => e.preventDefault()}>Error</Button>
                    <Button type={"secondary"} ml={1} auto  scale={0.6} onClick={(e) => e.preventDefault()}>Secondary</Button>
                </Card>
            </GeistProvider>
    )
}