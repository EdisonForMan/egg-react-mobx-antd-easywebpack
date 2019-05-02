import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  status: '-1',
  updateEnd: undefined,
  updateStart: undefined,
  userId: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class StrategyRelationInStore {
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
  doBatch = async Ids => {
    const data = await this.ForwardAPI.toJava({
      url: '/negativeLabel/rel/in/batchDone',
      params: {
        idList: Ids
      }
    });
    return data;
  };

  @action
  fetchDataList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQuery),
      query: query(this._query)
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/negativeLabel/rel/in/page',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  @action
  fetchLinkList = async (type, userId) => {
    const _ = type == 'merchant' ? 'TaobaoAcc' : type == 'qq' ? 'QQ' : 'PHONE';
    const data = await this.ForwardAPI.toJava({
      url: `/negativeLabel/rel/in/relationship/${userId}/${_}`,
      params: {}
    });
    return data;
  };

  @action
  fetchLink_List = async (type, userId) => {
    const url =
      type == 'merchant'
        ? `/ecommerce/tradeDetail/${userId}`
        : `/negativeLabel/rel/in/${
            type == 'qq' ? 'qq' : 'usercontact'
          }/${userId}`;
    const data = await this.ForwardAPI.toJava({
      url,
      params: {}
    });
    return data;
  };

  @action
  fetchWebResult = async (data, dataType) => {
    const _data = await this.ForwardAPI.toJava({
      url: '/dataquery/net/result',
      params: {
        data,
        dataType
      }
    });
    return _data;
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
        enabled: true
      }
    });
    return data;
  };

  @action
  editRecord = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/negativeLabel/rel/in/editrecord',
      params: { ...params, operator: window.sysUserId }
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

export default StrategyRelationInStore;
