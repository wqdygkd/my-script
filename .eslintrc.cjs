module.exports = {
  extends: ['wqdy'],
  env: {
    browser: true
  },
  rules: {
    'unicorn/prevent-abbreviations': 0
  },
  globals: {
    unsafeWindow: 'writable',
    GM_getValue: 'readonly',
    GM_setValue: 'readonly',
    GM_cookie: 'readonly',
    GM_registerMenuCommand: 'readonly',
    cookieStore: 'readonly'
  }
}
