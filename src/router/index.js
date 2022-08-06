const fs = require('fs')

const useRoutes = (app) => {
  //返回的结果其实是个数组,
  fs.readdirSync(__dirname) .forEach(file => {
    if(file === 'index.js')return;
    const router = require(`./${file}`) //动态遍历文件
    app.use(router.routes())
    app.use(router.allowedMethods())
  })

}
module.exports = useRoutes