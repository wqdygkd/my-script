import { stdout } from 'single-line-log'

function ProgressBar (description, barLength) {
  this.description = description || 'Progress'
  this.length = barLength || 25

  this.render = function (opts) {
    const percent = (opts.completed / opts.total).toFixed(4)
    const cellNum = Math.floor(percent * this.length)

    // 拼接黑色条
    let cell = ''
    for (let i = 0; i < cellNum; i++) {
      cell += '█'
    }

    // 拼接灰色条
    let empty = ''
    for (let i = 0; i < this.length - cellNum; i++) {
      empty += '░'
    }

    // 拼接最终文本
    const cmdText =
      this.description +
      ': ' +
      (100 * percent).toFixed(2) +
      '% ' +
      cell +
      empty +
      ' ' +
      opts.completed +
      '/' +
      opts.total +
      '\n'

    stdout(cmdText)
  }
}

export default ProgressBar
