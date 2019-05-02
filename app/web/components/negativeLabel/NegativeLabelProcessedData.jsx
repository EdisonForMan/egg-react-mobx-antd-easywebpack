import React, { Component } from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, DatePicker, Input, Select, message } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import DataForm, {
  DATA_FORM_MODE_ADD,
  DATA_FORM_MODE_UPDATE
} from './components/DataForm';
import hoc from 'components/HOC/pageHeader';
import { desensitization } from 'utils/utils';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.negativeLabelProcessedDataStore,
  userStore: stores.userStore
}))
@hoc({ name: '已入库数据', className: 'page_negativeLabelProcessedData' })
@observer
class NegativeLabelProcessedData extends Component {
  state = {
    loading: false,
    savingLoad: false,
    formModalVisiable: false,
    formMode: undefined,
    edit: null,
    //  状态
    statusOption: [
      { key: '-1', title: '全选' },
      { key: 'true', title: '生效' },
      { key: 'false', title: '失效' }
    ],
    //  数据类型
    dataTypeOption: [
      { key: '-1', title: '全选' },
      { key: 'PHONE', title: '手机号' },
      { key: 'QQ', title: 'QQ号' },
      { key: 'QG', title: 'QQ群号' }
    ],
    //   属性
    cautionLevelOption: [
      { key: '-1', title: '全选' },
      { key: 'WHITE', title: '白' },
      { key: 'GREY', title: '灰' },
      { key: 'BLACK', title: '黑' }
    ],
    //  行为标签
    dataTagOption: [
      { key: '-1', title: '全选' },
      { key: 'QZ', title: '欺诈' },
      { key: 'XY', title: '信用' },
      { key: 'SD', title: '涉赌' },
      { key: 'XD', title: '吸毒' },
      { key: 'TX', title: '套现' },
      { key: 'ZJ', title: '中介' },
      { key: 'CP', title: '彩票' },
      { key: 'CS', title: '催收' },
      { key: 'GLD', title: '高利贷' },
      { key: 'NULL', title: '无' }
    ]
  };

  componentWillMount() {
    //  默认状态
    this.props.store._query.updateEnd = `${moment()
      .subtract(0, 'days')
      .format(dateFormat)}`;
    this.props.store._query.updateStart = `${moment()
      .subtract(7, 'days')
      .format(dateFormat)}`;
  }

  async componentDidMount() {
    await this.fetchList();
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
    const {
      statusOption,
      dataTypeOption,
      cautionLevelOption,
      dataTagOption
    } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>数据类型:</label>
          <Select
            defaultValue={_query.dataType}
            style={{ width: '100px' }}
            onChange={val => {
              _query.dataType = val;
            }}
          >
            {dataTypeOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>属性:</label>
          <Select
            defaultValue={_query.cautionLevel}
            style={{ width: '100px' }}
            onChange={val => {
              _query.cautionLevel = val;
            }}
          >
            {cautionLevelOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>行为标签:</label>
          <Select
            defaultValue={_query.dataTag}
            style={{ width: '100px' }}
            onChange={val => {
              _query.dataTag = val;
            }}
          >
            {dataTagOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>状态:</label>
          <Select
            defaultValue={_query.status}
            style={{ width: '100px' }}
            onChange={val => {
              _query.status = val;
            }}
          >
            {statusOption.map(item => {
              return (
                <Option value={item.key} key={item.key.toString()}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>数据项:</label>
          <Input
            placeholder="输入数据项"
            style={{ width: '120px' }}
            onChange={e => {
              _query.nameAlike = e.target.value;
            }}
          />
        </span>
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
              _query.updateStart = dateString[0];
              _query.updateEnd = dateString[1];
            }}
          />
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
        <Button type="primary" icon="plus" onClick={this.showFormModal}>
          新增
        </Button>
      </span>
    );
  }

  columns() {
    const { cautionLevelOption, dataTagOption, dataTypeOption } = this.state;
    const { desensitizationStatus } = this.props.store;
    return [
      {
        title: '序号',
        width: 80,
        dataIndex: 'id',
        render: (t, r, index) => {
          return index;
        }
      },
      {
        title: '数据项',
        dataIndex: 'data',
        render: (t, r) => {
          return (
            <div>
              <a href="javascript:" onClick={() => this.showFormModal(r)}>
                {r.dataType == 'PHONE' && r.desensitization
                  ? desensitization(t)
                  : t}
              </a>
              {r.hasOwnProperty('desensitization') ? (
                <Button
                  className="desensitization"
                  size="small"
                  onClick={() => {
                    desensitizationStatus(r.id);
                  }}
                >
                  {r.desensitization ? '开' : '关'}
                </Button>
              ) : (
                undefined
              )}
            </div>
          );
        }
      },
      {
        title: '数据备注',
        dataIndex: 'dataTwo'
      },
      {
        title: '数据类型',
        width: 100,
        dataIndex: 'dataType',
        render: t => {
          let status = '';
          dataTypeOption.map(item => {
            if (item.key == t) {
              status = item.title;
            }
          });
          return status;
        }
      },
      {
        title: '属性',
        width: 60,
        dataIndex: 'cautionLevel',
        render: t => {
          let status = '';
          cautionLevelOption.map(item => {
            if (item.key == t) {
              status = item.title;
            }
          });
          return status;
        }
      },
      {
        title: '行为标签',
        width: 100,
        dataIndex: 'dataTag',
        render: t => {
          let status = '';
          dataTagOption.map(item => {
            if (item.key == t) {
              status = item.title;
            }
          });
          return status;
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: t => {
          return t ? '生效' : '失效';
        }
      },
      {
        title: '更新时间',
        width: 200,
        dataIndex: 'lastUpdateDate',
        render: t => t && moment(t).format('YYYY-MM-DD HH:mm:ss')
      }
    ];
  }

  @autobind
  async onSave() {
    const { formMode } = this.state;
    const { saveData } = this.props.store;
    const { form } = this.dataForm.props;
    const { currentUser } = this.props.userStore;
    const operator = currentUser.id;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        await saveData({ ...values, operator });
        this.hideFormModal();
        message.success(
          `${formMode == DATA_FORM_MODE_ADD ? '添加' : '更新'}数据成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
    });
  }

  @autobind
  showFormModal(web) {
    if (web && web.id) {
      this.setState({
        formModalVisiable: true,
        formMode: DATA_FORM_MODE_UPDATE,
        edit: web
      });
    } else {
      this.setState({ formModalVisiable: true });
    }
  }

  @autobind
  hideFormModal() {
    this.setState({
      formModalVisiable: false,
      formMode: DATA_FORM_MODE_ADD,
      edit: null
    });
  }

  render() {
    const {
      loading,
      savingLoad,
      edit,
      formMode,
      formModalVisiable,
      cautionLevelOption,
      dataTagOption,
      dataTypeOption,
      statusOption
    } = this.state;
    const { list, _pageQuery } = this.props.store;
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
          className="modal-data"
          title={`${formMode === DATA_FORM_MODE_ADD ? '新增' : '更新'}网站`}
          width={700}
          destroyOnClose={true}
          visible={formModalVisiable}
          onCancel={this.hideFormModal}
          footer={[
            <Button key="back" onClick={this.hideFormModal}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={savingLoad}
              onClick={this.onSave}
            >
              保存
            </Button>
          ]}
        >
          <DataForm
            data={edit}
            mode={formMode}
            dataTagOption={dataTagOption}
            dataTypeOption={dataTypeOption}
            cautionLevelOption={cautionLevelOption}
            statusOption={statusOption}
            wrappedComponentRef={instance => {
              this.dataForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default NegativeLabelProcessedData;
