<script setup lang="ts">
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import Config from "../config/index";
import Api from "../api/index";
const win: any = window;
defineProps<{ msg: string }>();
const chromePath = ref("");
const getInfoHandle = () => {
  const params = {
    a: formInline.account,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Api.getInfo(params);
      if (result.data && result.data.code == 0) {
        let info = result.data.data;
        if (info) {
          resolve(info);
        } else {
          ElMessage.error(`此卡编号还未验证，请先去验证`);
          reject();
        }
      } else {
        ElMessage.error(`${formInline.account} ${result.data.msg}`);
        reject();
      }
    } catch (err: any) {
      console.log("err: ", err);
      ElMessage.error(`请求出错 ${err.message}`);
      reject();
    }
  });
};

const authHandle = async (data: any) => {

  let cookie = ''
    if(data.type == 32){
      cookie = data.c
    }else{
      cookie = JSON.parse(data.c)
    }

  const params = {
    chromePath: chromePath.value,
    url: Config.websiteUrl[data.type],
    account: data.account,
    cookie: cookie,
    type: data.type,
  };

  try {
    await axios({
      method: "post",
      url: `${Config.serverUrl}/records`,
      data: params,
    });
    loading.value = false;
  } catch (error) {
    console.log("err: ", error);
    loading.value = false;
  }
};

const formInline = reactive({
  account: "",
  website: "amazon",
});
const loading = ref(false);

const onSubmit = async () => {
  if (!formInline.account) {
    ElMessage.error("请输入卡编号.");
    return;
  }
  const chromeDir = await win.electronAPI.dbFindOne({ name: "chromePath" });
  if (chromeDir) {
    chromePath.value = chromeDir.value;
  } else {
    ElMessage.error("请在设置中配置浏览器路径");
    return;
  }
  loading.value = true;
  getInfoHandle().then((data: any) => {
    const params = {
      ...data
    };
    authHandle(params);
  }).catch(()=>{
    loading.value = false;
  })
};
</script>

<template>
  <h1>查询流水</h1>
  <div class="demo-form-inline">
    <el-form
      :inline="false"
      :model="formInline"
      label-width="60px"
      class="form"
    >
      <el-form-item label="卡编号">
        <el-input v-model="formInline.account" placeholder="请输入帐号" />
      </el-form-item>
      <!-- <el-form-item label="网站">
        <el-select v-model="formInline.website" placeholder="请选择网站">
          <el-option label="Amazon" value="amazon" />
          <el-option label="Freecharge" value="freecharge" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
  </div>

  <!-- <p>记录<br /></p> -->
</template>

<style scoped>
a {
  color: #42b983;
}
.demo-form-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  display: flex;
  justify-content: center;
}
</style>
