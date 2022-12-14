const connection = require('../app/database')

class AuthService{
  async checkResource(tableName,id,userId){
    // console.log(momentId,userId);
    
    const statement = `SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;`
    const [result] = await connection.execute(statement,[id,userId])
    // console.log(result);
    return result.length === 0 ? false:true;

  }
}

module.exports = new AuthService()