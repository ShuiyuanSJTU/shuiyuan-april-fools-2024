import { apiInitializer } from "discourse/lib/api";
import KeyboardShortcuts from "discourse/lib/keyboard-shortcuts";
import Icons from "../lib/icons";
import { getTextNodes, randomSwap } from "../lib/utils";

export default apiInitializer("0.11.1", api => {
  if (!settings.enable_easter_egg) {return;}

  const today = new Date();
  const isAprilFoolsDay = today.getMonth() === 3 && today.getDate() === 1;
  if (isAprilFoolsDay || settings.force_global_easter_egg) {
    document.body.classList.add("shuiyuan-april-fools-2024-global");
    KeyboardShortcuts.unbind({
      "ctrl+shift+i": null,
      "F12": null,
    });
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
      if(Math.random() < settings.avatar_replace_probability) {
        attrs.avatar_template = api.getCurrentUser().avatar_template;
      }
      return this._super(attrs);
    }
  });

  api.decorateCookedElement((elem) => {
    if (Math.random() > settings.post_content_shuffle_probability) {
      return;
    }
    const textNodes = getTextNodes(elem);
    textNodes.forEach(node => {
      node.textContent = randomSwap(
        node.textContent,
        settings.post_content_shuffle_pairwise_probability);
    });
  },
    { id: "shuiyuan-april-fools-2024", onlyStream: true }
  );

  api.onPageChange(() => {
    if (Math.random() < settings.icon_shuffle_probability) {
      Icons.shuffleIcons();
    } else {
      Icons.restoreIcons();
    }
  });

});
