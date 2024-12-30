'use strict'

const gTrans = {
    title: { en: 'Meme generator', he: 'מחולל ממים', },
    navGallery: { en: 'Gallery', he: 'גלריה' },
    navRandom: { en: 'Random meme', he: 'מם אקראי' },
    navAbout: { en: 'About', he: 'אודות' },
    saveBtn: { en: 'Save', he: 'שמור' },
    downloadBtn: { en: 'Download', he: 'הורד' },
    shareBtn: { en: 'Share', he: 'שתף' },
    clearBtn: { en: 'Clear', he: 'נקה' },
    myGalleryBtn: { en: 'My meme gallery', he: 'גלריית הממים שלי' },
    memeGalleryBtn: { en: 'Meme gallery', he: 'גלריית ממים' },
    searchKeyword: { en: 'Search keyword', he: 'חפש מילת מפתח' },
    editorTitle: { en: 'Meme editor', he: 'עורך ממים' },
    editorTextInput: { en: 'Enter text', he: 'הכנס טקסט' },
    editorTextInput: { en: 'Enter text', he: 'הכנס טקסט' },
    aboutTitle: { en: 'About Meme Generator', he: 'אודות מחולל הממים' },
};

var gCurrLang = 'en'


function getTrans(transKey) {
    var transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'
    var transTxt = transMap[gCurrLang]
    if (!transTxt) transTxt = transMap.en
    return transTxt
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')

    els.forEach(el => {
        const transKey = el.dataset.trans
        const transTxt = getTrans(transKey)
        if (el.placeholder) el.placeholder = transTxt
        else el.innerText = transTxt
    })
}

function setLang(lang) {
    gCurrLang = lang
    console.log(gCurrLang);
}
