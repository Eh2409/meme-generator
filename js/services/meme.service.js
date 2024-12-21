"use strict"

var gImgs = [{ id: 1, url: 'images/5.jpg', keywords: ['funny', 'baby'] }]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 40,
            color: 'red'
        }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    gMeme.imgUrl = findImgUrlById(gMeme.selectedImgId)
    return gMeme
}

function findImgUrlById(imgId) {
    var img = gImgs.find(img => img.id === imgId)
    return img.url
}

function setLineTxt(text) {
    gMeme.lines[0].txt = text
}