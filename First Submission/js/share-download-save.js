'use strict'

function onDownloadMeme(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg') // Convert canvas to image URL
    elLink.href = imgContent // Set the href of the link to the image URL
    elLink.download = "meme.jpg" //download attribute
}

function uploadToImgur(dataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('image', dataUrl.split(',')[1])

    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            Authorization: 'Client-ID 58db889fcacc6d8',
        },
        body: formData,
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            onSuccess(data.data.link)
        } else {
            alert('Upload failed')
        }
    })
    .catch(err => {
        console.error('Error uploading to Imgur:', err)
    })
}

function onShareMemeToFacebook() {
    const memeDataUrl = gElCanvas.toDataURL('image/jpeg')
    uploadToImgur(memeDataUrl, (uploadedUrl) => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(uploadedUrl)}`
        window.open(fbUrl, '_blank')
    })
}

function onShareMemeToEmail() {
    const memeDataUrl = gElCanvas.toDataURL('image/jpeg')
    uploadToImgur(memeDataUrl, (uploadedUrl) => {
        const subject = encodeURIComponent('Check out this meme I made!')
        const body = encodeURIComponent(`Hey! Here's a meme I created:\n\n${uploadedUrl}`)
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`
        window.location.href = mailtoLink
    })
}

function onSaveMeme() {
    // Convert to a JPEG data URL.
    const memeDataUrl = gElCanvas.toDataURL('image/jpeg')

    // Retrieve the existing saved memes, or an empty array if none
    let savedMemes = loadFromStorage('savedMemes') || []

    // Add new meme's data URL to array
    savedMemes.push(memeDataUrl)

    // Save the updated array back to local storage using saveToStorage.
    saveToStorage('savedMemes', savedMemes)

    alert('Meme saved successfully')
}
