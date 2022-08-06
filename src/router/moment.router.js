const Router = require('koa-router')

const momentRouter = new Router({prefix:'/moment'})

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo
} = require('../controller/moment.controller')
const { 
  verifyAuth, 
  verifyPermission
} = require('../middleware/auth.middleware')

const {
  verifyLabelExists
} = require('../middleware/label.middleware')

momentRouter.post('/',verifyAuth,create)
momentRouter.get('/:momentId',detail)
//也应该包含评论的相关信息
momentRouter.get('/',list)

//1.用户必须登录 2.用户具备权限
momentRouter.patch('/:momentId',verifyAuth,verifyPermission,update)
momentRouter.delete('/:momentId',verifyAuth,verifyPermission,remove)

//给动态添加标签
momentRouter.post('/:momentId/labels',verifyAuth,verifyPermission,verifyLabelExists,addLabels)
//动态配图服务
momentRouter.get('/image/:filename',fileInfo)


module.exports = momentRouter