import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';
import { Button, Table, Modal, Input, Select, message } from 'antd';
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import KeywordForm, {
  KEYWORD_FORM_MODE_ADD,
  KEYWORD_FORM_MODE_UPDATE
} from './components/KeywordForm';
import hoc from 'components/HOC/pageHeader';

const keyword_no_phone_list = [
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
];
const keyword_phone_list = [
  { key: 'XX', title: '学校' },
  { key: 'NULL', title: '无' }
];

/**
 * 【特殊情况】
 *  业务类型businessType不为[通讯录敏感词]时,行为标签选项集为[keyword_no_phone_list]
 *  业务类型businessType为[通讯录敏感词]时,行为标签选项集为[keyword_phone_list]
 *  update by eds  2019/03/11
 */
@inject(stores => ({
  store: stores.negativeLabelKeywordStore
}))
@hoc({ name: '敏感词管理', className: 'page_negativeLabelKeyword' })
@observer
class NegativeLabelKeyword extends Component {
  state = {
    loading: false,
    savingLoad: false,
    formModalVisiable: false,
    formMode: undefined,
    edit: null,
    //  敏感词状态
    deprecatedOption: [
      { key: '-1', title: '全选' },
      { key: 'false', title: '生效' },
      { key: 'true', title: '失效' }
    ],
    //  过滤方式
    statusOption: [
      { key: '-1', title: '全选' },
      { key: 'WAIT', title: '可入库' },
      { key: 'DELETED', title: '已删除' },
      { key: 'IGNORED', title: '待判断' }
    ],
    //  业务类型
    businessOption: [
      { key: '-1', title: '全选' },
      { key: 'Basis', title: 'Basis' },
      { key: 'QQ敏感词', title: 'QQ敏感词' },
      { key: '通讯录敏感词', title: '通讯录敏感词' }
    ],
    //   属性
    graveOption: [
      { key: '-1', title: '全选' },
      { key: 'WHITE', title: '白' },
      { key: 'GREY', title: '灰' },
      { key: 'BLACK', title: '黑' }
    ],
    //  行为标签
    keywordOption: [{ key: '-1', title: '全选' }, ...keyword_no_phone_list]
  };

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
      deprecatedOption,
      statusOption,
      businessOption,
      graveOption,
      keywordOption
    } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>敏感词状态:</label>
          <Select
            defaultValue={_query.deprecated}
            style={{ width: '100px' }}
            onChange={val => {
              _query.deprecated = val;
            }}
          >
            {deprecatedOption.map(item => {
              return (
                <Option value={item.key} key={item.key.toString()}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>过滤方式:</label>
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
          <label>业务类型:</label>
          <Select
            defaultValue={_query.businessType}
            value={_query.businessType}
            style={{ width: '130px' }}
            onChange={val => {
              _query.businessType = val;
              const options =
                val == '通讯录敏感词'
                  ? keyword_phone_list
                  : keyword_no_phone_list;
              const optionMap = options.map(item => {
                return item.key;
              });
              this.setState(
                {
                  keywordOption: [{ key: '-1', title: '全选' }, ...options]
                },
                () => {
                  // ~indexOf有值则说明keywordType类型不变
                  _query.keywordType =
                    optionMap.indexOf(_query.keywordType) > 0
                      ? _query.keywordType
                      : optionMap[0];
                }
              );
            }}
          >
            {businessOption.map(item => {
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
            defaultValue={_query.graveLevel}
            style={{ width: '100px' }}
            onChange={val => {
              _query.graveLevel = val;
            }}
          >
            {graveOption.map(item => {
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
            defaultValue={_query.keywordType}
            value={_query.keywordType}
            style={{ width: '100px' }}
            onChange={val => {
              _query.keywordType = val;
            }}
          >
            {keywordOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>敏感词:</label>
          <Input
            placeholder="输入要查询的敏感词"
            style={{ width: '200px' }}
            onChange={e => {
              _query.nameAlike = e.target.value;
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
    const {
      businessOption,
      graveOption,
      keywordOption,
      statusOption
    } = this.state;
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
        title: '敏感词',
        dataIndex: 'keyword',
        render: (t, r) => {
          return (
            <a href="javascript:" onClick={() => this.showFormModal(r)}>
              {t}
            </a>
          );
        }
      },
      {
        title: '敏感词状态',
        dataIndex: 'deprecated',
        render: t => {
          //  这个字段反一下
          return t ? '失效' : '生效';
        }
      },
      {
        title: '过滤方式',
        dataIndex: 'status',
        render: t => {
          let status = '';
          statusOption.map(item => {
            if (item.key == t) {
              status = item.title;
            }
          });
          return status;
        }
      },
      {
        title: '业务类型',
        dataIndex: 'businessType',
        render: t => {
          let status = '';
          businessOption.map(item => {
            if (item.key == t) {
              status = item.title;
            }
          });
          return status;
        }
      },
      {
        title: '属性',
        dataIndex: 'graveLevel',
        render: t => {
          let status = '';
          graveOption.map(item => {
            if (item.key == t) {
              status = item.title;
            }
          });
          return status;
        }
      },
      {
        title: '行为标签',
        dataIndex: 'keywordType',
        render: (t, r) => {
          let status = '';
          const options =
            r.businessType == '通讯录敏感词'
              ? keyword_phone_list
              : keyword_no_phone_list;
          [{ key: '-1', title: '全选' }, ...options].map(item => {
            if (item.key == t) {
              status = item.title;
            }
          });
          return status;
        }
      },
      {
        title: '最后操作者',
        dataIndex: 'operator'
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateTime',
        render: t => t && moment(t).format('YYYY-MM-DD HH:mm:ss')
      }
    ];
  }

  @autobind
  async onSave() {
    const { formMode } = this.state;
    const { saveKeyword } = this.props.store;
    const { form } = this.keywordForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        await saveKeyword(values);
        this.hideFormModal();
        message.success(
          `${formMode == KEYWORD_FORM_MODE_ADD ? '添加' : '更新'}敏感词成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
    });
  }

  @autobind
  showFormModal(keyword) {
    if (keyword && keyword.id) {
      this.setState({
        formModalVisiable: true,
        formMode: KEYWORD_FORM_MODE_UPDATE,
        edit: keyword
      });
    } else {
      this.setState({ formModalVisiable: true });
    }
  }

  @autobind
  hideFormModal() {
    this.setState({
      formModalVisiable: false,
      formMode: KEYWORD_FORM_MODE_ADD,
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
      businessOption,
      deprecatedOption,
      graveOption,
      keywordOption,
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
          className="modal-keyword"
          title={`${
            formMode === KEYWORD_FORM_MODE_ADD ? '新增' : '更新'
          }敏感词`}
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
          <KeywordForm
            keyword={edit}
            mode={formMode}
            businessOption={businessOption}
            deprecatedOption={deprecatedOption}
            graveOption={graveOption}
            keywordOption={keywordOption}
            statusOption={statusOption}
            keyword_no_phone_list={keyword_no_phone_list}
            keyword_phone_list={keyword_phone_list}
            wrappedComponentRef={instance => {
              this.keywordForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default NegativeLabelKeyword;
