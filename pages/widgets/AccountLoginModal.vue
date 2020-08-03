<template>
	<view>
		<view v-if="switch2Display"
		      class="layer"
		      @click="closeModal">
			<view class="modal">
				<view class="modal-upper-back">
					<image src="@/static/img/gwb-img/grzx_bg.png"></image>
					<view class="modal-text">需要授权登录才可以进行后续的操作</view>
					<button type="primary"
					        open-type="getUserInfo"
					        @click="getWxUserInf">
						授权登录
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Util from '@/util/Util'
	import SystemApi from '@/api/system/System'

	export default {
		props: {
			switch2DisplayProp: {
				type: Boolean,
				default: false
			}
		},
		data: () => {
			return {
				switch2Display: false
			}
		},
		onLoad() {

		},
		methods: {
			checkUserStatus() {
				return Util.getObtainedStatus()
			},
			closeModal() {
				this.switch2Display = false
			},
			getWxUserInf() {
				uni.getUserInfo({
					provider: 'weixin',
					success: (infoRes) => {
						SystemApi.wxUserInfUpdate({
							uid: Util.getCurrentUid(),
							avatarUrl: infoRes.userInfo.avatarUrl,
							city: infoRes.userInfo.city,
							country: infoRes.userInfo.country,
							gender: infoRes.userInfo.gender,
							nickName: infoRes.userInfo.nickName,
							province: infoRes.userInfo.province
						})
					}
				})
			}
		},
		watch: {
			switch2DisplayProp: {
				handle(val) {
					this.switch2Display = val
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "css/AccountLoginModal.scss";
</style>
