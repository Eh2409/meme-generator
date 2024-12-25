"use strict"

var gImgs = [
    { id: 1, url: 'images/1.jpg', keywords: ['funny', 'baby'] },
    { id: 2, url: 'images/2.jpg', keywords: ['funny', 'baby'] },
    { id: 3, url: 'images/3.jpg', keywords: ['funny', 'baby'] },
    { id: 4, url: 'images/4.JPG', keywords: ['funny', 'baby'] },
    { id: 5, url: 'images/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: 'images/6.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'images/8.jpg', keywords: ['funny', 'baby'] },
    { id: 9, url: 'images/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: 'images/10.jpg', keywords: ['funny', 'baby'] },
    { id: 11, url: 'images/11.jpg', keywords: ['funny', 'baby'] },
    { id: 12, url: 'images/12.jpg', keywords: ['funny', 'baby'] },
    { id: 13, url: 'images/13.jpg', keywords: ['funny', 'baby'] },
    { id: 14, url: 'images/14.jpg', keywords: ['funny', 'baby'] },
    { id: 15, url: 'images/15.jpg', keywords: ['funny', 'baby'] },
    { id: 16, url: 'images/16.jpg', keywords: ['funny', 'baby'] },
    { id: 17, url: 'images/17.jpg', keywords: ['funny', 'baby'] },
    { id: 18, url: 'images/18.jpg', keywords: ['funny', 'baby'] },
    { id: 19, url: 'images/19.jpg', keywords: ['funny', 'baby'] },
    { id: 20, url: 'images/20.jpg', keywords: ['funny', 'baby'] },
    { id: 21, url: 'images/21.jpg', keywords: ['funny', 'baby'] },
    { id: 22, url: 'images/22.jpg', keywords: ['funny', 'baby'] },
    { id: 23, url: 'images/23.jpg', keywords: ['funny', 'baby'] },
    { id: 24, url: 'images/24.jpg', keywords: ['funny', 'baby'] },
    { id: 25, url: 'images/25.jpg', keywords: ['funny', 'baby'] },
    { id: 26, url: 'images/26.jpg', keywords: ['funny', 'baby'] },
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Enter text here',
            location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
            size: 50,
            color: '#ffcc00',
            fontFamily: 'Impact',
            textAlign: 'center'
        },
        {
            txt: 'Enter text here',
            location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
            size: 50,
            color: '#ffcc00',
            fontFamily: 'Impact',
            textAlign: 'center'
        },
    ]
}

const MYMEMES_KEY = 'myMemes'
var gMyMemes = []
_loadMyMemes()


var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function findImgUrlById(imgId) {
    var img = gImgs.find(img => img.id === imgId)
    return img.url
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
    gMeme.imgUrl = findImgUrlById(gMeme.selectedImgId)
}

function onAddImage(img) {
    console.log(img);
}


function setLineTxt(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFontSize(size) {
    gMeme.lines[gMeme.selectedLineIdx].size = +size
}

function setFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontFamily
}

function setTextAlign(direction) {
    gMeme.lines[gMeme.selectedLineIdx].textAlign = direction
}

function setLineHeight(num) {
    gMeme.lines[gMeme.selectedLineIdx].location.y = num
}

function addLine() {
    var newLine = {
        txt: 'Enter text here',
        location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
        size: 50,
        color: '#ffcc00',
        fontFamily: 'Impact',
        textAlign: 'center'
    }

    gMeme.lines.push(newLine)
}

function switchLine() {
    var nextLine = (gMeme.selectedLineIdx + 1 < gMeme.lines.length) ? gMeme.selectedLineIdx + 1 : 0;
    gMeme.selectedLineIdx = nextLine
}

function setLineLocation(pos) {
    gMeme.lines[pos.id].location = pos.location
}

function deleteCurrLine() {
    var idx = gMeme.selectedLineIdx
    gMeme.lines.splice(idx, 1)
    gMeme.selectedLineIdx = 0

    /// Temporary operation to prevent toilet malfunctions - will be improved later

    if (!gMeme.lines.length) {
        addLine()
    }
}

function setSelectedlineIdx(idx) {
    gMeme.selectedLineIdx = idx
}


// Note to self, think of a way to improve this function

function isLineClicked(clickedPos) {
    const { x: clickX, y: clickY } = clickedPos
    const { lines } = gMeme

    const clickedLine = lines.findIndex(line => {
        var { textAlign } = line
        var { x, y, lineWidth, textHeight } = line.location

        if (textAlign === 'center') {
            x -= lineWidth / 2
        } else if (textAlign === 'right') {
            x -= lineWidth
        }

        return clickX >= x && clickX <= x + lineWidth
            && clickY >= y && clickY <= y + textHeight

    })


    if (clickedLine !== -1) {
        setSelectedlineIdx(clickedLine)
        return true
    } else {
        return
    }
}



// my-memes functions

function saveMeme(imgUrl) {
    var meme = structuredClone(gMeme)
    meme.id = makeId()
    meme.url = imgUrl
    gMyMemes.unshift(meme)
    _saveMyMemes()

    resetMeme()
}

function _saveMyMemes() {
    return saveToStorage(MYMEMES_KEY, gMyMemes)
}

function resetMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Enter text here',
                location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
                size: 40,
                color: '#ffcc00',
                fontFamily: 'Arial',
                textAlign: 'center'
            },
        ]
    };
}

function _loadMyMemes() {
    gMyMemes = loadFromStorage(MYMEMES_KEY)
    if (gMyMemes && gMyMemes.length > 0) return

    gMyMemes = []
    _saveMyMemes()
}

function getMyMemes() {
    return gMyMemes
}

