import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initPage = {
  draw: 1,
  length: 20,
  count: undefined,
  orderBy: {}
};

class GroupStore {
  constructor(ctx, initialState) {
    this.ForwardAPI = new ForwardAPI(ctx);
  }

  @observable
  _groupList = [];
  @computed.struct
  get groupList() {
    return this._groupList;
  }

  @observable
  _pageQuery = initPage;

  @action
  reset() {
    this._pageQuery = initPage;
    this._groupList = [];
  }

  @action
  fetchGroupList = async params => {
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/group/page',
      params: {
        pageQuery: pageQuery(this._pageQuery)
      }
    });
    this._groupList = list;
    this._pageQuery = page;
    return list;
  };

  @action
  fetchBasicOption = async () => {
    const data = await this.ForwardAPI.toJava({
      url: '/menu/tree/query',
      params: {}
    });
    return data;
  };

  @action
  saveGroup = async params => {
    const data = await this.ForwardAPI.toJava({
      url: `/group/${params.groupId ? 'update' : 'create'}`,
      params
    });
    return data;
  };
}

export default GroupStore;
