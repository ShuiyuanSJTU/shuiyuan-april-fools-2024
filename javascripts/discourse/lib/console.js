/* eslint-disable no-console */
async function getBase64Image(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

async function imageToConsole(url,size = 200) {
    const base64 = await getBase64Image(url);
    const image = await loadImage(base64);
    const style = [
        'font-size: 1px;',
        'padding: ' + image.height/100*size + 'px ' + image.width/100*size + 'px;',
        'background: url('+ base64 +') no-repeat;',
        'background-size: contain;'
        ].join(' ');
    console.log('%c ', style);
}