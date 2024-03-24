import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", api => {
  console.log("hello world from api initializer!");
  api.reopenWidget("post-avatar", {
    html(attrs) {
      if(Math.random() < 0.3) {
        attrs.avatar_template = api.getCurrentUser().avatar_template;
      }
      return this._super(attrs);
    }
  });

  api.decorateCookedElement((elem) => {
    if (Math.random() > 0.9) {
      return;
    }
    const getTextNodes = (node) => {
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
    const randomSwap = (str, probability = 0.5, coolDown = 5) => {
      let arr = str.split('');
      let coolDownCounter = 0;
      for (let i = 0; i < arr.length - 1; i+=2) {
        if (coolDownCounter <= 0 && Math.random() < probability
            && !(".!?。，！？".includes(arr[i]) || ".!?。，！？".includes(arr[i + 1]))){
          let temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          coolDownCounter = coolDown;
        }
        coolDownCounter--;
      }
      return arr.join('');
    };
    const textNodes = getTextNodes(elem);
    textNodes.forEach(node => {
      node.textContent = randomSwap(node.textContent, 0.5);
    });
  },
    { id: "shuiyuan-april-fools-2024", onlyStream: true }
  );

});
