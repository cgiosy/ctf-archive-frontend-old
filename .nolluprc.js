export default {
  hot: true,
  contentBase: "./public",
  publicPath: "/assets/",
  historyApiFallback: "index.html",
  proxy: {
    "/api": {
      host: "https://ctf-archive.com",
      changeOrigin: true,
    },
  },
  port: 5000,
};
