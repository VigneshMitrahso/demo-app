const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { CracoAliasPlugin, configPaths } = require("react-app-rewire-alias");
const path = require("path");

const aliasMap = configPaths("./jsconfig.paths.json");

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {
        alias: aliasMap,
      },
    },
  ],

  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,

        "console-browserify": path.resolve(
          __dirname,
          "src/libs/console-browserify"
        ),

        // fs: require.resolve("node-libs-browser/mock/empty"),
        // child_process: require.resolve("node-libs-browser/mock/empty"),
        // net: require.resolve("node-libs-browser/mock/empty"),
      };

      // Add resolve extensions
      webpackConfig.resolve.extensions = [
        ...(webpackConfig.resolve.extensions || []),
        ".js",
        ".mjs",
      ];

      // Source map loader
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules\/chrome-launcher/,
        use: ["source-map-loader"],
      });

      return webpackConfig;
    },

    plugins: {
      add: [new NodePolyfillPlugin()],
    },
  },
};