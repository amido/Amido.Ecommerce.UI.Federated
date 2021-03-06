const {merge} = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

const paths = require('../paths')
const baseClientConfig = require('./client.base')
const {remoteLoaders} = require('./loaders/remoteLoaders')
const {remotePlugins} = require('./plugins/remotePlugins')

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

module.exports = webpackEnv => {
  const baseConfig = baseClientConfig(webpackEnv)
  const isProduction = webpackEnv === 'production'
  const remoteConfig = {
    target: 'node',
    externals: [nodeExternals()],
    externalsPresets: {node: true},
    output: {
      library: {type: 'commonjs'},
      // The build folder.
      path: `${paths.appSrc}/remote-entry`,
    },
    optimization: {
      minimize: isProduction,
      splitChunks: false,
    },
    plugins: [...remotePlugins(webpackEnv)].filter(Boolean),
    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap
          ? {
              enforce: 'pre',
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              test: /\.(js|mjs|jsx|ts|tsx|css)$/,
              loader: require.resolve('source-map-loader'),
            }
          : {},
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [...remoteLoaders(webpackEnv)].filter(Boolean),
        },
      ],
    },
  }

  return merge(baseConfig, remoteConfig)
}
