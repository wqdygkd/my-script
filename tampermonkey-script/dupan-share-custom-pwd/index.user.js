// ==UserScript==
// @name         百度网盘分享自定义密码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度网盘分享自定义密码
// @author       zhang333
// @include      *://pan.baidu.com/disk/main*
// @run-at document-end
// @require       http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @require       https://unpkg.com/ajax-hook/dist/ajaxhook.min.js

// @grant unsafeWindow
// ==/UserScript==

(function () {
  'use strict'

  // eslint-disable-next-line no-undef
  ah.proxy({
    // 请求发起前进入
    onRequest (config, handler) {
      const { url, body } = config
      if (url.startsWith('/share/set')) {
        const pwd = window.prompt('请输入', '6666')
        const pwdTmp = pwd.replace(/[\u4E00-\u9FA5]/gi, 'aaa')
        if (pwdTmp && pwdTmp.length === 4) {
          config.body = body.replace(/pwd=([\dA-Za-z]{4})/, `pwd=${pwd}`)
        }
      }
      handler.next(config)
    },
    // 请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError (err, handler) {
      handler.next(err)
    },
    // 请求成功后进入
    onResponse (response, handler) {
      handler.next(response)
    }
  })
  unsafeWindow.XMLHttpRequest = XMLHttpRequest

// eslint-disable-next-line semi
})();
