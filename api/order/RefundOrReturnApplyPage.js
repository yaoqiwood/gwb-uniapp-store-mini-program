import Util from '@/util/RequestUtil'

export default {
  reqExchangeOrReturn (params) {
    return Util.put("/wx/wxOrder/reqExchangeOrReturn", params)
  }
}