import Util from '@/util/RequestUtil'

export default {
  addOrCancelFavoritesItem (params) {
    return Util.post('/gwb/mallFavorites/addOrCancelFavoritesItem', params)
  },
  getMallFavoritesByPage (params) {
    return Util.get('/gwb/mallFavorites/getMallFavoritesByPage', params)
  }
}