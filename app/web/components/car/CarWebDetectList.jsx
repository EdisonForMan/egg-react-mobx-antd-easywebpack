import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import { Button, Table, Modal, Input, Select } from 'antd';
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import WebDetectDetail from './components/WebDetectDetail';
import hoc from 'components/HOC/pageHeader';

@inject(stores => ({
  store: stores.carWebDetectListStore
}))
@hoc({ name: '网查信息', className: 'page_carWebDetectList' })
@observer
class CarWebDetectList extends Component {
  state = {
    loading: true,
    formModalVisiable: false,
    edit: null,
    relevancesArr: [
      { key: 2, title: '全部' },
      { key: 4, title: '未关联' },
      { key: 8, title: '部分关联' },
      { key: 16, title: '全部关联' }
    ],
    pricecType: [],
    keepperType: []
  };

  async componentDidMount() {
    const { fetchTypeOption } = this.props.store;
    const { pricecType, keepperType } = await fetchTypeOption();
    await this.fetchList();
    //  渲染option
    this.setState({ pricecType, keepperType });
  }

  @autobind
  async fetchList() {
    const { fetchDataList } = this.props.store;
    this.setState({ loading: true });
    await fetchDataList();
    this.setState({ loading: false });
  }

  searchLeft() {
    const { _query, _pageQuery } = this.props.store;
    const { relevancesArr } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>车辆品牌:</label>
          <Input
            placeholder="输入品牌"
            style={{ width: '120px' }}
            onChange={e => {
              _query.brand = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>车系:</label>
          <Input
            placeholder="输入车系"
            style={{ width: '120px' }}
            onChange={e => {
              _query.carSeries = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>型号:</label>
          <Input
            placeholder="输入型号"
            style={{ width: '120px' }}
            onChange={e => {
              _query.model = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>关联状态:</label>
          <Select
            mode="multiple"
            defaultValue={[4, 8]}
            style={{ width: '300px' }}
            onChange={val => {
              _query.relevances = _.sum(val);
            }}
          >
            {relevancesArr.map(item => {
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
          icon="search"
          onClick={() => {
            _pageQuery.draw = 1;
            this.fetchList();
          }}
        >
          搜索
        </Button>
      </span>
    );
  }

  columns() {
    return [
      {
        title: '序号',
        width: 80,
        dataIndex: 'id',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '车辆品牌',
        dataIndex: 'brand'
      },
      {
        title: '车系',
        dataIndex: 'carSeries'
      },
      {
        title: '型号',
        dataIndex: 'model',
        render: (t, r) => {
          return (
            <a href="javascript:" onClick={() => this.showFormModal(r)}>
              {t}
            </a>
          );
        }
      },
      {
        title: '关联状态',
        dataIndex: 'relName'
      },
      {
        title: '操作人员',
        dataIndex: 'operatorName'
      },
      {
        title: '关联时间',
        dataIndex: 'correlationTimeStr'
      }
    ];
  }

  @autobind
  showFormModal(car) {
    if (car && car.id) {
      this.setState({
        formModalVisiable: true,
        edit: car
      });
    } else {
      this.setState({ formModalVisiable: true });
    }
  }

  @autobind
  hideFormModal() {
    this.setState({
      formModalVisiable: false,
      edit: null
    });
  }

  render() {
    const {
      loading,
      formModalVisiable,
      edit,
      pricecType,
      keepperType
    } = this.state;
    const {
      list,
      _pageQuery,
      fetchWebDetect,
      preView,
      doLink
    } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.id}
          pagination={{
            current: _pageQuery.draw,
            total: _pageQuery.count,
            pageSize: _pageQuery.length,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
              _pageQuery.length = pageSize;
              _pageQuery.draw = 1;
              this.fetchList();
            },
            onChange: current => {
              _pageQuery.draw = current;
              this.fetchList();
            },
            showTotal: () => {
              return '共 ' + _pageQuery.count + ' 条数据';
            }
          }}
          loading={loading}
        />
        <Modal
          className="modal-display"
          title="车辆信息"
          width={900}
          destroyOnClose={true}
          visible={formModalVisiable}
          onCancel={this.hideFormModal}
          footer={[
            <Button key="back" onClick={this.hideFormModal}>
              取消
            </Button>
          ]}
        >
          <WebDetectDetail
            car={edit}
            fetchWebDetect={fetchWebDetect}
            pricecType={pricecType}
            keepperType={keepperType}
            preView={preView}
            doLink={doLink}
            wrappedComponentRef={instance => {
              this.webForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default CarWebDetectList;
