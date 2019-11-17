/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-24 19:31:56
 * @LastEditTime: 2019-10-29 19:18:53
 * @LastEditors: Please set LastEditors
 */
const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  configureWebpack: {
    externals: {
      'AMap': 'AMap',
      'AMapUI': 'AMapUI'
    }
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    config.resolve.alias
      .set('_c', resolve('src/components')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_v', resolve('src/views'))
    config.module.rule('svg').uses.clear()
    config.module.rule('svg').use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false
  // 这里写你调用接口的基础路径，来解决跨域
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/variables.less') // 需要全局导入的less
      ]
    })
}
