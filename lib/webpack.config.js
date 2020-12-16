const path = require('path')
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve')
const serveOptions = { port: process.env.PORT || 3000 }
const debug = process.env.NODE_ENV !== 'production'
console.log('debug', debug)
const TerserPlugin = require('terser-webpack-plugin')

const minimizers = debug ? [] : [new TerserPlugin()]

module.exports = {
  entry: [path.resolve(process.cwd(), 'src', 'index.js')],
  mode: debug ? 'development' : 'production',
  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: 'bundle.js'
  },
  resolveLoader: {
    // resolves node modules for loaders from rewp instead of project
    // only need in dev/link mode
    modules: process.env.USING_LINK ? [path.join(__dirname, '..', 'node_modules')] : undefined
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.sass']
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: debug ? 'source-map' : 'hidden-source-map',
  plugins: [new Serve(serveOptions)],
  watch: true,
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
              sassOptions: {
                module: true,
                includePaths: ['./node_modules']
              }
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
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]',
              outputPath: 'img/'
            }
          }
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
        include: [path.join(process.cwd(), 'src')],
        exclude: [/node_modules/, path.join(process.cwd(), 'src', 'static')],
        loader: 'babel-loader',
        options: {
          presets: [
            [
              require.resolve('@babel/preset-env'),
              {
                modules: false,
                useBuiltIns: 'entry',
                corejs: '3.3.6'
              },
              require.resolve('@babel/preset-react')
            ]
          ],
          plugins: [
            [require.resolve('@babel/plugin-transform-react-jsx')]
          ]
        }
      }
    ]
  },
  optimization: {
    minimize: !debug,
    minimizer: minimizers
  }
}
