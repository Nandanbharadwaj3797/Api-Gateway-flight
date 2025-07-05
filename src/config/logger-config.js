 const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const coustomFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}: [${label}] : ${level}: ${message}`;
});

const logger=createLogger({
  format: combine(
    label({ label: 'API-Gateway' }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
    coustomFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'API-Gateway.log' })
  ]
});

module.exports = logger;