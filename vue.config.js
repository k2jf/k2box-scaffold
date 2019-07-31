module.exports = {
  publicPath: '',
  css: {
    loaderOptions: {
      less: {
        // enable inline-javascript, for customizing iview styles
        // https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        // search 'inline javascript' in http://lesscss.org/usage/ for more info
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    // see https://cli.vuejs.org/config/#devserver
    // see https://webpack.js.org/configuration/dev-server#devserverproxy
    proxy: {
      '^/api/': {
        // note 更换后端地址
        target: 'http://10.1.10.112:9080',
        // target: 'http://10.1.50.10:9080',
        pathRewrite: {
          '^/api/': '/'
        },
        changeOrigin: true
      }
    }
  }
}
