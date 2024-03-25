import I18n from "discourse-i18n";

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

export async function printHint1() {
    await imageToConsole(settings.theme_uploads.hint1_image, 50);
    const groupUrl = new URL(`/g/${settings.enabled_group_name}`, document.location.href);
    console.log('%c' + I18n.t(themePrefix("hint1_text")) + '\n%c' + groupUrl.href, 'color:lime;background:black;font-size:2em;', 'background:yellow;font-size:1.5em;');
    // console.log(, 'background:yellow;font-size:1.2em;');
}