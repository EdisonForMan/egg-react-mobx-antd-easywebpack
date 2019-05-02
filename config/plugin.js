'use strict';

/** @type Egg.EggPlugin */
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.static = true;

exports.reactssr = {
  enable: true,
  package: 'egg-view-react-ssr'
};
