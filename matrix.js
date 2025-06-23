const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.body.appendChild(canvas);
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const CHAR_COUNT = 70;
const chars = "*";
const FONT_SIZE = 10;
const SPEED = 2.1;
const ALPHA = 0.52;

function randomDirection() {
    // 0 = down, 1 = up, 2 = right, 3 = left
    return Math.floor(Math.random() * 4);
}

function directionVector(direction) {
    switch (direction) {
        case 0: return { dx: 0, dy: SPEED };    // down
        case 1: return { dx: 0, dy: -SPEED };   // up
        case 2: return { dx: SPEED, dy: 0 };    // right
        case 3: return { dx: -SPEED, dy: 0 };   // left
    }
}

function randomChar() {
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

function randomStartPos() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    };
}

function createDrop() {
    const direction = randomDirection();
    const { dx, dy } = directionVector(direction);
    const { x, y } = randomStartPos();
    return { x, y, dx, dy, char: randomChar(), direction };
}

let drops = Array.from({ length: CHAR_COUNT }, createDrop);

function drawMatrix() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = ALPHA;
    ctx.fillStyle = "#00ff00";
    ctx.font = `${FONT_SIZE}px monospace`;

    for (let drop of drops) {
        ctx.fillText(drop.char, drop.x, drop.y);
        drop.x += drop.dx;
        drop.y += drop.dy;

        // jeśli wyleci poza ekran – losowy restart w środku, nowy kierunek!
        if (
            drop.x < -FONT_SIZE || drop.x > canvas.width + FONT_SIZE ||
            drop.y < -FONT_SIZE || drop.y > canvas.height + FONT_SIZE
        ) {
            Object.assign(drop, createDrop());
        }
    }
    ctx.globalAlpha = 1.0;
}

setInterval(drawMatrix, 55);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array.from({ length: CHAR_COUNT }, createDrop);
});
