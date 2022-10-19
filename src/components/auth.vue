<script setup lang="ts">
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import Config from "../config/index";
const win: any = window;
const props = defineProps<{ msg: string; chromePath: string }>();
const chromePath = ref("");
const authHandle = (params: any) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: `${Config.serverUrl}/auth`,
      data: {
        chromePath: chromePath.value,
        url: "https://www.amazon.in/",
        account: params.account,
      },
    })
      .then((result) => {
        loading.value = false;
        console.log("result: ", params.account, result);
        resolve(result.data);
      })
      .catch((err) => {
        loading.value = false;
        console.log("err: ", params.account, err);
        reject(err);
      });
  });
};

const formInline = reactive({
  account: "",
  website: "amazon",
});

const tableData: any = ref([]);
const loading = ref(false);

const onSubmit = () => {
  if (!formInline.account) {
    ElMessage.error("请输入账号.");
    return;
  }
  const chromeDir = win.electronAPI.storeGetItem("chromePath");
    if (chromeDir) {
      chromePath.value = chromeDir;
    }else{
      ElMessage.error('请在设置中配置浏览器路径');
      return
    }

  tableData.value.push({ account: formInline.account, status: 0 });
  let params = JSON.parse(
    JSON.stringify({ account: formInline.account, status: 1 })
  );

  formInline.account = "";

  authHandle(params)
    .then((result: any) => {
      axios({
        method: "post",
        url: Config.apiUrl.create,
        data: {
          a: result.account,
          c: JSON.stringify(result.cookies),
        },
      })
        .then((result) => {
          console.log("result: ", result);
          if (result.data) {
            if (result.data.code == 0) {
              ElMessage.success(`${params.account} 同步成功.`);
              ElMessage.success(`${params.account} 验证成功.`);
              let index = tableData.value.findIndex(
                (item: any) => item.account === params.account
              );
              if (index != -1) {
                tableData.value[index].status = 1;
              }
            } else {
              ElMessage.error(`${params.account} 同步失败 ${result.data.msg}`);
              ElMessage.success(`${params.account} 验证失败.`);
              let index = tableData.value.findIndex(
                (item: any) => item.account === params.account
              );
              if (index != -1) {
                tableData.value[index].status = 2;
              }
            }
          }
        })
        .catch((err) => {
          ElMessage.error(`${params.account} 同步失败.`);
        });
    })
    .catch((err) => {
      ElMessage.error(`${params.account} 验证失败.`);
      let index = tableData.value.findIndex(
        (item: any) => item.account === params.account
      );
      if (index != -1) {
        tableData.value[index].status = 2;
      }
    });
};
</script>

<template>
  <h1>{{ msg }}</h1>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="帐号">
      <el-input v-model="formInline.account" placeholder="请输入帐号" />
    </el-form-item>
    <el-form-item label="网站">
      <el-select v-model="formInline.website" placeholder="请选择网站">
        <el-option label="Amazon" value="amazon" />
        <!-- <el-option label="Freecharge" value="freecharge" /> -->
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="onSubmit"
        >验证</el-button
      >
    </el-form-item>
  </el-form>
  <p>记录<br /></p>
  <div class="box">
    <el-table :data="tableData" border style="width: 600px">
      <el-table-column prop="account" label="帐号" width="300" />
      <el-table-column label="状态" width="300">
        <template #default="scope">
          <el-button
            type="info"
            v-if="scope.row.status == 0"
            :loading="scope.row.status == 0"
            >验证中</el-button
          >
          <el-button type="primary" v-if="scope.row.status == 1"
            >成功</el-button
          >
          <el-button v-if="scope.row.status == 2">失败</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
  display: flex;
  justify-content: center;
}
</style>
