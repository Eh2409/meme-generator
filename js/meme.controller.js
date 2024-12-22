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
    setMemeDataOnEditor(meme)
}

function setMemeDataOnEditor(meme) {
    const elTextInput = document.querySelector('.meme-text-input')
    elTextInput.value = meme.lines[0].txt
    const elFontColorInput = document.querySelector('.font-color-input')
    elFontColorInput.value = meme.lines[0].color
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

// update functions

function onSetLineTxt(text) {
    // modal
    setLineTxt(text)
    // Dom
    renderMeme()
}

function onSetFontColor(color) {
    // modal
    setFontColor(color)
    // Dom
    renderMeme()
}


function onUploadImg() {
    const canvasData = gElCanvas.toDataURL('image/jpeg')

    // After a succesful upload, allow the user to share on Facebook
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log('encodedUploadedImgUrl:', encodedUploadedImgUrl)
        document.querySelector('.download-link-container').innerHTML = `
        <p>Image url: ${uploadedImgUrl}</p>`
    }
    uploadImg(canvasData, onSuccess)
}

