import React from 'react';
import { Tooltip, Icon } from 'antd';

//  服务商
export const provider = [
  {
    title: '服务商',
    dataIndex: 'name'
  },
  {
    title: '编码',
    dataIndex: 'code'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '账户数',
    dataIndex: 'accountQuantity'
  },
  {
    title: '状态',
    width: 110,
    dataIndex: 'status',
    render: r => {
      return (
        <span>
          <i
            style={{
              color: r == 1 ? '#4aa45d' : '#de4f3f',
              marginRight: '2px',
              fontSize: '16px'
            }}
          >
            •
          </i>
          {r == 1 ? '启用' : '禁用'}
        </span>
      );
    }
  }
];
//  服务商-账号
export const provider_account = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '账号ID',
    dataIndex: 'accountId'
  },
  {
    title: '账号',
    dataIndex: 'accountName'
  },
  {
    title: (
      <span>
        余额(条数)
        <Tooltip title="禁用状态不查询余额，默认显示为'-'">
          <span style={{ cursor: 'pointer', marginLeft: '4px' }}>
            <Icon type="question-circle" />
          </span>
        </Tooltip>
      </span>
    ),
    dataIndex: 'balance',
    render: (r, data) => {
      return data.status == 1 ? r : '-';
    }
  },
  {
    title: '状态',
    width: 110,
    dataIndex: 'status',
    render: r => {
      return (
        <span>
          <i
            style={{
              color: r == 1 ? '#4aa45d' : '#de4f3f',
              marginRight: '2px',
              fontSize: '16px'
            }}
          >
            •
          </i>
          {r == 1 ? '启用' : '禁用'}
        </span>
      );
    }
  }
];
//  产品
export const product = [
  {
    title: '产品',
    dataIndex: 'name'
  },
  {
    title: '编码',
    dataIndex: 'code'
  },
  {
    title: '签名',
    dataIndex: 'tagContent'
  },
  {
    title: '通道数',
    dataIndex: 'channelQuantity'
  },
  {
    title: '状态',
    width: 110,
    dataIndex: 'status',
    render: r => {
      return (
        <span>
          <i
            style={{
              color: r == 1 ? '#4aa45d' : '#de4f3f',
              marginRight: '2px',
              fontSize: '16px'
            }}
          >
            •
          </i>
          {r == 1 ? '启用' : '禁用'}
        </span>
      );
    }
  }
];
//  产品-通道
export const product_channel = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '编码',
    dataIndex: 'code'
  },
  {
    title: '发送渠道',
    dataIndex: 'channels',
    render: (r, data) => {
      const channels = [];
      data.channelDistributionVOList.map(item => {
        channels.push(
          <span key={item.id} style={{ display: 'block' }}>
            {item.operatorName} / {item.operAccName}({item.operAccAccountName})
            {item.ratio ? ` / ${item.ratio}%` : ``}
          </span>
        );
      });
      return <div>{channels}</div>;
    }
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'status',
    render: r => {
      return (
        <span>
          <i
            style={{
              color: r == 1 ? '#4aa45d' : '#de4f3f',
              marginRight: '2px',
              fontSize: '16px'
            }}
          >
            •
          </i>
          {r == 1 ? '启用' : '禁用'}
        </span>
      );
    }
  }
];

//  产品-通道
export const history = [
  {
    title: '时间',
    dataIndex: 'operateTime'
  },
  {
    title: '操作类型',
    dataIndex: 'operateTypeName'
  },
  {
    title: '操作人员',
    dataIndex: 'operatePerson'
  }
];
