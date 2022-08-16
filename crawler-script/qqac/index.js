import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import ora from 'ora'

import extractData from './extract-data.js'
import decode from './decode.js'
import { baseUrl, outputFolder, start, retry } from './config.js'
import downloadImage from './download.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const output = path.resolve(__dirname, outputFolder)

// 创建输出文件夹
const createOutputFolder = () => {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output)
    console.log(chalk.green(`> 创建 output 文件夹：${output} 创建完成`))
  }
}

const main = async cid => {
  const url = baseUrl + cid
  const spinner = ora({ text: chalk.yellow(`提取数据 ${url} `), color: 'yellow' })
  spinner.start()
  const originData = await extractData(url)
  if (originData.DATA && originData.nonce) {
    spinner.succeed()
    console.log(chalk.green('> 提取数据：完成'))
  } else {
    spinner.fail()
    console.log(`${originData.DATA ? chalk.green('> 提取DATA：完成') : chalk.red('> 提取DATA：失败')}`)
    console.log(`${originData.nonce ? chalk.green('> 提取nonce：完成') : chalk.red('> 提取nonce：失败')}`)

    // 重试
  }
  const data = decode(originData)
  console.log(data)
  console.log(chalk.green('> 解密数据：完成'))
  console.log(chalk.green('> 开始下载图片'))
  await downloadImage(data, output)

  const { comic, chapter, picture } = data
  const { id, title, isFinish } = comic
  const { nextCid } = chapter
  if (isFinish) return
  main(nextCid)
}

(async () => {
  createOutputFolder()

  // await page.setJavaScriptEnabled(false)
  // console.log(chalk.blue('> 禁用JavaScript: 完成'))

  await main(start)

  // await browser.close()
})()
