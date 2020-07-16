import config from '@/config'

const defaultMethod = {
	getAnnexImg(id) {
		return config.getFullBaseUrl() + '/gwb/sysAnnexConfigInfo/getAnnexFile?id=' + id
	},
	getMinioImg(fileName) {
		return config.getFullBaseUrl() + '/file/minio/download?fileName=' + fileName
	}
}

export default defaultMethod
