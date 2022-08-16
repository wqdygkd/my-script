1. qqac 解密响应数据

await page.waitForResponse(url)
await page.waitForSelector('body')
await page.evaluate(() => {
    console.log(document)
    console.log(window)
})
