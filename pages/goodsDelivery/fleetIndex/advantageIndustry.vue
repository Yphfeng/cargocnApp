<template>
	<view class="all">
		<view class="select-content">
			<view class="select-all">
				<view :class="['select-box', item.isSelect?'select-text':'select-not-text']" v-for="(item, index) in industryArr" @click="selectIndustry(index)">{{item.industryName}}</view>
			</view>
			<view class="custom-box" v-if="!isInput" @click="switchInput">自定义</view>
			<input class="custom-box" v-else type="text" :focus="isFocus" maxlength="10" v-model="customText" @input="customTextInput" placeholder="请输入" />
		</view>
		<view class="btn-box">
			<view class="btn-text" @click="confirmEvent">确认信息</view>
		</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data (){
			return {
				industryArr: [],
				isInput: false,
				customText: '',
				industryText: '',
				isFocus: false,
			}
		},
		onLoad(options) {
			this.industryText = options.industryText?options.industryText:'';
			if(options.customText){
				this.isInput = true;
			}
			this.customText = options.customText?options.customText:'';
			console.log(options);
			this.getItems();
		},
		methods: {
			customTextInput(e){
				var val = e.detail.value;
				this.$nextTick(function() {
					this.customText = val.replace(/\s+/g, '');
				})
			},
			switchInput(){
				this.isInput = true;
				this.isFocus = true;
			},
			confirmEvent(){
				let that = this;
				let industryText = '';
				that.industryArr.map((val, idx)=>{
					if(val.isSelect){
						if(!industryText){
							industryText = val.industryName;
						} else {
							industryText = industryText + ',' + val.industryName;
						}
					}
				})
				uni.$emit('advantageEvent', {
					type: 2,
					industryText: industryText,
					customText: that.customText
				})
				setTimeout(()=>{
					uni.navigateBack({})
				}, 300)
			},
			getItems(){
				var that = this;
				ship.newQueryPostRequest('/cd/fleetAdvantageIndustry/list', {}).then(res=>{
					console.log(res);
					if(res.retCode == "0000000"){
						if(that.industryText){
							var industryArr = this.industryText.split(',');
							res.rspBody.map(val=>{
								industryArr.map(item=>{
									if(val.industryName == item){
										val.isSelect = true;
									}
								})
							})
						}
						that.industryArr = res.rspBody;
					} else {
						
					}
				})
				.catch(err=>{
					
				})
			},
			selectIndustry(index){
				let that = this;
				let industryArr = [];
				that.industryArr.map((val, idx)=>{
					if(index == idx){
						val.isSelect = !val.isSelect
					}
					industryArr.push(val);
				})
				that.industryArr = industryArr;
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F3F3F3;
	}
	.all{
		.select-content{
			background-color: #fff;
			margin-top: 18rpx;
			padding-bottom: 32rpx;
			.select-all{
				display: flex;
				padding: 8rpx 18rpx 200rpx 18rpx;
				box-sizing: border-box;
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
			.custom-box{
				background-color: #F2F2F2;
				color: #777;
				font-size: 28rpx;
				border-radius: 12rpx;
				margin: 0 44rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
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
