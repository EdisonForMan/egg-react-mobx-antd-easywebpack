import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  createEnd: undefined,
  createStart: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class ReportStore {
  constructor(ctx, initialState) {
    this.ForwardAPI = new ForwardAPI(ctx);
  }

  @observable
  _listEcommerce = [];
  @computed.struct
  get listEcommerce() {
    return this._listEcommerce;
  }

  @observable
  _listNegativeLabel = [];
  @computed.struct
  get listNegativeLabel() {
    return this._listNegativeLabel;
  }

  @observable
  _pageQueryEcommerce = initPage;

  @observable
  _queryEcommerce = initTable;

  @observable
  _pageQueryNegativeLabel = initPage;

  @observable
  _queryNegativeLabel = initTable;

  @action
  reset() {
    this._pageQueryEcommerce = initPage;
    this._pageQueryNegativeLabel = initPage;
    this._queryEcommerce = initTable;
    this._queryNegativeLabel = initTable;
    this._listEcommerce = [];
    this._listNegativeLabel = [];
  }

  @action
  fetchEcommerceList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQueryEcommerce),
      query: query(this._queryEcommerce)
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/ecommerce/report',
      params
    });
    this._listEcommerce = list;
    this._pageQueryEcommerce = page;
  };

  @action
  fetchNegativeLabelList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQueryNegativeLabel),
      query: query(this._queryNegativeLabel)
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/negativeLabel/report',
      params
    });
    this._listNegativeLabel = list;
    this._pageQueryNegativeLabel = page;
  };
}

export default ReportStore;
