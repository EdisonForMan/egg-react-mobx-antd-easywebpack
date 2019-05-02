import React, { Component } from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, DatePicker, Select, message } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import hoc from 'components/HOC/pageHeader';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.exrecordManagementStore,
  userStore: stores.userStore
}))
@hoc({ name: '异常结案管理', className: 'page_ExrecordManagementManagement' })
@observer
class ExrecordManagement extends Component {
  state = {
    loadingEcommerce: false,
    loadingNegativeLabel: false,
    loadingAccumulationFund: false,
    strategyEcommerceOption: [],
    strategyNegativeLabel_Option: [],
    strategyNegativeLabel__Option: [],
    ECOMMERCE_HASH: Symbol('ecommerce'),
    NEGATIVELABEL_HASH: Symbol('negativelabel'),
    ACCUMULATIONFUND_HASH: Symbol('accumulationfund')
  };

  componentWillMount() {
    const updateStart = `${moment()
      .subtract(7, 'days')
      .format(dateFormat)}`;
    const updateEnd = `${moment()
      .subtract(0, 'days')
      .format(dateFormat)}`;
    //  默认状态
    this.props.store._queryEcommerce.updateStart = updateStart;
    this.props.store._queryEcommerce.updateEnd = updateEnd;
    this.props.store._queryNegativeLabel.updateStart = updateStart;
    this.props.store._queryNegativeLabel.updateEnd = updateEnd;
    this.props.store._queryAccumulationFund.updateStart = updateStart;
    this.props.store._queryAccumulationFund.updateEnd = updateEnd;
    //  option
    this.props.store._queryEcommerce.strategy = 0;
    this.props.store._queryNegativeLabel.strategy = -1;
    this.props.store._queryNegativeLabel.bustypes = 0;
  }

  async componentDidMount() {
    const { fetchBasicOption } = this.props.store;
    const { bustypes, policytypes, strategies } = await fetchBasicOption();
    const strategyEcommerceOption = strategies.map(item => {
      return { key: item.code, title: item.desc };
    });
    const strategyNegativeLabel_Option = policytypes.map(item => {
      return { key: item.code, title: item.desc };
    });
    const strategyNegativeLabel__Option = bustypes.map(item => {
      return { key: item.code, title: item.desc };
    });
    this.setState({
      strategyEcommerceOption,
      strategyNegativeLabel_Option,
      strategyNegativeLabel__Option
    });
  }

  /**
   * 根据HASH获取请求函数
   * @param {*} HASH
   */
  @autobind
  async fetchList(HASH) {
    const {
      ECOMMERCE_HASH,
      NEGATIVELABEL_HASH,
      ACCUMULATIONFUND_HASH
    } = this.state;
    const { fetchList } = this.props.store;
    switch (HASH) {
      case ECOMMERCE_HASH:
        this.setState({ loadingEcommerce: true });
        await fetchList(2);
        this.setState({ loadingEcommerce: false });
        break;
      case NEGATIVELABEL_HASH:
        this.setState({ loadingNegativeLabel: true });
        await fetchList(1);
        this.setState({ loadingNegativeLabel: false });
        break;
      case ACCUMULATIONFUND_HASH:
        this.setState({ loadingAccumulationFund: true });
        await fetchList(3);
        this.setState({ loadingAccumulationFund: false });
        break;
    }
  }

  @autobind
  async exrecord(HASH) {
    const { exrecord, _queryEcommerce, _queryNegativeLabel } = this.props.store;
    const { currentUser } = this.props.userStore;
    const sysUserId = currentUser.id;
    const {
      ECOMMERCE_HASH,
      NEGATIVELABEL_HASH,
      ACCUMULATIONFUND_HASH,
      strategyEcommerceOption,
      strategyNegativeLabel_Option,
      strategyNegativeLabel__Option
    } = this.state;
    let _fix = undefined,
      _message = undefined,
      _strategy = '',
      _bustypes = '';
    switch (HASH) {
      case ECOMMERCE_HASH:
        strategyEcommerceOption.map(item => {
          if (item.key == _queryEcommerce.strategy) {
            _strategy = item.title;
          }
        });
        _fix = `/${_queryEcommerce.strategy}/${sysUserId}`;
        _message = `策略类型为${_strategy}的电商`;
        break;
      case NEGATIVELABEL_HASH:
        strategyNegativeLabel_Option.map(item => {
          if (item.key == _queryNegativeLabel.strategy) {
            _strategy = item.title;
          }
        });
        strategyNegativeLabel__Option.map(item => {
          if (item.key == _queryNegativeLabel.bustypes) {
            _bustypes = item.title;
          }
        });
        _fix = `/${_queryNegativeLabel.strategy}/${
          _queryNegativeLabel.bustypes
        }/${sysUserId}`;
        _message = `策略类型为${_strategy},业务类型为${_bustypes}的负面标签`;
        break;
      case ACCUMULATIONFUND_HASH:
        _fix = `/hfcompany/${sysUserId}`;
        _message = '公积金公司';
        break;
      default:
        break;
    }
    if (_fix) {
      Modal.confirm({
        title: `是否将${_message}待处理数据直接处理为异常结案?`,
        onOk: async () => {
          await exrecord(_fix);
          message.info('操作完成');
        },
        okText: '确认',
        cancelText: '取消'
      });
    }
  }

  searchLeftEcommerce() {
    const { ECOMMERCE_HASH, strategyEcommerceOption } = this.state;
    const { _queryEcommerce, _pageQueryEcommerce } = this.props.store;
    return (
      <span className="action-left-search">
        <div>
          <span className="action-left-search-single">
            <label>策略类型:</label>
            <Select
              defaultValue={_queryEcommerce.strategy}
              style={{ width: '140px' }}
              onChange={val => {
                _queryEcommerce.strategy = val;
              }}
            >
              {strategyEcommerceOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          </span>
          <Button
            type="primary"
            icon="form"
            onClick={() => this.exrecord(ECOMMERCE_HASH)}
          >
            异常结案
          </Button>
        </div>
        <div>
          <span className="action-left-search-single">
            <label>日期:</label>
            <RangePicker
              style={{ width: '240px' }}
              defaultValue={[
                moment(moment().subtract(7, 'days'), dateFormat),
                moment(moment().subtract(0, 'days'), dateFormat)
              ]}
              onChange={(value, dateString) => {
                console.log('Formatted Selected Time: ', dateString);
                _queryEcommerce.updateStart = dateString[0];
                _queryEcommerce.updateEnd = dateString[1];
              }}
            />{' '}
          </span>
          <Button
            type="primary"
            icon="search"
            onClick={() => {
              _pageQueryEcommerce.draw = 1;
              this.fetchList(ECOMMERCE_HASH);
            }}
          >
            搜索
          </Button>
        </div>
      </span>
    );
  }

  searchLeftNegativeLabel() {
    const {
      NEGATIVELABEL_HASH,
      strategyNegativeLabel_Option,
      strategyNegativeLabel__Option
    } = this.state;
    const { _queryNegativeLabel, _pageQueryNegativeLabel } = this.props.store;
    return (
      <span className="action-left-search">
        <div>
          <span className="action-left-search-single">
            <label>策略类型:</label>
            <Select
              defaultValue={_queryNegativeLabel.strategy}
              style={{ width: '140px' }}
              onChange={val => {
                _queryNegativeLabel.strategy = val;
              }}
            >
              {strategyNegativeLabel_Option.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          </span>
          <span className="action-left-search-single">
            <label>业务类型:</label>
            <Select
              defaultValue={_queryNegativeLabel.bustypes}
              style={{ width: '140px' }}
              onChange={val => {
                _queryNegativeLabel.bustypes = val;
              }}
            >
              {strategyNegativeLabel__Option.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          </span>
          <Button
            type="primary"
            icon="form"
            onClick={() => this.exrecord(NEGATIVELABEL_HASH)}
          >
            异常结案
          </Button>
        </div>
        <div>
          <span className="action-left-search-single">
            <label>日期:</label>
            <RangePicker
              style={{ width: '240px' }}
              defaultValue={[
                moment(moment().subtract(7, 'days'), dateFormat),
                moment(moment().subtract(0, 'days'), dateFormat)
              ]}
              onChange={(value, dateString) => {
                console.log('Formatted Selected Time: ', dateString);
                _queryNegativeLabel.updateStart = dateString[0];
                _queryNegativeLabel.updateEnd = dateString[1];
              }}
            />{' '}
          </span>
          <Button
            type="primary"
            icon="search"
            onClick={() => {
              _pageQueryNegativeLabel.draw = 1;
              this.fetchList(NEGATIVELABEL_HASH);
            }}
          >
            搜索
          </Button>
        </div>
      </span>
    );
  }

  searchLeftAccumulationFund() {
    const { ACCUMULATIONFUND_HASH } = this.state;
    const {
      _queryAccumulationFund,
      _pageQueryAccumulationFund
    } = this.props.store;
    return (
      <span className="action-left-search">
        <div>
          <span className="action-left-search-single">
            <Button
              type="primary"
              icon="form"
              onClick={() => this.exrecord(ACCUMULATIONFUND_HASH)}
            >
              异常结案
            </Button>
          </span>
        </div>
        <div>
          <span className="action-left-search-single">
            <label>日期:</label>
            <RangePicker
              style={{ width: '240px' }}
              defaultValue={[
                moment(moment().subtract(7, 'days'), dateFormat),
                moment(moment().subtract(0, 'days'), dateFormat)
              ]}
              onChange={(value, dateString) => {
                console.log('Formatted Selected Time: ', dateString);
                _queryAccumulationFund.updateStart = dateString[0];
                _queryAccumulationFund.updateEnd = dateString[1];
              }}
            />
          </span>
          <Button
            type="primary"
            icon="search"
            onClick={() => {
              _pageQueryAccumulationFund.draw = 1;
              this.fetchList(ACCUMULATIONFUND_HASH);
            }}
          >
            搜索
          </Button>
        </div>
      </span>
    );
  }

  columnsEcommerce() {
    return [
      {
        title: '操作时间',
        dataIndex: 'operDate'
      },
      {
        title: '策略类型',
        dataIndex: 'policyType'
      },
      {
        title: '操作人员',
        dataIndex: 'operName'
      },
      {
        title: '执行结果',
        dataIndex: 'status'
      },
      {
        title: '完成时间',
        dataIndex: 'finishDate'
      }
    ];
  }

  columnsNegativeLabel() {
    return [
      {
        title: '操作时间',
        dataIndex: 'operDate'
      },
      {
        title: '策略类型',
        dataIndex: 'policyType'
      },
      {
        title: '业务类型',
        dataIndex: 'businessType'
      },
      {
        title: '操作人员',
        dataIndex: 'operName'
      },
      {
        title: '执行结果',
        dataIndex: 'status'
      },
      {
        title: '完成时间',
        dataIndex: 'finishDate'
      }
    ];
  }

  columnsAccumulationFund() {
    return [
      {
        title: '操作时间',
        dataIndex: 'operDate'
      },
      {
        title: '操作人员',
        dataIndex: 'operName'
      },
      {
        title: '执行结果',
        dataIndex: 'status'
      },
      {
        title: '完成时间',
        dataIndex: 'finishDate'
      }
    ];
  }

  render() {
    const {
      loadingEcommerce,
      loadingNegativeLabel,
      loadingAccumulationFund,
      ECOMMERCE_HASH,
      NEGATIVELABEL_HASH,
      ACCUMULATIONFUND_HASH
    } = this.state;
    const {
      _pageQueryEcommerce,
      _pageQueryNegativeLabel,
      _pageQueryAccumulationFund,
      listEcommerce,
      listNegativeLabel,
      listAccumulationFund
    } = this.props.store;
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h3>待处理数据-电商</h3>
          <div className="action-container">{this.searchLeftEcommerce()}</div>
          <Table
            dataSource={toJS(listEcommerce)}
            columns={this.columnsEcommerce()}
            rowKey={r => r.id}
            pagination={{
              current: _pageQueryEcommerce.draw,
              total: _pageQueryEcommerce.count,
              pageSize: _pageQueryEcommerce.length,
              showSizeChanger: true,
              onShowSizeChange: (current, pageSize) => {
                _pageQueryEcommerce.length = pageSize;
                _pageQueryEcommerce.draw = 1;
                this.fetchList(ECOMMERCE_HASH);
              },
              onChange: current => {
                _pageQueryEcommerce.draw = current;
                this.fetchList(ECOMMERCE_HASH);
              },
              showTotal: () => {
                return '共 ' + _pageQueryEcommerce.count + ' 条数据';
              }
            }}
            loading={loadingEcommerce}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3>待处理数据-负面标签</h3>
          <div className="action-container">
            {this.searchLeftNegativeLabel()}
          </div>
          <Table
            dataSource={toJS(listNegativeLabel)}
            columns={this.columnsNegativeLabel()}
            rowKey={r => r.id}
            pagination={{
              current: _pageQueryNegativeLabel.draw,
              total: _pageQueryNegativeLabel.count,
              pageSize: _pageQueryNegativeLabel.length,
              showSizeChanger: true,
              onShowSizeChange: (current, pageSize) => {
                _pageQueryNegativeLabel.length = pageSize;
                _pageQueryNegativeLabel.draw = 1;
                this.fetchList(NEGATIVELABEL_HASH);
              },
              onChange: current => {
                _pageQueryNegativeLabel.draw = current;
                this.fetchList(NEGATIVELABEL_HASH);
              },
              showTotal: () => {
                return '共 ' + _pageQueryNegativeLabel.count + ' 条数据';
              }
            }}
            loading={loadingNegativeLabel}
          />
        </div>
        <div>
          <h3>待处理数据-公积金公司</h3>
          <div className="action-container">
            {this.searchLeftAccumulationFund()}
          </div>
          <Table
            dataSource={toJS(listAccumulationFund)}
            columns={this.columnsAccumulationFund()}
            rowKey={r => r.id}
            pagination={{
              current: _pageQueryAccumulationFund.draw,
              total: _pageQueryAccumulationFund.count,
              pageSize: _pageQueryAccumulationFund.length,
              showSizeChanger: true,
              onShowSizeChange: (current, pageSize) => {
                _pageQueryAccumulationFund.length = pageSize;
                _pageQueryAccumulationFund.draw = 1;
                this.fetchList(ACCUMULATIONFUND_HASH);
              },
              onChange: current => {
                _pageQueryAccumulationFund.draw = current;
                this.fetchList(ACCUMULATIONFUND_HASH);
              },
              showTotal: () => {
                return '共 ' + _pageQueryAccumulationFund.count + ' 条数据';
              }
            }}
            loading={loadingAccumulationFund}
          />
        </div>
      </div>
    );
  }
}

export default ExrecordManagement;
