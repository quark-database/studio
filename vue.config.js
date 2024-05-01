const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    target: 'electron-renderer'
  },
  transpileDependencies: true
})
