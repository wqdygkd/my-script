import fs from 'node:fs'
import ora from 'ora'
import chalk from 'chalk'
import single from './single.js'
import { outputFolder, listSkip } from './config.js'

const extractNextPage = async page => {
  const nextPage = await page.evaluate(() => {
    const link = document.querySelector('.next-page>a')
    return link ? link.getAttribute('href') : undefined
  })
  console.log(chalk.green('> 提取下一页 LINK ：完成'))
  return nextPage
}

const extractListLink = async page => {
  const linkArray = await page.evaluate(() => {
    return [...document.querySelectorAll('.thumbnail')].map(v => v.getAttribute('href'))
  })
  console.log(chalk.green('> 提取当前列表 LINK ：完成 \n'))
  return linkArray
}

const createSingleFolder = listLink => {
  const singleFolder = listLink
    .split('/')
    .pop()
    .replace(/\D/gi, '')
  const folder = `${imageFolder}/${singleFolder}`

  let isCreated = false
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
    console.log(chalk.green('> 创建 SINGLE 文件夹：完成'))
  } else {
    isCreated = true
    console.log(chalk.yellow(`> 跳过 ${folder}`))
  }
  return { folder, isCreated }
}

const linkSingle = async (page, listArray) => {
  for (const element of listArray) {
    const { folder, isCreated } = await createSingleFolder(element)
    if ((listSkip && !isCreated) || !listSkip) await single(page, element, folder)
  }
}

const list = async (page, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spinner = ora({
        text: chalk.yellow(`前往 ${url} `),
        color: 'yellow'
      })
      spinner.start()
      await page.goto(url)
      spinner.succeed()
      console.log(chalk.green('> 页面跳转：完成'))

      await page.waitForSelector('body')
      console.log(chalk.green('> 页面渲染：完成'))

      const listArray = await extractListLink(page)

      await linkSingle(page, listArray)

      const nextPage = await extractNextPage(page)
      nextPage && list(page, nextPage)

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export default list
