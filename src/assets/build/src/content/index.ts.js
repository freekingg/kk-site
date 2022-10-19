import '../../vendor/deps/vue.js';
import './style.css.js';
import Content from './Content.vue.js';
import element_plus_default from '../../vendor/deps/element-plus.js';
import '../../node_modules/element-plus/dist/index.css.js';
import { createApp } from '../../vendor/deps/chunk-JFXHU74D.js';

console.info("chrome-ext template-vue-ts content script");
let mountEl = document.createElement("div");
mountEl.setAttribute("id", "kkapp");
document.body.appendChild(mountEl);
const vm = createApp(Content).use(element_plus_default).mount(mountEl);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  vm.onMessage(request);
  sendResponse("\u6211\u662Fcontent,\u6211\u6536\u5230\u4F60\u7684\u6D88\u606F\u4E86\uFF1A" + JSON.stringify("request"));
});
window.addEventListener("message", function(e) {
  if (e.data) {
    vm.onMessage(e.data);
  }
});
const extWinMoveHandle = () => {
  function handleMouseDown(e) {
    let box2 = document.getElementById("kkapp");
    let disx = e.pageX - box2.offsetLeft;
    let disy = e.pageY - box2.offsetTop;
    document.onmousemove = function(e2) {
      let x, y;
      if (e2.pageX - disx > 0) {
        if (e2.pageX - disx > document.documentElement.clientWidth - 60) {
          x = document.documentElement.clientWidth - 60;
        } else {
          x = e2.pageX - disx;
        }
      } else {
        x = 0;
      }
      if (e2.pageY - disy > 0) {
        if (e2.pageY - disy > document.documentElement.clientHeight - 60) {
          y = document.documentElement.clientHeight - 60;
        } else {
          y = e2.pageY - disy;
        }
      } else {
        y = 0;
      }
      box2.style.left = x + "px";
      box2.style.top = y + "px";
      box2.style.right = "auto";
    };
  }
  function handleMouseUp() {
    document.onmousemove = document.onmouseup = null;
  }
  let box = document.querySelector("#kkapp .el-card__header");
  box.addEventListener("mousedown", handleMouseDown);
  box.addEventListener("mouseup", handleMouseUp);
};
extWinMoveHandle();
