import { Themes } from '@geist-ui/core';

const Color = require('color');

function generateThemesFromHex(hexColor: string) {
    const baseColor = Color(hexColor);

    // Generate a series of tints and shades
    const tintsAndShades = Array.from({ length: 8 }).map((_, index) => {
        const ratio = (index + 1) / 10;
        return {
            tint: baseColor.lighten(ratio).hex(),
            shade: baseColor.darken(ratio).hex()
        };
    });

    // Calculate a contrasting text color for each theme
    const contrastColorLight = baseColor.isLight() ? '#000000' : '#ffffff';
    const contrastColorDark = baseColor.isLight() ? '#ffffff' : '#000000';

    const lightTheme = Themes.createFromLight({
        type: `${hexColor}-light`,
        palette: {
            ...tintsAndShades.reduce((acc, curr, index) => ({
                ...acc,
                [`accents_${index + 1}`]: curr.tint
            }), {}),
            background: "#ffffff",
            foreground: contrastColorLight,
            border: baseColor.lighten(0.3).hex(),
            secondary: baseColor.lighten(0.4).hex(),
            selection: baseColor.lighten(0.5).hex(),
            code: baseColor.hex(),
            success: "#0070F3",
            successLight: "#3291FF",
            successDark: "#0056B3",
            error: "#EE0000",
            errorLight: "#FF3333",
            errorDark: "#AA0000",
            warning: "#F5A623",
            warningLight: "#FFC940",
            warningDark: "#F49B0B",
            cyan: baseColor.lighten(0.5).hex(),
            violet: baseColor.lighten(0.3).hex(),
            link: baseColor.hex(),
        }
    });

    const darkTheme = Themes.createFromDark({
        type: `${hexColor}-dark`,
        palette: {
            ...tintsAndShades.reduce((acc, curr, index) => ({
                ...acc,
                [`accents_${index + 1}`]: curr.shade
            }), {}),
            background: "#000000",
            foreground: contrastColorDark,
            border: baseColor.darken(0.3).hex(),
            secondary: baseColor.darken(0.4).hex(),
            selection: baseColor.darken(0.5).hex(),
            code: baseColor.hex(),
            success: "#0070F3",
            successLight: "#3291FF",
            successDark: "#0056B3",
            error: "#EE0000",
            errorLight: "#FF3333",
            errorDark: "#AA0000",
            warning: "#F5A623",
            warningLight: "#FFC940",
            warningDark: "#F49B0B",
            cyan: baseColor.darken(0.5).hex(),
            violet: baseColor.darken(0.3).hex(),
            link: baseColor.hex(),
        }
    });

    return { lightTheme, darkTheme };
}

export default generateThemesFromHex;