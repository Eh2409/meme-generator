"use strict"

let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('.main-canvas')
    gCtx = gElCanvas.getContext('2d')
    renderMeme()
}

function renderMeme() {
    drawImage()
}


function drawImage() {
    const elImg = new Image()
    elImg.src = 'images/5.jpg'
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText('Mission accomplished')
    }
}

function drawText(text, x = gElCanvas.width / 2, y = gElCanvas.height / 2) {
    gCtx.font = "30px serif";

    gCtx.textAlign = "center";
    gCtx.fillText(text, x, 40);

    // gCtx.fillText(text, x, y);

    // gCtx.fillText(text, x, gElCanvas.height - 30);
}

