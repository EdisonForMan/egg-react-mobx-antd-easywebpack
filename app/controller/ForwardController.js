const Controller = require('egg').Controller;
const superagent = require('superagent');
const qs = require('querystring');

/**
 * 转发接口
 * @param {Object} ctx
 */
const goJavaInterface = ctx => {
  const query = ctx.request.body;
  const shiro_cookie = ctx.cookies.get('SHIRO-COOKIE');
  let javaGateway = ctx.app.config.externalAPI.javaGateway;
  console.log(`request ---> ${javaGateway.baseURL + query.url}`);
  const promise = new Promise((resolver, reject) => {
    const _params =
      query.contentType == 'form' ? qs.stringify(query.params) : query.params;
    superagent
      .post(javaGateway.baseURL + query.url)
      .send(_params)
      .set(
        'Content-Type',
        `application/${
          query.contentType == 'form' ? 'x-www-form-urlencoded' : 'json'
        }`
      )
      .set('Cookie', `SHIRO-COOKIE=${shiro_cookie}; Path=/; HttpOnly`)
      .set('Accept', 'application/json')
      .then(res => {
        resolver({
          response: JSON.parse(res.text),
          cookie: res.header['set-cookie']
        });
      })
      .catch(err => {
        resolver(err);
      });
  });
  return promise;
};

/**
 * 获取shiro-cookie
 * @param {*} arr set-cookie 数组
 */
const getSHIRO_COOKIE = arr => {
  let shirocookie = '';
  arr.map(item => {
    item.split(';').map(v => {
      if (v.includes('SHIRO-COOKIE')) {
        shirocookie = v.split('SHIRO-COOKIE=')[1];
      }
    });
  });
  return shirocookie;
};

class ForwardController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async index() {
    const { ctx } = this;
    const { response, cookie } = await goJavaInterface(ctx);
    //  如果有cookie返回则为登录接口 setcookie
    if (cookie && cookie.length) {
      ctx.cookies.set('SHIRO-COOKIE', getSHIRO_COOKIE(cookie));
    }
    //ctx.logger.info(response);
    /**
     * HTTP错误 返回status为number
     */
    if (typeof response.status === 'number' && response.status != 200) {
      ctx.status = response.status;
      ctx.body = this.ServerResponse.createByErrorMsg(`[${response.status}]`);
    }
    if (response.status.code == 10003) {
      ctx.status = 401;
      ctx.body = this.ServerResponse.createByErrorMsg('用户未登录');
    } else {
      ctx.body = this.ServerResponse.createBySuccessData(response);
    }
  }

  /**
   * 文件转发接口
   * @example config/config.default.js 增加支持格式
   */
  async file() {
    const { ctx, app } = this;
    ctx.body = this.ServerResponse.createByErrorMsg('用户未登录');
  }
}

module.exports = ForwardController;
