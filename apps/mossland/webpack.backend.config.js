const { composePlugins, withNx } = require("@nx/webpack");
const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");

module.exports = composePlugins(withNx(), (config) => {
  if (process.env.HMR !== "true") return config;
  Object.assign(config, {
    entry: [path.join(__dirname, "../../node_modules/webpack/hot/poll?100"), "apps/epochxy/server.ts"], //this
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    mode: "development",
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new RunScriptWebpackPlugin({ name: "server.js", autoRestart: true }),
    ],
    output: {
      path: path.join(__dirname, "../../dist/apps/epochxy/backend"),
      filename: "server.js",
    },
  });
  config.externals.push(
    nodeExternals({
      allowlist: ["webpack/hot/poll?100"],
    })
  );
  return config;
});
