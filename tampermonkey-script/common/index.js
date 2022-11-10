// ==UserScript==
// @name         window property reset
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  恢复被重写的window上的方法
// @icon
// @author       zhang333
// @match        http://localhost:*/*
// @run-at       document-end
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict'
  // unsafeWindow.enableLog = true

  // 恢复 window.console
  var iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  unsafeWindow.console = iframe.contentWindow.console
})()
