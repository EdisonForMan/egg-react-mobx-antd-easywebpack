import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';
import {
  Button,
  Table,
  Modal,
  DatePicker,
  Input,
  Select,
  TreeSelect,
  message
} from 'antd';
const { TreeNode } = TreeSelect;
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import EcommerceForm, {
  ECOMMERCE_FORM_HASH,
  ECOMMERCE_FORM_MODE_ADD,
  ECOMMERCE_FORM_MODE_UPDATE
} from './components/EcommerceForm';
import hoc from 'components/HOC/pageHeader';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.ecommerceDataStore
}))
@hoc({ name: '已入库数据-电商', className: 'page_ecommerceData' })
@observer
class EcommerceData extends Component {
  state = {
    loading: false,
    savingLoad: false,
    pendingFormModalVisiable: false,
    pendingFormMode: ECOMMERCE_FORM_MODE_ADD,
    edit: null,
    treeData: [],
    treeOption: [],
    statusOption: [
      { key: '2', title: '全选' },
      { key: '1', title: '生效' },
      { key: '0', title: '失效' }
    ],
    expressionOption: [
      { key: '0', title: '全选' },
      { key: '1', title: '不良行为' },
      { key: '2', title: '交易类型' },
      { key: '3', title: '白名单' }
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
    const { _query } = this.props.store;
    await this.fetchTree(_query.expressionType);
    await this.fetchList();
  }

  /**
   * 获取树
   * @param {*} expressionType
   */
  async fetchTree(expressionType) {
    const { fetchTagTree } = this.props.store;
    //  1 不良行为 2 交易类型
    const data = await fetchTagTree(expressionType);
    const treeOption = this.fixTree(data);
    this.setState({ treeOption });
  }

  /**
   *  生成option
   * @param {*} data 树
   */
  fixTree(data) {
    return data ? this.drawTree(data) : [];
  }

  drawTree(data) {
    const treeOption = [];
    data.map(item => {
      const _treeOption =
        item.children && item.children.length
          ? this.drawTree(item.children)
          : [];
      treeOption.push(
        <TreeNode value={item.key} title={item.title} key={item.key}>
          {_treeOption}
        </TreeNode>
      );
    });
    return treeOption;
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
    const { statusOption, expressionOption, treeOption } = this.state;
    const showTreeSelect =
      _query.expressionType == '1' || _query.expressionType == '2';
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>后置表达式:</label>
          <Select
            defaultValue={_query.expressionType}
            style={{ width: '100px' }}
            onChange={async val => {
              _query.expressionType = val;
              await this.fetchTree(val);
              _query.behaviorLabelId = undefined;
            }}
          >
            {expressionOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        {showTreeSelect ? (
          <span className="action-left-search-single">
            <label>行为标签:</label>
            <TreeSelect
              value={_query.behaviorLabelId}
              style={{ width: 400 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="选择标签"
              onChange={val => {
                _query.behaviorLabelId = val;
              }}
            >
              {treeOption}
            </TreeSelect>
          </span>
        ) : (
          undefined
        )}
        <span className="action-left-search-single">
          <label>入库数据状态:</label>
          <Select
            defaultValue={_query.status}
            style={{ width: '100px' }}
            onChange={val => {
              _query.status = val;
            }}
          >
            {statusOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
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
        <span className="action-left-search-single">
          <Input
            placeholder="输入要查询的数据项"
            style={{ width: '200px' }}
            onChange={e => {
              _query.keyword = e.target.value;
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
        <Button
          type="primary"
          icon="plus"
          onClick={() => this.openModal(ECOMMERCE_FORM_HASH)}
        >
          新增
        </Button>
      </span>
    );
  }

  columns() {
    return [
      {
        title: '序号',
        width: 80,
        dataIndex: 'mappingId',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '数据项',
        dataIndex: 'keyword',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(ECOMMERCE_FORM_HASH, r)}
            >
              {t}
            </a>
          );
        }
      },
      {
        title: '行为标签',
        dataIndex: 'lableName'
      },
      {
        title: '后置表达式分类',
        dataIndex: 'rearExpressionCategory'
      },
      {
        title: '后置表达式',
        dataIndex: 'rearExpression'
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateDate',
        render: t => t && moment(t).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'enabled',
        render: data => {
          return data ? '生效' : '失效';
        }
      }
    ];
  }

  @autobind
  async onSave() {
    const { check, editEcommerceData } = this.props.store;
    const { form } = this.ecommerceForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      if (values.rearExpressionText) {
        const _check = await check(values);
        if (_check == 'ERROR') {
          return message.error('后置表达式有误');
        }
        values.rearExpression = values.rearExpressionText;
      }
      this.setState({ savingLoad: true });
      try {
        const data = await editEcommerceData(values);
        this.hideModal(ECOMMERCE_FORM_HASH);
        message.success(data);
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
    });
  }

  /**
   * 对应hash关闭&开启modal
   * @param {*} hash
   */
  @autobind
  hideModal(hash) {
    switch (hash) {
      case ECOMMERCE_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: false,
          pendingFormMode: ECOMMERCE_FORM_MODE_ADD,
          edit: null
        });
        break;
      }
    }
  }
  @autobind
  openModal(hash, obj = null) {
    console.log('[open]', hash);
    switch (hash) {
      case ECOMMERCE_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: true,
          pendingFormMode: obj
            ? ECOMMERCE_FORM_MODE_UPDATE
            : ECOMMERCE_FORM_MODE_ADD,
          edit: { ...obj, data: obj ? obj.otherSide : undefined }
        });
        break;
      }
    }
  }

  render() {
    const {
      loading,
      savingLoad,
      edit,
      pendingFormModalVisiable,
      pendingFormMode
    } = this.state;
    const { list, _pageQuery, fetchTagTree } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.mappingId}
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
          className="modal-ecommerce"
          title={'数据项'}
          width={900}
          destroyOnClose={true}
          visible={pendingFormModalVisiable}
          onCancel={() => this.hideModal(ECOMMERCE_FORM_HASH)}
          footer={[
            <Button
              key="back"
              onClick={() => this.hideModal(ECOMMERCE_FORM_HASH)}
            >
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
          <EcommerceForm
            data={edit}
            mode={pendingFormMode}
            status={true}
            fetchTagTree={fetchTagTree}
            wrappedComponentRef={instance => {
              this.ecommerceForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default EcommerceData;
