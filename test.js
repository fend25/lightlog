const lightlog = require('./index')

const dev = lightlog.getLogger('dev')
const dev2 = lightlog.getLogger('short', lightlog.DEFAULT_DEV_OPTS)
const prod = lightlog.getLogger('prod', Object.assign({}, lightlog.DEFAULT_PROD_OPTS, {toStdErrFromLevel: 0}))

dev.info(1, 'a', [1], {a: 1})
dev.debug(lightlog.DEFAULT_DEV_OPTS.padNames)
dev2.info(3)
dev2.warn(4)
dev.error(5)
dev.fatal(6)

prod.info(new Error(123))

const delay = (ms) => new Promise(res => setTimeout(res, ms))

Promise.resolve(delay(0)).then(dev.info).catch(dev.error)

Promise.resolve(delay(100)).then(() => {
  const dev3 = lightlog.getLogger('loooooong', lightlog.DEFAULT_DEV_OPTS)
  dev2.trace(1, 'a', [1], {a: 1})
  dev3.debug(lightlog.DEFAULT_DEV_OPTS.padNames)
  dev2.info(3)
  dev2.fatal(4)
  dev3.error(5)
  dev2.warn(6)

  const a = {c: 1}
  const b = {c: 2, sibling: a}
  a.sibling = b
  dev.info(a)
})