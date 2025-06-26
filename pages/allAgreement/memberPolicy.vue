<template>
	<view class="privacy">
		<web-view 
			v-if="memberPolicy"
			:src="memberPolicy"
			:update-title="false"
		></web-view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	export default {
		data() {
			return {
				memberPolicy: ship.memberPolicy
			};
		},
		onLoad() {
			setTimeout(()=>{
				uni.setNavigationBarTitle({
					title: '会员协议'
				})
			},500)
		}
	}
</script>

<style lang="scss">
</style>
