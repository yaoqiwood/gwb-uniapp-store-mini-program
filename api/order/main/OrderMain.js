import Util from '@/util/RequestUtil'

export default {
  checkOrderMainPaidStatus (orderNum) {
    return Util.get("/gwb/mallOrderMain/checkOrderMainPaidStatus", { orderNum: orderNum })
  }
}