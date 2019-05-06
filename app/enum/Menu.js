/**
 * 默认菜单 - 第一版 先写死
 */
module.exports.MENUS = [
  {
    label: 'console',
    link: '#console',
    children: [
      {
        label: 'user',
        link: '/user'
      },
      {
        label: 'group',
        link: '/group'
      },
      {
        label: 'menus',
        link: '/menu'
      }
    ]
  }
];
/*
module.exports.MENUS = [
  {
    label: 'console',
    link: '#console',
    children: [
      {
        label: 'user',
        link: '/user'
      },
      {
        label: 'group',
        link: '/group'
      },
      {
        label: 'menus',
        link: '/menu'
      }
    ]
  },
  {
    label: '电商',
    link: '#em',
    children: [
      {
        label: '待处理数据-电商',
        link: '/ecommercerawdata'
      },
      {
        label: '已入库数据-电商',
        link: '/ecommercedata'
      },
      {
        label: '已入库数据-账单',
        link: '/ecommercebill'
      }
    ]
  },
  {
    label: '公积金',
    link: '#inquiryCenter',
    children: [
      {
        label: '待处理数据-公积金',
        link: '/accumulationFundUnhandled'
      },
      {
        label: '已入库数据-公积金',
        link: '/accumulationFundHandled'
      }
    ]
  },
  {
    label: '负面标签',
    link: '#fumian',
    children: [
      {
        label: '敏感词管理',
        link: '/negativeLabelKeyword'
      },
      {
        label: '待处理数据',
        link: '/negativeLabelPendingData'
      },
      {
        label: '已入库数据',
        link: '/negativeLabelProcessedData'
      }
    ]
  },
  {
    label: '外部网贷黑名单',
    link: '#waibuwangdai',
    children: [
      {
        label: '黑名单管理',
        link: '/blackListManagement'
      },
      {
        label: '批量导入',
        link: '/import'
      }
    ]
  },
  {
    label: '入库数据抽查',
    link: '#rukushuju',
    children: [
      {
        label: '电商抽查',
        link: '/ecommerceCheck'
      },
      {
        label: '负面标签抽查',
        link: '/negativeLabelCheck'
      }
    ]
  },
  {
    label: '报表',
    link: '#baobiao',
    children: [
      {
        label: '入库统计',
        link: '/report'
      }
    ]
  },
  {
    label: '异常结案',
    link: '#yichang',
    children: [
      {
        label: '异常结案管理',
        link: '/exrecordManagement'
      }
    ]
  },
  {
    label: '车辆信息管理',
    link: '#cheliang',
    children: [
      {
        label: '网查信息',
        link: '/carWebDetectList'
      },
      {
        label: '车辆信息',
        link: '/carDisplayList'
      }
    ]
  },
  {
    label: '网站管理',
    link: '#websit',
    children: [
      {
        label: '网站管理',
        link: '/webManagement'
      }
    ]
  }
];
*/
