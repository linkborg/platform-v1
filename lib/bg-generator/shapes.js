// shapes.js
export const drawCircle = (ctx, x, y, size, color) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
};

export const drawSquare = (ctx, x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
};

export const drawTriangle = (ctx, x, y, size, color) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size / 2, y - size);
    ctx.fillStyle = color;
    ctx.closePath();
    ctx.fill();
};
