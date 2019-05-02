module.exports = (option, app) =>
  async function parseConfig(ctx, next) {
    const { externalAPI, https } = app.config;

    const apiConfig = { https };
    Object.keys(externalAPI).forEach(gateway => {
      const { defaultOptions, baseURL } = externalAPI[gateway];
      apiConfig[gateway] = { defaultOptions, baseURL };
    });

    ctx.locals.apiConfig = apiConfig;

    await next();
  };
