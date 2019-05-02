module.exports = app => {
    const { router, controller } = app;
    const { forwardController } = controller;
    const prefix = '/api/forward';

    router.post(`${prefix}`, forwardController.index);
    router.post(`${prefix}/file`, forwardController.file);
};