import Util from '@/util/RequestUtil'

export default {
  selectPtypeById (params) {
    return Util.get('/gwb/ptype/selectPtypeById', params)
  }
}