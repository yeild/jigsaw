const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  devServer: {
    hot: true,
    open: true,
    quiet: true,
    clientLogLevel: 'warning',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'demo.html',
      inject: 'head'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true
    })
  ],
  mode: 'development'
})
