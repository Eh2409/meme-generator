"use strict"

let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('.main-canvas')
    gCtx = gElCanvas.getContext('2d')
    renderMeme()
}

function renderMeme() {
    var meme = getMeme()
    drawImage(meme)

    // It's temporary here
    const elInput = document.querySelector('.meme-text-input')
    elInput.value = meme.lines[0].txt
}


function drawImage(meme) {
    const elImg = new Image()
    elImg.src = meme.imgUrl
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText(meme.lines)
    }
}

function drawText(lines, x = gElCanvas.width / 2, y = gElCanvas.height / 2) {
    var { txt, size, color } = lines[0]
    gCtx.font = `${size}px Arial`;

    gCtx.fillStyle = color
    gCtx.textAlign = "center";
    gCtx.fillText(txt, x, size);

    // gCtx.fillText(text, x, y);

    // gCtx.fillText(text, x, gElCanvas.height - 30);

}

function onSetLineTxt(text) {
    // modal
    setLineTxt(text)
    // Dom
    renderMeme()
}