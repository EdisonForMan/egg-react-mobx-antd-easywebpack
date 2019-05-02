import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  queryType: '',
  value: ''
};

const initPage = {
  draw: 1,
  length: 20,
  count: undefined,
  orderBy: {}
};

class BlackListManagementStore {
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
      url: '/externalloan/blacklist/loadByPage',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  /**
   * 新增/编辑黑名单
   * @param black <Object> 黑名单信息
   */
  @action
  saveBlack = async black => {
    const result = await this.ForwardAPI.toJava({
      url: `/externalloan/blacklist/${
        black.id ? 'editRecord' : 'insertRecord'
      }`,
      params: { ...black }
    });
    return result;
  };

  /**
   * 批量删除黑名单
   * @param Ids <Array> id数组
   */
  @action
  deleteBlack = async ids => {
    const result = await this.ForwardAPI.toJava({
      url: '/externalloan/blacklist/deleteRecoed',
      params: { ids }
    });
  };
}

export default BlackListManagementStore;
