const util = {
	setToken(token) {
		this.setSession('token', token)
	},
	getToken() {
		return this.getSession('token') || '';
	},
	getUserId() {
		return this.getSession('userId') || '';
	},
	getSession(key) {
		return uni.getStorageSync(key);
	},
	setSession(key, value) {
		uni.setStorageSync(key, value);
	},
	headerTimesTamp() {
		return Math.floor(new Date().getTime() / 1000)
	},
	showToast(text, type = 'none', position = 'center') {
		setTimeout(() => {
			uni.showToast({
				title: text,
				duration: 2000,
				mask: true,
				icon: type,
				position: position,
				success() {

				},
				fail() {

				}
			})
		}, 100)
	}
}

export default util
