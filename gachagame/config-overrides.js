const {
    addWebpackAlias,
    addWebpackResolve,
    addWebpackPlugin,
    override,
} = require("customize-cra");
const path = require("path");
const webpack = require("webpack");

module.exports = override(
    addWebpackResolve({
        fallback: {
            stream: require.resolve("stream-browserify"),
            zlib: require.resolve("browserify-zlib"),
            crypto: require.resolve("crypto-browserify"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            url: require.resolve("url"),
            path: require.resolve("path-browserify"),
            os: require.resolve("os-browserify/browser"),
            net: false,
            tls: false,
            fs: false,
            assert: require.resolve("assert/"),
        },
    }),

    addWebpackAlias({
        "@": path.resolve(__dirname, "src"),
    }),

    addWebpackPlugin(
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        })
    )

);
