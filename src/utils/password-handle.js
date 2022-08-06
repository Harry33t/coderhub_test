const crypto = require('crypto') //自带的库

const md5password = (password) => {
  const md5 = crypto.createHash('md5');
  const result = md5.update(password).digest('hex') //最终拿到的结果是16进制的结果 如果不digest(hex)返回的是buffer
  return result

}

module.exports = md5password