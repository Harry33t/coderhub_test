const path = require('path')

const Multer = require('koa-multer')
const Jimp = require('jimp')

const {AVATAR_PATH,PICTURE_PATH} = require('../constants/file-path')

const avatarUpload = Multer({
  dest : AVATAR_PATH
})

const pictureUpload = Multer({
  dest: PICTURE_PATH
});

const avatarHandler = avatarUpload.single('avatar')
const pictureHandler = pictureUpload.array('picture', 9);

const pictrueResize = async (ctx,next) => {
  //1.获取所有图像信息
  const files = ctx.req.files

  //2.对图像进行处理(sharp第三方库) sharp(path).resize 但是这个sharp比较大
    //我们使用jimp 这个会小一点

  
  for(let file of files){
    const destPath = path.join(file.destination,file.filename)
    // Jimp.read(file.path) //返回promise
    
    //使其阻塞用async await 但是图片处理很耗费时间

    Jimp.read(file.path).then(image => {
      image.resize(1280,Jimp.AUTO).write(`${destPath}-large`)            //根据宽度自动调整高度
      image.resize(640,Jimp.AUTO).write(`${destPath}-middle`)
      image.resize(320,Jimp.AUTO).write(`${destPath}-small`)
    })
  }

  await next() 
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictrueResize 
}