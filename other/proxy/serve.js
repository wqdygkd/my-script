const net = require('net')

net.createServer(client => {
  client.on('error', error => console.log('client', error))
  client.on('data', req => {
    // 处理请求
    // const content = req.toString()
    // console.log(content)

    const remoteServer = new net.Socket()
    remoteServer.connect(8088, 'localhost')
    remoteServer.on('error', error => {
      console.log('remoteServer', error)
    })

    // 把请求发送给远程服务器
    remoteServer.write(req)
    remoteServer.on('data', res => {
      // 处理响应
      const content = res.toString()
      console.log(content)

      // 把响应发送给客户端
      client.write(res)
    })
  })
}).listen(80)
