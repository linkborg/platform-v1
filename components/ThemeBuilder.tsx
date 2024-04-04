import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import {GeistProvider, CssBaseline, Text, Card, Input, Button, Tabs} from '@geist-ui/core';
import generateThemesFromHex from "@/lib/themes/generator";
const ThemeBuilder = () => {
    const [baseColor, setBaseColor] = useState("#00f"); // Initialize with a base color
    const [theme, setTheme] = useState(generateThemesFromHex(baseColor)); // Generate initial theme
    const [colorEdits, setColorEdits] = useState<any>({}); // Track color edits

    const handleBaseColorChange = (color: any) => {
        setBaseColor(color.hex);
        setTheme(generateThemesFromHex(color.hex));
    }

    const handleColorEditChange = (name: any, value: any) => {
        setColorEdits({ ...colorEdits, [name as string]: value });
        setTheme(prevTheme => ({
            ...prevTheme,
            palette: { ...prevTheme.lightTheme.palette, [name as string]: value },
        }));
    }



    const resetColorEdits = () => {
        setColorEdits({});
        setTheme(generateThemesFromHex(baseColor));
    }

    return (
        <div>
            <SketchPicker color={baseColor} onChangeComplete={handleBaseColorChange} />

            <Tabs initialValue="1">
                <Tabs.Item label="light" value="1">
                    {Object.entries(theme.lightTheme.palette).map(([name, color]) => (
                        <div key={name} style={{display: "inline-block"}}>
                            <Text>{name}</Text>
                            <Input
                                width="100px"
                                value={colorEdits[name] || color}
                                onChange={(e) => handleColorEditChange(name, e.target.value)}
                            />
                        </div>
                    ))}
                </Tabs.Item>
                <Tabs.Item label="dark" value="2">Between the Web browser and the server, numerous computers and machines relay the HTTP messages.</Tabs.Item>
            </Tabs>

            <Button onClick={resetColorEdits}>Reset</Button>
        </div>
    );
};

export default ThemeBuilder;
