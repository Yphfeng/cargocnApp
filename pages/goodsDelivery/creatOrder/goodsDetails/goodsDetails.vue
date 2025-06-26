<template>
	<view class="goodsDetails">
		<view class="titleBox" style="padding-top: 48rpx;">
			<view class="mainTitle">
				货物类型
				<text class="subTitle">（必填，单选）</text>
			</view>
		</view>
		<view class="goodsTypeBox">
			<view
				class="goodsBox"
				v-for="(item, index) in goodsItem"
				:key="index"
				@click="toCheckGroup(item)"
				:style="checkedGroup.id && checkedGroup.id == item.id ? 'background: #4396F8;color: #FFF;' : 'background: #FFF;color: #333;'">
				{{item.cargoName}}
			</view>
		</view>
		<view class="diyBtn" @click="showDiyPopup()">自定义</view>
		<view class="boxLine"></view>
		<view class="titleBox">
			<view class="mainTitle">
				重量/体积
				<text class="subTitle">（必填一项）</text>
			</view>
		</view>
		<view class="goodsNumBox">
			<view class="title">重量</view>
			<view class="numModelBox">
				<input
				class="numInput"
				maxlength="7"
				type="digit"
				placeholder-style="font-size: 28rpx;color:#B3B3B3"
				placeholder="请输入"
				v-model="goodsWeight"
				@input="onWeightInput"/>
				<view class="sybMsg">吨</view>
			</view>
		</view>
		<view class="goodsNumBox">
			<view class="title">体积</view>
			<view class="numModelBox">
				<input
				class="numInput"
				maxlength="7"
				type="digit"
				placeholder-style="font-size: 28rpx;color:#B3B3B3"
				placeholder="请输入"
				v-model="goodsVolume"
				@input="onKeyVolumeInput"/>
				<view class="sybMsg">方</view>
			</view>
		</view>
		<view class="comfirmBtn" @click="saveGoods()">确定</view>
		
		<uni-popup ref="diyPopup" type="center">
			<view class="diyMainBox">
				<view class="popupMainTitle">自定义</view>
				<view class="inputBox">
					<input
					class="goodsInput"
					maxlength="5"
					placeholder-style="font-size: 28rpx;color:#000;"
					placeholder="请输入"
					v-model="diyGoodsName"/>
					<view class="inputHint">{{diyGoodsName ? diyGoodsName.length : 0}}/5</view>
				</view>
				<view class="popupBtnGroup">
					<view class="popupBtn popupCancelBtn" @click="closeDiyPopup()">取消</view>
					<view class="popupBtn popupComfirmBtn" @click="saveDiyGoods()">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				userInfo: {},
				checkedGroup: {
					id: '',
					name: ''
				},
				goodsItem: [],
				goodsWeight: '',
				goodsVolume: '',
				diyGoodsName: '',
			};
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) {
				uni.navigateBack()
			}else {
				this.userInfo = JSON.parse(userInfo);
				console.log(this.userInfo);
				uni.showLoading();
				this.cargoUserFind();
			}
			let newGoodsObj = getApp().globalData.newGoodsObj;
			this.checkedGroup.id = newGoodsObj.id ? newGoodsObj.id : '';
			this.checkedGroup.name = newGoodsObj.name ? newGoodsObj.name : '';
			this.goodsWeight = newGoodsObj.goodsWeight ? newGoodsObj.goodsWeight : '';
			this.goodsVolume = newGoodsObj.goodsVolume ? newGoodsObj.goodsVolume : '';
		},
		onReady() {
		},
		methods: {
			showDiyPopup() { // 打开自定义弹窗
				this.diyGoodsName = '';
				this.$refs.diyPopup.open();
			},
			closeDiyPopup() { // 关闭自定义弹窗
				this.$refs.diyPopup.close();
			},
			toCheckGroup(item) { // 选择货物
				this.checkedGroup = {
					id: item.id,
					name: item.cargoName
				};
			},
			cargoUserFind() { // 货主查询货物
				let that = this;
				let params = {
					"userId": that.userInfo.userId,
					"userCode": that.userInfo.attrs.userCode,
				}
				console.log('查询参数', params);
				utils.postRequest('/td/order/cargo/user/find', params)
				.then(res=>{
					uni.hideLoading();
					console.log('我的货物', res);
					if(res.retCode == '0000000') {
						that.goodsItem = res.rspBody;
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			onWeightInput(e){
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 7){
						let num  = Number(e.detail.value.length) - 7;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 2;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.goodsWeight = e.detail.value;
					if(this.goodsWeight > 100000 || this.goodsWeight == 100000) {
						this.goodsWeight = 99999;
					}
				})
			},
			onKeyVolumeInput(e){
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 7){
						let num  = Number(e.detail.value.length) - 7;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					// console.log('首位小数点情况')
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
				    //去掉最后一位
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 2;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.goodsVolume = e.detail.value;
					if(this.goodsVolume > 100000 || this.goodsVolume == 100000) {
						this.goodsVolume = 99999;
					}
				})
			},
			saveDiyGoods() { // 保存自定义货物
				if(!this.diyGoodsName) {
					uni.showToast({
						title: '请填写货物名称',
						icon:'none'
					})
					return false;
				}
				uni.showLoading();
				let that = this;
				let params = {
					"userId": that.userInfo.userId,
					"userCode": that.userInfo.attrs.userCode,
					"cargoName": that.diyGoodsName
				}
				console.log('保存参数', params);
				utils.postRequest('/td/order/cargo/add', params)
				.then(res=>{
					uni.hideLoading();
					console.log('保存结果', res);
					if(res.retCode == '0000000') {
						that.closeDiyPopup();
						uni.showToast({
							title: '保存成功',
							icon:'none'
						})
						if(that.goodsItem.length == 12) {
							that.goodsItem.splice(11, 1);
						}
						that.goodsItem.splice(1, 0, {
							id: res.rspBody,
							cargoName: that.diyGoodsName
						});
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
					console.log(err);
				})
			},
			saveGoods() {
				if(!this.checkedGroup.id) {
					uni.showToast({
						title: '请选择货物',
						icon:'none'
					})
					return false;
				}
				if(!this.goodsWeight && !this.goodsVolume) {
					uni.showToast({
						title: '请填写货物重量或体积',
						icon:'none'
					})
					return false;
				}
				getApp().globalData.newGoodsObj = {
					id: this.checkedGroup.id,
					name: this.checkedGroup.name,
					goodsWeight: this.goodsWeight ? this.goodsWeight : '',
					goodsVolume: this.goodsVolume ? this.goodsVolume : '',
				};
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	.goodsDetails {
		min-height:100vh;
		background-color: #FAFAFA;
		box-sizing: border-box;
		padding-bottom: 36rpx;
		.toRolate {
			transform-origin:center center;
			transform: rotate(180deg);
			transition: transform 0.2s;
		}
		.rolateRecovery {
			transform-origin:center center;
			transform: rotate(0deg);
			transition: transform 0.2s;
		}
		.goodsTypeBox {
			padding: 16rpx 36rpx 0 34rpx;
			display: flex;
			flex-wrap: wrap;
			background-color: #FAFAFA;
			.goodsBox:nth-child(3n) {
				margin-right:0;
			}
			.goodsBox {
				width: 200rpx;
				height: 72rpx;
				line-height: 72rpx;
				margin-right: 40rpx;
				margin-bottom: 20rpx;
				box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.22);
				border-radius: 8rpx;
				font-size: 32rpx;
				text-align: center;
			}
		}
		.diyBtn {
			margin: 20rpx 36rpx 0 36rpx;
			width: 678rpx;
			height: 80rpx;
			line-height: 80rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			border: 2rpx solid #2B72F0;
			font-size: 32rpx;
			font-weight: 500;
			color: #2B72F0;
			text-align: center;
		}
		.boxLine {
			width: 100vw;
			height: 26rpx;
			background: #F4F4F4;
			margin: 48rpx 0;
		}
		.titleBox {
			padding: 0 42rpx 0 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #FAFAFA;
			.mainTitle {
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
				line-height: 44rpx;
				.subTitle {
					font-size: 24rpx;
					color: #666666;
				}
			}
			.showAllBoxContent {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #666666;
				line-height: 44rpx;
				.showMoreIcon {
					width: 31rpx;
					height: 18rpx;
					display: block;
					margin-left: 18rpx;
				}
			}
		}
		.goodsNumBox {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 80rpx 0 36rpx;
			margin: 34rpx 0 56rpx 0 ;
			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
			}
			.numModelBox {
				display:flex;
				.numInput {
					width: 238rpx;
					height: 72rpx;
					box-sizing: border-box;
					background-color: #FFF;
					background: #FFFFFF;
					border-radius: 8rpx;
					padding: 0 28rpx;
					font-size: 28rpx;
					color:#333;
				}
				.sybMsg {
					line-height: 72rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					padding-left: 16rpx;
				}
			}
		}
		.comfirmBtn {
			margin: 140rpx 175rpx 0 175rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #2B72F0;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
		.diyMainBox {
			width: 678rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			box-sizing: border-box;
			padding: 46rpx 38rpx 36rpx 38rpx;
			.popupMainTitle {
				font-size: 44rpx;
				font-weight: 600;
				color: #000000;
				line-height: 44rpx;
				text-align: center;
			}
			.inputBox {
				height: 232rpx;
				background: #F3F3F3;
				border-radius: 8rpx;
				padding: 22rpx 34rpx 16rpx 30rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin: 36rpx 0 44rpx 0;
				.goodsInput {
					width: 100%;
					height: 44rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #000000;
				}
				.inputHint {
					font-size: 28rpx;
					font-weight: 500;
					color: #000000;
					line-height: 44rpx;
					text-align: right;
				}
			}
			.popupBtnGroup {
				display: flex;
				justify-content: center;
				.popupBtn {
					width: 236rpx;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 16rpx;
					font-size: 32rpx;
					font-weight: 500;
					text-align: center;
					color: #FFFFFF;
				}
				.popupCancelBtn {
					background: #D4D4D4;
				}
				.popupComfirmBtn {
					background: #2B72F0;
					margin-left:48rpx;
				}
			}
		}
	}
</style>
