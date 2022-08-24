import got from 'got'
import Sqlite3 from 'sqlite3'

const sqlite3 = Sqlite3.verbose()
const db = new sqlite3.Database('./note.db')

const request = async () => {
  const instance = got.extend({
    headers: {
      origin: 'https://zxso.net',
      referer: 'https://zxso.net/tool/dognote',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
    },
    responseType: 'json'
  })

  const result = await instance.get('https://zxso.net/api/dognote')
  return result.body.data.trim()
}

let count = 1

const main = async () => {
  let note = await request()
  note = note.replace(/["'‘’“”]/g, ' ')
  const str = `SELECT * FROM "main"."note" WHERE "note" = "${note}"`
  db.get(str, async (err, row) => {
    if (err) {
      console.log(err)
    }
    if (row) {
      // console.log(row)
      console.log(`第${count}次 已存在`)
    } else {
      db.run(`INSERT INTO "main"."note" ("note") VALUES ("${note}")`)
      console.log(`第${count}次 添加成功`)
    }

    count++
    const wait = (Math.random() * 4 + 1)
    // console.log(`暂停${wait}秒`)
    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, wait * 1000)
    })

    await main()
  })
}

db.serialize(async () => await main())

// db.close()
