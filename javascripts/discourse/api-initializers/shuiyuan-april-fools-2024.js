import { apiInitializer } from "discourse/lib/api";
import { replaceIcon,REPLACEMENTS } from "discourse-common/lib/icon-library";
import { getTextNodes, randomSwap, shuffleArray } from "../lib/utils";

export default apiInitializer("0.11.1", api => {
  if (!settings.enable_easter_egg) {return;}

  const today = new Date();
  const isAprilFoolsDay = today.getMonth() === 3 && today.getDate() === 1;
  if (isAprilFoolsDay || settings.force_global_easter_egg) {
    document.body.classList.add("shuiyuan-april-fools-2024-global");
  }

  const currentUser = api.getCurrentUser();
  if (!(currentUser && currentUser.groups
    && currentUser.groups.filter(group => group.name === settings.enabled_group_name).length > 0)
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
    if (Math.random() > 0.3) {
      return;
    }
    const textNodes = getTextNodes(elem);
    textNodes.forEach(node => {
      node.textContent = randomSwap(node.textContent, 0.3);
    });
  },
    { id: "shuiyuan-april-fools-2024", onlyStream: true }
  );

  const shuffledIcons = shuffleArray(Object.values(REPLACEMENTS));
  Object.keys(REPLACEMENTS).forEach((icon, index) => {
    replaceIcon(icon, shuffledIcons[index]);
  });
});
