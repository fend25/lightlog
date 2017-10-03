exports.DEFAULT_DEV_OPTS = {
  prettyJson: true,
  logLevel: `trace`,
  toStdErrFromLevel: 999,
  minNameLength: 4,
  colorize: true,
  printStackTrace: true,
  singleLine: false,
  trimLines: false,
  padNames: true,
  UTC: false
}
exports.DEFAULT_PROD_OPTS = {
  prettyJson: false,
  logLevel: `info`,
  toStdErrFromLevel: 999,
  minNameLength: 0,
  colorize: false,
  printStackTrace: false,
  singleLine: true,
  trimLines: true,
  padNames: false,
  UTC: false
}

const COLORS = exports.COLORS = {
  black: `\x1B[30m`,
  red: `\x1B[31m`,
  green: `\x1B[32m`,
  yellow: `\x1B[33m`,
  blue: `\x1B[34m`,
  purple: `\x1B[35m`,
  cyan: `\x1B[36m`,
  white: `\x1B[37m`,
  cleanup: `\x1B[0m`
}

const proxify = (levelObj) => new Proxy(levelObj, {
  set: (obj, prop, value) => {
    if (prop === `color`) obj[prop] = value
    else console.error(`Changing any value except color is restricted. '${prop}' value is '${obj[prop]}'`)
  }
})

const LEVELS = exports.LEVELS = {
  trace: proxify({
    name: `trace`,
    color: COLORS.cleanup,
    level: 0
  }),
  debug: proxify({
    name: `debug`,
    color: COLORS.cyan,
    level: 1
  }),
  info: proxify({
    name: `info`,
    color: COLORS.green,
    level: 2
  }),
  warn: proxify({
    name: `warn`,
    color: COLORS.yellow,
    level: 3
  }),
  error: proxify({
    name: `error`,
    color: COLORS.red,
    level: 4
  }),
  fatal: proxify({
    name: `fatal`,
    color: COLORS.purple,
    level: 5
  })
}

const pad0 = s => (s < 10 ? `0` : ``) + s.toString()
const pad00 = s => (s < 10 ? `00` : (s < 100) ? `0` : ``) + s.toString()
exports.formatTs = () => {
  const d = new Date()
  const date = `${d.getFullYear()}-${pad0(d.getMonth() + 1)}-${pad0(d.getDate())}`
  const time = `${pad0(d.getHours())}:${pad0(d.getMinutes())}:${pad0(d.getSeconds())}:${pad00(d.getMilliseconds())}`
  return `${date} ${time}`
}

exports.padStart = (str, len) => {
  if (str.length >= len) return str
  return (' '.repeat(len - str.length)) + str
}

exports.padEnd = (str, len) => {
  if (str.length >= len) return str
  return str + (' '.repeat(len - str.length))
}

const findMax = (arr) => {
  let max = -1

  for (let len of arr) {
    if (len > max) max = len
  }

  return max
}

exports.maxLevelNameLength = () => findMax(Object.keys(LEVELS).map(s => s.length))
exports.maxNameLength = (loggers) => findMax(Object.keys(loggers).map(s => s.length))