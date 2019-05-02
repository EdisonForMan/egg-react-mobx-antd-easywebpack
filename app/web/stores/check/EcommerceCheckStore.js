import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  ruleCode: undefined
};

class EcommerceCheckStore {
  constructor(ctx, initialState) {
    this.ForwardAPI = new ForwardAPI(ctx);
  }

  @observable
  _list = [];
  @computed.struct
  get list() {
    return this._list;
  }

  @observable
  _query = initTable;

  @action
  reset() {
    this._query = initTable;
    this._list = [];
  }

  /**
   * 电商信息抽查 不需要分页
   */
  @action
  fetchDataList = async () => {
    const params = {
      ...this._query
    };
    const list = await this.ForwardAPI.toJava({
      url: '/ecommerce/spotCheck',
      params
    });
    const _list = list.map((item, index) => {
      return { userId: item, id: index };
    });
    this._list = _list;
  };

  @action
  fetchTradeDetail = async userId => {
    const list = await this.ForwardAPI.toJava({
      url: `/ecommerce/tradeDetail/${userId}`,
      params: {}
    });
    return list;
  };
}

export default EcommerceCheckStore;
