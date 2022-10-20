// datastore.js
import Datastore from "nedb";
import path from "path";
import { app } from "electron";
const DB = new Datastore({
  autoload: true,
  // 指定数据库文件路径
  filename: path.join(app.getPath("userData"), "/data.db"),
});
console.log(path.join(app.getPath("userData"), "/data.db"));
const findAll = (query: any) => {
  return new Promise((resolve, reject) => {
    DB.find(query, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

const findOne = (query: any) => {
  return new Promise((resolve, reject) => {
    DB.findOne(query, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

const insert = (query: any) => {
  return new Promise((resolve, reject) => {
    DB.insert(query, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

const updateOne = (query: any, data: any) => {
  return new Promise((resolve, reject) => {
    DB.update(query, data,{upsert:true},(err,doc)=>{
      resolve(doc)
    })
  })
}

export default {
  findAll,findOne, insert, updateOne
};
