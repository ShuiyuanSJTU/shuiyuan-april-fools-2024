/* eslint-disable no-alert */
/* eslint-disable no-console */
import Group from "discourse/models/group";
import I18n from "discourse-i18n";

async function findEnabledGroup() {
    return (await Group.findAll()).findBy("name", settings.enabled_group_name);
}

function getGroupUrl() {
    return new URL(`/g/${settings.enabled_group_name}`, document.location.href);
}

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

// implement of objects that can interact with in console
// 1. use named functions to create objects
//    so that the objects will be named in the console
// 2. use a object to wrap the Settings function
//    so that the functions will not be renamed by terser
const __console_obj_wrapper = {
    Settings: function (allowedSettings = []) {
        for (let setting of allowedSettings) {
            Object.defineProperty(this, setting, {
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
            Object.defineProperty(this, hint, {
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
                    console.error("不知道报错信息该写什么，但这个不能改");
                },
            });
        }
    },
    LeaveGroup: function () {
        Object.defineProperty(this, "安全出口（真的）→", {
            get: () => {
                setTimeout(async () => {
                    const group = await findEnabledGroup();
                    if (group) {
                        await group.leave();
                    } else {
                        alert("好像失败了，再试试？");
                    }
                    window.location.reload();
                }, 2000);
                return "再见！";
            }
        });
    },
    JoinGroup: function () {
        Object.defineProperty(this, "启动→", {
            get: () => {
                setTimeout(async () => {
                    const group = await findEnabledGroup();
                    if (group) {
                        await group.join();
                        window.location.reload();
                    } else {
                        if (confirm("失败了，试试手动加入？")) {
                            window.location.href = getGroupUrl().href;
                        }
                    }
                }, 100);
                return "马上就好！";
            }
        });
    },
};

export async function printHint1() {
    await imageToConsole(settings.theme_uploads.hint1_image, 35);
    const groupUrl = new URL(`/g/${settings.enabled_group_name}`, document.location.href);
    console.log(
        `%c${I18n.t(themePrefix("hint1_text"))}\n%c${groupUrl.href}`,
        'color:lime;background:black;font-size:2em;font-family:Arial,sans-serif;',
        'background:yellow;font-size:1.5em;font-family:Arial,sans-serif;'
    );
    const joinGroup = new __console_obj_wrapper.JoinGroup();
    console.dir(joinGroup);
}

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
    const settingsProxy = new __console_obj_wrapper.Settings(allowedSettings);
    console.dir(settingsProxy);
    const leaveGroup = new __console_obj_wrapper.LeaveGroup();
    console.dir(leaveGroup);
}