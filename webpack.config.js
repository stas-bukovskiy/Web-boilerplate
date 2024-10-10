const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MinifyPlugin = require('babel-minify-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const CONFIG = {
  entry: './src/js/app.ts', // Update entry point to TypeScript file
  mode: process.env.NODE_ENV,
  devtool: devMode ? 'cheap-module-source-map' : 'source-map', // Enable source maps for debugging in dev mode
  output: {
    path: path.resolve(__dirname, './build'),
    filename: devMode ? 'app.js' : 'app.[contenthash].js', // Use hash in production for cache busting
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve both TypeScript and JavaScript
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      minify: !devMode
        ? {
          collapseWhitespace: true,
          minifyCSS: true,
          removeComments: true,
        }
        : false,
    }),
    new HtmlReplaceWebpackPlugin([
      {
        pattern:
            '<script type="text/javascript" src="../build/app.ts"></script>',
        replacement: '',
      },
      {
        pattern: '<link rel="stylesheet" href="./css/app.css">',
        replacement: '',
      },
    ]),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/images/',
        to: 'images/',
      },
      {
        from: 'src/*.txt',
        to: './[name].[ext]',
        toType: 'template',
      },
    ]),
    new ImageminPlugin({
      disable: devMode,
      test: /\.(jpe?g|png|gif|svg)$/i,
      optipng: { optimizationLevel: 3 },
      jpegtran: { progressive: true },
      gifsicle: { optimizationLevel: 1 },
      svgo: {},
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Add rule for TypeScript files
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader', // or 'babel-loader' if you're using Babel with TypeScript
            options: {
              transpileOnly: true, // Improve build speed
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: path.resolve(__dirname, 'src/'), // keep folder structure
              outputPath: 'assets/',
              publicPath: '../', // Adjust to correctly load images
            },
          },
        ],
      },
      {
        test: /\.js$/, // Process .js files through Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 3001,
    hot: true,
    liveReload: true, // watchContentBase is deprecated in Webpack 5
    open: true, // Open browser automatically
  },
};

if (!devMode) {
  CONFIG.output.publicPath = './';
  CONFIG.plugins.push(new MinifyPlugin());
  CONFIG.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: { presets: ['@babel/preset-env'] },
  });
}

module.exports = CONFIG;
