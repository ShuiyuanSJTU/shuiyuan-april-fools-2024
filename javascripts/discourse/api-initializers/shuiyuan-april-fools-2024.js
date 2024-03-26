import { apiInitializer } from "discourse/lib/api";
import KeyboardShortcuts from "discourse/lib/keyboard-shortcuts";
import discourseLater from "discourse-common/lib/later";
import { printHint1, printHint2 } from "../lib/console";
import Icons from "../lib/icons";
import { getTextNodes, randomSwap } from "../lib/utils";

export default apiInitializer("0.11.1", api => {
  if (!settings.enable_easter_egg) {return;}

  const currentUser = api.getCurrentUser();
  const inGroup = currentUser && currentUser.groups
    && currentUser.groups.filter(group => group.name === settings.enabled_group_name).length > 0;
  const today = new Date();
  const isAprilFoolsDay = today.getMonth() === 3 && today.getDate() === 1;
  if (!inGroup) {
    if (isAprilFoolsDay || settings.force_global_easter_egg) {
      // not in group, but it's April Fools' Day or forced
      // enable global easter egg
      document.body.classList.add("shuiyuan-april-fools-2024-global");
      KeyboardShortcuts.unbind({
        "ctrl+shift+i": null,
        "F12": null,
      });
      discourseLater(printHint1, 5000);
    }
    // do nothing if not in group
    return;
  }

  document.body.classList.add("shuiyuan-april-fools-2024");

  api.reopenWidget("post-avatar", {
    html(attrs) {
      // eslint-disable-next-line no-bitwise
      if((attrs.id^currentUser.id)*7%100/100 < settings.avatar_replace_probability) {
        attrs.avatar_template = currentUser.avatar_template;
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
  discourseLater(printHint2, 3000);
});
