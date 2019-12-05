const env = process.env.NODE_ENV

let MYSQL_CONF

if(env === 'dev'){
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'jimson_6632',
    port: '3306',
    database: 'myblog'
  }
}
if(env === 'production') {
  MYSQL_CONF = {

  }
}

module.exports = {
  MYSQL_CONF
}
