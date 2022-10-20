<script setup lang="ts">
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import Config from "../config/index";
import Api from "../api/index";
const win: any = window;
defineProps<{ msg: string; chromePath: string }>();
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

const getInfoHandle = async () => {
  if (!formInline.account) {
    ElMessage.error("请输入卡编号.");
    return;
  }

  Api.getInfo({
    a: formInline.account,
  })
    .then((result) => {
      if (result.data && result.data.code === 0) {
        let info = result.data.data;
        if (info) {
          let params = {
            account: formInline.account,
            uname: info.uname,
            pwd: info.pwd,
            status: 3,
          };
          tableData.value.unshift(params);
        }
      } else {
        ElMessage.error(`${result.data.msg}`);
      }

      formInline.account = "";
    })
    .catch((err) => {});
};

const onSubmit = async (row: any) => {
  if (!row.account) {
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

  authHandle({ account: row.account })
    .then((result: any) => {
      Api.updateInfo({
        a: result.account,
        c: JSON.stringify(result.cookies),
      })
        .then((result) => {
          console.log("result: ", result);
          if (result.data) {
            if (result.data.code == 0) {
              ElMessage.success(`${row.account} 同步成功.`);
              ElMessage.success(`${row.account} 验证成功.`);
              let index = tableData.value.findIndex(
                (item: any) => item.account === row.account
              );
              if (index != -1) {
                tableData.value[index].status = 1;
              }
            } else {
              ElMessage.error(`${row.account} 同步失败 ${result.data.msg}`);
              ElMessage.success(`${row.account} 验证失败.`);
              let index = tableData.value.findIndex(
                (item: any) => item.account === row.account
              );
              if (index != -1) {
                tableData.value[index].status = 2;
              }
            }
          }
        })
        .catch((err) => {
          ElMessage.error(`${row.account} 同步失败.`);
        });
    })
    .catch((err) => {
      ElMessage.error(`${row.account} 验证失败.`);
      let index = tableData.value.findIndex(
        (item: any) => item.account === row.account
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
    <el-form-item label="卡编号">
      <el-input v-model="formInline.account" placeholder="请输入卡编号" />
    </el-form-item>
    <el-form-item label="网站">
      <el-select v-model="formInline.website" placeholder="请选择网站">
        <el-option label="Amazon" value="amazon" />
        <!-- <el-option label="Freecharge" value="freecharge" /> -->
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="getInfoHandle"
        >获取</el-button
      >
    </el-form-item>
  </el-form>
  <p>记录<br /></p>
  <div class="box">
    <el-table :data="tableData" border style="width: 600px">
      <el-table-column prop="account" label="卡编号" width="100" />
      <el-table-column prop="uname" label="帐号" width="200" />
      <el-table-column prop="pwd" label="密码" width="200" />
      <el-table-column label="状态" width="100">
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
          <el-button
            v-if="scope.row.status == 3"
            type="primary"
            :loading="loading"
            @click="onSubmit(scope.row)"
            >验证</el-button
          >
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
