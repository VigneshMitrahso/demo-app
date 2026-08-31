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
      // Set up aliases
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "react/jsx-runtime": require.resolve("react/jsx-runtime.js"),
      };

      // Set up fallbacks for node modules - using false to disable them
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        dns: false,
      };

      // Add resolve extensions
      webpackConfig.resolve.extensions = [
        ...(webpackConfig.resolve.extensions || []),
        ".js",
        ".mjs",
      ];

      // Add source-map-loader rule
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules\/chrome-launcher/,
        use: ["source-map-loader"],
      });

      return webpackConfig;
    },
    plugins: {
      add: [
        new NodePolyfillPlugin({
          // Exclude problematic polyfills
          excludeAliases: [],
        }),
      ],
    },
  },
};
