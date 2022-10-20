<script setup lang="ts">
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import Config from "../config/index";
const win: any = window;
const chromePath = ref("");

const formInline = reactive({
  account: "",
  website: "amazon",
});

const tableData: any = ref([]);
const loading = ref(false);

</script>

<template>
  <p class="box">
    <h1>查询</h1>
    1、输入帐号,类型 <br />
    2、点击查询 <br />
    3、可直接打开网站进行查询 <br />
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
</style>
