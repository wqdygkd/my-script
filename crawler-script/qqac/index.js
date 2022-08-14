import fs from 'node:fs'
import chalk from 'chalk'
import puppeteer from 'puppeteer'

import ora from 'ora'

// import list from './list.js'
import { baseUrl, outputFolder, startPage, endPage, id } from './config.js'

// 当前页
const currentPage = startPage

// 创建输出文件夹
const createOutputFolder = () => {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder)
    console.log(chalk.green('> 创建 outputFolder 文件夹：完成'))
  }
}

const extractLink = async page => {
  const linkArray = await page.evaluate(() => {
    return [...document.querySelectorAll('#comicContain li img')].map(v => v.getAttribute('src'))
  })
  console.log(chalk.green('> 提取 LINK ：完成 \n'))
  return linkArray
}

const main = async page => {
  const url = baseUrl + currentPage
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

  const listArray = await extractLink(page)

  console.log(listArray)
}

(async () => {
  const browser = await puppeteer.launch()
  console.log(chalk.blue('> 浏览器启动: 完成'))

  const page = await browser.newPage()

  createOutputFolder()

  // await page.setJavaScriptEnabled(false)
  // console.log(chalk.blue('> 禁用JavaScript: 完成'))

  await main(page)

  await browser.close()
})()
