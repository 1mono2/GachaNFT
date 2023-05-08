const { override, addWebpackAlias } = require("customize-cra");

module.exports = override(
    addWebpackAlias({
        stream: require.resolve("stream-browserify"),
    })
);
