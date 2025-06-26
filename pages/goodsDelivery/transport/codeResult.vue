<template>
	<view class="all">
		<view class="" v-for="item in codeArr">{{item}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				codeArr: [],
			}
		},
		onLoad(options) {
			this.codeArr = JSON.parse(options.resultArr);
		},
		onUnload() {
			uni.$emit('codeRefresh', {
				isRefresh: 1
			})
		},
		methods:{
			
		}
	}
</script>

<style>
</style>
