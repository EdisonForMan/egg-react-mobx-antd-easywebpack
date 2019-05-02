const BaseAntifraudAPI = require('./base_antifraud_api');

class UserAPI extends BaseAntifraudAPI {
  login(params) {
    return this.post('/user/login', params);
  }

  logout() {
    return this.get('/user/logout');
  }

  getUserSession() {
    return this.get('/user/session');
  }

  fetchUserList(params) {
    return this.get(`/user/list`, params);
  }

  register(params) {
    return this.post('/user/register', params);
  }

  createUser(user) {
    return this.post('/user', user);
  }

  updateUser(user) {
    return this.put(`/user/${user.id}`, user);
  }

  updatePassword(params) {
    return this.put(`/user/resetPassword/${params.userId}`, params);
  }

  adminUpdatePassword(params) {
    return this.put(`/user/adminResetPassword/${params.userId}`, params);
  }

  updateToAdmin(userId) {
    return this.put(`/user/updateToAdmin/${userId}`);
  }

  fetchUserInfo() {
    return this.get('/user/info');
  }

  fetchJobOption() {
    return this.get('/user/job/option');
  }

  fetchDepartmentOption() {
    return this.get('/user/department/option');
  }
}

export default UserAPI;
