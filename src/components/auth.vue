<script setup lang="ts">
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Config from "../config/index";
import Api from "../api/index";
const win: any = window;
defineProps<{ msg: string }>();
const chromePath = ref("");

const formInline = reactive({
  account: "",
});

const tableData: any = ref([]);
const loading = ref(false);

const getInfoHandle = async () => {
  if (!formInline.account) {
    ElMessage.error("请输入卡编号.");
    return;
  }

  const params = {
    a: formInline.account,
  };

  try {
    const result = await Api.getInfo(params);
    if (result.data && result.data.code === 0) {
      let info = result.data.data;
      if (info) {
        ElMessageBox.confirm("此帐号已经验证过,是否再次重新验证？", "Warning", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }).then(() => {
          const params = {
            account: formInline.account,
            uname: info.uname,
            pwd: info.pwd,
            status: 3,
            type: info.type || 25,
            upi: info.upi || '',
          };
          tableData.value.unshift(params);
          formInline.account = "";
        });
      } else {
        const params = {
          account: formInline.account,
          uname: info.uname,
          pwd: info.pwd,
          status: 3,
          type: info.type,
        };
        tableData.value.unshift(params);
        formInline.account = "";
      }
     
    } else {
      ElMessage.error(`${result.data.msg}`);
    }
  } catch (err: any) {
    ElMessage.error(`请求出错 ${err.message}`);
    console.log("err: ", err);
  }
};

const authHandle = (data: any) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      chromePath: chromePath.value,
      url: Config.websiteUrl[data.type],
      account: data.account,
      type: data.type,
    };

    try {
      let result = await axios({
        method: "post",
        url: `${Config.serverUrl}/auth`,
        data: params,
      });
      loading.value = false;
      if (result.data.status) {
        resolve(result.data);
      } else {
        reject(result.data.error);
      }
    } catch (error) {
      loading.value = false;
      console.log("err: ", params.account, error);
      reject(error);
    }
  });
};

const onSubmit = async (row: any) => {
  console.log('row: ', row);
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

  const params = {
    account: row.account,
    type: row.type,
    upi: row.upi,
  };

  try {
    const result: any = await authHandle(params);
    let cookie = ''
    if(row.type == 32){
      let target = result.cookies.find(item => item.name == 'app_fc')
      cookie = `app_fc=${target.value}`
    }else{
      cookie = JSON.stringify(result.cookies)
    }
    // 验证成功，上传信息
    Api.updateInfo({
      a: result.account,
      c: cookie,
    })
      .then((result) => {
        console.log("result: ", result);
        if (result.data) {
          if (result.data.code == 0) {
            ElMessage.success(`${row.account} 验证成功.`);
            let index = tableData.value.findIndex(
              (item: any) => item.account === row.account
            );
            if (index != -1) {
              tableData.value[index].status = 1;
            }
          } else {
            ElMessage.error(`${row.account} 验证失败 ${result.data.msg || ''}`);
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
        console.log('err: ', err);
        ElMessage.error(`${row.account} 同步失败.${err.message}`);
      });
  } catch (err: any) {
    console.log("err: ", err);
    ElMessage.error(`${row.account} 验证失败.${err.message || ''}`);
    let index = tableData.value.findIndex(
      (item: any) => item.account === row.account
    );
    if (index != -1) {
      tableData.value[index].status = 2;
    }
  }
};
</script>

<template>
  <h1>验证账号</h1>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="卡编号">
      <el-input v-model="formInline.account" placeholder="请输入卡编号" />
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
      <el-table-column prop="uname" label="帐号" width="125" />
      <el-table-column prop="pwd" label="密码" width="125" />
      <el-table-column prop="upi" label="upi" width="150" />
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
