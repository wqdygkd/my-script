// ==UserScript==
// @name         爱家登录脚本
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  移动端登录
// @author       zhang333
// @include      *://broker.mklij.com*
// @include      *://broker-dev.mklij.com*
// @include      *://localhost:7520/*
// @run-at document-end
// ==/UserScript==

(async function () {
  'use strict'

  window.addEventListener('popstate', function (event) {
    if (event.target.location.pathname !== '/login') {
      run()
    }
  })

  function run () {
    const aside = document.querySelector('.scroll-container.page-aside.sidebar-container')
    aside.style.overflowY = 'auto'

    const userheader = document.querySelector('.el-dropdown-menu.el-popper.user-header')
    userheader.append(createDom())
  }

  function createDom () {
    const domStr = '<li tabindex="-1" class="el-dropdown-menu__item">🤡登录H5</li>'

    const host = {
      'localhost:7520': 'https://broker-h5-dev.mklij.com',
      'broker-dev.mklij.com': 'https://broker-h5-dev.mklij.com',
      'broker.mklij.com': 'https://broker-h5.mklij.com'
    }

    const document = new DOMParser().parseFromString(domStr, 'text/html')
    const dom = document.querySelector('.el-dropdown-menu__item')
    dom.addEventListener('click', async function () {
      const token = await cookieStore.get('aika-token')
      const newUrl = `${host[location.host]}?token=${token.value}&redirectUrl=${host[location.host]}`
      window.open(newUrl)
    })
    return dom
  }
})()

// function nodeToString (node) {
//   let tmpNode = document.createElement('div')
//   tmpNode.append(node.cloneNode(true))
//   const str = tmpNode.innerHTML
//   tmpNode = node = null
//   return str
// }
