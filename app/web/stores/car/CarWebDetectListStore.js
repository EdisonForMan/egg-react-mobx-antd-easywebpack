import { action, observable, computed } from 'mobx';
import ForwardAPI from 'api/forward';
import { pageQuery, query } from 'stores/common';

const initTable = {
  //  处理状态
  relevances: 12,
  brand: undefined,
  carSeries: undefined,
  model: undefined
};

const initPage = {
  draw: 1,
  length: 10,
  count: undefined,
  orderBy: {}
};

class CarWebDetectListStore {
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
      url: '/car/config/pagequery',
      params
    });
    this._list = list;
    this._pageQuery = page;
  };

  /**
   * 获取车辆网查信息
   * @param id String<Long> id
   */
  @action
  fetchWebDetect = async id => {
    const data = await this.ForwardAPI.toJava({
      url: `/car/config/${id}`,
      params: {}
    });
    return data;
  };

  /**
   * 获取基础的选项列表信息
   */
  fetchTypeOption = async () => {
    const _priceType = await this.ForwardAPI.toJava({
      url: '/car/price/types',
      params: {}
    });
    const _keepperType = await this.ForwardAPI.toJava({
      url: '/car/keepper/types',
      params: {}
    });
    const pricecType = _priceType.map(item => {
      return {
        key: `${item.brand}${item.carSeries ? `/${item.carSeries}` : ''}${
          item.model ? `/${item.model}` : ''
        }`
      };
    });
    const keepperType = _keepperType.map(item => {
      return {
        key: `${item.brand}${item.carSeries ? `/${item.carSeries}` : ''}${
          item.model ? `/${item.model}` : ''
        }`
      };
    });
    return { pricecType, keepperType };
  };

  /**
   * 预览获取
   * @param type <String> 类型
   * @param obj <Object> 相关信息
   */
  preView = async (type, key) => {
    const _key = key.split('/');
    const _preData = await this.ForwardAPI.toJava({
      url: `/car/${type}/detail`,
      params: {
        brand: _key[0],
        carSeries: _key[1],
        model: _key[2]
      }
    });
    return _preData;
  };

  /**
   * 预览获取
   * @param type <String> 类型
   * @param obj <Object> 相关信息
   * @param id <String> carId 车Id
   * @param id <String> userId 操作员Id
   */
  doLink = async (type, key, id) => {
    const _key = key.split('/');
    const _preData = await this.ForwardAPI.toJava({
      url: `/car/editRel/${type}/${id}/${window.sysUserId}`,
      params: {
        brand: _key[0],
        carSeries: _key[1],
        model: _key[2]
      }
    });
    return _preData;
  };
}

export default CarWebDetectListStore;
