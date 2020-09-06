import Util from '@/util/RequestUtil'
import { ENUM_GOODS_COLUMN, ENUM_ORDER } from '@/util/Constants'

export default {
  getMallOrderMainDto (pageNo = 1, pageSize = 10, status = 'all') {
    return Util.get('/gwb/mallOrderMain/getMallOrderMainDto', { 'pageNo': pageNo, 'pageSize': pageSize, 'status': status })
  }
}
