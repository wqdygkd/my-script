function post (url, data, headers, type) {
  if (this.isType(data) === 'object') {
    data = JSON.stringify(data)
  }
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url,
      headers,
      data,
      responseType: type || 'json',
      onload: res => {
        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText)
      },
      onerror: err => {
        reject(err)
      }
    })
  })
}

function get (url, headers, type, extra) {
  return new Promise((resolve, reject) => {
    const requestObj = GM_xmlhttpRequest({
      method: 'GET',
      url,
      headers,
      responseType: type || 'json',
      onload: res => {
        if (res.status === 204) {
          requestObj.abort()
          idm[extra.index] = true
        }
        if (type === 'blob') {
          res.status === 200 && base.blobDownload(res.response, extra.filename)
          resolve(res)
        } else {
          resolve(res.response || res.responseText)
        }
      },
      onprogress: res => {
        if (extra && extra.filename && extra.index) {
          res.total > 0 ? progress[extra.index] = (res.loaded * 100 / res.total).toFixed(2) : progress[extra.index] = 0
        }
      },
      onloadstart () {
        extra && extra.filename && extra.index && (request[extra.index] = requestObj)
      },
      onerror: err => {
        reject(err)
      }
    })
  })
}

function addStyle (id, tag, css) {
  tag = tag || 'style'
  const doc = document; const styleDom = doc.getElementById(id)
  if (styleDom) return
  const style = doc.createElement(tag)
  style.rel = 'stylesheet'
  style.id = id
  tag === 'style' ? style.innerHTML = css : style.href = css
  doc.querySelectorAll('head')[0].append(style)
}
