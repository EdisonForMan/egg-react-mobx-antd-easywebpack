import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Select, Divider, message } from 'antd';
const { Option } = Select;
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import './Detail.less';

@observer
class CarDetail extends Component {
  state = {
    configSwitch: false,
    priceSwitch: false,
    keepperSwitch: false,
    //
    id: undefined,
    yf: undefined,
    config: undefined,
    preConfig: undefined,
    carPrice: undefined,
    preCarPrice: undefined,
    keepPercent: undefined,
    preKeepPercent: undefined,
    // link
    configLinkVal: undefined,
    priceLinkVal: undefined,
    keepperLinkVal: undefined
  };

  async componentDidMount() {
    const { configType, pricecType, keepperType } = this.props;
    //  优先渲染页面configType
    await this._fetchCar();
    this.setState({
      configLinkVal: configType[0].key,
      priceLinkVal: pricecType[0].key,
      keepperLinkVal: keepperType[0].key
    });
  }

  /**
   * 获取车辆信息
   */
  async _fetchCar() {
    const { car, fetchCar } = this.props;
    //  优先渲染页面
    const { yf, base } = await fetchCar(car.id);
    const { carPrice, keepPercent } = base.config;
    this.setState({
      yf,
      config: base.config,
      id: base.id,
      carPrice,
      keepPercent
    });
  }

  columns() {
    return [
      {
        title: '车辆年限',
        dataIndex: 'year'
      },
      {
        title: '保值率',
        dataIndex: 'keep'
      }
    ];
  }

  /**
   * 预览
   * @param {*} type
   */
  @autobind
  async preView(type) {
    const { preView } = this.props;
    const { configLinkVal, priceLinkVal, keepperLinkVal } = this.state;
    const _view = await preView(
      type,
      type == 'config'
        ? configLinkVal
        : type == 'price'
        ? priceLinkVal
        : keepperLinkVal
    );
    if (Object.keys(_view).length) {
      if (type == 'config') {
        //  配置预览时 配置 价格 保值 都会改变
        const { carPrice, keepPercent } = _view;
        this.setState({
          preConfig: _view,
          preCarPrice: carPrice,
          preKeepPercent: keepPercent
        });
      } else if (type == 'price') {
        this.setState({ preCarPrice: _view });
      } else if (type == 'keepper') {
        this.setState({ preKeepPercent: _view });
      }
    }
  }

  /**
   * 关联
   * @param {*} type
   */
  @autobind
  async doLink(type) {
    const { doLink, car } = this.props;
    const {
      configLinkVal,
      priceLinkVal,
      keepperLinkVal,
      config,
      id
    } = this.state;
    const _view = await doLink(
      type,
      type == 'config'
        ? configLinkVal
        : type == 'price'
        ? priceLinkVal
        : keepperLinkVal,
      type == 'config' ? id : config.id
    );
    message.info('关联成功');
    this._fetchCar();
  }

  /**
   * 打开关联
   * @param {*} tip
   */
  openSwitch(tip) {
    const obj = {};
    obj[`${tip}Switch`] = true;
    this.setState(obj);
  }

  /**
   * 关闭关联
   * @param {*} tip
   */
  closeSwitch(tip) {
    const { configType, pricecType, keepperType } = this.props;
    const obj = {};
    obj[`${tip}Switch`] = false;
    obj['configLinkVal'] = configType[0].key;
    obj['priceLinkVal'] = pricecType[0].key;
    obj['keepperLinkVal'] = keepperType[0].key;
    if (tip == 'config') {
      obj['preConfig'] = undefined;
      obj['preCarPrice'] = undefined;
      obj['preKeepPercent'] = undefined;
    } else if (tip == 'price') {
      obj['preCarPrice'] = undefined;
    } else if (tip == 'keepper') {
      obj['preKeepPercent'] = undefined;
    }
    this.setState(obj);
  }

  /**
   * 标题下发
   * @param {*} title 标题
   * @param {*} type 关联类型 config配置 price价格 keepper保值
   * @param {*} rawdataTimeStr 查得时间
   * @param {*} open 是否打开
   */
  renderTitle(title, type, rawdataTimeStr, open) {
    const { configType, pricecType, keepperType } = this.props;
    const {
      configLinkVal,
      priceLinkVal,
      keepperLinkVal,
      config,
      id
    } = this.state;
    const url =
      type == 'config'
        ? 'http://www.haicj.com/carmodel'
        : type == 'price'
        ? 'https://www.autohome.com.cn/'
        : 'https://www.che168.com/keepvalue/result_3294.html';
    return (
      <div className="detail-header">
        <div className="detail-title">
          <span>{title}</span>
          {type ? (
            <a
              href="javascript:"
              onClick={() => {
                this.openSwitch(type);
              }}
            >
              关联
            </a>
          ) : (
            undefined
          )}
          <span style={{ marginLeft: '10px' }}>
            查得时间: {rawdataTimeStr}{' '}
          </span>
          {type ? (
            <a href={url} target="_blank">
              查看来源
            </a>
          ) : (
            undefined
          )}
        </div>
        {type && open ? (
          <div className="detail-link">
            <div>
              <span className="link-tip">选择车型:</span>
              <span>
                {type == 'config' ? (
                  <Select
                    defaultValue={configLinkVal}
                    style={{ width: '200px' }}
                    onChange={val => {
                      this.setState({ configLinkVal: val });
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {configType.map(item => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.key}
                        </Option>
                      );
                    })}
                  </Select>
                ) : type == 'price' ? (
                  <Select
                    defaultValue={priceLinkVal}
                    style={{ width: '200px' }}
                    onChange={val => {
                      this.setState({ priceLinkVal: val });
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {pricecType.map(item => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.key}
                        </Option>
                      );
                    })}
                  </Select>
                ) : type == 'keepper' ? (
                  <Select
                    defaultValue={keepperLinkVal}
                    style={{ width: '200px' }}
                    onChange={val => {
                      this.setState({ keepperLinkVal: val });
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {keepperType.map(item => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.key}
                        </Option>
                      );
                    })}
                  </Select>
                ) : (
                  undefined
                )}
              </span>
              <Button onClick={() => this.preView(type)}>预览</Button>
              <Button
                type="primary"
                disabled={
                  !((type == 'config' && id) || (type != 'config' && config.id))
                }
                onClick={() => this.doLink(type)}
              >
                提交关联
              </Button>
              <Button
                onClick={() => {
                  this.closeSwitch(type);
                }}
              >
                取消
              </Button>
            </div>
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }

  /**
   * 获取保值信息
   * @param obj Object keepper信息
   */
  getKeepperList = obj => {
    return [
      { year: '第一年', keep: `${(obj.firstYear * 100).toFixed(2)}%` },
      { year: '第二年', keep: `${(obj.secondYear * 100).toFixed(2)}%` },
      { year: '第三年', keep: `${(obj.thirdYear * 100).toFixed(2)}%` },
      { year: '第四年', keep: `${(obj.fourthYear * 100).toFixed(2)}%` },
      { year: '第五年', keep: `${(obj.fifthYear * 100).toFixed(2)}%` },
      { year: '第六年', keep: `${(obj.sixthYear * 100).toFixed(2)}%` },
      { year: '第七年', keep: `${(obj.seventhYear * 100).toFixed(2)}%` },
      { year: '第八年', keep: `${(obj.eighthYear * 100).toFixed(2)}%` }
    ];
  };

  render() {
    const {
      yf,
      configSwitch,
      priceSwitch,
      keepperSwitch,
      config,
      preConfig,
      carPrice,
      preCarPrice,
      keepPercent,
      preKeepPercent
    } = this.state;
    const _yf = yf || {};
    const cf = preConfig ? preConfig || {} : config || {};
    const cp = preCarPrice ? preCarPrice || {} : carPrice || {};
    const kp = preKeepPercent ? preKeepPercent || {} : keepPercent || {};
    const keepPercentTable =
      Object.keys(kp).length == 0 ? [] : this.getKeepperList(kp);
    return (
      <div>
        <div>{this.renderTitle('优分信息', '', _yf.queryTimeStr)}</div>
        <div className="detail-data">
          <div>
            <span>车辆品牌：{_yf.brand}</span>
            <span>车辆类型：{_yf.model}</span>
            <span>燃油种类：{_yf.fuelType}</span>
          </div>
          <div>
            <span>排量：{_yf.emission}</span>
            <span>载客人数：{_yf.seatNum}</span>
            <span>发动机型号：{_yf.engineModel}</span>
          </div>
        </div>
        <Divider />
        <div>
          {this.renderTitle(
            '配置参数',
            'config',
            cf.rawdataTimeStr,
            configSwitch
          )}
        </div>
        <div className="detail-data">
          <div>
            <span>车辆品牌：{cf.brand}</span>
            <span>车系：{cf.carSeries}</span>
            <span>型号：{cf.model}</span>
          </div>
          <div>
            <span>车辆名称：{cf.carName}</span>
            <span>车辆型号：{cf.modelNum}</span>
          </div>
          <div>
            <span>厂家名称：{cf.factoryName}</span>
            <span>厂家指导价(万)：{cf.factoryPrice}</span>
          </div>
          <div>
            <span>级别：{cf.carLevel}</span>
            <span>年款：{cf.carYear}</span>
            <span>座位数：{cf.seatNum}</span>
          </div>
          <div>
            <span>发动机型号：{cf.engineModel}</span>
            <span>气缸容量(cc)：{cf.cylinderCupacity}</span>
            <span>燃油类型：{cf.fuelType}</span>
          </div>
        </div>
        <Divider />
        <div>
          {this.renderTitle(
            '价格信息',
            'price',
            cp.rawdataTimeStr,
            priceSwitch
          )}
        </div>
        <div className="detail-data">
          <div>
            <span>车辆品牌：{cp.brand}</span>
            <span>车系：{cp.carSeries}</span>
            <span>经销商参考价(万)：{cp.dealerPrice}</span>
          </div>
          <div>
            <span>厂家指导价(万)：{cp.manufacturePrice}</span>
            <span>全款购车价(万)：{cp.totalPaymentPrice}</span>
            <span>二手车参考价(万)：{cp.secondHandCarPrice}</span>
          </div>
        </div>
        <Divider />
        <div>
          {this.renderTitle(
            '保值率',
            'keepper',
            kp.rawdataTimeStr,
            keepperSwitch
          )}
          <Table
            dataSource={toJS(keepPercentTable)}
            columns={this.columns()}
            rowKey={r => r.year}
          />
        </div>
      </div>
    );
  }
}

export default CarDetail;
