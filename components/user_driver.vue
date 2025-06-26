<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		props: {
			userItem: {
				type: Object,
				default: {}
			},
			beidouItem: {
				type: Object,
				default: {}
			},
			trajectoryBtnShow: {
				type: Boolean,
				default: false
			},
			collectionBtnShow: {
				type: Boolean,
				default: false
			},
			callBtnShow: {
				type: Boolean,
				default: false
			},
			vipTypeShow: {
				type: Number,
				default: 0
			}
		},
		name:"mainUserList",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>