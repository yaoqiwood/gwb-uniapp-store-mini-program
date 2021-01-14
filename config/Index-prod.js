'use strict';
module.exports = {
  api: {
    host: 'https://api.web.guangwabao.com',
    port: '',
    projectName: '/gwb-boot/'
  },
  getFullBaseUrl () {
    let that = this.api
    return that.host + that.projectName
  }
}
