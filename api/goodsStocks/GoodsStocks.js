import Util from '@/util/RequestUtil'

export default {
	findGoodsStocksListByArray(params){
		return Util.post('/gwb/goodsStocks/findGoodsStocksListByArray', params)
	}
}