type toStr = (...params: any[]) => string
type logFunc = (...params: any[]) => void
type levelsADT = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
type colorsADT = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'purple' | 'cyan' | 'white' | 'cleanup'

interface Options {
  prettyJson?: boolean
  logLevel?: string
  toStdErrFromLevel?: number
  minNameLength?: number
  colorize?: boolean
  printStackTrace?: boolean
  singleLine?: boolean
  trimLines?: boolean
  padNames?: boolean
  UTC?: boolean
}

interface Logger {
  trace: logFunc
  debug: logFunc
  info: logFunc
  warn: logFunc
  error: logFunc
  fatal: logFunc
  formatToString: toStr
}

type Level = {
  readonly name: string
  readonly level: number
  color: string
}

export function getLogger(name: string, opts?: Options): Logger
export function setGlobalLogLevel(logLevel: string): void

export type DEFAULT_DEV_OPTS = Options
export type DEFAULT_PROD_OPTS = Options
export type LEVELS = { [L in levelsADT]: Level }
export type COLORS = { [C in colorsADT]: string }