module.exports = {
  devServer: {
    hot: false,
    liveReload: false
  },
  "configureWebpack": {
    "optimization": {
      "splitChunks": {
        "minSize": 10000,
        "maxSize": 250000
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ],
  "publicPath": "./",
  //publicPath: '\.\/',
  outputDir: process.env.VUE_APP_ENV === 'PROD'
  ? 'build-prod'
  : 'build-dev',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "WCH Map";
        return args;
      })
  }
}