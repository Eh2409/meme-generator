"use strict"

function renderGallery() {
    const elGalleryContainer = document.querySelector('.gallery-container')
    var strHtml = ''
    const imgs = getImgs() // List

    strHtml = imgs.map(({ id, url }) => {
        return `
             <div class="photo-card" onclick="onImgSelect(${id})">
                    <img src="${url}" alt="" class="meme-image">
            </div>  `
    })

    elGalleryContainer.innerHTML = strHtml.join('')
}


function onImgSelect(imgId) {
    // modal
    setImg(imgId)
    // Dom
    renderMeme()
}