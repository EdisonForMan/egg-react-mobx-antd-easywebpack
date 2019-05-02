import React, { Component } from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, DatePicker, Input, Select } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import hoc from 'components/HOC/pageHeader';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.reportStore
}))
@hoc({ name: '入库统计', className: 'page_report' })
@observer
class Report extends Component {
  state = {
    loadingEcommerce: false,
    loadingNegativeLabel: false,
    ECOMMERCE_HASH: Symbol('ecommerce'),
    NEGATIVELABEL_HASH: Symbol('negativelabel')
  };

  componentWillMount() {
    const createEnd = `${moment()
      .subtract(0, 'days')
      .format(dateFormat)}`;
    const createStart = `${moment()
      .subtract(7, 'days')
      .format(dateFormat)}`;
    //  默认状态
    this.props.store._queryEcommerce.createStart = createStart;
    this.props.store._queryEcommerce.createEnd = createEnd;
    this.props.store._queryNegativeLabel.createStart = createStart;
    this.props.store._queryNegativeLabel.createEnd = createEnd;
  }

  /**
   * 根据HASH获取请求函数
   * @param {*} HASH
   */
  @autobind
  async fetchList(HASH) {
    const { ECOMMERCE_HASH, NEGATIVELABEL_HASH } = this.state;
    switch (HASH) {
      case ECOMMERCE_HASH:
        const { fetchEcommerceList } = this.props.store;
        this.setState({ loadingEcommerce: true });
        await fetchEcommerceList();
        this.setState({ loadingEcommerce: false });
        break;
      case NEGATIVELABEL_HASH:
        const { fetchNegativeLabelList } = this.props.store;
        this.setState({ loadingNegativeLabel: true });
        await fetchNegativeLabelList();
        this.setState({ loadingNegativeLabel: false });
        break;
      default:
        break;
    }
  }

  searchLeftEcommerce(HASH) {
    const { _queryEcommerce, _pageQueryEcommerce } = this.props.store;
    return (
      <span className="action-left-search">
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
              _queryEcommerce.createStart = dateString[0];
              _queryEcommerce.createEnd = dateString[1];
            }}
          />
        </span>
        <Button
          type="primary"
          icon="search"
          onClick={() => {
            _pageQueryEcommerce.draw = 1;
            this.fetchList(HASH);
          }}
        >
          搜索
        </Button>
      </span>
    );
  }

  searchLeftNegativeLabel(HASH) {
    const { _queryNegativeLabel, _pageQueryNegativeLabel } = this.props.store;
    return (
      <span className="action-left-search">
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
              _queryNegativeLabel.createStart = dateString[0];
              _queryNegativeLabel.createEnd = dateString[1];
            }}
          />
        </span>
        <Button
          type="primary"
          icon="search"
          onClick={() => {
            _pageQueryNegativeLabel.draw = 1;
            this.fetchList(HASH);
          }}
        >
          搜索
        </Button>
      </span>
    );
  }

  columnsEcommerce() {
    return [
      {
        title: '处理日期',
        dataIndex: 'date',
        render: t => t && moment(t).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '已处理-不良行为',
        dataIndex: 'behaviorCount'
      },
      {
        title: '已处理-白名单',
        dataIndex: 'whiteListCount'
      },
      {
        title: '已处理-交易类型',
        dataIndex: 'typeCount'
      }
    ];
  }

  columnsNegativeLabel() {
    return [
      {
        title: '处理日期',
        dataIndex: 'date'
      },
      {
        title: '欺诈',
        dataIndex: 'fraudCount'
      },
      {
        title: '信用',
        dataIndex: 'creditCount'
      },
      {
        title: '涉赌',
        dataIndex: 'drugCount'
      },
      {
        title: '套现',
        dataIndex: 'cashCount'
      },
      {
        title: '中介',
        dataIndex: 'agencyCount'
      },
      {
        title: '彩票',
        dataIndex: 'lotteryCount'
      },

      {
        title: '催收',
        dataIndex: 'collectionCount'
      },
      {
        title: '无',
        dataIndex: 'emptyCount'
      }
    ];
  }

  render() {
    const {
      loadingEcommerce,
      loadingNegativeLabel,
      ECOMMERCE_HASH,
      NEGATIVELABEL_HASH
    } = this.state;
    const {
      _pageQueryEcommerce,
      _pageQueryNegativeLabel,
      listEcommerce,
      listNegativeLabel
    } = this.props.store;
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h3>电商</h3>
          <div className="action-container">
            {this.searchLeftEcommerce(ECOMMERCE_HASH)}
          </div>
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
          <h3>负面标签</h3>
          <div className="action-container">
            {this.searchLeftNegativeLabel(NEGATIVELABEL_HASH)}
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
      </div>
    );
  }
}

export default Report;
