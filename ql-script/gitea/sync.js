// gitea api 使用指南 https://docs.gitea.io/zh-cn/api-usage/
// gitea api http://localhost:3000/api/swagger#/repository

const got = require('got')
// const { readFile } = require('fs/promises');
// const path = require('path');
// const {CookieJar} = require('tough-cookie');
// const {promisify} = require('util');
// const qlDir = process.env.QL_DIR || '/ql';
// const authFile = path.join(qlDir, 'config/auth.json');
// const response = await instance('http://localhost:3000/api/v1/repos/search', {searchParams: {q: 'hexo'}});

const baseUrl = 'http://localhost:3000/api/v1'

const instance = got.extend({
  retry: { limit: 0 },
  headers: {
    Authorization: 'token 3000ca0a33b0ed5153f1c61412c49a7a64ed88d9',
    'Content-Type': 'application/json'
  },
  responseType: 'json',
  prefixUrl: baseUrl
})

;(async () => {
  try {
    // create({ org: 'github-repo-sync', name: 'test666', description: 'ceshi', defaultBranch: 'main' })
    // const originalUrl = 'https://github.com/sindresorhus/got'
    const cloneAddr = 'https://github.com/wqdyteam/fe-blog'
    const repoName = 'wqdyteam__fe-blog'
    const repoOwner = 'github-repo-sync'

    console.log(`migrate ${cloneAddr}\n`)
    console.log('check start\n')
    const checkResult = await checkRepo({ repoOwner, repoName })
    console.log('check end\n')
    if (checkResult === 1) {
      return console.log(`${cloneAddr} 已镜像`)
    } else if (checkResult === 2) {
      console.log('delete start\n')
      const deleteResult = await deleteRepo({ repoOwner, repoName })
      console.log('delete end\n')
      if (deleteResult !== 1) return
    }

    console.log('migrate start\n')
    const migrateResult = await migrateRepo({ cloneAddr, repoName, repoOwner })
    console.log('migrate end\n')

    if (migrateResult === 1) {
      console.log('migrate success\n')
    }
  } catch (error) {
    console.log(error)
  }
})()

// 检测仓库是否存在
async function checkRepo ({ repoOwner, repoName }) {
  try {
    const response = await instance(`repos/${repoOwner}/${repoName}`)
    const { body } = response
    const { mirror } = body
    console.log(`checkRepo -------- ${JSON.stringify(body)}`)
    return mirror === true ? 1 : 2
  } catch (error) {
    console.log('checkRepo error --------')
    console.log(error.response)
    return error.response.statusCode === 404 ? 3 : 0
  }
}

async function deleteRepo ({ repoOwner, repoName }) {
  try {
    const response = await instance.delete(`repos/${repoOwner}/${repoName}`)
    const { complete } = response
    console.log(`deleteRepo -------- ${JSON.stringify(response)}\n`)
    return complete ? 1 : 2
  } catch (error) {
    console.log('deleteRepo error --------')
    console.log(error.response)
    return 0
  }
}

async function migrateRepo ({ cloneAddr, repoName, repoOwner }) {
  try {
    const response = await instance.post('repos/migrate',
      {
        json: {
          // "auth_token": "string",
          clone_addr: cloneAddr,
          // description: '123',
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
    console.log(error.response)
    return 0
  }
}
