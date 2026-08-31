const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { CracoAliasPlugin, configPaths } = require("react-app-rewire-alias");
const aliasMap = configPaths("./jsconfig.paths.json");
const path = require("path");

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: { alias: aliasMap },
    },
  ],
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        // "react/jsx-runtime": require.resolve("react/jsx-runtime.js"),
        "console-browserify": path.resolve(
          __dirname,
          "src/libs/console-browserify",
        ),
        fs: require.resolve("node-libs-browser/mock/empty"),
        child_process: require.resolve("node-libs-browser/mock/empty"),
        net: require.resolve("node-libs-browser/mock/empty"),
      };

      // Add resolve extensions for '.mjs' and '.js'
      webpackConfig.resolve.extensions = [
        ...(webpackConfig.resolve.extensions || []),
        ".js",
        ".mjs",
      ];

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
