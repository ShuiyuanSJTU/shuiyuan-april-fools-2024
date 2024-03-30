export function getTextNodes(node) {
    let textNodes = [];
    if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.textContent)) {
        textNodes.push(node);
    } else {
        for (let childNode of node.childNodes) {
            textNodes = textNodes.concat(getTextNodes(childNode));
        }
    }
    return textNodes;
};

export function randomSwap(str, probability = 0.5, coolDown = 5) {
    let arr = str.split('');
    let coolDownCounter = 0;
    for (let i = 0; i < arr.length - 1; i += 2) {
        if (coolDownCounter <= 0 && Math.random() < probability
            && !(".!?。，！？".includes(arr[i]) || ".!?。，！？".includes(arr[i + 1]))) {
            let temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
            coolDownCounter = coolDown;
        }
        coolDownCounter--;
    }
    return arr.join('');
};

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}