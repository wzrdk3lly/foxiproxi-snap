// workaround for gatsby not wanting to serve static html files in dev mode :(
const express = require(`express`);

// Enable development support for serving HTML from `./static` folder
exports.onCreateDevServer = ({ app }) => {
  app.use(express.static('static'));
};
