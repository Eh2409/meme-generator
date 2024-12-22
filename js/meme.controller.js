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
    const { txt, size, color } = meme.lines[0]
    document.querySelector('.meme-text-input').value = txt
    document.querySelector('.font-size-input').value = size
    document.querySelector('.font-size').innerText = `${size}px`
    document.querySelector('.font-color-input').value = color
}


function drawImage(meme) {
    const elImg = new Image()
    elImg.src = meme.imgUrl
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText(meme.lines)
    }
}

function drawText(lines, x = 0, y = 0) {

    lines.forEach((line, idx) => {
        var { txt, size, color } = line
        console.log(color, idx);

        gCtx.beginPath()
        gCtx.textBaseline = 'top';
        gCtx.fillStyle = color
        gCtx.textAlign = "start";
        gCtx.font = `${size}px Arial`;
        gCtx.fillText(txt, x, y, gElCanvas.width);

        y += size
    })

}

function onAddLine() { // create
    // modal
    addLine()
    // Dom
    renderMeme()
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

function onSetFontSize(size) {
    // modal
    setFontSize(size)
    // Dom
    document.querySelector('.font-size').innerText = `${size}px`
    renderMeme()
}

// upload image

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

