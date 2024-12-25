"use strict"

var gDisplay = 'gallery'
var gFilterGalleryBy = ''

function onInit() {
    renderDisplay()
}

function renderDisplay() {

    if (gDisplay === 'my-meme') {
        renderMyMemes()
    } else {
        renderImageGallery()
    }

}

function renderMyMemes() {
    const elMyMemesContainer = document.querySelector('.my-meme-container')
    var strHtml = ''
    const meme = getMyMemes() // List

    strHtml = meme.map(({ id, url }) => {
        return `
             <div class="photo-card" onclick="onEditMeme('${id}')">
                    <img src="${url}" alt="" class="meme-image">
            </div>  `
    })

    elMyMemesContainer.innerHTML = strHtml.join('')

    toggleGallery()
}


function renderImageGallery() {
    const elGalleryContainer = document.querySelector('.gallery-container')
    var strHtml = ''
    const imgs = getImgs(gFilterGalleryBy) // List

    var addImage =
        `<div class="photo-card">
    <input type="file" name="name" class="upload-image-input" id="fileInput" accept="image/*" onchange="onImgInput(event)" hidden>
    <img src="images/add-image.png" class="upload-btn" alt="meme-image" onclick="onClickUpload()"></div>`

    strHtml = imgs.map(({ id, url }) => {
        return `
             <div class="photo-card" onclick="onImgSelect(${id})">
                    <img src="${url}" alt="" class="meme-image">
            </div>  `
    })

    strHtml.unshift(addImage)

    elGalleryContainer.innerHTML = strHtml.join('')

    toggleGallery()
    // onLoadKeywords()
}


function onImgSelect(imgId) {
    // modal
    setImg(imgId)
    // Dom
    initCanvas()
}

function onMemeSelect(memeId) {
    // modal
    setMeme(memeId)
    // Dom
    initCanvas()
}

function toggleGallery() {
    const elMyMeme = document.querySelector('.my-meme-container')
    const elGallery = document.querySelector('.gallery-container')

    if (gDisplay === 'my-meme') {
        elMyMeme.classList.remove('hide')
        elGallery.classList.add('hide')
    } else {
        elGallery.classList.remove('hide')
        elMyMeme.classList.add('hide')
    }
}

function onSetDisplay(displayType) {
    gDisplay = displayType

    renderDisplay()
}


function onGalleryFilter(keywords) {
    // modal
    gFilterGalleryBy = keywords
    // Dom
    renderDisplay()
}

function onClearGalleryFilter() {
    const elGalleryFilter = document.querySelector('.gallery-filter')
    // modal
    gFilterGalleryBy = ''
    elGalleryFilter.value = ''
    // Dom
    renderDisplay()
}

// function onLoadKeywords() {
//     var keywordCountMap = getkeywordCountMap()

// }