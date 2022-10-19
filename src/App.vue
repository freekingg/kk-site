<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import Auth from "./components/auth.vue";
import Records from "./components/records.vue";
import Setting from "./components/setting.vue";
const win: any = window;
const chromePath = ref('');
onMounted(() => {
  const chromeDir = win.electronAPI.storeGetItem('chromePath');
  if(chromeDir){
    chromePath.value = chromeDir;
  }
});
</script>

<template>
  <el-tabs tab-position="left" class="demo-tabs">
    <el-tab-pane label="验证">
      <div class="logo-box">
        <img class="logo vite" src="./assets/vite.svg" />
      </div>
      <Auth :chromePath="chromePath" msg="账号验证" />
    </el-tab-pane>
    <el-tab-pane label="查询">
      <div class="logo-box">
        <img class="logo vite" src="./assets/vite.svg" />
      </div>
      <Records :chromePath="chromePath" msg="流水查询" />
    </el-tab-pane>
    <el-tab-pane label="配置">
      <div class="logo-box">
        <img class="logo vite" src="./assets/vite.svg" />
      </div>
      <Setting :chromePath="chromePath" msg="配置" />
    </el-tab-pane>
    <el-tab-pane label="日志">Task</el-tab-pane>
  </el-tabs>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}

.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
}

.static-public code {
  background-color: #eee;
  padding: 2px 4px;
  margin: 0 4px;
  border-radius: 4px;
  color: #304455;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
