import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, Input, Select } from 'antd';
import _ from 'lodash';
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import DisplayDetail from './components/DisplayDetail';
import hoc from 'components/HOC/pageHeader';

@inject(stores => ({
  store: stores.carDisplayListStore
}))
@hoc({ name: '车辆信息', className: 'page_carDisplayList' })
@observer
class CarDisplayList extends Component {
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
    configType: [],
    pricecType: [],
    keepperType: []
  };

  async componentDidMount() {
    const { fetchTypeOption } = this.props.store;
    const { pricecType, keepperType, configType } = await fetchTypeOption();
    await this.fetchList();
    //  渲染option
    this.setState({ pricecType, keepperType, configType });
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
          <label>车辆型号:</label>
          <Input
            placeholder="输入型号"
            style={{ width: '120px' }}
            onChange={e => {
              _query.modelNum = e.target.value;
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
        title: '型号',
        dataIndex: 'modelNum',
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
      configType,
      pricecType,
      keepperType
    } = this.state;
    const { list, _pageQuery, fetchCar, preView, doLink } = this.props.store;
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
          title={`车辆型号 [${edit ? edit.modelNum : ''}]`}
          width={1000}
          destroyOnClose={true}
          visible={formModalVisiable}
          onCancel={this.hideFormModal}
          footer={[
            <Button key="back" onClick={this.hideFormModal}>
              取消
            </Button>
          ]}
        >
          <DisplayDetail
            car={edit}
            fetchCar={fetchCar}
            configType={configType}
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

export default CarDisplayList;
