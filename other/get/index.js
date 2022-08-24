// import path from 'node:path'
// import fs from 'node:fs'

// import chalk from 'chalk'
import got from 'got'
import FormData from 'form-data'
import Sqlite3 from 'sqlite3'

const sqlite3 = Sqlite3.verbose()
const db = new sqlite3.Database('./note.db')

const request = async () => {
  const instance = got.extend({
    headers: {
      cookie: 'SESSION=gu2n8a5bbn8ua058h3muprln8qv27ksu',
      origin: 'https://zxso.net',
      referer: 'https://zxso.net/tool/dognote',
      'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'Windows',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    },
    responseType: 'json'
  })

  const formData = new FormData()
  formData.append('token', '86637be5-409a-4808-8189-fd676af03577')
  const result = await instance.post('https://zxso.net/api/dognote', {
    body: formData
  })
  return result.body.data.trim()
}

const main = async () => {
  // const note = await request()
  const note = '123324343'
  db.get(`SELECT * FROM "main"."note" WHERE "note" = ${note}`, async (err, row) => {
    if (err) {
      // db.run(`INSERT INTO "main"."note" ("note") VALUES (${note})`)
    }
    db.run(`INSERT INTO "main"."note" ("note") VALUES (${note})`)
    console.log(row)

    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    // await main()
  })
}

db.serialize(async () => {
  await main()
})

// db.close()

// import makeDir from 'make-dir'
// import mime from 'mime-types'

// import ProgressBar from './progress.js'
// import { mainModule } from 'node:process'

// const downloadImageSingle = async (item, downloadFolder) => {
//   const { url, pid } = item
//   if (!url) return

//   const res = await got(url)
//   const type = res.headers['content-type']
//   const extension = mime.extension(type)
//   await fs.writeFileSync(`${downloadFolder}/${pid}.${extension}`, res.rawBody)
// }

// main()
