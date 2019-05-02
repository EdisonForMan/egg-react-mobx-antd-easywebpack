import BaseAntifraudAPI from './base_antifraud_api';
export default class ForwardJavaAPI extends BaseAntifraudAPI {
  toJava(params) {
    // 全局带上userId
    if (window.sysUserId && params.params) {
      params.params = {
        ...params.params,
        sysUserId: window.sysUserId || undefined
      };
    }
    //  如果id无效 去除id
    if (!params.id && params.id != 0) {
      delete params.id;
    }
    return this.post('/forward', params);
  }
}
