"use strict"

let gElCanvas
let gCtx
let gStartPos

function initCanvas() {
    toggleDisplay('main-meme-generator')

    gElCanvas = document.querySelector('.main-canvas')
    gCtx = gElCanvas.getContext('2d')

    resizeCanvas()

    window.addEventListener('resize', () => {
        resizeCanvas()
    })

    addListeners()
}

function toggleDisplay(className) {
    const elSections = document.querySelectorAll('main section')
    elSections.forEach(section => section.classList.add('hide'))
    const elcurrDisplay = document.querySelector(`.${className}`)
    elcurrDisplay.classList.remove('hide')
}

function renderMeme() {
    var meme = getMeme()
    drawImage(meme)
    setMemeDataOnEditor(meme)
}

function drawImage(meme) {
    const elImg = new Image()
    elImg.src = meme.imgUrl
    elImg.onload = () => {
        coverCanvasWithImg(elImg)
        drawText(meme.lines, meme.selectedLineIdx)
    }
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    renderMeme()
}

function coverCanvasWithImg(elImg) {
    if (!elImg) return
    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

function setMemeDataOnEditor(meme) {
    if (meme.selectedLineIdx === -1) return
    const { txt, size, color, strokeColor, fontFamily, textAlign, location } = meme.lines[meme.selectedLineIdx]
    document.querySelector('.line-count').innerText = `${meme.selectedLineIdx + 1} / ${meme.lines.length}`
    document.querySelector('.meme-text-input').value = txt
    document.querySelector('.font-size-input').value = size
    document.querySelector('.font-size').innerText = `${size}px`
    document.querySelector('.fa-solid.fa-fill-drip').style.color = color
    document.querySelector('.fa-solid.fa-brush').style.color = strokeColor
    document.querySelector('.font-family-select').value = fontFamily
    document.querySelector('.line-height-input').value = location.y
    document.querySelector('.line-height-input').max = gElCanvas.height
    document.querySelector('.font-height').innerText = `${location.y}px`

    const elAlignBtns = document.querySelectorAll('.align-btn');
    elAlignBtns.forEach(btn => btn.classList.remove('active'));
    if (textAlign) {
        document.querySelector(`.align-${textAlign}-btn.align-btn`).classList.add('active');
    }

}


// Note to self: maybe break it down into several functions
function drawText(lines, selectedLineIdx) {
    lines.forEach((line, idx) => {
        var { txt, size, color, strokeColor, fontFamily, textAlign } = line
        var { x, y } = line.location
        console.log(x, y);

        if (!line.location.y) {
            y = (gElCanvas.height / 2) - (size / 2)
        }

        if (!line.location.y && idx === 0) {
            y = 0
        }

        if (!line.location.y && idx === 1) {
            y = gElCanvas.height - 10 - size
        }

        gCtx.textBaseline = 'top';
        gCtx.fillStyle = color
        gCtx.font = `${size}px ${fontFamily}`;
        gCtx.strokeStyle = strokeColor;

        var lineWidth = gCtx.measureText(txt).width


        if (textAlign) {
            var xPos = textAlignPos(textAlign, lineWidth)
            x = xPos
        }

        var textHeight = gCtx.measureText(line.txt).fontBoundingBoxAscent + gCtx.measureText(line.txt).fontBoundingBoxDescent;

        gCtx.fillText(txt, x, y);
        gCtx.strokeText(txt, x, y);

        // Finds the selected line and frames it
        if (idx === selectedLineIdx) {
            frameSelectedLine(x, y, textAlign, lineWidth, textHeight)
        }

        setLineLocation({
            id: idx,
            location: { x: x, y: y, lineWidth: lineWidth, textHeight: textHeight }
        })
    })
}

function frameSelectedLine(x, y, textAlign, lineWidth, textHeight) {

    if (textAlign) {
        var xPos = textAlignPos(textAlign, lineWidth)
        x = xPos
    }

    gCtx.strokeStyle = '#f6cd55';
    gCtx.setLineDash([10, 2]);
    gCtx.strokeRect(x, y, lineWidth, textHeight);
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

function onAddEmoji(emoji) { // create
    console.log(emoji);

    // modal
    addEmoji(emoji)
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

function onSetStrokeColor(color) {
    // modal
    setStrokeColor(color)
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
    console.log(typeof num);
    // modal
    setLineHeight(num)
    // Dom
    renderMeme()
}

function onDeleteCurrLine() {
    // modal
    deleteCurrLine()
    // Dom
    renderMeme()
}

/// save meme

function onSaveMeme() {

    removeFramefromLine()

    setTimeout(() => {

        const dataUrl = gElCanvas.toDataURL('image/jpeg');
        saveMeme(dataUrl);

        const elShowSave = document.querySelector('.saved-meme');
        elShowSave.innerHTML = `<img src="${dataUrl}" alt="Saved Meme">`;

        const elDownloadBtn = document.querySelector('.saved-meme-btns a');
        console.log(elDownloadBtn);

        elDownloadBtn.href = dataUrl
        elDownloadBtn.download = 'my-meme'

        toggleDisplay('main-saved-meme')
    }, 100);
}

function removeFramefromLine() {
    // modal
    setSelectedlineIdx(-1)
    // Dom
    renderMeme()
}

/// download meme

function onDownloadMeme(elLink) {
    removeFramefromLine()

    const dataUrl = gElCanvas.toDataURL('image/jpeg')
    elLink.href = dataUrl
    elLink.download = 'my-meme'
}


// upload image

function onUploadImg() {
    setSelectedlineIdx(-1)
    const canvasData = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log('encodedUploadedImgUrl:', encodedUploadedImgUrl)

        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    uploadImg(canvasData, onSuccess)
}

/// dom function
function onClickEditorBtn(elBtn) {
    elBtn.classList.toggle('active')
}

function triggerColorPicker(type) {
    document.querySelector(`.${type}-color-input`).click();
}

function onToggleButtonMenu(elNavButton) {
    elNavButton.classList.toggle('active')
}
function onToggleMenu() {
    document.body.classList.toggle('menu-open')
}


////  edit meme
function onEditMeme(memeId) {
    // modal
    editMeme(memeId)
    // Dom
    initCanvas()
}

/// upload image

function onClickUpload() {
    document.querySelector('.upload-image-input').click()
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}
function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()
    reader.onload = function (event) {
        var img = new Image()
        img.onload = () => onImageReady(img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}
function renderImg(img) {
    // modal
    uploadImage(img)
    // Dom
    initCanvas()
}

////  line click


function addListeners() {
    gElCanvas.addEventListener('mouseout', mouseOut)
    addMultiEventListener(['mousedown', 'touchstart'], onDown, gElCanvas)
    addMultiEventListener(['mousemove', 'touchmove'], onMove, gElCanvas)
    addMultiEventListener(['mouseup', 'touchend'], onUp, gElCanvas)
}
function mouseOut() {
    gIsMouseDown = false
}
function addMultiEventListener(events, func, el) {
    events.forEach((ev) => {
        el.addEventListener(ev, func)
    })
}


function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return
    renderMeme()

    setLineDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
    console.log(gStartPos);

}

function onMove(ev) {
    const isDrag = getLine()
    console.log(isDrag);

    if (!isDrag) return
    console.log('Moving the circle')

    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)

    gStartPos = pos
    renderMeme()
}


function onUp(ev) {
    const isDrag = getLine()
    console.log(isDrag);
    console.log('Moving the circle')

    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    setLineDrag(false)
    document.body.style.cursor = 'grab'
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
