import Util from '@/util/RequestUtil'

export default {
	getSwipeImgList() {
		return Util.get('gwb/goodsStockPictures/getSwipeImgList')
	}
}
