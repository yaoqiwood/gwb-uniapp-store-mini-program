import Util from '@/util/RequestUtil'
import { ENUM_GOODS_COLUMN, ENUM_ORDER } from '@/util/Constants'

export default {
  searchPtypeByPage (pageNo = 1, pageSize = 5, pfullname = '', parId = '', orderColumn = ENUM_GOODS_COLUMN.SALE_NUM.code, order = ENUM_ORDER.ASC.code) {
    return Util.get('wx/wxSearchPage/searchPtypeByPage', { 'pfullname': pfullname, 'parId': parId, 'orderColumn': orderColumn, 'order': order, 'pageNo': pageNo, 'pageSize': pageSize })
  }
}