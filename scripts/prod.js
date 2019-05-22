'use strict';

const webpack = require('webpack');
const rm = require('rimraf');
const utils = require('./utils');
const config = require('./config');
const webpackConfig = require('./webpack.prod.config');
const distPath = utils.resolve(config.distPath);

rm(distPath, () => {
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      utils.fatal(err);
    }
  });
});
