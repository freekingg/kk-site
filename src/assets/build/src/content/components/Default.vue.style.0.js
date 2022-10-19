import { createHotContext, updateStyle, removeStyle } from '../../../node_modules/vite/dist/client/client.mjs.js';

import.meta.hot = createHotContext("/src/content/components/Default.vue.style.0.js");const __vite__id = "/Users/kingking/king/work/kk-ext-secret/src/content/components/Default.vue?vue&type=style&index=0&scoped=true&lang.css";
const __vite__css = "\n.run-status[data-v-d93935d2] {\n  display: flex;\n  justify-content: center;\n}\n#kk-container[data-v-d93935d2]  .el-result {\n  padding-top: 0;\n}\n#kk-container[data-v-d93935d2]  .el-result__title {\n  margin-top: 10px;\n}\n#kk-container[data-v-d93935d2]  .el-result__extra {\n  margin-top: 10px;\n}\n";
updateStyle(__vite__id, __vite__css);
import.meta.hot.accept();
import.meta.hot.prune(() => removeStyle(__vite__id));

export { __vite__css as default };
