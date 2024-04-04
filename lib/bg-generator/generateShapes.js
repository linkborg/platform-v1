// generateShapes.js
import { colors } from './colors';
import { drawCircle, drawSquare, drawTriangle } from './shapes';

export const generateShapes = (ctx, width, height, numberOfShapes) => {
    const shapes = [drawCircle];
    const shapeFunc = shapes[Math.floor(Math.random() * shapes.length)];

    for (let i = 0; i < numberOfShapes; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * width / 10;

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shade = `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${0.5 + Math.random() * 0.5})`;

        shapeFunc(ctx, x, y, size, shade);
    }
};
