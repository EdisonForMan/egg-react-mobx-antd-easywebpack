import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  businessType: 'QQ号',
  dataTag: 'QZ'
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class NegativeLabelCheckStore {
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
      ...query(this._query)
    };
    const list = await this.ForwardAPI.toJava({
      url: '/negativeLabel/spotCheck',
      params
    });
    this._list = list;
    //this._pageQuery = page;
  };
}

export default NegativeLabelCheckStore;
