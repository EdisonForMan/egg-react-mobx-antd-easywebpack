import 'styles/pages/home.less';
// 国际化
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'mobx-react';

//  common
import Layout from 'framework/layout.jsx';
import MainContainer from 'components/MainContainer';
import UserStore from 'stores/console/UserStore';

//  控制台
import User from 'components/console/User';
import Group from 'components/console/Group';
import GroupStore from 'stores/console/GroupStore';
import Menu from 'components/console/Menu';
import MenuStore from 'stores/console/MenuStore';

//  电商
import EcommerceBill from 'components/ecommerce/EcommerceBill';
import EcommerceBillStore from 'stores/ecommerce/EcommerceBillStore';
import EcommerceData from 'components/ecommerce/EcommerceData';
import EcommerceDataStore from 'stores/ecommerce/EcommerceDataStore';
import EcommercePendingData from 'components/ecommerce/EcommercePendingData';
import EcommercePendingDataStore from 'stores/ecommerce/EcommercePendingDataStore';

//  公积金
import AccumulationFundHandled from 'components/accumulationFund/AccumulationFundHandled';
import AccumulationFundHandledStore from 'stores/accumulationFund/AccumulationFundHandledStore';
import AccumulationFundUnhandled from 'components/accumulationFund/AccumulationFundUnhandled';
import AccumulationFundUnhandledStore from 'stores/accumulationFund/AccumulationFundUnhandledStore';

//  负面标签
import NegativeLabelKeyword from 'components/negativeLabel/NegativeLabelKeyword';
import NegativeLabelKeywordStore from 'stores/negativeLabel/NegativeLabelKeywordStore';
import NegativeLabelPendingData from 'components/negativeLabel/NegativeLabelPendingData';
import StrategyKeywordStore from 'stores/negativeLabel/StrategyKeywordStore';
import StrategyDensityStore from 'stores/negativeLabel/StrategyDensityStore';
import StrategyRelationInStore from 'stores/negativeLabel/StrategyRelationInStore';
import StrategyRelationOutStore from 'stores/negativeLabel/StrategyRelationOutStore';
import NegativeLabelProcessedData from 'components/negativeLabel/NegativeLabelProcessedData';
import NegativeLabelProcessedDataStore from 'stores/negativeLabel/NegativeLabelProcessedDataStore';

//  外部网贷黑名单
import BlackListManagement from 'components/blackList/BlackListManagement';
import BlackListManagementStore from 'stores/blackList/BlackListManagementStore';
//import Import from 'components/blackList/Import';
//import ImportStore from 'stores/blackList/ImportStore';

//  入库数据抽查
import EcommerceCheck from 'components/check/EcommerceCheck';
import EcommerceCheckStore from 'stores/check/EcommerceCheckStore';
//import NegativeLabelCheck from 'components/check/negativeLabelCheck';
//import NegativeLabelCheckStore from 'stores/check/negativeLabelCheckStore';

//  报表
import Report from 'components/report/Report';
import ReportStore from 'stores/report/ReportStore';

//  异常结案
import ExrecordManagement from 'components/exrecord/ExrecordManagement';
import ExrecordManagementStore from 'stores/exrecord/ExrecordManagementStore';

//  车辆信息管理
import CarDisplayList from 'components/car/CarDisplayList';
import CarDisplayListStore from 'stores/car/CarDisplayListStore';
import CarWebDetectList from 'components/car/CarWebDetectList';
import CarWebDetectListStore from 'stores/car/CarWebDetectListStore';

//  网站管理
import WebManagement from 'components/web/WebManagement';
import WebManagementStore from 'stores/web/WebManagementStore';

//  网查
import WebDetectStore from 'stores/common/WebDetectStore';

const createStores = (ctx, state) => ({
  userStore: new UserStore(ctx, state),
  groupStore: new GroupStore(ctx, state),
  menuStore: new MenuStore(ctx, state),
  ecommerceBillStore: new EcommerceBillStore(ctx, state),
  ecommerceDataStore: new EcommerceDataStore(ctx, state),
  ecommercePendingDataStore: new EcommercePendingDataStore(ctx, state),
  accumulationFundHandledStore: new AccumulationFundHandledStore(ctx, state),
  accumulationFundUnhandledStore: new AccumulationFundUnhandledStore(
    ctx,
    state
  ),
  negativeLabelKeywordStore: new NegativeLabelKeywordStore(ctx, state),
  strategyKeywordStore: new StrategyKeywordStore(ctx, state),
  strategyDensityStore: new StrategyDensityStore(ctx, state),
  strategyRelationInStore: new StrategyRelationInStore(ctx, state),
  strategyRelationOutStore: new StrategyRelationOutStore(ctx, state),
  negativeLabelProcessedDataStore: new NegativeLabelProcessedDataStore(
    ctx,
    state
  ),
  blackListManagementStore: new BlackListManagementStore(ctx, state),
  //importStore: new ImportStore(ctx, state),
  ecommerceCheckStore: new EcommerceCheckStore(ctx, state),
  //negativeLabelCheckStore: new NegativeLabelCheckStore(ctx, state),
  reportStore: new ReportStore(ctx, state),
  exrecordManagementStore: new ExrecordManagementStore(ctx, state),
  carDisplayListStore: new CarDisplayListStore(ctx, state),
  carWebDetectListStore: new CarWebDetectListStore(ctx, state),
  webManagementStore: new WebManagementStore(ctx, state),
  webDetectStore: new WebDetectStore(ctx, state)
});

const routes = [
  {
    path: '/',
    component: MainContainer,
    routes: [
      {
        path: '/home/user',
        component: User
      },
      {
        path: '/home/group',
        component: Group
      },
      {
        path: '/home/menu',
        component: Menu
      },
      {
        path: '/home/ecommercerawdata',
        component: EcommercePendingData
      },
      {
        path: '/home/ecommercedata',
        component: EcommerceData
      },
      {
        path: '/home/ecommercebill',
        component: EcommerceBill
      },
      {
        path: '/home/accumulationFundHandled',
        component: AccumulationFundHandled
      },
      {
        path: '/home/accumulationFundUnhandled',
        component: AccumulationFundUnhandled
      },
      {
        path: '/home/negativeLabelKeyword',
        component: NegativeLabelKeyword
      },
      {
        path: '/home/negativeLabelPendingData',
        component: NegativeLabelPendingData
      },
      {
        path: '/home/negativeLabelProcessedData',
        component: NegativeLabelProcessedData
      },
      {
        path: '/home/blackListManagement',
        component: BlackListManagement
      },
      // {
      //   path: '/home/import',
      //   component: Import
      // },
      {
        path: '/home/ecommerceCheck',
        component: EcommerceCheck
      },
      // {
      //   path: '/home/negativeLabelCheck',
      //   component: NegativeLabelCheck
      // },
      {
        path: '/home/report',
        component: Report
      },
      {
        path: '/home/exrecordManagement',
        component: ExrecordManagement
      },
      {
        path: '/home/carWebDetectList',
        component: CarWebDetectList
      },
      {
        path: '/home/carDisplayList',
        component: CarDisplayList
      },
      {
        path: '/home/webManagement',
        component: WebManagement
      }
    ]
  }
];

const clientRender = () => {
  const stores = createStores(null, window.__INITIAL_STATE__);
  const Entry = () => (
    <Provider {...stores}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Provider>
  );
  const render = App => {
    ReactDOM.hydrate(
      EASY_ENV_IS_DEV ? (
        <AppContainer>
          <LocaleProvider locale={zh_CN}>
            <App />
          </LocaleProvider>
        </AppContainer>
      ) : (
          <LocaleProvider locale={zh_CN}>
            <App />
          </LocaleProvider>
        ),
      document.getElementById('app')
    );
  };
  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(Entry);
};

const serverRender = async locals => {
  const { ctx, apiConfig } = locals.state;
  const { url, service } = ctx;
  const stores = createStores(ctx);
  const branch = matchRoutes(routes, url);
  const promises = branch.map(({ route }) => {
    const { fetch } = route.component;
    return fetch instanceof Function ? fetch(stores) : Promise.resolve(null);
  });

  const results = await Promise.all(promises);
  const initialState = await results.reduce((state, result) => {
    Object.assign(state, result);
    return state;
  }, {});
  locals.state = initialState;

  return () => (
    <LocaleProvider locale={zh_CN}>
      <Layout apiConfig={apiConfig}>
        <Provider {...stores}>
          <StaticRouter location={url} context={{}}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      </Layout>
    </LocaleProvider>
  );
};

serverRender.isWrapped = true;

export default (EASY_ENV_IS_NODE ? serverRender : clientRender());
