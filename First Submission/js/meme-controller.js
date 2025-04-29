'use strict'

var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')

    // Add click event listener to canvas
    gElCanvas.addEventListener('click', onCanvasClick)

    const imgObj = getImageById(gMeme.selectedImgId);
    if (!imgObj) {
        renderGallery()
        renderMeme()
        return
    }

    //Format aspect ratio of photo on canvas
    const img = new Image()
    img.src = imgObj.url

    img.onload = () => {
        const canvasWidth = 400 // chosen width
        const canvasHeight = (img.naturalHeight * canvasWidth) / img.naturalWidth // Aspect ratio formula

        gElCanvas.width = canvasWidth
        gElCanvas.height = canvasHeight

        renderGallery()
        renderMeme()
    }
}

function renderMeme() {
    const meme = getMeme()
    const img = new Image()
    img.src = getImageById(meme.selectedImgId).url

    img.onload = () => {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

        meme.lines.forEach((line, idx) => {
            gCtx.font = `${line.size}px Arial`
            gCtx.textAlign = 'center'
            gCtx.textBaseline = 'middle'
            gCtx.fillStyle = line.color

            // Measure text
            const textMetrics = gCtx.measureText(line.txt)
            const textWidth = textMetrics.width
            const textHeight = line.size

            // Update stored dimensions (in object)
            line.width = textWidth
            line.height = textHeight

            // Draw text
            gCtx.fillText(line.txt, line.x, line.y)

            // If selected, draw a white highlight (existing code, like switch line function)
            if (idx === gMeme.selectedLineIdx) {
                gCtx.strokeStyle = 'white'
                gCtx.lineWidth = 2
                const padding = 10
                gCtx.strokeRect(
                    line.x - (textWidth / 2) - padding,
                    line.y - (textHeight / 2) - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                )
            }
        })
    }
}

function onLineTxtChange() {
    const textInput = document.querySelector('.meme-text').value

    setLineTxt(textInput) // Update meme text
    renderMeme() // Re-render the meme
}

document.addEventListener('DOMContentLoaded', () => {
    window.toggleEditor = function (showEditor) {
        const gallery = document.querySelector('.image-gallery')
        const editor = document.querySelector('.meme-editor')

        if (showEditor) {
            gallery.classList.add('hidden')
            editor.classList.remove('hidden')
        } else {
            gallery.classList.remove('hidden')
            editor.classList.add('hidden')
        }
    }
})

function onDownloadMeme(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg') // Convert canvas to image URL
    elLink.href = imgContent // Set the href of the link to the image URL
    elLink.download = "meme.jpg" //download attribute
}

function onSetColor() {
    const colorInput = document.querySelector('.text-color-picker').value
    setColor(colorInput)

    //change font color without re-rendering image
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        gCtx.fillStyle = line.color
        gCtx.font = `${line.size}px Arial`
        gCtx.textAlign = 'center'
        gCtx.fillText(line.txt, gElCanvas.width / 2, (idx + 1) * 50)
    })
}

function onFontSizeChange() {
    const fontSize = document.querySelector('#font-size-meter').value

    setFontSize(Number(fontSize)) // Update font size in gMeme
    renderMeme()
}

function onAddLine() {
    const lastLine = gMeme.lines[gMeme.lines.length - 1]
    const newY = lastLine.y + 60

    gMeme.lines.push({
        txt: 'New Line',
        size: 20,
        color: 'black',
        x: 200,
        y: newY
    })

    renderMeme()
}

function onSwitchLine() {
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length // Cycle through lines
    renderMeme()
}

function updateEditor(line) {
    document.querySelector('.meme-text').value = line.txt
    document.querySelector('.text-color-picker').value = line.color
    document.querySelector('#font-size-meter').value = line.size
}

function onCanvasClick(ev) {
    ev.preventDefault() // Prevent any default behavior

    // Get the canvas's bounding rectangle
    const getEvPos = (ev) => {
        const rect = gElCanvas.getBoundingClientRect()
        // Helper to convert event coordinates to canvas coordinates
        const scaleX = gElCanvas.width / rect.width
        const scaleY = gElCanvas.height / rect.height
        return {
          x: (ev.clientX - rect.left) * scaleX,
          y: (ev.clientY - rect.top) * scaleY,
        }
      }

    const pos = getEvPos(ev)
    console.log('Canvas clicked at (scaled):', pos)

    gMeme.lines.forEach((line, idx) => {
        // Set font size so measurements are accurate.
        gCtx.font = `${line.size}px Arial`
        const textMetrics = gCtx.measureText(line.txt)

        // Use line.size for approx text height
        const textHeight = line.size
        const textWidth = textMetrics.width;

        // Calculate the clickable area with padding
        const padding = 10
        const bounds = {
            left: line.x - (textWidth / 2) - padding,
            right: line.x + (textWidth / 2) + padding,
            top: line.y - (textHeight / 2) - padding,
            bottom: line.y + (textHeight / 2) + padding
        }

        console.log(`Checking line ${idx}:`, {
            text: line.txt,
            position: `(${line.x}, ${line.y})`,
            bounds: bounds,
            clickPos: pos
        })

        const isInBounds =
            pos.x >= bounds.left &&
            pos.x <= bounds.right &&
            pos.y >= bounds.top &&
            pos.y <= bounds.bottom;

        console.log(`Line ${idx} clicked:`, isInBounds)

        if (isInBounds) {
            console.log(`✅ Selected line ${idx}: "${line.txt}"`)
            gMeme.selectedLineIdx = idx
            updateEditor(line)
            renderMeme()
        }
    })
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

