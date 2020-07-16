'use strict';
module.exports = {
	api: {
		host: 'http://127.0.0.1',
		port: '8080',
		projectName: '/jeecg-boot/'
	},
	getFullBaseUrl() {
		let that = this.api
		return that.host + ":" + that.port + that.projectName
	}
}
