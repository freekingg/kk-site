
import axios from "axios";
import Config from "../config/index";

// 获取信息
const getInfo = (data:any)=>{
  return axios({
    method: "get",
    url: Config.apiUrl.base + '/admin/member/memberbankinfo/c',
    params: data,
  })
}

// 更新信息
const updateInfo = (data:any)=>{
  return axios({
    method: "post",
    url: Config.apiUrl.base + '/admin/member/memberbankinfo/c',
    data,
  })
}

export default { getInfo, updateInfo };