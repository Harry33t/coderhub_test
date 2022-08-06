const fileservice = require('../service/file.service')
const userService = require('../service/user.service')
const {AVATAR_PATH} = require('../constants/file-path')
const {APP_HOST,APP_PORT} = require('../app/config')

class FileController{
  async saveAvatarInfo(ctx,next){
    //1.获取图形相关信息
    // console.log(ctx.req.file);
    const {mimetype,filename,size} = ctx.req.file;
    const {id} = ctx.user
    //2.将图像信息数据保存到数据库中
    const result = await fileservice.createAvatar(filename,mimetype,size,id)
    //3.将图片地址保存到user表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
    await userService.updateAvatarUrlById(avatarUrl,id)

    //4.返回结果
    ctx.body = '用户上传头像成功~'
  }

  async savePictureInfo(ctx,next){
    
    //1.获取头像信息
    const files = ctx.req.files
    const {id} = ctx.user;
    const {momentId} = ctx.query;

    //2.将所有的文件信息保存到数据库中
    for(let file of files){
      const {mimetype,filename,size} = file;
      // console.log(mimetype,filename,size);
      await fileservice.createFile(filename,mimetype,size,id,momentId)
    }

    ctx.body = '动态上传完成~'
  }
}

module.exports = new FileController()

