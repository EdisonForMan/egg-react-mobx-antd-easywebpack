import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  //  策略类型
  strategy: '1',
  //  处理状态
  status: '0',
  updateEnd: undefined,
  updateStart: undefined,
  otherSide: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class EcommercePendingDataStore {
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
  _pageQuery = initPage;

  @observable
  _query = initTable;

  @action
  reset() {
    this._pageQuery = initPage;
    this._query = initTable;
    this._list = [];
  }

  @action
  fetchDataList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQuery),
      query: query(this._query)
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/ecommerce/toProcessList',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  @action
  fetchOtherSideList = async name => {
    const data = await this.ForwardAPI.toJava({
      url: '/ecommerce/queryOtherSideByName',
      params: {
        name
      }
    });
    return data;
  };

  @action
  fetchTradeList = async userId => {
    const data = await this.ForwardAPI.toJava({
      url: `/ecommerce/tradeDetail/${userId}`,
      params: {}
    });
    return data;
  };

  @action
  doBatch = async (Ids, Ignore, params) => {
    let data = null;
    if (Ignore) {
      data = await this.ForwardAPI.toJava({
        url: '/ecommerce/ecommerceConfirm',
        params: {
          idList: Ids
        }
      });
    } else {
      data = await this.ForwardAPI.toJava({
        url: '/ecommerce/batchEditEcommerceData',
        params: {
          ...params,
          keyword: Ids,
          enabled: params.enabled || true
        }
      });
    }
    return data;
  };

  @action
  check = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/ecommerce/checkEcommerceExpression',
      params
    });
    return data;
  };

  @action
  editEcommerceData = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/ecommerce/editEcommerceData',
      params: {
        ...params,
        enabled: params.enabled || true
      }
    });
    return data;
  };

  @action
  fetchTagTree = async type => {
    const url =
      type == 1 ? '/behaviorLabel/query' : '/behaviorLabel/transactionquery';
    const data = await this.ForwardAPI.toJava({
      url,
      params: {}
    });
    return data;
  };
}

export default EcommercePendingDataStore;
