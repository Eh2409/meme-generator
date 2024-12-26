"use strict"

var gImgs = []
_setgImgs()

const MYMEMES_KEY = 'myMemes'
var gMyMemes = []
_loadMyMemes()

var gIsEditModeOn = false

const KEYWORD_KEY = 'KeywordCountMap'
var gKeywordSearchCountMap
_loadKeywordCountMap()

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Enter text here',
            location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
            size: 50,
            color: '#ffb921',
            strokeColor: '#000000',
            fontFamily: 'Impact',
            textAlign: 'center',
            isDrag: false
        },
        {
            txt: 'Enter text here',
            location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
            size: 50,
            color: '#ffb921',
            strokeColor: '#000000',
            fontFamily: 'Impact',
            textAlign: 'center',
            isDrag: false
        },
    ]
}


function getMeme() {
    return gMeme
}

function getkeywordCountMap() {
    console.log(gKeywordSearchCountMap);

    return gKeywordSearchCountMap
}

function upvoteKeyword(word) {
    for (var keyword in gKeywordSearchCountMap) {
        if (keyword === word && gKeywordSearchCountMap[keyword] < 20) {
            gKeywordSearchCountMap[word]++
            console.log(gKeywordSearchCountMap[word]);
        }
    }
    saveToStorage(KEYWORD_KEY, gKeywordSearchCountMap)
}

function getImgs(filterBy) {
    var images = gImgs.filter(({ keywords }) =>
        keywords.some(word => word.toLowerCase().includes(filterBy.toLowerCase())))

    return images
}

function findImgUrlById(imgId) {
    var img = gImgs.find(img => img.id === imgId)
    return img.url
}

function setImg(imgId) {
    gIsEditModeOn = false
    gMeme.selectedImgId = imgId
    gMeme.imgUrl = findImgUrlById(gMeme.selectedImgId)
}

function onAddImage(img) {
    console.log(img);
}


function setLineTxt(text) {
    if (gMeme.selectedLineIdx === -1) return
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function setFontColor(color) {
    if (gMeme.selectedLineIdx === -1) return
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setStrokeColor(color) {
    if (gMeme.selectedLineIdx === -1) return
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setFontSize(size) {
    if (gMeme.selectedLineIdx === -1) return
    gMeme.lines[gMeme.selectedLineIdx].size = +size
}

function setFontFamily(fontFamily) {
    if (gMeme.selectedLineIdx === -1) return
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontFamily
}

function setTextAlign(direction) {
    if (gMeme.selectedLineIdx === -1) return
    gMeme.lines[gMeme.selectedLineIdx].textAlign = direction
}

function setLineHeight(num) {
    if (gMeme.selectedLineIdx === -1) return
    gMeme.lines[gMeme.selectedLineIdx].location.y = num
}

function addLine() {
    var newLine = {
        txt: 'Enter text here',
        location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
        size: 50,
        color: '#ffb921',
        strokeColor: '#000000',
        fontFamily: 'Impact',
        textAlign: 'center',
        isDrag: false
    }

    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function addEmoji(emoji) {
    var newEmoji = {
        txt: emoji,
        location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
        size: 50,
        textAlign: 'center'
    }

    gMeme.lines.push(newEmoji)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
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

// my-memes functions

function saveMeme(imgUrl) {
    if (gIsEditModeOn) {
        var idx = gMyMemes.findIndex(meme => meme.id === gMeme.id)
        gMyMemes[idx] = structuredClone(gMeme)
        gMyMemes[idx].url = imgUrl
        gIsEditModeOn = false
    } else {
        var meme = structuredClone(gMeme)
        meme.id = makeId()
        meme.url = imgUrl
        gMyMemes.unshift(meme)
    }
    saveToStorage(MYMEMES_KEY, gMyMemes)
    resetMeme()
}


function resetMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Enter text here',
                location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
                size: 50,
                color: '#ffb921',
                strokeColor: '#000000',
                fontFamily: 'Impact',
                textAlign: 'center',
                isDrag: false
            },
            {
                txt: 'Enter text here',
                location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
                size: 50,
                color: '#ffb921',
                strokeColor: '#000000',
                fontFamily: 'Impact',
                textAlign: 'center',
                isDrag: false
            },
        ]
    };
}

function _loadMyMemes() {
    gMyMemes = loadFromStorage(MYMEMES_KEY)
    if (gMyMemes && gMyMemes.length > 0) return

    gMyMemes = []
    saveToStorage(MYMEMES_KEY, gMyMemes)
}

function getMyMemes() {
    return gMyMemes
}

function editMeme(memeId) {
    gIsEditModeOn = true
    var myMeme = findMyMemeById(memeId)
    gMeme = myMeme
    gMeme.selectedLineIdx = 0
}

function findMyMemeById(memeId) {
    return gMyMemes.find(meme => meme.id === memeId)
}

// upload image 

function uploadImage(img) {
    gMeme.imgUrl = img.src
}

///// set images 

function _setgImgs() {
    gImgs = [
        { id: 1, url: 'images/1.jpg', keywords: ['funny', 'baby'] },
        { id: 2, url: 'images/2.jpg', keywords: ['funny', 'cat'] },
        { id: 3, url: 'images/3.jpg', keywords: ['funny', 'baby'] },
        { id: 4, url: 'images/4.JPG', keywords: ['funny', 'baby'] },
        { id: 5, url: 'images/5.jpg', keywords: ['dragon', 'baby'] },
        { id: 6, url: 'images/6.jpg', keywords: ['funny', 'baby'] },
        { id: 8, url: 'images/8.jpg', keywords: ['funny', 'dog'] },
        { id: 9, url: 'images/9.jpg', keywords: ['funny', 'baby'] },
        { id: 10, url: 'images/10.jpg', keywords: ['funny', 'baby'] },
        { id: 11, url: 'images/11.jpg', keywords: ['funny', 'baby'] },
        { id: 12, url: 'images/12.jpg', keywords: ['funny', 'dog'] },
        { id: 13, url: 'images/13.jpg', keywords: ['funny', 'baby'] },
        { id: 14, url: 'images/14.jpg', keywords: ['funny', 'baby'] },
        { id: 15, url: 'images/15.jpg', keywords: ['funny', 'baby'] },
        { id: 16, url: 'images/16.jpg', keywords: ['funny', 'baby'] },
        { id: 17, url: 'images/17.jpg', keywords: ['funny', 'baby'] },
        { id: 18, url: 'images/18.jpg', keywords: ['funny', 'baby'] },
        { id: 19, url: 'images/19.jpg', keywords: ['funny', 'baby'] },
        { id: 20, url: 'images/20.jpg', keywords: ['cat', 'baby'] },
        { id: 21, url: 'images/21.jpg', keywords: ['funny', 'dog'] },
        { id: 22, url: 'images/22.jpg', keywords: ['funny', 'baby'] },
        { id: 23, url: 'images/23.jpg', keywords: ['funny', 'baby'] },
        { id: 24, url: 'images/24.jpg', keywords: ['cat', 'baby'] },
        { id: 25, url: 'images/25.jpg', keywords: ['cat', 'dog'] },
        { id: 26, url: 'images/26.jpg', keywords: ['funny', 'baby'] },
    ]
}

function _loadKeywordCountMap() {
    gKeywordSearchCountMap = loadFromStorage(KEYWORD_KEY)
    if (gKeywordSearchCountMap) return

    gKeywordSearchCountMap = { 'funny': 2, 'cat': 2, 'baby': 2 }
    saveToStorage(KEYWORD_KEY, gKeywordSearchCountMap)
}


/// Touch a line  canvas

function isLineClicked(clickedPos) {
    const { x: clickX, y: clickY } = clickedPos
    const { lines } = gMeme

    const clickedLine = lines.findIndex(line => {
        var { x, y, lineWidth, textHeight } = line.location

        return clickX >= x && clickX <= x + lineWidth
            && clickY >= y && clickY <= y + textHeight
    })

    if (clickedLine !== -1) {
        setSelectedlineIdx(clickedLine)
        return true
    } else {
        return false
    }
}

function setLineDrag(isDrag) {
    if (gMeme.selectedImgId === -1) return

    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
    if (isDrag) {
        gMeme.lines[gMeme.selectedLineIdx].textAlign = ''
    }
}

function getLine() {
    return gMeme.lines[gMeme.selectedLineIdx].isDrag
}

function moveLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].location.x += dx
    gMeme.lines[gMeme.selectedLineIdx].location.y += dy
    console.log(gMeme.lines[gMeme.selectedLineIdx].location);
}
