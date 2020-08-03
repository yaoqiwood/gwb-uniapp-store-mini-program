<template>
	<view></view>
</template>

<script>
	import Util from '@/util/Util'
	import SystemApi from '@/api/system/System'

	export default {
		data() {
			return {}
		},
		onLoad() {
			SystemApi.checkLoginStatus().then(resp => {
				if (resp.status) {
					Util.goto('/pages/tabBar/home/home')
				}
			})
		},
		method: {}
	}
</script>
<style lang="scss">

</style>
