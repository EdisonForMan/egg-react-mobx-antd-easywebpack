import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';

class ImportStore {
  constructor(ctx, initialState) {
    this.ForwardAPI = new ForwardAPI(ctx);
  }

  /**
   * 批量保存
   */
  saveBatch = async batch => {
    const data = await this.ForwardAPI.toJava({
      url: '/externalloan/blacklist/saveData',
      params: { dataStr: JSON.stringify(batch) }
    });
    return data;
  };
}

export default ImportStore;
