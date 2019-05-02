import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  updateEnd: undefined,
  updateStart: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class AccumulationFundManagementStore {
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
  _listAccumulationFund = [];
  @computed.struct
  get listAccumulationFund() {
    return this._listAccumulationFund;
  }

  @observable
  _pageQueryEcommerce = initPage;

  @observable
  _queryEcommerce = initTable;

  @observable
  _pageQueryNegativeLabel = initPage;

  @observable
  _queryNegativeLabel = initTable;

  @observable
  _pageQueryAccumulationFund = initPage;

  @observable
  _queryAccumulationFund = initTable;

  @action
  reset() {
    this._pageQueryEcommerce = initPage;
    this._pageQueryNegativeLabel = initPage;
    this._pageQueryAccumulationFund = initPage;
    this._queryEcommerce = initTable;
    this._queryNegativeLabel = initTable;
    this._pageQueryAccumulationFund = initTable;
    this._listEcommerce = [];
    this._listNegativeLabel = [];
    this._listAccumulationFund = [];
  }

  /**
   * 获取选项
   */
  @action
  fetchBasicOption = async () => {
    const data = await this.ForwardAPI.toJava({
      url: '/exceptionrecord/sellists',
      params: {}
    });
    return data;
  };

  /**
   * 异常结案
   * @param fix <String> 后缀
   */
  @action
  exrecord = async fix => {
    const data = await this.ForwardAPI.toJava({
      url: '/exceptionrecord' + fix,
      params: {}
    });
    return data;
  };

  @action
  fetchList = async recordType => {
    const params = {
      pageQuery: pageQuery(
        recordType == 1
          ? this._pageQueryNegativeLabel
          : recordType == 2
          ? this._pageQueryEcommerce
          : this._pageQueryAccumulationFund
      ),
      query: {
        recordType,
        ...query(
          recordType == 1
            ? this._queryNegativeLabel
            : recordType == 2
            ? this._queryEcommerce
            : this._queryAccumulationFund
        )
      }
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/exceptionrecord/oper/page',
      params
    });
    switch (recordType) {
      case 1:
        this._listNegativeLabel = list;
        this._pageQueryNegativeLabel = page;
        break;
      case 2:
        this._listEcommerce = list;
        this._pageQueryEcommerce = page;
        break;
      case 3:
        this._listAccumulationFund = list;
        this._pageQueryAccumulationFund = page;
        break;
    }
  };
}

export default AccumulationFundManagementStore;
