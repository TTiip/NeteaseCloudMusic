module.exports = {
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
