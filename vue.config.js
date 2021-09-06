const path = require('path')

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/less/common.less'),
        path.resolve(__dirname, './src/assets/less/reset.less')
      ]
    })
}

module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
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
