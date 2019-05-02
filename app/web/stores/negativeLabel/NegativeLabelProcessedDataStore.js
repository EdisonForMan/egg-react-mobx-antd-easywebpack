import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  dataType: '-1',
  status: '-1',
  cautionLevel: '-1',
  dataTag: '-1',
  nameAlike: undefined,
  updateEnd: undefined,
  updateStart: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class NegativeLabelProcessedDataStore {
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

  /**
   * 脱敏函数
   */
  @action
  desensitizationStatus = id => {
    this._list = this._list.map(item => {
      if (item.id == id) {
        item.desensitization = !item.desensitization;
      }
      return item;
    });
  };

  @action
  fetchDataList = async () => {
    const params = {
      pageQuery: pageQuery(this._pageQuery),
      query: {
        ...query(this._query),
        dataType:
          this._query.dataType == '-1' ? undefined : this._query.dataType,
        cautionLevel:
          this._query.cautionLevel == '-1'
            ? undefined
            : this._query.cautionLevel,
        dataTag: this._query.dataTag == '-1' ? undefined : this._query.dataTag
      }
    };
    const { list, page } = await this.ForwardAPI.toJava({
      url: '/negativeLabel/getProcessedList',
      params
    });
    this._list = list.map(item => {
      if (item.dataType == 'PHONE' && /^1\d{10}$/.test(item.data)) {
        item.desensitization = true;
      }
      return item;
    });
    this._pageQuery = page;
  };

  /**
   *  保存信息
   * @param {obj} data 编辑的数据
   */
  saveData = async params => {
    const data = await this.ForwardAPI.toJava({
      url: `/negativeLabel/${
        params.id ? 'updateProcessedData' : 'addProcessedData'
      }`,
      params
    });
    return data;
  };
}

export default NegativeLabelProcessedDataStore;
