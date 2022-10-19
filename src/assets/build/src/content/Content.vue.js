import { createHotContext } from '../../node_modules/vite/dist/client/client.mjs.js';
import '../../vendor/deps/vue.js';
import { ElIcon, ElMessage } from '../../vendor/deps/element-plus.js';
import '../../vendor/deps/element-plus_icons-vue.js';
import Default from './components/Default.vue.js';
import AxisbankPrime from './components/AxisbankPrime.vue.js';
import './Content.vue.style.0.js';
import _export_sfc from '../../plugin-vue-export-helper.js';
import { defineComponent, ref, reactive, onMounted, toRefs, pushScopeId, popScopeId, resolveComponent, openBlock, createElementBlock, withDirectives, createVNode, withCtx, createBaseVNode, toDisplayString, createBlock, resolveDynamicComponent, vShow } from '../../vendor/deps/chunk-JFXHU74D.js';
import { view_default } from '../../vendor/deps/chunk-AMW2O4TU.js';

import.meta.hot = createHotContext("/src/content/Content.vue.js");const _sfc_main = defineComponent({
  components: {
    Default,
    AxisbankPrime,
    View: view_default,
    ElIcon
  },
  setup() {
    const visible = ref(true);
    const state = reactive({
      host: "",
      type: "Default",
      typeName: "",
      onOff: false,
      data: ""
    });
    const matchSite = [
      {
        type: "AxisbankPrime",
        typeName: "\u7F51\u7AD9\u52A9\u624B",
        matches: ["www.amazon.in", "www.amazon.com", "amazon.in"]
      }
    ];
    const onMessage = (e) => {
      if (e.actionType) {
        state.data = JSON.stringify(e.data);
        if (e.actionType) {
          ElMessage({
            message: "\u8BF7\u6C42\u53C2\u6570\u5DF2\u66F4\u65B0.",
            type: "success"
          });
        }
      }
    };
    const onOffHandle = (flag) => {
      state.onOff = flag;
    };
    onMounted(() => {
      state.host = location.host;
      initHandle();
    });
    const injectJsHandle = (jspath) => {
      var s = document.createElement("script");
      s.src = chrome.runtime.getURL(jspath);
      s.onload = function() {
      };
      if (document.body || document.head) {
        ;
        (document.body || document.head).appendChild(s);
      }
    };
    const initHandle = () => {
      const host = state.host;
      let target = null;
      for (const iterator of matchSite) {
        if (iterator.matches.includes(host)) {
          target = iterator;
        }
      }
      console.log("target", target);
      if (!target)
        return;
      const { type, typeName, injectJs } = target;
      state.type = type;
      state.typeName = typeName;
      if (injectJs && injectJs.length) {
        for (const iterator of injectJs) {
          injectJsHandle(iterator);
        }
      }
      allowRightClick();
    };
    const toggleVisile = () => {
      visible.value = !visible.value;
    };
    const allowRightClick = () => {
      window.addEventListener("contextmenu", function(e) {
        e.stopPropagation();
      }, true);
      document.addEventListener("contextmenu", function(e) {
        e.stopPropagation();
      }, true);
    };
    return {
      visible,
      toggleVisile,
      onMessage,
      onOffHandle,
      ...toRefs(state)
    };
  }
});
const _withScopeId = (n) => (pushScopeId("data-v-1a99ec7a"), n = n(), popScopeId(), n);
const _hoisted_1 = { id: "kk-content" };
const _hoisted_2 = { class: "card-header" };
const _hoisted_3 = { class: "card-box" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("main", _hoisted_1, [
    withDirectives(createVNode(_component_el_card, { shadow: "always" }, {
      header: withCtx(() => [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("span", null, toDisplayString(_ctx.typeName || "-"), 1)
        ])
      ]),
      default: withCtx(() => [
        withDirectives(createBaseVNode("div", _hoisted_3, [
          (openBlock(), createBlock(resolveDynamicComponent(_ctx.type), {
            onOff: _ctx.onOff,
            data: _ctx.data,
            onOnOffHandle: _ctx.onOffHandle
          }, null, 40, ["onOff", "data", "onOnOffHandle"]))
        ], 512), [
          [vShow, _ctx.visible]
        ])
      ]),
      _: 1
    }, 512), [
      [vShow, _ctx.type !== "Default"]
    ])
  ]);
}
_sfc_main.__hmrId = "1a99ec7a";
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.accept(({ default: updated, _rerender_only }) => {
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
var Content = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1a99ec7a"], ["__file", "/Users/kingking/king/work/kk-ext-secret/src/content/Content.vue"]]);

export { Content as default };
