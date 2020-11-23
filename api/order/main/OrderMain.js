import Util from '@/util/RequestUtil'

export default {
  checkOrderMainPaidStatus (orderNum) {
    return Util.get("/gwb/mallOrderMain/checkOrderMainPaidStatus", { orderNum: orderNum })
  },
  queryByItemNum (id) {
    return Util.get("/gwb/mallOrderMain/queryByItemNum", { itemNum: id })
  },
  cancelOrder (orderNum) {
    return Util.put("/gwb/mallOrderMain/cancelOrder?orderNum=" + orderNum)
  },
  repealOrderReturnReq (orderNum) {
    return Util.put("/gwb/mallOrderMain/repealOrderReturnReq?orderNum=" + orderNum)
  },
  getMallOrderReturnInfById (momId) {
    return Util.get("/gwb/mallOrderMain/getMallOrderReturnInfById?momId=" + momId)
  }
}