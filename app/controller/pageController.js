'use strict';

const Controller = require('egg').Controller;

class PageController extends Controller {
  async index() {
    const { ctx } = this;
    //const { response } = await isLogin(ctx);
    const response = {
      status : true
    };
    if (!response || !response.status || (response && response.status && response.status.code == 10003)) {
      return ctx.redirect(`/login`);
    } else {
      await ctx.render('app.js');
    }
  }

  async login() {
    const { ctx } = this;
    await ctx.render('login.js');
  }
}

module.exports = PageController;