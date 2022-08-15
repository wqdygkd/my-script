import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import puppeteer from 'puppeteer'
import ora from 'ora'

import { fileURLToPath } from 'node:url'
// const _packageJson = fs.readFileSync(path.resolve(__dirname, './package.json'))

import extractData from './extract-data.js'
import decode from './decode.js'

import { baseUrl, outputFolder, startPage, endPage, id } from './config.js'
import downloadImage from './download.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const output = path.resolve(__dirname, outputFolder)

// 当前页
const currentPage = startPage

// 创建输出文件夹
const createOutputFolder = () => {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output)
    console.log(chalk.green(`> 创建 output 文件夹：${output} 创建完成`))
  }
}

const main = async page => {
  const url = baseUrl + currentPage
  const spinner = ora({ text: chalk.yellow(`提取数据 ${url} `), color: 'yellow' })
  spinner.start()
  const originData = await extractData(url)
  spinner.succeed()
  console.log(chalk.green('> 提取数据：完成'))
  const data = decode(originData)
  console.log(chalk.green('> 解密数据：完成'))
  console.log(chalk.green('> 开始下载图片'))
  await downloadImage(data, output)
}

(async () => {
  createOutputFolder()

  // await page.setJavaScriptEnabled(false)
  // console.log(chalk.blue('> 禁用JavaScript: 完成'))

  await main()

  // await browser.close()
})()
