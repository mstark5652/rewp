const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
  mode: debug ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: debug ? 'source-map' : false,

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.sass']
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css'
            }
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              module: true,
              includePaths: ['./node_modules']
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
              outputPath: 'font/'
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]'
          // 'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false'
        ]
      },
      {
        test: /\.(mp4|mp3)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'vid/'
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        include: [path.join(__dirname, 'src')],
        exclude: [/node_modules/, path.join(__dirname, 'src', 'static')],
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                useBuiltIns: 'entry',
                corejs: '3.3.6'
              },
              '@babel/preset-react'
            ]
          ],
          plugins: [
            ['@babel/plugin-transform-react-jsx']
          ]
        }
      }
    ]
  }
}
