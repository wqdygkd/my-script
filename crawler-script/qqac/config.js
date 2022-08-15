import got from 'got'

const baseUrl = 'https://ac.qq.com/ComicView/index/id/531040/cid/'
const id = 531_040
const outputFolder = './output'
const listSkip = false
const pageSkip = true
const startPage = 1
const endPage = 1

export { outputFolder, baseUrl, listSkip, pageSkip, startPage, endPage, id }

const downloadImageSingle = async (item, downloadFolder) => {
  if (item.url) {
    const res = await got(item.url)
  }
}
