import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, Upload, message, Icon } from 'antd';
import shortId from 'shortid';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import hoc from 'components/HOC/pageHeader';
import './Import.less';

const props = {
  name: 'file',
  action: '/api/forward/file?url=/externalloan/blacklist/import',
  showUploadList: false
};

@inject(stores => ({
  store: stores.importStore
}))
@hoc({ name: '批量导入', className: 'page_import' })
@observer
class Import extends Component {
  state = {
    loading: false,
    list: [],
    batch: []
  };

  /**
   * 批量保存
   */
  @autobind
  saveBatch() {
    const { batch, list } = this.state;
    const { saveBatch } = this.props.store;
    if (!batch.length) {
      return message.error('请选择需要保存的数据项');
    }
    Modal.confirm({
      title: '确定保存选中的条目?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await saveBatch(batch);
        message.success(`保存成功`);
        const _list = [];
        list.map(item => {
          let shall = true;
          batch.map(v => {
            if (item.shortid == v.shortid) {
              shall = false;
            }
          });
          if (shall) {
            _list.push(item);
          }
        });
        this.setState({ list: _list });
      }
    });
  }

  /**
   * 全部保存
   */
  @autobind
  saveAll() {
    const { list } = this.state;
    const { saveBatch } = this.props.store;
    if (!list.length) {
      return message.error('没有可以保存的数据');
    }
    Modal.confirm({
      title: '确定保存全部条目?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await saveBatch(list);
        message.success(`保存成功`);
        this.setState({ list: [] });
      }
    });
  }

  /**
   * 重置表格
   */
  @autobind
  resetTable() {
    this.setState({ list: [], batch: [] });
  }

  /**
   * 批量删除
   */
  @autobind
  batchDelete() {
    const { batch, list } = this.state;
    Modal.confirm({
      title: '确定删除选中的条目?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const _list = [];
        list.map(item => {
          let ava = true;
          batch.map(_item => {
            if (_item.shortid == item.shortid) {
              ava = false;
            }
          });
          if (ava) {
            _list.push(item);
          }
        });
        this.setState({
          list: _list,
          batch: []
        });
        message.success(`删除成功`);
      }
    });
  }

  searchLeft() {
    const { _query } = this.props.store;
    return (
      <span className="action-left-search">
        <Button type="primary" icon="save" onClick={this.saveBatch}>
          保存
        </Button>
        <Button type="primary" icon="save" onClick={this.saveAll}>
          保存所有数据
        </Button>
        <Button type="primary" icon="edit" onClick={this.resetTable}>
          重置
        </Button>
        <Button type="primary" icon="delete" onClick={this.batchDelete}>
          删除
        </Button>
        <Upload
          {...props}
          style={{ display: 'inline-block' }}
          beforeUpload={() => {
            this.setState({
              loading: true
            });
          }}
          onChange={info => {
            if (info.file.status === 'done') {
              if (
                info.file.response.data.status &&
                info.file.response.data.status.code == 10003
              ) {
                const { pathname, search } = window.location;
                window.location.href = `/login?from=${encodeURIComponent(
                  pathname + search
                )}`;
              }
              message.success(`${info.file.name} 导入成功`);
              const list = info.file.response.data.map(item => {
                const shortid = shortId.generate();
                return { ...item, shortid };
              });
              this.setState({ list, loading: false });
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 导入失败.`);
            }
          }}
        >
          <Button>
            <Icon type="download" /> 导入数据
          </Button>
        </Upload>
      </span>
    );
  }

  columns() {
    return [
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '身份证',
        dataIndex: 'idcard'
      },
      {
        title: '性别',
        dataIndex: 'sex'
      },
      {
        title: 'QQ号码',
        dataIndex: 'qq'
      },
      {
        title: '手机',
        dataIndex: 'mobile'
      },
      {
        title: '手机2',
        dataIndex: 'mobild2'
      },
      {
        title: '手机3',
        dataIndex: 'mobile3'
      },
      {
        title: '来源',
        dataIndex: 'platform'
      },
      {
        title: '网站',
        dataIndex: 'blacksite'
      }
    ];
  }

  render() {
    const { loading, batch, list } = this.state;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.shortid}
          pagination={{
            pageSize: 20
          }}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({ batch: selectedRows });
            }
          }}
          rowClassName={(record, index) =>
            record.state == '2' ? 'status_2' : ''
          }
          loading={loading}
        />
      </div>
    );
  }
}

export default Import;
