import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  //  策略类型
  policyType: '1',
  businessType: '-1',
  status: 'WAIT',
  resultType: '-1',
  updateEnd: undefined,
  updateStart: undefined,
  nameAlike: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class StrategyDensityStore {
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
  desensitizationStatus = id => {
    this._list = this._list.map(item => {
      if (item.id == id) {
        item.desensitization = !item.desensitization;
      }
      return item;
    });
  };

  @action
  fetchDataList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQuery),
      query: {
        ...query(this._query),
        businessType:
          this._query.businessType == '-1'
            ? undefined
            : this._query.businessType,
        resultType:
          this._query.resultType == '-1' ? undefined : this._query.resultType
      }
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/negativeLabel/getPendingList',
      params
    });
    this._list = list.map(item => {
      if (
        (item.businessType == '通讯录' || item.businessType == '通话记录') &&
        /^1\d{10}$/.test(item.data)
      ) {
        item.desensitization = true;
      }
      return item;
    });
    this._pageQuery = page;
  };

  @action
  saveData = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/negativeLabel/updatePendingData',
      params: { ...params, policyType: '1', operator: window.sysUserId }
    });
    return data;
  };

  @action
  doBatch = async (Ids, Ignore) => {
    const data = await this.ForwardAPI.toJava({
      url: `/negativeLabel/${
        Ignore ? 'updateIgnore' : 'batchUpdatePendingData'
      }`,
      params: {
        ids: Ids
      }
    });
    return data;
  };
}

export default StrategyDensityStore;
