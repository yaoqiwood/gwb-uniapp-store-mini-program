import SystemApi from '@/api/system/System'
import Util from '@/util/Util'
import { ENUM_STATUS } from "./Constants"


const util = {
	login () {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					SystemApi.wxUserLogin2Server(loginRes.code).then(resp => {
						Util.setToken(resp.token)
						Util.setCurrentUid(resp.uid)
						if (resp.status === ENUM_STATUS.NOT_OBTAINED.code) {
							Util.setObtainedStatus(false)
							// uniTemp.getUserInfo({
							// 	provider: 'weixin',
							// 	success: (infoRes) => {
							// 		SystemApi.wxUserInfUpdate({
							// 			uid: resp.uid,
							// 			avatarUrl: infoRes.userInfo.avatarUrl,
							// 			city: infoRes.userInfo.city,
							// 			country: infoRes.userInfo.country,
							// 			gender: infoRes.userInfo.gender,
							// 			nickName: infoRes.userInfo.nickName,
							// 			province: infoRes.userInfo.province
							// 		})
							// 	}
							// })
							resolve(true)
						} else {
							Util.setObtainedStatus(true)
							// SystemApi.getWxUserInf().then(resp => {
							// 	console.log(resp)
							// })
						}
						resolve(true)
						// Util.goto('../pages/tabBar/home/home?random=' + Math.random())
					})
				}
			})
		})
	}
}

export default util
