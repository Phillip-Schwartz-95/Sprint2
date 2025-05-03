'use strict'

// Meme data model
var gImgs = [{ id: 1, url: 'square-img/1.jpg', keywords: ['funny', 'trump'] },
{ id: 2, url: 'square-img/2.jpg', keywords: ['cute', 'puppies'] },
{ id: 3, url: 'square-img/3.jpg', keywords: ['cute', 'baby'] }]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    selectedFont: 'Arial',
    textAlign: 'center',
    lines: [
        {
            txt: 'Enter Text Here',
            size: 20,
            color: 'red',
            x: 200,  
            y: 50,   
            width: 0,  // These will be calculated
            height: 0  // during rendering
        },
        {
            txt: 'Second Line Here',
            size: 20,
            color: 'blue',
            x: 200,
            y: 150,
            width: 0,
            height: 0
        }
    ]
}


var gKeywordSearchCountMap = { 'funny': 1, 'cute': 2, 'baby': 1 }

// Find the image in the gImgs array for the render function
function getImageById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

// Function to retrieve the current meme object
function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

// For rendering pictures in the gallery from available pics
function getImgs() {
    return gImgs 
}

// Used for the selectedImgId property value inside gMeme in order to
// render the selected image in the canvas 
function setImg(imgId) {
    gMeme.selectedImgId = imgId 
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFontSize(size) {
    gMeme.lines[gMeme.selectedLineIdx].size = size // Increase and decrease font size
}

//for handling touch vs. click events
function getEvPos(ev) {
    // Get the canvas's bounding rectangle
    const rect = gElCanvas.getBoundingClientRect()
    // Calculate scale factors to convert CSS coordinates to canvas
    const scaleX = gElCanvas.width / rect.width
    const scaleY = gElCanvas.height / rect.height

    let pos

    // Check if this is a touch event
    if (ev.type.startsWith('touch')) {
        // Prevent default behavior 
        ev.preventDefault()
        // Use the first touch point
        const touch = ev.changedTouches[0]
        pos = {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        }
    } else {
        // else it's a mouse event
        pos = {
            x: (ev.clientX - rect.left) * scaleX,
            y: (ev.clientY - rect.top) * scaleY
        }
    }

    console.log(`getEvPos - X: ${pos.x}, Y: ${pos.y}`)
    return pos
}