const jwt = require('jsonwebtoken')

const errorType = require('../constants/error-types')
const userService = require('../service/user.service');
const authService = require('../service/auth.service')


const md5password = require('../utils/password-handle')
const {PUBLIC_KEY} = require('../app/config');

/**
 * 
 * 1.很多内容都需要验证权限:修改/删除动态,修改/删除评论
 * 2.接口:业务接口/后台管理系统(权限验证非常重要)
 *  一对一:user -> role 角色关系
 *  多对多: role -> menu(删除动态/修改动态)
 * 
 */
const verifyLogin = async(ctx,next) => {
  //拿到用户名以及密码
  let {name,password} = ctx.request.body

  //2.判断用户名和密码是否为空  
  if(!name || !password || name === '' || password === ''){
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error',error,ctx) 
  }

  //3.判断用户是否存在(用户不存在)
  const result = await userService.getUserByName(name)
  const user = result[0]
  if(!user){
    const error = new Error(errorType.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error',error,ctx) 
  }
  //4.判断密码是否和数据库中的密码是否一致(加密)
  if(md5password(password) !== user.password){
    const error = new Error(errorType.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error',error,ctx)
  }

  ctx.user = user;

  await next() //接着执行后面的中间件
}

const verifyAuth = async(ctx,next) => {
  console.log('验证授权的middleware~');

  //1. 获取token
  const authorization = ctx.headers.authorization

  if(!authorization){ //处理空的情况
    const error = new Error(errorType.UNAUTHORIZATION)
    return ctx.app.emit('error',error,ctx)
  }

  const token = authorization.replace('Bearer ','')
  //2. 验证token (id/name/iat//exp)
  try{
    const result = jwt.verify(token,PUBLIC_KEY,{
      algorithms:["RS256"]
    })
    ctx.user = result
    await next() //通过了调用next

  }catch(err){
    const error = new Error(errorType.UNAUTHORIZATION)
    ctx.app.emit('error',error,ctx)
  }
}

const verifyPermission = async (ctx,next) => {
  // 
  console.log('验证权限的middleware,premission~');
  //{commentId:'1'} 拿到comment

  //1.获取参数
  const [resourceKey] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id','')
  const resourceId = ctx.params[resourceKey];
  const {id} = ctx.user;
  
  
  
  
  

  //2.查询是否具备权限
  try {
    const isPermission = await authService.checkResource(tableName,resourceId,id)
    if(!isPermission){
      throw new Error()  //抛出异常在catch捕获
    }

    await next()
  } catch (err) {
    const error = new Error(errorType.UNPERMISSION)
    return ctx.app.emit('error',error,ctx)
  }
}


module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}