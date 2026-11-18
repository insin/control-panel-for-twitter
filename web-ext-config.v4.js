const config = require('./web-ext-config.v5.js')

module.exports = {
  ...config,
  ignoreFiles: [
    ...config.ignoreFiles,
    'content-pro.js',
    'shared/extensions-pro-bridge.js',
    'shared/trace.css',
    'shared/trace.html',
    'shared/trace.js',
  ],
}
