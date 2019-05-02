const axios = require('axios');
const { message } = require('antd');
const BusinessError = require('./error/business_error');
const HTTPError = require('./error/http_error');

export default class BaseAPI {
  constructor(config) {
    const { baseURL, defaultOptions } = config;
    const httpclient = axios.create({
      baseURL,
      ...defaultOptions
      /*transformResponse: [
        function(data) {
          // 对 data 进行Long类型处理
          if (data) {
            data = JSON.parse(
              data.replace(/"\w+":\d{14,}/g, match => {
                return `${match.replace(/:/i, ':"')}"`;
              })
            );
          }
          return data;
        }
      ]*/
      /*transformRequest: [
        function(data, instance) {
          return instance['Content-Type'] == 'application/x-www-form-urlencoded'
            ? data
            : JSON.stringify(data).replace(/"\w+":"\d{14,}"/g, match => {
                return match.replace(/:"/i, ':').replace(/"$/gi, '');
              });
        }
      ]*/
    });

    this.httpclient = httpclient;
    this.config = config;
  }

  curl(path, options = {}) {
    const { defaultOptions } = this.config;
    const finalOptions = Object.assign(
      {
        url: path
      },
      defaultOptions,
      options
    );
    return this.httpclient(finalOptions);
  }

  async getCurl(path, options = {}) {
    try {
      const responseData = await this.curl(path, options);
      return responseData;
    } catch (err) {
      if (err instanceof BusinessError) {
        message.error(err.message || '系统繁忙，请稍后重试', 2);
      }
      if (err instanceof HTTPError) {
        if (err.status === 401) {
          if (typeof window !== 'undefined') {
            const { pathname, search } = window.location;
            window.location.href = `/login?from=${encodeURIComponent(
              pathname + search
            )}`;
          }
        } else {
          if (typeof window !== 'undefined') {
            message.error(err.message || '系统繁忙，请稍后重试', 2);
          }
        }
      }
      throw err;
    } finally {
    }
  }

  post(path, data, options = {}) {
    return this.getCurl(path, {
      ...options,
      method: 'POST',
      data
    });
  }

  get(path, data, options = {}) {
    return this.getCurl(path, {
      ...options,
      method: 'GET',
      params: data
    });
  }

  put(path, data, options = {}) {
    return this.getCurl(path, {
      ...options,
      method: 'PUT',
      data
    });
  }

  delete(path, data, options = {}) {
    return this.getCurl(path, {
      ...options,
      method: 'DELETE',
      data
    });
  }
}

BaseAPI.IS_NODE = typeof window === 'undefined';