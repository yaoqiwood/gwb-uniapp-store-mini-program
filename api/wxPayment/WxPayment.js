import Util from '@/util/RequestUtil'

export default {
  doOrderUnifiedorder (params) {
    return Util.post('/wx/wxPaymentApi/doOrderUnifiedorder', params)
  }
}