const path = require("path");
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const dotenv = require('dotenv').config();

module.exports = {
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin()],
  // },
  entry: ['regenerator-runtime/runtime.js', path.resolve(__dirname, "client", "src", 'index.js')],
  output: { path: path.resolve(__dirname, "client", "dist") },
  mode: 'development',
  devtool: 'source-map',
  // plugins: [
  //   new CompressionPlugin({
  //     algorithm: 'gzip',
  //     test: /\.js$|\.css$|\.html$/,
  //     threshold: 10240,
  //     minRatio: 0.8
  //   }),
  //   new BrotliPlugin({
  //     asset: '[path].br[query]',
  //     test: /\.(js|css|html|svg)$/,
  //     threshold: 10240,
  //     minRatio: 0.8
  //   })
  // ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        },
        // {
        //   loader: 'postcss-loader',
        //   options: {
        //     plugins: function () {
        //       return [
        //         require('precss'),
        //         require('autoprefixer')
        //       ];
        //     }
        //   }
        // },
        {
          loader: 'sass-loader'
        }]
      },
      {
        test: /\.s[a|c]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      }
    ]
  },
  // plugins: [
  //   new CompressionPlugin({
  //   algorithm: 'gzip',
  //   test: /\.js$|\.css$|\.html$/,
  //   threshold: 10240,
  //   minRatio: 0.8
  //   }),
  //   new BrotliPlugin({
  //   asset: '[path].br[query]',
  //   test: /\.js$|\.css$|\.html$/,
  //   threshold: 10240,
  //   minRatio: 0.8
  //   })
  //  ],
  devServer: {
    port: 3001,
    watchContentBase: true,
    contentBase: path.join(__dirname, 'client','/dist'),
    hot: true,
    overlay: true,
    // compress: true,
    historyApiFallback: true,
    // host: process.env.HOST,
    // host: '10.0.0.90'

    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: {'^/api' : ''}, // In this case we don't pass `api` path
    //   }
    // }
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/client/dist'
  }
};