'use strict';
module.exports = {
	api: {
		host: 'http://192.168.2.70',
		port: '8080',
		projectName: '/jeecg-boot/'
	},
	getFullBaseUrl () {
		let that = this.api
		return that.host + ":" + that.port + that.projectName
	}
}
