import { createHotContext, updateStyle, removeStyle } from '../../node_modules/vite/dist/client/client.mjs.js';

import.meta.hot = createHotContext("/src/content/style.css.js");const __vite__id = "/Users/kingking/king/work/kk-ext-secret/src/content/style.css";
const __vite__css = "#kkapp{\n  position: fixed;\n  top: 10px;\n  right: 10px;\n  font-size: 16px;\n  z-index: 9999;\n  padding: 6px;\n}\n";
updateStyle(__vite__id, __vite__css);
import.meta.hot.accept();
import.meta.hot.prune(() => removeStyle(__vite__id));

export { __vite__css as default };
