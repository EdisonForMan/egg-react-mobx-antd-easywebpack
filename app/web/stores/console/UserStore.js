import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initPage = {
  draw: 1,
  length: 20,
  count: undefined,
  orderBy: {}
};

class UserStore {
  constructor(ctx, initialState) {
    this.ForwardAPI = new ForwardAPI(ctx);
    if (initialState && initialState[0]) {
    }
  }

  @observable
  _userList = [];
  @computed.struct
  get userList() {
    return this._userList;
  }
  @observable
  currentUser = {};
  @observable
  currentMenu = [];

  //  分页
  @observable
  _pageQuery = initPage;

  @action
  reset() {
    this._pageQuery = initPage;
    this._userList = [];
  }

  @action
  login = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/login/in',
      params
    });
    return data;
  };

  logout = async () => {
    const data = await this.ForwardAPI.toJava({
      url: '/login/out',
      params: {}
    });
    return data;
  };

  @action
  fetchUserSession = async () => {
    const user = await this.ForwardAPI.toJava({
      url: '/user/current/user/info',
      params: {}
    });
    this.currentUser = user;
    window.sysUserId = user.id;
    return user;
  };

  @action
  fetchMenus = async userId => {
    const menus = await this.ForwardAPI.toJava({
      url: '/user/menu/tree',
      params: {
        userId
      }
    });
    this.currentMenu = menus;
    return menus;
  };

  @action
  fetchUserList = async params => {
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/user/page',
      params: {
        pageQuery: pageQuery(this._pageQuery)
      }
    });
    this._userList = list;
    this._pageQuery = page;
    return list;
  };

  @action
  saveUser = async params => {
    const data = await this.ForwardAPI.toJava({
      url: `/user/${params.userId ? 'update' : 'create'}`,
      params
    });
    return data;
  };

  @action
  updatePassword = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/user/password/modify',
      params
    });
    return data;
  };

  @action
  adminUpdatePassword = async params => {
    const data = await this.ForwardAPI.toJava({
      url: '/user/password/modify',
      params: {
        ...params
      }
    });
    return data;
  };

  @action
  updateToAdmin = async userId => {
    const result = await this.userAPI.updateToAdmin(userId);
    return result;
  };

  @action
  fetchUserInfo = async userId => {
    const result = await this.userAPI.fetchUserInfo(userId);
    return result;
  };

  //console
  @action
  fetchBasicOption = async () => {
    const data = await this.ForwardAPI.toJava({
      url: '/group/list',
      params: {}
    });
    return data;
  };
}

export default UserStore;
