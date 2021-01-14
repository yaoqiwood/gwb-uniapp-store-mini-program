import Util from '@/util/RequestUtil'

export default {
  wxPtypeDetailUpdate (params) {
    return Util.put('/gwb/ptypeDetail/wxPtypeDetailUpdate', params)
  },
  wxProductTypeSwipeAdd (params) {
    return Util.put('/gwb/ptype/wxProductTypeSwipeAdd', params)
  }
}