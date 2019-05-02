/**
 * 默认菜单 - 第一版 先写死
 */
module.exports.MENUS = [
  {
    title: '控制台',
    key: '#console',
    children: [
      {
        title: '用户管理',
        key: '/user'
      },
      {
        title: '用户组管理',
        key: '/group'
      },
      {
        title: '菜单管理',
        key: '/menu'
      }
    ]
  },
  {
    title: '电商',
    key: '#em',
    children: [
      {
        title: '待处理数据-电商',
        key: '/ecommercerawdata'
      },
      {
        title: '已入库数据-电商',
        key: '/ecommercedata'
      },
      {
        title: '已入库数据-账单',
        key: '/ecommercebill'
      }
    ]
  },
  {
    title: '公积金',
    key: 'inquiryCenter',
    children: [
      {
        title: '待处理数据-公积金',
        key: '/accumulationFundUnhandled'
      },
      {
        title: '已入库数据-公积金',
        key: '/accumulationFundHandled'
      }
    ]
  },
  {
    title: '负面标签',
    key: '#fumian',
    children: [
      {
        title: '敏感词管理',
        key: '/negativeLabelKeyword'
      },
      {
        title: '待处理数据',
        key: '/negativeLabelPendingData'
      },
      {
        title: '已入库数据',
        key: '/negativeLabelProcessedData'
      }
    ]
  },
  {
    title: '外部网贷黑名单',
    key: '#waibuwangdai',
    children: [
      {
        title: '黑名单管理',
        key: '/blackListManagement'
      },
      {
        title: '批量导入',
        key: '/import'
      }
    ]
  },
  {
    title: '入库数据抽查',
    key: '#rukushuju',
    children: [
      {
        title: '电商抽查',
        key: '/ecommerceCheck'
      },
      {
        title: '负面标签抽查',
        key: '/negativeLabelCheck'
      }
    ]
  },
  {
    title: '报表',
    key: '#baobiao',
    children: [
      {
        title: '入库统计',
        key: '/report'
      }
    ]
  },
  {
    title: '异常结案',
    key: '#yichang',
    children: [
      {
        title: '异常结案管理',
        key: '/exrecordManagement'
      }
    ]
  },
  {
    title: '车辆信息管理',
    key: '#cheliang',
    children: [
      {
        title: '网查信息',
        key: '/carWebDetectList'
      },
      {
        title: '车辆信息',
        key: '/carDisplayList'
      }
    ]
  },
  {
    title: '网站管理',
    key: '#websit',
    children: [
      {
        title: '网站管理',
        key: '/webManagement'
      }
    ]
  }
];
