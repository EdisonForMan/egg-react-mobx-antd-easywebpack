import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  deprecated: '-1',
  status: '-1',
  graveLevel: '-1',
  keywordType: '-1',
  businessType: '-1',
  nameAlike: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class NegativeLabelKeywordStore {
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
      query: {
        ...query(this._query),
        deprecated:
          this._query.deprecated == '-1' ? undefined : this._query.deprecated,
        graveLevel:
          this._query.graveLevel == '-1' ? undefined : this._query.graveLevel,
        keywordType:
          this._query.keywordType == '-1' ? undefined : this._query.keywordType,
        businessType:
          this._query.businessType == '-1'
            ? undefined
            : this._query.businessType
      }
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/negativeLabel/keyword/loadByPage',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  /**
   *  保存敏感词信息
   * @param {obj} keyword 编辑的网站
   */
  saveKeyword = async params => {
    const data = await this.ForwardAPI.toJava({
      url: `/negativeLabel/keyword/${params.id ? 'update' : 'create'}`,
      params: {
        ...params,
        operator: window.sysUserId
      }
    });
    return data;
  };
}

export default NegativeLabelKeywordStore;
