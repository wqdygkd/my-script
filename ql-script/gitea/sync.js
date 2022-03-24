// gitea api 使用指南 https://docs.gitea.io/zh-cn/api-usage/
// gitea api http://localhost:3000/api/swagger#/repository

const $ = new Env('sync')
const got = require('got')
const githubToken = process.env.githubToken || ''
const giteaToken = process.env.giteaToken || 'f8287de644a16b41a580fcb34204dc7ad49aff6f'

try {
  const notify = $.isNode() ? require('./sendNotify') : ''
} catch {}

const baseUrl = 'http://c10.wqdy.top:3000/api/v1'

const instance = got.extend({
  retry: { limit: 0 },
  headers: {
    Authorization: `token ${giteaToken}`,
    'Content-Type': 'application/json'
  },
  responseType: 'json',
  prefixUrl: baseUrl
})

const instance1 = got.extend({
  retry: { limit: 0 },
  headers: {
    Authorization: `token ${githubToken}`,
    'Content-Type': 'application/json'
  },
  responseType: 'json',
  prefixUrl: 'https://api.github.com'
})

const star = []

;(async () => {
  // await getGithubStar()

  await getGithubStar()

  const length = star.length
  for (let index = 0; index < length; index++) {
    const element = star[index]

    if (['microsoft/TypeScript', 'ryanoasis/nerd-fonts'].includes(element.full_name)) continue

    const cloneAddr = element.html_url // 'https://github.com/wqdyteam/fe-blog'
    const repoName = element.full_name.split('/').join('__') // 'wqdyteam__fe-blog'
    const repoOwner = 'github-repo-backup'
    const description = element.description
    console.log(`第(${index}/${length})`)
    console.log(`migrate ${cloneAddr}`)
    // console.log('check start')
    const checkResult = await checkRepo({ repoOwner, repoName })
    // console.log('check end\n')
    if (checkResult === 1) {
      console.log('已镜像')
      continue
    } else if (checkResult === 2) {
      console.log('delete...')
      const deleteResult = await deleteRepo({ repoOwner, repoName })
      console.log('delete end')
      // if (deleteResult !== 0) continue
    }

    console.log('migrate...')
    const migrateResult = await migrateRepo({ cloneAddr, repoName, repoOwner, description })
    if (migrateResult === 1) {
      console.log('migrate success\n')
    }

    await $.wait(1000)
  }
})().catch(error => {
  $.log('', `❌ ${$.name}, 失败! 原因: ${error}!`, '')
})
  .finally(() => {
    $.done()
  })

// 检测仓库是否存在
async function checkRepo ({ repoOwner, repoName }) {
  try {
    const response = await instance(`repos/${repoOwner}/${repoName}`)
    const { body } = response
    const { mirror } = body
    // console.log(`checkRepo -------- ${JSON.stringify(body)}`)
    return mirror === true ? 1 : 2
  } catch (error) {
    // console.log('checkRepo error --------')

    if (error.response.statusCode === 404) {
      console.log(404)
      return 3
    }
    console.log(error.response.statusCode, error.response.statusMessage)
    return 0
  }
}

async function deleteRepo ({ repoOwner, repoName }) {
  try {
    const response = await instance.delete(`repos/${repoOwner}/${repoName}`)
    const { complete } = response
    // console.log(`deleteRepo -------- ${JSON.stringify(response)}\n`)
    return complete ? 1 : 2
  } catch {
    // console.log('deleteRepo error --------')
    // console.log(error.response.statusCode, error.response.statusMessage)
    return 0
  }
}

async function migrateRepo ({ cloneAddr, repoName, repoOwner, description }) {
  try {
    const response = await instance.post('repos/migrate',
      {
        json: {
          // "auth_token": "string",
          clone_addr: cloneAddr,
          description,
          issues: true,
          labels: true,
          mirror: true,
          // "mirror_interval": "string",
          private: false,
          pull_requests: true,
          releases: true,
          repo_name: repoName,
          repo_owner: repoOwner,
          service: 'git',
          wiki: true
        }
      }
    )

    console.log(`migrate -------- ${JSON.stringify(response.body)}\n`)
    return response.statusCode === 201 ? 1 : 2
  } catch (error) {
    console.log('migrate error --------')
    console.log(error.response.statusCode, error.response.statusMessage)
    return 0
  }
}

async function getGithubStar (page = 1) {
  const searchParameters = { page }
  console.log(`第${page}页...`)
  const response = await instance1('users/wqdygkd/starred?pre_page=30&page=18', { searchParams: searchParameters })
  for (const item of response.body) {
    star.push({
      clone_url: item.clone_url,
      html_url: item.html_url,
      description: item.description,
      name: item.name,
      full_name: item.full_name
    })
  }

  if (response.body.length > 0) {
    await getGithubStar(++page)
  }
}

// prettier-ignore
// eslint-disable-next-line
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
