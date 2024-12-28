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
            size: 30,
            color: '#ffb921',
            strokeColor: '#000000',
            fontFamily: 'Impact',
            textAlign: 'center',
            isDrag: false
        },
        {
            txt: 'Enter text here',
            location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
            size: 30,
            color: '#ffb921',
            strokeColor: '#000000',
            fontFamily: 'Impact',
            textAlign: 'center',
            isDrag: false
        },
    ]
}

var gRandomLines = [
    ['The face you make', 'when you step on a LEGO at 3 AM.'],
    ['Yo dawg, I heard you like memes', 'so I put a meme in your meme.'],
    ['Is this', 'a pigeon?'],
    ['Me explaining the meme', 'my mom staring in confusion.']
]

// Meme Management

function getMeme() {
    return gMeme
}

function setImg(imgId) {
    gIsEditModeOn = false
    gMeme.selectedImgId = imgId
    gMeme.imgUrl = findImgUrlById(gMeme.selectedImgId)
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

function setSelectedlineIdx(idx) {
    gMeme.selectedLineIdx = idx
}

function resetMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Enter text here',
                location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
                size: 30,
                color: '#ffb921',
                strokeColor: '#000000',
                fontFamily: 'Impact',
                textAlign: 'center',
                isDrag: false
            },
            {
                txt: 'Enter text here',
                location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
                size: 30,
                color: '#ffb921',
                strokeColor: '#000000',
                fontFamily: 'Impact',
                textAlign: 'center',
                isDrag: false
            },
        ]
    };
}


// Image Management

function _setgImgs() {
    gImgs = [
        { id: 0, url: 'images/0.jpg', keywords: ['funny', 'sad'] },
        { id: 1, url: 'images/1.jpg', keywords: ['funny', 'sad'] },
        { id: 2, url: 'images/2.jpg', keywords: ['funny', 'cat'] },
        { id: 3, url: 'images/3.jpg', keywords: ['funny', 'baby'] },
        { id: 4, url: 'images/4.jpg', keywords: ['funny', 'sad'] },
        { id: 5, url: 'images/5.jpg', keywords: ['happy', 'baby'] },
        { id: 6, url: 'images/6.jpg', keywords: ['funny', 'baby'] },
        { id: 7, url: 'images/7.jpg', keywords: ['funny', 'baby'] },
        { id: 8, url: 'images/8.jpg', keywords: ['funny', 'sad'] },
        { id: 9, url: 'images/9.jpg', keywords: ['funny', 'baby'] },
        { id: 10, url: 'images/10.jpg', keywords: ['funny', 'happy'] },
        { id: 11, url: 'images/11.jpg', keywords: ['funny', 'baby'] },
        { id: 12, url: 'images/12.jpg', keywords: ['sad', 'dog'] },
        { id: 13, url: 'images/13.jpg', keywords: ['funny', 'happy'] },
        { id: 14, url: 'images/14.jpg', keywords: ['funny', 'happy'] },
        { id: 15, url: 'images/15.jpg', keywords: ['funny', 'happy'] },
        { id: 16, url: 'images/16.jpg', keywords: ['funny', 'happy'] },
        { id: 17, url: 'images/17.jpg', keywords: ['funny', 'happy'] },
        { id: 18, url: 'images/18.jpg', keywords: ['funny', 'happy'] },
        { id: 19, url: 'images/19.jpg', keywords: ['funny', 'happy'] },
        { id: 20, url: 'images/20.jpg', keywords: ['cat', 'happy'] },
        { id: 21, url: 'images/21.jpg', keywords: ['funny', 'dog'] },
        { id: 22, url: 'images/22.jpg', keywords: ['happy', 'sad'] },
        { id: 23, url: 'images/23.jpg', keywords: ['funny', 'baby'] },
        { id: 24, url: 'images/24.jpg', keywords: ['cat', 'happy'] },
        { id: 25, url: 'images/25.jpg', keywords: ['cat', 'dog'] },
        { id: 26, url: 'images/26.jpg', keywords: ['funny', 'happy'] },
    ]
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

// Line Management

function addLine(emoji) {
    var newLine = {
        txt: emoji || 'Enter text here',
        location: { x: 0, y: 0, lineWidth: 0, textHeight: 0 },
        size: 30,
        color: '#ffb921',
        strokeColor: '#000000',
        fontFamily: 'Impact',
        textAlign: 'center',
        isDrag: false
    }

    gMeme.lines.push(newLine)
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

    if (!gMeme.lines.length) {
        addLine()
    }
}

// My Memes

function _loadMyMemes() {
    gMyMemes = loadFromStorage(MYMEMES_KEY)
    if (gMyMemes && gMyMemes.length > 0) return

    gMyMemes = []
    saveToStorage(MYMEMES_KEY, gMyMemes)
}

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

// Keyword and Search

function getkeywordCountMap() {
    return gKeywordSearchCountMap
}

function upvoteKeyword(word) {
    for (var keyword in gKeywordSearchCountMap) {
        if (keyword === word && gKeywordSearchCountMap[keyword] < 15) {
            gKeywordSearchCountMap[word]++
        }
    }
    saveToStorage(KEYWORD_KEY, gKeywordSearchCountMap)
}

function _loadKeywordCountMap() {
    gKeywordSearchCountMap = loadFromStorage(KEYWORD_KEY)
    if (gKeywordSearchCountMap) return

    gKeywordSearchCountMap = { 'funny': 5, 'cat': 5, 'baby': 5, 'happy': 5, 'sad': 5, 'dog': 5 }
    saveToStorage(KEYWORD_KEY, gKeywordSearchCountMap)
}


// upload image 

function uploadImage(img) {
    gMeme.imgUrl = img.src
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
}


//// 

function SetRandomMeme() {
    resetMeme()
    var imageId = getRandomInt(0, gImgs.length)
    var randomLines = gRandomLines[getRandomInt(0, gRandomLines.length)]
    setImg(imageId)
    gMeme.lines.forEach((line, idx) => line.txt = randomLines[idx])
}


