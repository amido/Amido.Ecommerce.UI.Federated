const {dependencies} = require('../package.json')

const getFederationConfig = REMOTES => ({
  name: 'mfe_header',
  filename: 'remote-entry.cjs',
  library: {type: 'commonjs'},
  remotes: REMOTES,
  exposes: {
    './header': './src/Header.tsx',
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      eager: true,
      requiredVersion: dependencies.react,
      shareScope: 'default',
    },
  },
})

module.exports = {getFederationConfig}
