'use strict'

function renderGallery() {
    const imgs = getImgs() // images from memeService
    const galleryContainer = document.querySelector('.gallery-container')

    galleryContainer.innerHTML = imgs.map(img => `
        <img src="${img.url}" onclick="onImgSelect(${img.id})">
    `).join('')
}

function onImgSelect(imgId) {
    setImg(imgId) // Update selected image in gMeme
    toggleEditor(true) //show the meme editor and hide the gallery
    renderMeme() // Render the meme with the selected image
}
