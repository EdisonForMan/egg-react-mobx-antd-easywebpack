import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';

class WebDetectStore {
  constructor(ctx, initialState) {
    this.ForwardAPI = new ForwardAPI(ctx);
  }

  @action
  WebDetect = async (data, dataType) => {
    const _data = await this.ForwardAPI.toJava({
      url: '/dataquery/net/result',
      params: {
        data,
        dataType
      }
    });
    return _data;
  };
}

export default WebDetectStore;
