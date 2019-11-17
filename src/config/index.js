/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-09 11:05:01
 * @LastEditTime: 2019-11-07 10:41:46
 * @LastEditors: Please set LastEditors
 */
/**
 * 全局配置
 */
export default {
  /**
   * 配置显示在浏览器标签的title
   */
  title: '数据汇聚平台',

  /**
   * 是否开启显示在浏览器标签的title,如果为false, 则只显示默认title
   */
  show_title: true,

  /**
   * 设置ele组件默认尺寸
   */
  el_size: 'medium',

  /**
   * 是否固定头部
   */
  affix_header: true,

  /**
   * 是否显示标签页
   */
  has_tags: true,

  /**
   * api请求基础路径
   */
  base_url: {
    // dev: 'http://192.168.169.88:8089/themis/api', // 修真
    // // dev: 'http://192.168.169.102:8083/themis/api', // 建城
    // dev: 'http://192.168.170.92:8080/themis/api', // 金友
    // dev: 'http://220.250.1.58:8035/themis/api',
    // pro: 'https://catffee.cn/themis' // 测试地址
    dev: 'https://catffee.cn/themis/api', // 测试地址
    pro: 'https://catffee.cn/themis/api' // 测试地址

  },

  // source: 'http://192.168.169.88:8089/themis' // 修真
  // source: 'http://192.168.170.92:8080/themis' // 金友
  // source: 'http://220.250.1.58:8035/themis'
  // source: 'http://47.92.211.76:80/themis' // 测试地址
  source: 'https://catffee.cn/themis' // 测试地址
}
