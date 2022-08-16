const httpProxy = require('http-proxy')
const http = require('http')
const proxy = httpProxy.createProxyServer({}) // See (†)

const server = http.createServer(function (req, res) {
// 代理的地址
  const url = 'https://down.51miz.com/'
  // 将请求素材网站的referer替换为同域名
  req.headers.referer = url
  delete req.headers.host
  proxy.web(req, res, { target: url })
})
proxy.on('error', function (e) {
  console.log(e)
})
server.listen(3001)
