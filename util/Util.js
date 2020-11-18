const util = {
	setToken (token) {
		this.setSession('token', token)
	},
	getToken () {
		return this.getSession('token') || '';
	},
	getUserId () {
		return this.getSession('userId') || '';
	},
	setObtainedStatus (status) {
		this.setSession("obtainedStatus", status)
	},
	getObtainedStatus () {
		return this.getSession("obtainedStatus")
	},
	setCurrentUid (uid) {
		this.setSession("uid", uid)
	},
	getCurrentUid () {
		return this.getSession("uid")
	},
	setCurrentUserInf (obj) {
		this.setSession("currentUserInf", obj)
	},
	getCurrentUserInf () {
		return this.getSession("currentUserInf")
	},
	setShopingCartInf (params) {
		this.setSession("shoppingCart", JSON.stringify(params))
	},
	emptyShoppingCartInf () {
		this.setSession("shoppingCart", [])
	},
	getShoppingCartInf () {
		if (null == this.getSession("shoppingCart") || '' == this.getSession('shoppingCart')) {
			return []
		}
		return JSON.parse(this.getSession("shoppingCart"))
	},
	setPaymentInf (params) {
		this.setSession("paymentOrder", params)
	},
	getPaymentInf () {
		return this.getSession("paymentOrder")
	},
	setMallOrderMainSession (params) {
		this.setSession("mallOrderMain", params)
	},
	getMallOrderMainSession () {
		return this.getSession("mallOrderMain")
	},
	setSelectMallOrderMainSession (params) {
		this.setSession("selectMallOrderMainSession", params)
	},
	getSelectMallOrderMainSession () {
		return this.getSession("selectMallOrderMainSession")
	},
	setRetAddressInf (params) {
		this.setSession("retAddressInfSession", params)
	},
	getRetAddressInf () {
		return this.getSession("retAddressInfSession")
	},
	// 设定默认地址选定
	setDefaultAddress (address) {
		this.setSession("defaultAddress", JSON.stringify(address))
	},
	// 获取默认地址选定
	getDefaultAddress () {
		if (this.getSession("defaultAddress") === null || this.getSession("defaultAddress") === '') {
			return null;
		}
		return JSON.parse(this.getSession("defaultAddress"))
	},
	getSession (key) {
		return uni.getStorageSync(key);
	},
	setSession (key, value) {
		uni.setStorageSync(key, value);
	},
	formatDate (date, fmt) {
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds() //秒 
		}
		if (/(y+)/.test(fmt)) { //根据y的长度来截取年
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
		}
		return fmt
	},
	headerTimesTamp () {
		return Math.floor(new Date().getTime() / 1000)
	},
	showToast (text, type = 'none', position = 'center') {
		setTimeout(() => {
			uni.showToast({
				title: text,
				duration: 2000,
				mask: true,
				icon: type,
				position: position,
				success () {

				},
				fail () {

				}
			})
		}, 100)
	},
	goto (url, animationType, animationDuration, success, fail, complete) {
		uni.reLaunch({
			'url': url
		})
	}
}

export default util
