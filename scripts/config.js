'use strict'

const HOST = 'localhost';
const PORT = 6006;

module.exports = {
  srcPath: './src',
  distPath: './dist',
  mockPath: './mock',
  proxyTable: {},
  mockData: false,
  optimizeCommon: {
    'vendor-react': [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    'vendor-redux': [
      'redux',
      'react-redux'
    ],
    'vendor-lib': [
      'classnames',
      'axios',
    ],
  },
  host: HOST,
  port: PORT,
  autoOpen: true,
  useEslint: false,
  extractStyle: false,
  proxyTable: {
    'mock-api': `http://${HOST}:${PORT}`
  }
}
