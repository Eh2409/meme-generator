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
    const { txt, size, color, fontFamily } = meme.lines[meme.selectedLineIdx]
    document.querySelector('.meme-text-input').value = txt
    document.querySelector('.font-size-input').value = size
    document.querySelector('.font-size').innerText = `${size}px`
    document.querySelector('.font-color-input').value = color
    document.querySelector('.font-family-select').value = fontFamily
}


function drawImage(meme) {
    const elImg = new Image()
    elImg.src = meme.imgUrl
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText(meme.lines, meme.selectedLineIdx)
    }
}

// Note to self: maybe break it down into several functions
function drawText(lines, selectedLineIdx) {

    lines.forEach((line, idx) => {
        var { txt, size, color, fontFamily, textAlign } = line
        var y = (!line.location) ? (idx * 30) : line.location.y

        gCtx.textBaseline = 'top';
        gCtx.fillStyle = color
        gCtx.textAlign = textAlign;
        gCtx.font = `${size}px ${fontFamily}`;

        var lineWidth = gCtx.measureText(txt).width
        var xPos = textAlignPos(textAlign, 0)

        gCtx.fillText(txt, xPos, y, gElCanvas.width);

        // Finds the selected line and frames it
        if (idx === selectedLineIdx) {
            frameSelectedLine(y, textAlign, lineWidth, size)
        }

        // Note to self going forward: think of a smarter way to do it
        setLineLocation({
            id: idx,
            location: { x: xPos, y: y, lineWidth: lineWidth, size: size }
        })
    })
}

function frameSelectedLine(y, textAlign, lineWidth, size) {
    var xPos = textAlignPos(textAlign, lineWidth)
    gCtx.strokeStyle = 'green';
    gCtx.setLineDash([10, 2]);
    gCtx.strokeRect(xPos, y, lineWidth, size);
    gCtx.setLineDash([]);
}

function textAlignPos(textAlign, lineWidth) {
    switch (textAlign) {
        case 'left': return 0;
        case 'center': return gElCanvas.width / 2 - lineWidth / 2;
        case 'right': return gElCanvas.width - lineWidth;
    }
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

function onSetFontFamily(fontFamily) {
    // modal
    setFontFamily(fontFamily)
    // Dom
    renderMeme()

}

function onSetTextAlign(direction) {
    // modal
    setTextAlign(direction)
    // Dom
    renderMeme()
}

function onSetLineHeight(num) {
    // modal
    setLineHeight(num)
    // Dom
    renderMeme()
}


/// download meme

function onDownloadMeme(elLink) {
    const dataUrl = gElCanvas.toDataURL('image/jpeg')
    elLink.href = dataUrl
    elLink.download = 'my-meme'
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