const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

// can add workspace here as well
module.exports = (config, workspace) => {
  const options = workspace.options ? workspace.options : workspace.buildOptions
  process.env.NODE_CONFIG_DIR = path.join(options.cwd, 'config')

  return merge(config, {
    devtool: 'eval-source-map',
    stats: 'minimal',
    devServer: {
      host: '0.0.0.0',
      port: 4200,
      hot: true
    },
    output: {
      filename: path.join('assets', 'js', '[name].[hash:8].js'),
      sourceMapFilename: path.join('assets', 'js', '[name].[hash:8].map'),
      chunkFilename: path.join('assets', 'js', '[name]-[id].[hash:8].js'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [ '@svgr/webpack', 'url-loader' ]
        },
        {
          test: /\.(jpg|png)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: path.join('assets', 'img'),
                name: '[hash:24].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: path.join('assets', 'fonts')
              }
            }
          ]
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  '@babel/proposal-class-properties',
                  '@babel/proposal-object-rest-spread',
                  [
                    '@babel/plugin-transform-runtime',
                    {
                      absoluteRuntime: false,
                      helpers: true,
                      corejs: 3,
                      regenerator: true,
                      useESModules: true
                    }
                  ],
                  [ 'styled-components', { pure: true, ssr: true } ]
                ],
                presets: [
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'usage',
                      corejs: 3
                    }
                  ],
                  'minify'
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new ErrorOverlayPlugin(),
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify(require('config').util.toObject())
      })
    ],
    node: {
      process: 'mock'
    }
  })
}
