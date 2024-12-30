"use strict"

let gElCanvas
let gCtx
let gStartPos
var gIsMouseDown = false
var gIsToggleDisplayOn = false

function initCanvas() {
    // toggleDisplay('main-meme-generator')

    gElCanvas = document.querySelector('.main-canvas')
    gCtx = gElCanvas.getContext('2d')

    resizeCanvas()

    window.addEventListener('resize', () => {
        resizeCanvas()
    })

    addListeners()
}

// Render canvas function

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
    document.querySelector('.font-height').innerText = `${Math.floor(location.y)}px`

    const elAlignBtns = document.querySelectorAll('.align-btn');
    elAlignBtns.forEach(btn => btn.classList.remove('active'));
    if (textAlign) {
        document.querySelector(`.align-${textAlign}-btn.align-btn`).classList.add('active');
    }

}

function drawText(lines, selectedLineIdx) {
    lines.forEach((line, idx) => {
        var { txt, size, color, strokeColor, fontFamily, textAlign } = line
        var { x, y } = line.location

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
        gCtx.lineWidth = 2;
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

function toggleDisplay(className) {
    if (gIsToggleDisplayOn) return
    gIsToggleDisplayOn = true
    const elSections = document.querySelectorAll('main section')
    elSections.forEach(section => section.classList.add('bounce-out'))
    const elcurrDisplay = document.querySelector(`.${className}`)

    const elloader = document.querySelector(`.loader`)
    elloader.classList.remove('hide')
    elloader.classList.add('fade-in')

    setTimeout(() => {
        elSections.forEach(section => section.classList.remove('bounce-out'))
        elSections.forEach(section => section.classList.add('hide'))
        elloader.classList.remove('fade-in')
    }, 1000)

    setTimeout(() => {
        elcurrDisplay.classList.remove('hide')
        elcurrDisplay.classList.add('bounce-in')
        if (className === 'main-meme-generator') {
            initCanvas()
        }

    }, 1200)

    setTimeout(() => {
        gIsToggleDisplayOn = false
        elloader.classList.add('fade-out')
    }, 2500)

    setTimeout(() => {
        elloader.classList.add('hide')
        elloader.classList.remove('fade-out')
    }, 2800)

    setTimeout(() => {
        const elcurrDisplay = document.querySelector(`.${className}`)
        elcurrDisplay.classList.remove('bounce-in')
    }, 3000)
}


function onAddLine() { // create
    // modal
    addLine()
    // Dom
    renderMeme()
}

function onAddEmoji(emoji) { // create
    // modal
    addLine(emoji)
    // Dom
    renderMeme()
}

// Update functions

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

/// Save meme

function onSaveMeme() {

    removeFramefromLine()

    setTimeout(() => {

        const dataUrl = gElCanvas.toDataURL('image/jpeg');
        saveMeme(dataUrl);

        const elShowSave = document.querySelector('.saved-meme');
        elShowSave.innerHTML = `<img src="${dataUrl}" alt="Saved Meme" class="saved-Meme-img">`;

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

/// Download meme

function setDownload() {
    removeFramefromLine()
    const elDownLoad = document.querySelector('.download-url')
    setTimeout(() => {
        elDownLoad.click()
    }, 200);
}

function onDownloadMeme(elLink) {
    removeFramefromLine()

    const dataUrl = gElCanvas.toDataURL('image/jpeg')
    elLink.href = dataUrl
    elLink.download = 'my-meme'
}


// Upload to cloud and share

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


/// Dom function
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

////  Edit meme
function onEditMeme(memeId) {
    // modal
    editMeme(memeId)
    // Dom

    // initCanvas()
    toggleDisplay('main-meme-generator')
}

/// Upload image

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

    // initCanvas()
    toggleDisplay('main-meme-generator')
}

////  Line click

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
    gIsMouseDown = true
    document.body.style.cursor = 'grab'
}


function onMove(ev) {
    if (!gIsMouseDown) return
    const pos = getEvPos(ev)

    const isDrag = getLine()
    if (!isDrag) return

    document.body.style.cursor = 'grabbing'

    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y

    moveLine(dx, dy)
    gStartPos = pos

    renderMeme()
}

function onUp(ev) {
    const isDrag = getLine()
    console.log(isDrag);

    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    setLineDrag(false)
    gIsMouseDown = false
    document.body.style.cursor = 'default'
}

function getEvPos(ev) {
    const canvasRect = gElCanvas.getBoundingClientRect()
    let pos = {
        x: ev.clientX - canvasRect.left,
        y: ev.clientY - canvasRect.top,
    };

    if (['touchstart', 'touchmove', 'touchend'].includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]

        pos = {
            x: ev.clientX - canvasRect.left,
            y: ev.clientY - canvasRect.top,
        };
    }

    const scaleX = gElCanvas.width / canvasRect.width
    const scaleY = gElCanvas.height / canvasRect.height
    pos.x *= scaleX
    pos.y *= scaleY

    return pos;
}

/// random meme

function onSetRandomMeme() {
    // modal
    SetRandomMeme()
    // Dom

    // initCanvas()
    toggleDisplay('main-meme-generator')
}


/// lang

function onSetLang(lang) {
    setLang(lang)

    const editorHeader = document.querySelector('.main-editor-header')
    const memeTextInput = document.querySelector('.meme-text-input')
    const aboutContainer = document.querySelector('.about-container')
    const siteLogo = document.querySelector('.site-logo-img')

    if (lang == 'he') {
        document.body.classList.add('rtl')
        editorHeader.classList.add('rtl')
        memeTextInput.classList.add('rtl')
        aboutContainer.innerHTML = `
        <p>ברוכים הבאים ל- <strong>מחולל ממים</strong>, הכלי האולטימטיבי ליצירה ושיתוף של הממים הכי מצחיקים שלכם! בין אם אתם רוצים להעלות תמונות משלכם או לבחור מתוך מגוון תבניות כיפיות, הפלטפורמה הידידותית שלנו מאפשרת לכם להוסיף טקסט מותאם אישי וליצור את המם המושלם. ברגע שתסיימו , תוכלו לשמור את היצירה שלכם במחשב או לשתף אותה עם חברים ועוקבים.</p>
        <p><strong>מחולל ממים</strong> עוסק בכיף, יצירתיות וביטוי עצמי הפכו כל תמונה למם בכמה לחיצות!</p>
        <p>החלו ליצור עכשיו וצרו את הממים שתמיד חלמתם עליהם!</p>`
        siteLogo.innerHTML = ' <img src="images/site-logo-he.png" alt="Meme generator" class="site-image-logo">'

    } else {
        document.body.classList.remove('rtl')
        editorHeader.classList.remove('rtl')
        memeTextInput.classList.remove('rtl')
        aboutContainer.innerHTML = `
        <p>Welcome to <strong>Meme Generator</strong>, the ultimate tool for creating and sharing your own
            hilarious memes! Whether you want to upload your own images or select from a variety of fun
            templates, our easy-to-use platform lets you add custom text to craft the perfect meme. Once
            you're done, you can save your creation to your computer or share it with friends and followers.
        </p>
        <p><strong>Meme Generator</strong> is all about fun, creativity, and self-expression—turn any image
            into a meme with just a few clicks!
        </p>
        <p>Start creating now and bring your meme ideas to life!</p>`
        siteLogo.innerHTML = ' <img src="images/site-logo.png" alt="Meme generator" class="site-image-logo">'
    }

    doTrans()
}

