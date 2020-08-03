import Util from '@/util/RequestUtil'
import {ENUM_STATUS} from "@/util/Constants";

export default {
	getSwipeImgList() {
		return Util.get('gwb/goodsStockPictures/getSwipeImgList')
	},
	getGoodStocksSaleTopThree() {
		return Util.get('gwb/dlySale/getGoodStocksSaleTopThree')
	},
	getGoodStockSiftCount() {
		return Util.get("gwb/goodsStocksSift/getGoodStockSiftCount")
	},
	selectPTypePriceByPage(pageNo = 1, pageSize = 5, params = {status: ENUM_STATUS.ENABLE.code}) {
		return Util.get("/gwb/goodsStocksSift/selectPTypePriceByPage?pageNo=" + pageNo + "&pageSize=" + pageSize, params)
	}
}
