import { replaceIcon, REPLACEMENTS } from "discourse-common/lib/icon-library";
import { shuffleArray } from "./utils";

export default {
    originalReplacement: {},
    shuffled: false,

    shuffleIcons: function(force = false) {
        if (this.shuffled && !force) {
            return;
        }
        if (!this.shuffled) {
            this.originalReplacement = Object.assign({}, REPLACEMENTS);
        }
        this.shuffled = true;
        const shuffledIcons = shuffleArray(Object.values(REPLACEMENTS));
        Object.keys(REPLACEMENTS).forEach((icon, index) => {
            replaceIcon(icon, shuffledIcons[index]);
        });
    },
    restoreIcons: function() {
        if (!this.shuffled) {
            return;
        }
        this.shuffled = false;
        Object.keys(this.originalReplacement).forEach((icon) => {
            replaceIcon(icon, this.originalReplacement[icon]);
        });
    }
};