import Util from '@/util/RequestUtil'

export default {
  confirmOrder (params) {
    return Util.post("/wx/wxOrder/confirmOrder", params)
  }
}