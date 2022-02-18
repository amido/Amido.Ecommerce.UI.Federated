const path = require("path");

const { ESBuildMinifyPlugin } = require("esbuild-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const FederatedStatsPlugin = require("webpack-federated-stats-plugin");
const nodeExternals = require("webpack-node-externals");
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const packageJsonDeps = require("./package.json").dependencies;

// const { parsed: env } = require("dotenv").config();

const env = {
  PORT:3001,
REMOTE_URLS:{ "webpackRemote2": "http://localhost:3003" }
}

const REMOTE_URLS = env.REMOTE_URLS;

const REMOTES = Object.entries(REMOTE_URLS)
  .map(([name, entry]) => ({
    [name]: `${entry}/static/container.js`,
  }))
  .reduce((acc, n) => ({ ...acc, ...n }), {});

/**
 * @type {webpack.Configuration}
 */
const clientConfig = {
  entry: { app: ["./src/index.js"] },
  output: {
    path: path.resolve("./public/build"),
  },
  resolve: {
    fallback: {
      process: false,
    },
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "esbuild-loader",
          options: {
            loader: "jsx",
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      REMOTE_URLS,
    }),
    new MiniCssExtractPlugin(),
    new StatsWriterPlugin({
      filename: "stats.json",
      stats: { all: true },
    }),
    new FederatedStatsPlugin({
      filename: "federation-stats.json",
    }),
    new webpack.container.ModuleFederationPlugin({
      name: "webpackRemote",
      filename: "remote-entry.js",
      exposes: {
        "./header": "./src/components/header.jsx",
      },
      shared: ["react", "react-dom"],
      remotes: REMOTES,
    }),
  ],
  optimization: {
    minimizer: [new ESBuildMinifyPlugin({})],
  },
};

/**
 * @type {webpack.Configuration}
 */
const serverConfig = {
  target: "node",
  entry: { app: "./src/components/app.jsx" },
  output: {
    path: path.resolve("./dist"),
    library: { type: "commonjs" },
  },
  externals: [nodeExternals()],
  externalsPresets: { node: true },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "esbuild-loader",
          options: {
            loader: "jsx",
          },
        },
      },
      {
        test: /\.css$/,
        use: {
          loader: "css-loader",
          options: {
            modules: {
              exportOnlyLocals: true,
            },
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      REMOTE_URLS,
    }),
    new webpack.container.ModuleFederationPlugin({
      name: "webpackRemote",
      filename: "remote-entry.js",
      library: { type: "commonjs" },
      exposes: {
        "./header": "./src/components/header.jsx",
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: packageJsonDeps.react,
        },
      },
      remotes: REMOTES,
    }),
  ],
  optimization: {
    minimize: false,
  },
};

module.exports = [clientConfig, serverConfig];
