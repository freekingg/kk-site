import { createHotContext } from '../../../node_modules/vite/dist/client/client.mjs.js';
import '../../../vendor/deps/vue.js';
import { ElIcon, ElMessage, ElMessageBox } from '../../../vendor/deps/element-plus.js';
import '../../../vendor/deps/element-plus_icons-vue.js';
import useStorage from '../useStorage.ts.js';
import './AxisbankPrime.vue.style.0.js';
import _export_sfc from '../../../plugin-vue-export-helper.js';
import { defineComponent, ref, reactive, watch, onMounted, toRefs, pushScopeId, popScopeId, createTextVNode, resolveComponent, openBlock, createElementBlock, createBaseVNode, createCommentVNode, createVNode, withCtx, Fragment, renderList, createBlock, toDisplayString } from '../../../vendor/deps/chunk-JFXHU74D.js';
import { question_filled_default } from '../../../vendor/deps/chunk-AMW2O4TU.js';

import.meta.hot = createHotContext("/src/content/components/AxisbankPrime.vue.js");let timer = null;
let cutDownNumTimer = null;
const _sfc_main = defineComponent({
  components: { QuestionFilled: question_filled_default, ElIcon },
  props: {
    onOff: Boolean,
    data: String
  },
  emits: ["onOffHandle"],
  setup(props, ctx) {
    const cutDownNum = ref(30);
    const settingVisible = ref(false);
    const runGifSrc = ref(chrome.runtime.getURL("img/runing.gif"));
    const state = reactive({
      currentTab: null
    });
    const { setSyncStorage, getSyncStorage } = useStorage();
    const ruleFormRef = ref();
    const ruleForm = reactive({
      account: "",
      website: "amazon",
      reportUrl: "",
      secret: ""
    });
    const options = ref([
      {
        value: "amazon",
        label: "Amazon"
      },
      {
        value: "freecharge",
        label: "Freecharge"
      }
    ]);
    const rules = reactive({
      account: [{ required: true, message: "Please input ...", trigger: "blur" }],
      website: [{ required: true, message: "Please input ...", trigger: "blur" }],
      reportUrl: [{ required: true, message: "Please input ...", trigger: "blur" }],
      secret: [{ required: true, message: "Please input ...", trigger: "blur" }]
    });
    watch(() => props.onOff, (newValue) => {
      if (props.data && newValue) {
        let params = JSON.parse(props.data);
        if (!params || params.ser !== "STDWGO") {
          ElMessage({
            message: "[\u542F\u52A8\u5931\u8D25]\uFF1A\u8BF7\u4E0B\u8F7D\u4E00\u6B21\u6D41\u6C34\u64CD\u4F5C.",
            type: "error"
          });
          ctx.emit("onOffHandle", false);
          clearTimeout(timer);
          clearInterval(cutDownNumTimer);
        } else {
          ElMessage({
            message: "[\u4EFB\u52A1\u6267\u884C\u6210\u529F].",
            type: "success"
          });
          download();
        }
      } else if (!newValue) {
        ElMessage({
          message: "[\u4EFB\u52A1\u5DF2\u7ECF\u5173\u95ED].",
          type: "info"
        });
        clearTimeout(timer);
        clearInterval(cutDownNumTimer);
      } else {
        ElMessage({
          message: "[\u542F\u52A8\u5931\u8D25]\uFF1A\u8BF7\u4E0B\u8F7D\u4E00\u6B21\u6D41\u6C34\u64CD\u4F5C.",
          type: "error"
        });
        clearTimeout(timer);
        clearInterval(cutDownNumTimer);
        ctx.emit("onOffHandle", false);
      }
    });
    const submitForm = async (formEl) => {
      if (!formEl)
        return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log("submit!");
          setSyncStorage(ruleForm);
        } else {
          console.log("error submit!", fields);
        }
      });
    };
    const checkOverlay = () => {
      let hasOverlay = document.querySelector(".cdk-global-overlay-wrapper .cdk-overlay-pane.mx-session-popup-class");
      if (hasOverlay) {
        let jxbtn = document.querySelector(".cdk-global-overlay-wrapper .mat-raised-button.mat-warn");
        console.log("\u53D1\u73B0\u8D85\u65F6\u7EE7\u7EED\u6309\u94AE", jxbtn);
        if (jxbtn) {
          jxbtn.click();
        }
      }
      let hasOverlay2 = document.querySelector(".mat-dialog-container.ng-trigger-dialogContainer");
      if (hasOverlay2) {
        let jxbtn2 = document.querySelector(".mat-dialog-container.ng-trigger-dialogContainer .mat-raised-button.mat-warn");
        console.log("\u53D1\u73B0\u8D85\u65F6\u7EE7\u7EED\u6309\u94AE2", jxbtn2);
        if (jxbtn2) {
          jxbtn2.click();
        }
      }
    };
    const download = () => {
      let xxsrftoken = getCookie("XSRF-TOKEN");
      if (!xxsrftoken || !props.onOff)
        return;
      let parseProps = JSON.parse(props.data);
      console.log("parseProps: ", parseProps);
      function add(n) {
        if (n <= 9) {
          return `0${n}`;
        }
        return n;
      }
      var myDate = new Date();
      var myYear = myDate.getFullYear();
      var myMonth = add(myDate.getMonth() + 1);
      var myToday = add(myDate.getDate());
      var myToday1 = "03";
      var myToday2 = "09";
      let body = `fromdate=${parseProps.fromdate}&todate=${parseProps.todate}&month=&year=&selectedValue=0&accNumber=${parseProps.accNumber}&docType=3&data=0&referenceId=${parseProps.data.referenceId}&ser=STDWGO&app=OC&mxrs=2000`;
      console.log("body: ", body);
      fetch("https://omni.axisbank.co.in/wsprod/mib/servlets/report", {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "text/plain",
          "sec-fetch-site": "same-origin",
          "X-XSRF-TOKEN": `${xxsrftoken}`
        },
        referrer: "https://omni.axisbank.co.in/axisretailbanking/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body,
        method: "POST",
        mode: "cors",
        credentials: "include"
      }).then((res) => {
        return res.blob();
      }).then((res) => {
        const a = document.createElement("a");
        const body2 = document.querySelector("body");
        a.download = "axisDownloadName.csv";
        a.href = window.URL.createObjectURL(res);
        a.style.display = "none";
        body2.appendChild(a);
        a.click();
        body2.removeChild(a);
        window.URL.revokeObjectURL(a.href);
        clearTimeout(timer);
        clearInterval(cutDownNumTimer);
        cutDownNum.value = ruleForm.intervalTime;
        timer = setTimeout(() => {
          download();
        }, ruleForm.intervalTime * 1e3 || 3e4);
        cutDownNumTimer = setInterval(() => {
          cutDownNum.value--;
          checkOverlay();
          if (cutDownNum.value < 0) {
            clearInterval(cutDownNumTimer);
          }
        }, 1e3);
      }).catch((err) => {
        console.log("\u4E0B\u8F7D\u51FA\u9519: ", err);
        clearTimeout(timer);
        clearInterval(cutDownNumTimer);
        ElMessage({
          message: "[\u4E0B\u8F7D\u51FA\u9519]\uFF1A\u8BF7\u5237\u65B0\u6D4F\u89C8\u5668\u91CD\u65B0\u64CD\u4F5C.",
          type: "error"
        });
      });
    };
    const getCookie = (name) => {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    };
    const getSecret = (name) => {
      ElMessageBox.confirm("\u8BF7\u786E\u8BA4\u5DF2\u7ECF\u6210\u529F\u767B\u5F55\u7F51\u7AD9", "\u63D0\u9192", {
        confirmButtonText: "\u786E\u8BA4",
        cancelButtonText: "\u53D6\u6D88",
        type: "warning"
      }).then(() => {
        ruleForm.secret = document.cookie;
        ElMessage({
          type: "success",
          message: "\u83B7\u53D6\u6210\u529F"
        });
      });
    };
    const resetForm = (formEl) => {
      if (!formEl)
        return;
      formEl.resetFields();
    };
    const settingVisibleHandle = () => {
      settingVisible.value = !settingVisible.value;
    };
    onMounted(async () => {
      let _intervalTime = await getSyncStorage("intervalTime");
      let _reportUrl = await getSyncStorage("reportUrl");
      ruleForm.intervalTime = _intervalTime || 30;
      ruleForm.reportUrl = _reportUrl || "";
    });
    return {
      settingVisible,
      settingVisibleHandle,
      runGifSrc,
      ruleFormRef,
      ruleForm,
      rules,
      cutDownNum,
      submitForm,
      getCookie,
      getSecret,
      resetForm,
      options,
      ...toRefs(state)
    };
  }
});
const _withScopeId = (n) => (pushScopeId("data-v-d122e210"), n = n(), popScopeId(), n);
const _hoisted_1 = { id: "kk-container" };
const _hoisted_2 = /* @__PURE__ */ createTextVNode("\u83B7\u53D6Cookie");
const _hoisted_3 = /* @__PURE__ */ createTextVNode("\u4E0A\u4F20Cookie");
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_el_input = resolveComponent("el-input");
  const _component_el_form_item = resolveComponent("el-form-item");
  const _component_el_radio = resolveComponent("el-radio");
  const _component_el_radio_group = resolveComponent("el-radio-group");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_form = resolveComponent("el-form");
  return openBlock(), createElementBlock("main", _hoisted_1, [
    createBaseVNode("section", null, [
      createCommentVNode(' <el-alert title="\u914D\u7F6E" type="info" center show-icon /> '),
      createVNode(_component_el_form, {
        ref: "ruleFormRef",
        model: _ctx.ruleForm,
        rules: _ctx.rules,
        "label-width": "100px",
        class: "demo-ruleForm",
        "status-icon": ""
      }, {
        default: withCtx(() => [
          createVNode(_component_el_form_item, {
            label: "\u767B\u5F55\u8D26\u53F7",
            prop: "account"
          }, {
            default: withCtx(() => [
              createVNode(_component_el_input, {
                modelValue: _ctx.ruleForm.account,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.ruleForm.account = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          createVNode(_component_el_form_item, {
            label: "\u7F51\u7AD9",
            prop: "website"
          }, {
            default: withCtx(() => [
              createVNode(_component_el_radio_group, {
                modelValue: _ctx.ruleForm.website,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.ruleForm.website = $event)
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, (item) => {
                    return openBlock(), createBlock(_component_el_radio, {
                      key: item.value,
                      label: item.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["label"]);
                  }), 128))
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          }),
          createVNode(_component_el_form_item, {
            label: "\u4E0A\u62A5\u63A5\u53E3",
            prop: "reportUrl"
          }, {
            default: withCtx(() => [
              createVNode(_component_el_input, {
                modelValue: _ctx.ruleForm.reportUrl,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.ruleForm.reportUrl = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          createVNode(_component_el_form_item, { label: "Cookie" }, {
            default: withCtx(() => [
              createVNode(_component_el_input, {
                modelValue: _ctx.ruleForm.secret,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.ruleForm.secret = $event),
                type: "textarea",
                disabled: ""
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          createVNode(_component_el_form_item, null, {
            default: withCtx(() => [
              createVNode(_component_el_button, {
                type: "info",
                onClick: _cache[4] || (_cache[4] = ($event) => _ctx.getSecret(_ctx.ruleFormRef))
              }, {
                default: withCtx(() => [
                  _hoisted_2
                ]),
                _: 1
              }),
              createVNode(_component_el_button, {
                type: "primary",
                onClick: _cache[5] || (_cache[5] = ($event) => _ctx.submitForm(_ctx.ruleFormRef))
              }, {
                default: withCtx(() => [
                  _hoisted_3
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["model", "rules"])
    ])
  ]);
}
_sfc_main.__hmrId = "d122e210";
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.accept(({ default: updated, _rerender_only }) => {
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
var AxisbankPrime = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d122e210"], ["__file", "/Users/kingking/king/work/kk-ext-secret/src/content/components/AxisbankPrime.vue"]]);

export { AxisbankPrime as default };
