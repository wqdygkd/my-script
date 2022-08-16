import jsdom from 'jsdom'
const { JSDOM } = jsdom

export default async url => {
  const resourceLoader = new jsdom.ResourceLoader({
    strictSSL: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
  })

  const { window } = await JSDOM.fromURL(url, { resources: resourceLoader })
  for (const item of [...window.document.querySelectorAll('script')].filter(item => item.src === '' && item.type !== 'text/html')) {
    try {
      // eslint-disable-next-line no-eval
      eval(item.text + 'if (DATA) { window.DATA = DATA }')
    } catch {}
  }

  return {
    DATA: window.DATA,
    nonce: window.nonce
  }
}
