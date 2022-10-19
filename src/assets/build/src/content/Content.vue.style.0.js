import { createHotContext, updateStyle, removeStyle } from '../../node_modules/vite/dist/client/client.mjs.js';

import.meta.hot = createHotContext("/src/content/Content.vue.style.0.js");const __vite__id = "/Users/kingking/king/work/kk-ext-secret/src/content/Content.vue?vue&type=style&index=0&scoped=true&lang.css";
const __vite__css = "\n#kk-content[data-v-1a99ec7a] {\n  min-width: 350px;\n}\n.card-header[data-v-1a99ec7a] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.card-header .right[data-v-1a99ec7a] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  width: 76px;\n}\n";
updateStyle(__vite__id, __vite__css);
import.meta.hot.accept();
import.meta.hot.prune(() => removeStyle(__vite__id));

export { __vite__css as default };
