// 利用cf wordkers获取网站状态码
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest (request) {
  const url = new URL(request.url).searchParams.get('url')
  if (!url) { return new Response('url异常') }

  const response = await fetch(url)
  return new Response(response.status)
}
