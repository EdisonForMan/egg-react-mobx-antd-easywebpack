import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  status: 'WAIT',
  resultType: '-1',
  updateEnd: undefined,
  updateStart: undefined,
  mobileNum: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class StrategyRelationOutStore {
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
      url: '/negativeLabel/rel/out/batchIgnore',
      params: {
        idList: Ids
      }
    });
    console.log(data);
    return data;
  };

  @action
  saveData = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/negativeLabel/rel/out/editrecord',
      params: { ...params, dataType: 'PHONE' }
    });
    return data;
  };

  @action
  fetchDataList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQuery),
      query: {
        ...query(this._query),
        resultType:
          this._query.resultType == '-1' ? undefined : this._query.resultType
      }
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/negativeLabel/rel/out/page',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };
}

export default StrategyRelationOutStore;
