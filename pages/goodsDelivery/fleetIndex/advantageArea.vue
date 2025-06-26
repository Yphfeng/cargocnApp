<template>
	<view class="all">
		<view class="all-box">
			<view :class="['select-box', item.isSelect?'select-text':'select-not-text']" v-for="(item, index) in areaArr" @click="selectArea(index)">{{item.areaName}}</view>
		</view>
		<view class="btn-box">
			<view class="btn-text" @click="confirmEvent">确认信息</view>
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data(){
			return {
				areaArr: [],
				areaText: '',
			}
		},
		onLoad(options) {
			this.areaText = options.areaText?options.areaText:'';
			ship.newQueryPostRequest('/cd/fleetAdvantageArea/list', {}).then(res=>{
				if(res.retCode == "0000000"){
					if(this.areaText){
						var areaTextArr = this.areaText.split(',');
						res.rspBody.map(val=>{
							areaTextArr.map(item=>{
								if(val.areaName == item){
									val.isSelect = true;
								}
							})
						})
					}
					this.areaArr = res.rspBody;
				} else {
					uni.showToast({
						title: res.retDesc,
						icon: 'none'
					})
				}
			})
			.catch(err=>{
				console.log(err)
			})
		},
		methods: {
			confirmEvent(){
				let that = this;
				let areaText = '';
				that.areaArr.map((val, idx)=>{
					if(val.isSelect){
						if(!areaText){
							areaText = val.areaName;
						} else {
							areaText = areaText + ',' + val.areaName;
						}
					}
				})
				uni.$emit('advantageEvent', {
					type: 1,
					areaText: areaText
				})
				setTimeout(()=>{
					uni.navigateBack({})
				}, 300)
			},
			selectArea(index){
				let that = this;
				let areaArr = [];
				that.areaArr.map((val, idx)=>{
					if(index == idx){
						val.isSelect = !val.isSelect
					}
					areaArr.push(val);
				})
				that.areaArr = areaArr;
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F3F3F3;
	}
	.all{
		.all-box{
			background-color: #fff;
			margin-top: 18rpx;
			display: flex;
			padding: 8rpx 18rpx 24rpx 18rpx;
			flex-wrap: wrap;
			.select-box{
				width: 206rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
				border-radius: 12rpx;
				margin-top: 24rpx;
				box-sizing: border-box;
				font-size: 28rpx;
				margin-left: 26rpx;
			}
			.select-text{
				background-color: #0171F9;
				color: #fff;
			}
			.select-not-text{
				border: 2rpx solid #979797;
				color: #777;
			}
		}
		.btn-box{
			position: fixed;
			bottom: 24rpx;
			left: 0;
			right: 0;
			width: 100%;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			.btn-text{
				background-color: #0171F9;
				width: 630rpx;
				text-align: center;
				height: 88rpx;
				line-height: 88rpx;
				border-radius: 44rpx;
				box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(38, 158, 255, 0.5);
				font-size: 36rpx;
			}
		}
	}
</style>
