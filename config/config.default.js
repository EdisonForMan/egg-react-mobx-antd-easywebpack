/* eslint valid-jsdoc: "off" */
    
const path = require('path');
const fs = require('fs');
'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1556632511662_605';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // middleware
  config.middleware = ['parseConfig'];

  // url
  config.configCenter = {
    url:
      'http://super-diamond.dashu.ds:8090/superdiamond/preview/antifraud-frontend/development?format=json'
  };

  // static
  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public')
  };

  // external
  config.externalAPI = {
    fwGateway: {
      //  接口入口地址
      baseURL: 'http://192.168.5.65:7001/api'
    },
    javaGateway: {
      //  后端java接口地址
      baseURL: 'http://192.168.5.147:8084/risk-control-operating-system'
    }
  }

  return {
    ...config,
    ...userConfig,
  };
};
