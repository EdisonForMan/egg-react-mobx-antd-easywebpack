import "styles/pages/home.less";
// 国际化
import { ConfigProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, StaticRouter } from "react-router-dom";
import { matchRoutes, renderRoutes } from "react-router-config";
import { AppContainer } from "react-hot-loader";
import { Provider } from "mobx-react";

//  common
import Layout from "framework/layout.jsx";
import MainContainer from "components/MainContainer";
import UserStore from "stores/console/UserStore";

//  控制台
import User from "components/console/User";
import Group from "components/console/Group";
import GroupStore from "stores/console/GroupStore";
import Menu from "components/console/Menu";
import MenuStore from "stores/console/MenuStore";

const createStores = (ctx, state) => ({
  userStore: new UserStore(ctx, state),
  groupStore: new GroupStore(ctx, state),
  menuStore: new MenuStore(ctx, state),
});

const routes = [
  {
    path: "/",
    component: MainContainer,
    routes: [
      {
        path: "/home/user",
        component: User,
      },
      {
        path: "/home/group",
        component: Group,
      },
      {
        path: "/home/menu",
        component: Menu,
      },
    ],
  },
];

const clientRender = () => {
  const stores = createStores(null, window.__INITIAL_STATE__);
  const Entry = () => (
    <Provider {...stores}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Provider>
  );
  const render = (App) => {
    ReactDOM.hydrate(
      EASY_ENV_IS_DEV ? (
        <AppContainer>
          <ConfigProvider locale={zh_CN}>
            <App />
          </ConfigProvider>
        </AppContainer>
      ) : (
        <ConfigProvider locale={zh_CN}>
          <App />
        </ConfigProvider>
      ),
      document.getElementById("app")
    );
  };
  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(Entry);
};

const serverRender = async (locals) => {
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

export default EASY_ENV_IS_NODE ? serverRender : clientRender();
