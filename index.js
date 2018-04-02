const utils = require(`./utils`)
const util = require(`util`)
const COLORS = utils.COLORS
const LEVELS = utils.LEVELS
const formatTs = utils.formatTs

const padStart = utils.padStart
const padEnd = utils.padEnd

const DEFAULT_DEV_OPTS = utils.DEFAULT_DEV_OPTS
const DEFAULT_PROD_OPTS = utils.DEFAULT_PROD_OPTS

/**
 * converts passed param of any type to string according passed options
 * @param param any - param to log
 * @param options object
 * @return {*}
 */
const toStr = (param, {prettyJson, printStackTrace, singleLine, trimLines}) => {
  let s = null
  if (typeof param !== `object`) s = String(param)
  else if (Buffer.isBuffer(param)) s = util.format(param)
  else if (param instanceof Error) {
    if (printStackTrace) s = param.stack
    else s = param.toString()
  }
  else s = JSON.stringify(param, utils.serializer(), prettyJson ? 2 : 0)

  if (typeof s === `string`) {
    if (trimLines) s = s.split(`\n`).map(el => el.trim()).join(`\n`)
    if (singleLine) s = s.replace(/\r|\n/g, ' ')
  }
  return s
}

/**
 * creates logger function according to provided logger name, level and options
 * @param {string} name
 * @param {string} levelName
 * @param {object} opts
 * @return function
 */
createLevelLogger = (name, levelName, opts) => {
  const level = LEVELS[levelName]
  if (LEVELS[opts.logLevel].level > level.level) return () => {}

  const colorPrefix = opts.colorize ? level.color : ``
  const colorSuffix = opts.colorize ? COLORS.cleanup : ``

  return (...params) => {
    let levelStr = ``, nameStr = ``
    if (opts.padNames) {
      levelStr = padStart(`[${levelName}]`, utils.maxLevelNameLength() + 2)
      nameStr = padEnd(`[${name}]`, Math.max(utils.maxNameLength(loggers), opts.minNameLength) + 2)
    } else {
      levelStr = `[${levelName}]`
      nameStr = `[${name}]`
    }

    const prefix = `${colorPrefix}[${opts.UTC ? new Date().toJSON() : formatTs()}] ${levelStr} ${nameStr} - ${colorSuffix}`
    const str = prefix + params.map(p => toStr(p, opts)).join(` `) + `\n`

    const output = (level.level >= opts.toStdErrFromLevel) ? `stderr` : `stdout`
    process[output].write(str)
  }
}

const optsToUse = process.env.NODE_ENV === `production` ? DEFAULT_PROD_OPTS : DEFAULT_DEV_OPTS
const setGlobalLogLevel = (logLevel) => {
  optsToUse.logLevel = logLevel
}

/**
 * creates log object according provided name and opts
 * @param {string} name
 * @param {Object} opts
 * @return {Logger}
 */
const loggers = {}
const getLogger = (name, _opts) => {
  if (typeof name !== `string` || name.length === 0)
    throw new TypeError(`logger name has to be a non empty string`)

  if (name in loggers)
    return loggers[name]

  if (typeof _opts !== `object`) _opts = {}

  const opts = Object.assign({}, optsToUse, _opts)

  loggers[name] = {}
  for (let levelName in LEVELS) {
    loggers[name][levelName] = createLevelLogger(name, levelName, opts)
  }

  loggers[name].formatToString = (param) => toStr(param, opts)

  return loggers[name]
}

module.exports = {
  getLogger,
  setGlobalLogLevel,
  LEVELS,
  DEFAULT_DEV_OPTS,
  DEFAULT_PROD_OPTS,
  COLORS
}
