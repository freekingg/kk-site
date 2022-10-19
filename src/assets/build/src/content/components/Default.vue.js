import { createHotContext } from '../../../node_modules/vite/dist/client/client.mjs.js';
import '../../../vendor/deps/vue.js';
import { ElIcon } from '../../../vendor/deps/element-plus.js';
import '../../../vendor/deps/element-plus_icons-vue.js';
import './Default.vue.style.0.js';
import _export_sfc from '../../../plugin-vue-export-helper.js';
import { defineComponent, pushScopeId, popScopeId, openBlock, createElementBlock } from '../../../vendor/deps/chunk-JFXHU74D.js';
import { question_filled_default } from '../../../vendor/deps/chunk-AMW2O4TU.js';

import.meta.hot = createHotContext("/src/content/components/Default.vue.js");const _sfc_main = defineComponent({
  components: { QuestionFilled: question_filled_default, ElIcon },
  props: {
    onOff: Boolean,
    data: String
  },
  emits: ["onOffHandle"],
  setup(props, ctx) {
  }
});
const _withScopeId = (n) => (pushScopeId("data-v-d93935d2"), n = n(), popScopeId(), n);
const _hoisted_1 = { id: "kk-container" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", _hoisted_1, "\u65E0");
}
_sfc_main.__hmrId = "d93935d2";
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.accept(({ default: updated, _rerender_only }) => {
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
var Default = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d93935d2"], ["__file", "/Users/kingking/king/work/kk-ext-secret/src/content/components/Default.vue"]]);

export { Default as default };
