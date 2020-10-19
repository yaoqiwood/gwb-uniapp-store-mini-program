import Util from '@/util/RequestUtil'

export default {
  orderItemList (orderNo, pageNo = 1, pageSize = 100) {
    return Util.get('/gwb/mallOrderItem/list', { orderNo, pageNo, pageSize })
  },
  getOrderItemExpressInfo (orderNum) {
    return Util.get('/gwb/mallOrderItem/getOrderItemExpressInfo', { orderNum: orderNum })
  }
}