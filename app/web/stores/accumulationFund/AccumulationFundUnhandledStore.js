import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  //  公司名
  corporationName: undefined,
  //  处理状态
  status: '0',
  updateEnd: undefined,
  updateStart: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class AccumulationFundUnhandledStore {
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
      url: '/housefund/pending/page',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  /**
   * 获取用户列表详情
   * @param corporationName {String}
   * @param page {Object}
   */
  @action
  fetchCount = async (corporationName, page) => {
    const params = {
      pageQuery: page,
      query: { corporationName }
    };
    const data = await this.ForwardAPI.toJava({
      url: '/housefund/pending/houseFund/page',
      params
    });
    return data;
  };

  /**
   * 批量修改状态
   * @param params {Object} 提交对象
   */
  @action
  batchUpdate = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/housefund/pending/updateStatus',
      params
    });
    return data;
  };
}

export default AccumulationFundUnhandledStore;
