import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  //  网站名称
  platform: undefined,
  //  网站地址
  web: undefined,
  //  状态
  status: '-1'
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class WebManagementStore {
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
  fetchWebList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQuery),
      query: query(this._query)
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/dishonesty/configPage',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  /**
   *  保存网站信息
   * @param {obj} web 编辑的网站
   */
  saveWeb = async web => {
    const data = await this.ForwardAPI.toJava({
      url: `/dishonesty/${web.id ? 'editConfig' : 'createConfig'}`,
      params: { ...web, status: parseInt(web.status) }
    });
    return data;
  };
}

export default WebManagementStore;
