'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { forwardController, pageController } = controller;

  router.get('/', pageController.index);

  //require('./router/page')(app);
  app.get('/login', pageController.login);
  app.get('/home(/.+)?', pageController.index);

  const prefix = '/api/forward';
  router.post(`${prefix}`, forwardController.index);
  router.post(`${prefix}/file`, forwardController.file);
};
