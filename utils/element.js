/*
监听dom状态
*/
export function domListener (selector, appear = () => {}, change = () => {}, disappear = () => {}) {
  let status = false
  let html = ''
  setInterval(() => {
    const el = document.querySelector(selector)
    if (status && el && el.innerHTML !== html) {
      html = el.innerHTML
      change(el)
    }
    if (el && !status) {
      status = true
      appear(el)
    } else if (!el && status) {
      status = false
      disappear()
    }
  }, 100)
}
