module.exports = {
  chainWebpack: config => {
    //发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      //entry找到默认的打包入口，调用clear则是删除默认的打包入口
      //add添加新的打包入口
      config.entry('app').clear().add('./src/main-prod.js')

      // 通过externals加载外部CDN资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      // 首页内容定制
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    //开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "common": "@/common",
        "components": "@/components",
        "network": "@/network",
        "views": "@/views",
        "store": "@/store",
        "plugins": "@/plugins"
      }
    }
  },
  lintOnSave: false
}