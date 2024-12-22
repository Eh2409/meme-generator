"use strict"

var gImgs = [
    { id: 1, url: 'images/2.jpg', keywords: ['funny', 'baby'] },
    { id: 2, url: 'images/3.jpg', keywords: ['funny', 'baby'] },
    { id: 3, url: 'images/5.jpg', keywords: ['funny', 'baby'] },
    { id: 4, url: 'images/6.jpg', keywords: ['funny', 'baby'] },
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 40,
            color: '#ffcc00'
        },
        {
            txt: 'i love food',
            size: 20,
            color: '#ae4c4c'
        }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    gMeme.imgUrl = findImgUrlById(gMeme.selectedImgId)
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

function addLine() {
    var newLine = {
        txt: 'Add text here',
        size: 30,
        color: '#ae4c4c'
    }

    gMeme.lines.push(newLine)
}

function switchLine() {
    var nextLine = (gMeme.selectedLineIdx + 1 < gMeme.lines.length) ? gMeme.selectedLineIdx + 1 : 0;
    gMeme.selectedLineIdx = nextLine
}