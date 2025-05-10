'use strict'

function renderGallery() {
    document.querySelector('.user-memes').classList.add('hidden')
    const imgs = getImgs()
    const galleryContainer = document.querySelector('.gallery-container')

    // Render gallery images
    galleryContainer.innerHTML = imgs.map(img => `
        <img src="${img.url}" onclick="onImgSelect(${img.id})">
    `).join('')

    // Render the keywords
    renderKeywords()
}

function renderKeywords() {
    const keywordsContainer = document.querySelector('.keywords-container')
    const keywordsMap = gKeywordSearchCountMap

    let keywordsHTML = ''

    for (let keyword in keywordsMap) {
        const count = keywordsMap[keyword]
        const fontSize = 12 + count * 2
        keywordsHTML += `<span class="keyword" style="font-size:${fontSize}px" onclick="onKeywordClick('${keyword}')">${keyword}</span>`
    }
    
    keywordsHTML = keywordsHTML.trim()

    // render on gallery page
    keywordsContainer.innerHTML = keywordsHTML
    
}

function onKeywordClick(keyword) {
    // Increase keyword popularity
    if (gKeywordSearchCountMap[keyword]) {
        gKeywordSearchCountMap[keyword]++
    } else {
        gKeywordSearchCountMap[keyword] = 1
    }

    // Re-render keywords with updated sizes
    renderKeywords()

    // Search the gallery
    onSearchGallery(keyword)
}

function onSearchGallery(keyword) {
    keyword = keyword.toLowerCase()
    const filteredImgs = getImgs().filter(img =>
        img.keywords.some(tag => tag.toLowerCase().includes(keyword))
    )

    renderFilteredGallery(filteredImgs)
}

function renderFilteredGallery(imgs) {
    const galleryContainer = document.querySelector('.gallery-container')

    if (imgs.length === 0) {
        galleryContainer.innerHTML = '<p class="no-results">No images found.</p>'
        return
    }

    galleryContainer.innerHTML = imgs.map(img => `
        <img src="${img.url}" onclick="onImgSelect(${img.id})" alt="meme">
    `).join('')
}


function onImgSelect(imgId) {
    setImg(imgId) // Update selected image in gMeme
    gMeme.selectedImgUrl = null // Clear uploaded image

    // Reset gMeme to default line.
    gMeme.lines = [{
        txt: 'Your Meme Text Here',
        size: 20,
        color: 'white',
        x: 200,
        y: 50,
        width: 0,
        height: 0
    }]
    document.querySelector('.image-gallery').classList.add('hidden')
    document.querySelector('.meme-editor').classList.remove('hidden')
    renderMeme()
}

