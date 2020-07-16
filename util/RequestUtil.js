import util from '@/util/Util'
import config from '@/config'

const host = config.api.host;
const port = config.api.port;
const prjName = config.api.projectName
const request = {
	uniRequest(url, method, paramObj, showLoading) {
		let time = util.headerTimesTamp()
		return new Promise((resolve, reject) => {
			let timeout;
			timeout = setTimeout(() => {
				util.showToast('请求超时，请稍后再试')
			}, 30000)
			if (showLoading) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
			}
			// console.log(`${host}:${port}${prjName}${url}`)
			uni.request({
				url: `${host}:${port}${prjName}${url}`,
				data: paramObj,
				method: method,
				header: {
					'Content-Type': 'application/json', //自定义请求头信息
					'token': util.getToken(),
					'appId': config.api.appId,
					'timestamp': time,
					'timeoutExpress': time + 30
					// 'sign': util.headerSign(method, url, time, paramObj)
				},
				success: res => {
					if (res.statusCode === 200) {
						if (res.data.result.code == 909) {
							util.goto('login/login');
							util.showToast('请重新登录');
							reject(res.data);
						} else {
							resolve(res.data.result)
						}
					} else if (res.statusCode === 500) {
						util.showToast('服务器出问题了')
					} else {
						util.showToast(res.data.result.msg)
					}
				},
				fail: err => {
					util.showToast(err.message);
					reject(err)
				},
				complete: () => {
					clearTimeout(timeout)
					uni.hideLoading()
				}
			})
		})
	},
	get(url, paramObj = {}, showLoading = true) {
		return this.uniRequest(url, 'GET', paramObj, showLoading)
	},
	post(url, paramObj = {}, showLoading = true) {
		return this.uniRequest(url, 'POST', paramObj, showLoading)
	},
	put(url, paramObj = {}) {
		return this.uniRequest(url, 'PUT', paramObj)
	},
	delete(url, paramObj = {}) {
		return this.uniRequest(url, 'DELETE', paramObj)
	}
}
export default request
