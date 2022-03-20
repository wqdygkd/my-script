const winston = require('winston')

// log 系统
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

exports.logger = logger
