import config from '@/config'
import Util from '@/util/RequestUtil'

const defaultMethod = {
	getAnnexImg(id) {
		return config.getFullBaseUrl() + '/gwb/sysAnnexConfigInfo/getAnnexFile?id=' + id
	},
	getMinioImg(fileName) {
		return config.getFullBaseUrl() + '/file/minio/download?fileName=' + fileName
	},
	wxUserLogin2Server(code) {
		let url = '/wx/wxUser/wxUserLogin'
		url = url + '?code=' + code
		return Util.post(url)
	},
	wxUserInfUpdate(params) {
		return Util.post('/wx/wxUser/wxUserInfUpdate', params)
	},
	getWxUserInf() {
		return Util.get('/wx/wxUser/getWxUserInf')
	},
	checkLoginStatus() {
		return Util.get('/wx/wxUser/checkLoginStatus')
	}
}

export default defaultMethod
