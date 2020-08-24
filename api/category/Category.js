import Util from '@/util/RequestUtil'

export default {
  getPtypeDtoMiniProgramMenu () {
    return Util.get('wx/wxPtype/getPtypeDtoMiniProgramMenu')
  }
}