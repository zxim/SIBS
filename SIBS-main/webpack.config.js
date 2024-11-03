const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // 기타 Webpack 설정
  plugins: [
    new NodePolyfillPlugin()
  ],
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
    }
  }
};
