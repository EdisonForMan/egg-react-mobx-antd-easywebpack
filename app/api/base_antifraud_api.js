
import BaseAPI from './base_api';
const BusinessError = require('./error/business_error');
const HTTPError = require('./error/http_error');
export default class BaseAntifraudAPI extends BaseAPI {
  constructor(ctx) {
    let config = {};

    // 服务端实例化会传入ctx，否则为客户端实例化
    if (BaseAPI.IS_NODE) {
      const { baseURL, defaultOptions } = ctx.app.config.externalAPI.fwGateway;
      config = { baseURL, defaultOptions };
    } else {
      config = window.__API_CONFIG__.fwGateway; // eslint-disable-line no-underscore-dangle
    }

    super(config);

    this.ctx = ctx;
  }

  createCookieHeader() {
    const cookieKeys = ['publish_sid', 'publish_sid.sig'];
    const { cookies } = this.ctx;

    let cookieStr = '';
    cookieKeys.forEach(k => {
      const v = cookies.get(k, { signed: false });
      if (v) {
        cookieStr += `${k}=${v};`;
      }
    });

    return { Cookie: cookieStr };
  }

  async curl(path, options = {}) {
    const opt = options;
    if (BaseAPI.IS_NODE) {
    }
    try {
      const result = await super.curl(path, opt);
      const { data: resData } = result.data;
      if (resData.status && resData.status.code > 0) {
        throw new BusinessError(resData.status.code, resData.status.msg);
      }
      if (resData.errno) {
        throw new BusinessError(resData.address, resData.errno);
      }
      return JSON.parse(
        JSON.stringify(resData.result).replace(/"\w":\d{14,}/, match => {
          return `${match.replace(/:/i, ':"')}"`;
        })
      );
    } catch (err) {
      // 处理HTTP错误
      if (err.response && err.request) {
        throw new HTTPError(err);
      }
      throw err;
    }
  }
}