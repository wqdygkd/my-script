const base = "https://telegra.ph"

addEventListener('fetch', function(event) {
  event.respondWith(handleRequest(event.request))
})
async function handleRequest(request) {
  const url = new URL(request.url)
  const { pathname, search } = url
  const destinationURL = base + '/file' + pathname.slice(3)

  return fetch(destinationURL)
}

// telegra.ph/file/6d70a5733197997ed140f.jpg
// workers.dev/tg/6d70a5733197997ed140f.jpg
