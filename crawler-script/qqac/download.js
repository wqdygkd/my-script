import path from 'node:path'
import chalk from 'chalk'
import fs from 'node:fs'
import got from 'got'

import makeDir from 'make-dir'

import ProgressBar from './progress.js'
import { dirExists } from './folder.js'

const data = {
  comic: {
    id: 531_040,
    title: '斗破苍穹',
    collect: '5572352',
    isJapanComic: false,
    isLightNovel: false,
    isLightComic: false,
    isFinish: false,
    isRoastable: true,
    eId: 'KlBMTkNCUVFTAwsfAQYHBwwJHEEy'
  },
  chapter: {
    cid: 1,
    cTitle: '01',
    cSeq: '1',
    vipStatus: 1,
    prevCid: 0,
    nextCid: 2,
    blankFirst: 1,
    v_club_state: 1,
    is_app_chapter: false,
    canRead: true
  },
  picture: [
    {
      pid: '2333',
      width: 800,
      height: 1333,
      url: 'https://manhua.acimg.cn/manhua_detail/0/16_21_26_dbceb62b0abb5c04a6cc66f7e5977321_2333.jpg/0'
    }
  ]
}

const downloadImageSingle = async (item, downloadFolder) => {
  if (item.url) {
    const res = await got(item.url)
  }
}

const downloadImage = async (data, output) => {
  const { comic, chapter, picture } = data
  const { id, title, isFinish } = comic
  const { nextCid, cid } = chapter

  const downloadFolder = path.join(output, `${title}${id}`, String(cid))
  // const path = await makeDir('unicorn/rainbow/cake');

  await dirExists(downloadFolder)
  console.log(chalk.green(`> 创建 downloadFolder 文件夹：${downloadFolder} 创建完成`))

  const progress = new ProgressBar(`> 第${cid}页 下载进度`, 50)
  for (let i = 0; i < picture.length; i++) {
    await downloadImageSingle(picture[i], downloadFolder)
    progress.render({ completed: i + 1, total: picture.length })
  }
}

export default downloadImage
