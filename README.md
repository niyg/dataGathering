# vue-ele-admin

## 介绍

`vue-ele-admin` 是借鉴 `iview-admin` 和 `vue-element-admin` 两套集成方案实现的，结合了两套方案比较好的功能模块以及代码风格。`vue-ele-admin` 是基于 `vue` 和 `element-ui` 实现，提供了动态路由，权限验证以及常用的功能组件。它可以帮助你快速搭建后台系统。

## 功能

`vue-ele-admin` 目前处于初版阶段，只提供了一些常用功能组件，后续的话，还会根据实际开发进行功能组件的扩展。

```
- 登录 / 注销

- 权限验证
  - 页面权限

- 全局功能
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 快捷导航(标签页)
  - Svg Sprite 图标
  - Screenfull全屏
  - 自适应收缩侧边栏

- 错误页面
  - 404

- 組件
  - 图表
  - 查询
  - 表格
  - 拖拽Dialog
  - 水波纹
  - 涟漪
  - 富文本编辑器
  - 图片上传裁剪
```

## 目录结构

`vue-ele-admin` 已经为你生成了一个完整的开发框架，提供了涵盖中后台开发的各类功能和坑位，下面是整个项目的目录结构。

```
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── cache                  # 本地存储设置
│   ├── components             # 全局公用组件
│   ├── config                 # 全局配置
│   ├── directive              # 全局指令
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 权限管理
├── tests                      # 测试
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```

## 安装

`vue-ele-admin` 是基于 `vue-cli 3.0` 搭建的，所以项目运行的话可以像`vue-cli 2.0` 命令启动，也可以导入 `vue-cli 3.0` 的UI可视化界面，之后启动。

```
# 克隆项目
git clone http://192.168.169.57:9000/scm/git/hzt-webdocs.git

# 进入项目目录
cd 项目路径

# 安装依赖
npm install
```
