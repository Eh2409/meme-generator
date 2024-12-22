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

    addMouseListeners()
    addTouchListeners()
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
    const { txt, size, color } = meme.lines[meme.selectedLineIdx]
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
        drawText(meme.lines, meme.selectedLineIdx)
    }
}

function drawText(lines, selectedLineIdx, x = 0, y = 0) {

    lines.forEach((line, idx) => {
        var { txt, size, color } = line

        var line = gCtx.measureText(txt)
        gCtx.textBaseline = 'top';
        gCtx.fillStyle = color
        gCtx.textAlign = "start";
        gCtx.font = `${size}px Arial`;

        gCtx.fillText(txt, x, y, gElCanvas.width);

        // Finds the selected line and frames it
        if (idx === selectedLineIdx) {
            line = gCtx.measureText(txt)
            gCtx.strokeStyle = 'red';
            gCtx.setLineDash([10, 2]);
            gCtx.strokeRect(x, y, line.width, size);
            gCtx.setLineDash([]);
        }

        // Note to self going forward: think of a smarter way to do it
        var pos = {
            id: idx,
            location: { x: x, y: y, lineWidth: line.width, size: size }
        }

        setLineLocation(pos)

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

function onSwitchLine() {
    // modal
    switchLine()
    // Dom

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


////  line click

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return

    renderMeme()
}


function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (['touchstart', 'touchmove', 'touchend'].includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]

        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}