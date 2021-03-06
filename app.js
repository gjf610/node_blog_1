const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// session 数据
const SESSION_DATA = {}

const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (7*24*60*60*1000))
  return d.toGMTString()
}

//用于处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if(req.method !== 'POST'){
      resolve({})
      return
    }

    if(req.headers['content-type'] !== 'application/json'){
      resolve({})
      return
    }

    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })

    req.on('end', () => {
      if(!postData){
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}

const serverHandle = (req, res) => {
  // 设置返回格式JSON
  res.setHeader('Content-type', 'application/json')

  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析query
  req.query = querystring.parse(url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(!item){
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim(), val = arr[1]
    req.cookie[key] = val
  })

  // 解析 sesion
  let needSetCookie = false
  let userId = req.cookie.userid
  if(userId){
    if(!SESSION_DATA[userId]){
      SESSION_DATA[userId] = {}
    }
  }else{
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]

  // 处理post data
  getPostData(req).then(postData=>{
    req.body = postData

    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res)
    if(blogResult){
      blogResult.then(blogData => {
        if(needSetCookie){
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData))
      })
      return
    }

    // 处理user路由
    // const userData = handleUserRouter(req, res)
    // if(userData){
    //   res.end(JSON.stringify(userData))
    //   return
    // }
    const userResult = handleUserRouter(req, res)
    if(userResult){
      if(needSetCookie){
        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
      }
      userResult.then(userData => {
        res.end(JSON.stringify(userData))
      })
      return
    }


    // 未命中路由， 返回404
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
  })


}


module.exports = serverHandle
