import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initPage = {
  draw: 1,
  length: 20,
  count: undefined,
  orderBy: {}
};

class MenuStore {
  constructor(ctx, initialState) {
    this.ForwardAPI = new ForwardAPI(ctx);
  }

  //  菜单列表
  @observable
  _menuList = [];
  @computed.struct
  get menuList() {
    return this._menuList;
  }

  @observable
  _pageQuery = initPage;

  @action
  reset() {
    this._pageQuery = initPage;
    this._menuList = [];
  }

  @action
  fetchMenuList = async params => {
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/menu/page',
      params: {
        pageQuery: pageQuery(this._pageQuery)
      }
    });
    this._menuList = list;
    this._pageQuery = page;
    return list;
  };

  @action
  fetchMenuOption = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/menu/tree/query',
      params: {}
    });
    return data;
  };

  @action
  fetchMenuAll = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/menu/list',
      params: {}
    });
    return data;
  };

  @action
  fetchBasicOption = async () => {
    const data = await this.ForwardAPI.toJava({
      url: '/group/list',
      params: {}
    });
    return data;
  };

  @action
  saveMenu = async params => {
    const data = await this.ForwardAPI.toJava({
      url: `/menu/${params.id ? 'update' : 'create'}`,
      params
    });
    return data;
  };

  @action
  deleteMenu = async id => {
    console.log(id);
    return id;
  };

  @action
  saveMenuStore = async menus => {
    const data = await this.ForwardAPI.toJava({
      url: '/menu/tree/update',
      params: {
        menus
      }
    });
    return data;
  };
}

export default MenuStore;
