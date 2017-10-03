# lightlog

This is a tiny logger library, which just prints passed params to stdout/stderr.

It has no dependencies and no any 'this' references, so it could be used as lambda.

By default, it uses two configs: dev or production (depends on NODE_ENV). In dev mode output is neat, multiline, colorized and so on. In prod mode the output is clean, goes to single line and much closer to something desired by log parsers.

Inspired by log4js. TypeScript typings are included.

# installation
npm:
```
npm install --save lightlog
```

yarn:
```
yarn add lightlog
```

# usage
```js
const lightlog = require('lightlog')
const log = lightlog.getLogger('any_prefix_you_like')
const anotherLog = lightlog.getLogger('another_prefix', config)

log.trace(1)
log.debug('a')
log.info(1, 'a', [1], {a: 1})
log.warn('oops')
log.error(new Error('I want another type', 'TypeError'))
log.fatal('I`m tyred')

// usage as lambda:
Promise.resolve(5).then(log.info).catch(log.error) // no extra wrappings.
                                                   // it just works and just prints what you want.
```

# configuration
Since it just prints to console, and it hasn't any appenders like mailers, udp, IM bots and so on, it still can be configured.

config object structure:
```js
interface Options {
  prettyJson?: boolean
  logLevel?: string // minimal logLevel to print. ie: if you set 'info', log.trace and log.debug won't work. default: '
  toStdErrFromLevel?: number // number representation of llog level. number is chosen to be able get level higher than any levels and set all output to stdout. default: 999
  padNames?: boolean // to pad names or no
  minNameLength?: number // minimal length of logger name (use to pad it with spaces for neat output)
  colorize?: boolean
  printStackTrace?: boolean // used when passed an error
  singleLine?: boolean // make all output in single line
  trimLines?: boolean // trims every line of input (useful to avoid extra spacings in error stack)
  UTC?: boolean //output timestamp at UTC or machine's timezone
}
```

By default, in `NODE_ENV='production'` used DEFAULT_PROD_OPTS, otherwise DEFAULT_DEV_OPTS:

```js
const DEFAULT_DEV_OPTS = {
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
```

```js
const DEFAULT_PROD_OPTS = {
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
```

You can create your own options object from scratch or get and change any default one.

# license
MIT