<script setup lang="ts">
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import Config from "../config/index";
import Api from "../api/index";
const win: any = window;
const chromePath = ref("");
const getInfo = () => {
  return new Promise((resolve, reject) => {
    Api.getInfo({
      a: formInline.account,
    })
      .then((result) => {
          if (result.data && result.data.code == 0) {
            let info = result.data.data;
            if (info && info.c) {
              resolve(info.c);
            } else {
              ElMessage.error(`此卡编号还未验证，请先去验证`);
              reject();
            }
          } else {
            ElMessage.error(`${formInline.account} ${result.data.msg}`);
            reject();
          }
      })
      .catch((err) => {
        console.log("err: ", err);
        ElMessage.error("接口出错");
        reject();
      });
  });
};

const authHandle = (cookie: any) => {
  // const cookie = [
  //   {
  //     name: "session-id-time",
  //     value: "2082758401l",
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683119.576567,
  //     size: 26,
  //     httpOnly: false,
  //     secure: false,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "csm-hit",
  //     value:
  //       "tb:DSXEZKAADY5DQNAZ5858+s-A5MES54WVP36CYY3JDVW|1666147119438&t:1666147119438&adb:adblk_no",
  //     domain: "www.amazon.in",
  //     path: "/",
  //     expires: 1696387119,
  //     size: 96,
  //     httpOnly: false,
  //     secure: false,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "i18n-prefs",
  //     value: "INR",
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683116.507296,
  //     size: 13,
  //     httpOnly: false,
  //     secure: false,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "sess-at-acbin",
  //     value: '"cpRvFtiqFyzWAKyBO01oUnvHQqiptkMsx/xsTuWA3eM="',
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683106.84682,
  //     size: 59,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "x-acbin",
  //     value:
  //       '"RsICtmX1UVBpPYImntcm?u@Xuft9cskCwH4fkp4BKK10ATmNx6H5mqcXA0Q?g3TW"',
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683116.507256,
  //     size: 73,
  //     httpOnly: false,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "sst-acbin",
  //     value:
  //       "Sst1|PQHb1GF_GMWqRsurhz4yTw7OCZ5qrSOIcYSIeXEbKqnL6CcX1Bupxxc-4XdqxTdEZ15oJEYN7Du-iUt4QJwpglmo2uiz-5aySCyMZfytKNGWLcyqc5Mt9bc0v8prpAH6pi3xiPPUxP6B_-8fMdRC-ve5AdoWEt1AOsbBFK-BsQXpshnRDQ6gYxTskTlEnx8WCYztmMEHAeMXsXOZO9miNedPsO6KTthQiIKhBLVbGVMUfrYxSEnZFnu67yjwsqTf1E9n-tC_t3_R4YavB8qneG5LHaW9ZyOUTSQn6DEzB95Y9fk",
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683106.846832,
  //     size: 317,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "at-acbin",
  //     value:
  //       "Atza|IwEBIJxmIXOWDuWF_l_U78dumPJnYOACrZQPjN-YpHDidJKxRZxW8fQN-50pajnqvVFZnTKB14WOjsYQMiCXUB22kQz0pRuk0JzCxUat6gaX7ksR8u_v46LMa6eOj1y-Ewdhqe7c4Lyfsc-ST6LoNC2FjLa4QpgT-dDS9fdQIA1vE7HkeCZ1YMeR3y82cKBF0iyjwlEC1oMGGR7TLxUt-WIdQ1BW8MvHw54CAqvEriaVWkwwoQ",
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683106.846799,
  //     size: 255,
  //     httpOnly: true,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "session-token",
  //     value:
  //       "lvL9jX1YDJEpOeibSk/LsG6SvS1p4Roo0rr+z/V7HRUvAh40q/b45ifS1D97KYX51lQZhe0ex12c+so4LbrOVhYKk+hZraLTyc96L7l8cdrMhe+HsifPNQZtOqy4ZrI198zI4q46xpRGpQSs/99yGj0nizz+S+9OABVwpaDzSzQC0RILaBPrhoNVHv5+60NZG8Y86XR+F/iTqWFc3NWEgF1grxxfcvGeOnmWVVbeUo1XEndqPtTmS/bKafV6tyVP",
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683116.50712,
  //     size: 269,
  //     httpOnly: false,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "ubid-acbin",
  //     value: "259-0844708-9804316",
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683119.576497,
  //     size: 29,
  //     httpOnly: false,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  //   {
  //     name: "session-id",
  //     value: "261-6242719-0659562",
  //     domain: ".amazon.in",
  //     path: "/",
  //     expires: 1697683119.576604,
  //     size: 29,
  //     httpOnly: false,
  //     secure: true,
  //     session: false,
  //     sameParty: false,
  //     sourceScheme: "Secure",
  //     sourcePort: 443,
  //   },
  // ];
  let cookies = JSON.parse(cookie);
  axios({
    method: "post",
    url: `${Config.serverUrl}/records`,
    data: {
      chromePath: chromePath.value,
      url: "https://www.amazon.in/",
      account: formInline.account,
      cookie: cookies,
    },
  })
    .then((result) => {
      console.log("result: ", result);
      loading.value = false;
    })
    .catch((err) => {
      console.log("err: ", err);
      loading.value = false;
    });
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
  getInfo()
    .then((cookie) => {
      authHandle(cookie);
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};
</script>

<template>
  <h1>查询流水</h1>
  <div class="demo-form-inline">
    <el-form :inline="false" :model="formInline" label-width="60px" class="form">
      <el-form-item label="卡编号">
        <el-input v-model="formInline.account" placeholder="请输入帐号" />
      </el-form-item>
      <el-form-item label="网站">
        <el-select v-model="formInline.website" placeholder="请选择网站">
          <el-option label="Amazon" value="amazon" />
          <!-- <el-option label="Freecharge" value="freecharge" /> -->
        </el-select>
      </el-form-item>
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
