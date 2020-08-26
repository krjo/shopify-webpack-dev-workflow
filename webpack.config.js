const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const devtool = mode === 'development' ? 'eval-cheap-source-map' : 'none';
const stats = mode === 'development' ? 'errors-warnings' : { children: false };

module.exports = {
  mode: mode,
  devtool: devtool,
  entry: glob.sync('./src/js/bundles/**/*.js').reduce((acc, path) => {
    const entry = path.replace(/^.*[\\\/]/, '').replace('.js','');
    acc[entry] = path;
    return acc;
  }, {}),
  output: {
    filename: './assets/bundle.[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      Styles: path.resolve(__dirname, 'src/styles/'),
      Helpers: path.resolve(__dirname, 'src/styles/helpers/')
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './assets/bundle.[name].css.liquid',
    }),
    new CopyPlugin([
      {
        from: 'src/**/*',
        to: '[folder]/[name].[ext]',
        ignore: [
          'src/js/**/*',
          'src/styles/**/*',
          'src/assets/**/*',
          'src/liquid/templates/customers/*',
          'src/liquid/snippets/**/*'
        ],
      },
      {
        from: 'src/liquid/templates/customers/*.liquid',
        to: 'templates/[folder]/[name].[ext]',
      },
      {
        from: 'src/liquid/snippets/**/*.liquid',
        to: 'snippets/[name].[ext]',
        flatten: true
      },
      {
        from: 'src/assets/**/*',
        to: 'assets/',
        flatten: true
      }
    ])
  ],
  stats: stats,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/env'],
        }
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      }
    ]
  }
}

if (mode === 'development') {
  module.exports.plugins.push(
    new WebpackShellPluginNext({
      onBuildStart:{
        scripts: ['echo Webpack build in progress...🛠'],
      }, 
      onBuildEnd:{
        scripts: ['echo Build Complete 📦','shopify-themekit watch','shopify-themekit open'],
        parallel: true
      }
    })
  )
}