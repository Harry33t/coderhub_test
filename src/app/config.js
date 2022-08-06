const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')
dotenv.config() //将.env文件的配置信息写入环境变量中

console.log(process.env.APP_PORT);

// const {APP_PORT} = process.env

const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname,'./keys/private.key'))
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname,'./keys/public.key'))

module.exports = {
  APP_PORT,
  APP_HOST,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = process.env //这个类似连等了,先从process.env解构出来,在导出

module.exports.PRIVATE_KEY = PRIVATE_KEY
module.exports.PUBLIC_KEY = PUBLIC_KEY