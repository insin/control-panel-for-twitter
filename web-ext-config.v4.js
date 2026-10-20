const config = require('./web-ext-config.v5.js')

module.exports = {
  ...config,
  ignoreFiles: [
    ...config.ignoreFiles,
    'content-pro.js',
    'extensions-pro-bridge.js',
    'trace.html',
    'trace.js',
    'trace.css',
  ],
}
