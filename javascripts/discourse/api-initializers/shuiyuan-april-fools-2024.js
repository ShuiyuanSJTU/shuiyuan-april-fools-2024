import { apiInitializer } from "discourse/lib/api";
import { REPLACEMENTS, replaceIcon } from "discourse-common/lib/icon-library";

export default apiInitializer("0.11.1", api => {
  const currentUser = api.getCurrentUser();
  if (!(currentUser && currentUser.groups
    && currentUser.groups.filter(group => group.name === "g_arpil_fools_2024").length > 0)
  ) {
    return;
  }

  document.body.classList.add("shuiyuan-april-fools-2024");

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

  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledIcons = shuffleArray(Object.values(REPLACEMENTS));
  Object.keys(REPLACEMENTS).forEach((icon, index) => {
    replaceIcon(icon, shuffledIcons[index]);
  });
  
});
