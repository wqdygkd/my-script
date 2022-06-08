// ==UserScript==
// @name         Hook
// @version      0.1
// @description  Hook
// @author
// @grant        none
// ==/UserScript==
(function () {
  'use strict'
  function hook (object, attr) {
    const func = object[attr]
    object[attr] = function () {
      console.log('hooked', object, attr)
      const ret = func.apply(object, arguments)
      return ret
    }
  }
  hook(window, 'btoa')
})()
