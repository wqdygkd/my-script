
import fse from 'fs-extra'
import path from 'node:path'

/**
 * 读取路径信息
 * @param {string} path 路径
 */
async function getStat (path) {
  return await fse.stat(path).catch(() => {
    return false
  })
}

/**
   * 创建路径
   * @param {string} dir 路径
   */
async function mkdir (dir) {
  await fse.mkdir(dir).catch(() => {
    return false
  })
  return true
}

/**
   * 路径是否存在，不存在则创建
   * @param {string} dir 路径
   * @example dirExists('./1/2/3')
   */
async function dirExists (dir) {
  const isExists = await getStat(dir)
  if (isExists && isExists.isDirectory()) {
    return true // 该路径存在且不是文件，返回 true
  } else if (isExists) {
    return false // 如果该路径存在但是文件，返回 false
  }

  // 该路径不存在
  const tempDir = path.parse(dir).dir // 拿到上级路径
  // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  const status = await dirExists(tempDir)
  let mkdirStatus
  if (status) {
    mkdirStatus = await mkdir(dir)
  }
  return mkdirStatus
}

export {
  dirExists
}
