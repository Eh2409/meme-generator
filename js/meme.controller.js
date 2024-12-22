"use strict"

let gElCanvas
let gCtx

function onInit() {
    renderGallery()

    gElCanvas = document.querySelector('.main-canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    renderMeme()

    window.onresize = resizeCanvas
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth
    gElCanvas.height = elContainer.clientHeight

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

    // gCtx.fillText(txt, x, y);

    // gCtx.fillText(txt, x, gElCanvas.height - 30);

}

function onSetLineTxt(text) {
    // modal
    setLineTxt(text)
    // Dom
    renderMeme()
}