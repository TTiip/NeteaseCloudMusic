const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './assets/less/common.less'),
        path.resolve(__dirname, './assets/less/reset.less')
      ]
    }
  },
  configureWebpack: {
    resolve: {
      alias: {}
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.uniquemo.cn',
        changeOrigin: true,
        pathRewrite: {}
      }
    }
  }
}
