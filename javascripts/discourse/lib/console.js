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
    console.log(
        `%c${I18n.t(themePrefix("hint1_text"))}\n%c${groupUrl.href}`,
        'color:lime;background:black;font-size:2em;font-family:Arial,sans-serif;',
        'background:yellow;font-size:1.5em;font-family:Arial,sans-serif;'
    );
}

// no real implementation, just for pretty print in console
// 1. use a named function to create object
//    so that the object will be named in the console
// 2. use a object to wrap the Settings function
//    so that the function will not be renamed by terser
const __wrapper_Settings = {
    Settings: function() { }
};

export async function printHint2() {
    await imageToConsole(settings.theme_uploads.hint2_image, 50);
    console.log(
        `%c${I18n.t(themePrefix("hint2_text"))}`,
        'color:lime;background:black;font-size:2em;font-family:Arial,sans-serif;',
    );
    const allowedSettings = [
        'avatar_replace_probability',
        'post_content_shuffle_probability',
        'post_content_shuffle_pairwise_probability',
        'icon_shuffle_probability'
    ];
    // so the object will be named in the console
    const proxy = new __wrapper_Settings.Settings();
    for (let setting of allowedSettings) {
        Object.defineProperty(proxy, setting, {
            get: () => settings[setting],
            set: (value) => settings[setting] = value,
            enumerable: true,
        });
    }
    const specialHints = [
        "#1 上面是控制概率的参数",
        "#2 你可以单击它们以查看它们的值",
        "#3 也可以双击并修改它们的值",
        "#4 值修改后立刻生效，你可以继续浏览以查看效果",
        "#5 修改的值将在刷新页面后还原"
    ];
    for (let hint of specialHints) {
        Object.defineProperty(proxy, hint, {
            get: () => {
                if (document.body.classList.contains("shuiyuan-april-fools-2024-flip")){
                    document.body.classList.remove("shuiyuan-april-fools-2024-flip");
                } else {
                    document.body.classList.add("shuiyuan-april-fools-2024-flip");
                }
                return "喵";
            },
            set: () => {
                if (document.body.classList.contains("shuiyuan-april-fools-2024-invert")){
                    document.body.classList.remove("shuiyuan-april-fools-2024-invert");
                } else {
                    document.body.classList.add("shuiyuan-april-fools-2024-invert");
                }
                console.error("不知道该报什么错，但反正这个不能改");
            },
        });
    }
    console.dir(proxy);
}