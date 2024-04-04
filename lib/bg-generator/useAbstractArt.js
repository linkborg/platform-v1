// useAbstractArt.js
import { useEffect, useState } from 'react';
import { generateShapes } from './generateShapes';

const useAbstractArt = (width = 800, height = 600, numberOfShapes = 100) => {
    const [bgImage, setBgImage] = useState(null);

    const generateArt = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'black'; // Set background color to black
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        generateShapes(ctx, width, height, numberOfShapes);

        setBgImage(canvas.toDataURL());
    };

    useEffect(() => {
        generateArt();
    }, []);

    return bgImage;
};

export default useAbstractArt;
