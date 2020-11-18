import Util from '@/util/RequestUtil'

export default {
  findMallMainAfterSaleDtoByOrderNo (orderNo) {
    return Util.get('/gwb/mallOrderMain/findMallMainAfterSaleDtoByOrderNo?orderNo=' + orderNo)
  },
  getRetAddressInf () {
    return Util.get('/wx/wxConfInf/getRetAddressInf')
  },
  userRetGoodsInfEnter (params) {
    return Util.put('/gwb/mallOrderMain/userRetGoodsInfEnter', params)
  }
}