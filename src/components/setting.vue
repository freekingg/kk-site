<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
const win: any = window;
defineProps<{ msg: string }>();
const formInline = reactive({
  path: "",
});

onMounted(async () => {
  const chromeDir = await win.electronAPI.dbFindOne({ name: "chromePath" });
  if (chromeDir) {
    formInline.path = chromeDir.value;
  }
});

const getPath = () => {
  // win.electronAPI.openDirectory("openDirectory");
};

const loading = ref(false);

const onSubmit = () => {
  if (!formInline.path) {
    ElMessage.error("请输入浏览器路径.");
    return;
  }
  win.electronAPI
    .dbUpdateOne({ name: "chromePath" },{ name: "chromePath", value: formInline.path })
    .then((result: any) => {
      console.log("dbUpdateOne: ", result);
      ElMessage.success("保存成功.");
    })
    .catch((err: any) => {
      console.log("dbUpdateOne: ", err);
      ElMessage.error("保存失败.");
    });
};
</script>

<template>
  <h1>配置</h1>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="浏览器路径">
      <el-input
        v-model="formInline.path"
        @click="getPath"
        placeholder="请输入浏览器路径"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :loading="loading"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
  <p class="box">
    1、打开chrome 浏览器 <br />
    2、输入 chrome://version/ <br />
    3、把 可执行文件路径 复制到此处保存 <br />
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
.box {
  width: 100%;
  text-align: left;
}
.demo-form-inline {
  width: 400px;
  padding-left: 30px;
}
</style>
