import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  //  公司名
  corporationName: undefined,
  //  处理状态
  status: '-1',
  updateEnd: undefined,
  updateStart: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class AccumulationFundHandledStore {
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
      url: '/housefund/warehousing/page',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  /**
   * 保存、更新公积金公司
   * @param params {Object}
   */
  @action
  saveHandled = async params => {
    const data = await this.ForwardAPI.toJava({
      url: `/housefund/warehousing/${params.id ? 'updateStatus' : 'create'}`,
      params
    });
    return data;
  };

  /**
   * 一键重跑
   */
  @action
  redo = async () => {
    const data = await this.ForwardAPI.toJava({
      url: '/housefund/pending/refresh',
      params: {}
    });
    return data;
  };
}

export default AccumulationFundHandledStore;
