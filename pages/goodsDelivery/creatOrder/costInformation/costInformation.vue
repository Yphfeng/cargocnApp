<template>
	<view class="costInformation">
		<view class="mainTitle">
			报价方式
			<text class="subTitle">（必填，单选）</text>
		</view>
		<view class="btnGroup">
			<view class="btn" :class="quotationWay == 2 ? 'checkedBtn' : 'defaultBtn'" @click="quotationWay = 2">价格电议</view>
			<view class="btn" :class="quotationWay == 1 ? 'checkedBtn' : 'defaultBtn'" @click="quotationWay = 1">固价</view>
		</view>
		<view class="costBox" v-if="quotationWay">
			<view class="rowItem">
				<view class="title">单位：</view>
				<view class="rightContent">
					<view
						class="btn"
						v-for="(item, index) in priceSybData"
						:key="index"
						:class="hopePriceSyb == item.label ? 'checkedBtn' : 'defaultBtn'"
						@click="hopePriceSyb = item.label">
						{{item.label}}
					</view>
				</view>
			</view>
			<view class="rowItem" v-if="quotationWay == 1">
				<view class="title">运费：</view>
				<view class="rightContent">
					<input
					class="numInput"
					maxlength="9"
					type="digit"
					placeholder-style="font-size: 28rpx;color:rgba(0,0,0,0.65)"
					placeholder="请输入"
					v-model="hopePrice"
					@input="onKeyHopePriceInput"/>
					<view class="priceSyb">元</view>
				</view>
			</view>
			<view class="rowItem" style="align-items: flex-start;margin-bottom: -24rpx;">
				<view class="title" style="line-height: 56rpx;margin-right:0;">运输增值发票：</view>
				<view class="rightContent">
					<view class="hintBtn">
						<view
							class="btn"
							style="width: 140rpx;"
							:class="needInvoiceFlag == 1 ? 'checkedBtn' : 'defaultBtn'"
							@click="checkTaxNo()">
							需要
						</view>
						<view class="hintMsg">（线上支付）</view>
					</view>
					<view class="hintBtn">
						<view
							class="btn"
							style="width: 140rpx;"
							:class="needInvoiceFlag == 2 ? 'checkedBtn' : 'defaultBtn'"
							@click="needInvoiceFlag = 2">
							不需要
						</view>
						<view class="hintMsg">（线下支付）</view>
					</view>
				</view>
			</view>
			<view class="rowItem">
				<view class="title">订金：</view>
				<view class="rightContent">
					<input
					class="numInput"
					maxlength="9"
					type="digit"
					placeholder-style="font-size: 28rpx;color:rgba(0,0,0,0.65)"
					placeholder="请输入"
					v-model="infoPrice"
					@input="onKeyInfoPriceInput"/>
					<view class="priceSyb">元</view>
					<view class="btn" :class="informationFlag == 1 ? 'checkedBtn' : 'defaultBtn'" @click="informationFlag = 1">退还</view>
					<view class="btn" :class="informationFlag == 2 ? 'checkedBtn' : 'defaultBtn'" @click="informationFlag = 2">不退还</view>
				</view>
			</view>
		</view>
		<view class="comfirmBtn" @click="saveCostData()">确定</view>
		
		<uni-popup ref="hintPopup" type="center">
			<view class="popupBox">
				<view class="hintTitle">温馨提示</view>
				<view class="hintMsg">请先完成企业认证，并与货运中国签订了合同才可选择发票服务！</view>
				<view class="comMobile" @click="toCallUser('4000160606')">400-016-0606</view>
				<view class="btn" @click="closePopup()">我知道了</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				quotationWay: '',
				priceSybData: [{
					label: '趟'
				}, {
					label: '吨'
				}, {
					label: '方'
				}],
				hopePriceSyb: '',
				infoPrice: '',
				hopePrice: '',
				needInvoiceFlag: 2,
				taxNo: '',
				userInfo: {},
				informationFlag: 2,
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
				this.getCompanyInfo();
			}
			this.quotationWay = getApp().globalData.costInformation.quotationWay;
			this.infoPrice = getApp().globalData.costInformation.infoPrice;
			this.informationFlag = getApp().globalData.costInformation.informationFlag ? getApp().globalData.costInformation.informationFlag : 2;
			this.needInvoiceFlag = getApp().globalData.costInformation.needInvoiceFlag ? getApp().globalData.costInformation.needInvoiceFlag : 2;
			this.hopePriceSyb = getApp().globalData.costInformation.hopePriceSyb ? getApp().globalData.costInformation.hopePriceSyb : '';
			if(this.quotationWay == 1) {
				this.hopePrice = getApp().globalData.costInformation.hopePrice;
			}
		},
		onReady() {
		},
		methods: {
			getCompanyInfo() { // 获取企业认证详情
				let that = this;
				utils.postRequest('/yh/enterprise/select/detail', {userCode: this.userInfo.attrs.userCode})
				.then(res=>{
					console.log('企业认证详情', res);
					if(res.retCode == "0000000") {
						if(res.rspBody) {
							that.taxNo = res.rspBody.taxNo;
						}
					}
				})
				.catch(err=>{})
				uni.hideLoading();
			},
			checkTaxNo() {
				if(!this.taxNo) {
					this.$refs.hintPopup.open();
					// uni.showToast({
					// 	title: '请先完成企业认证，并与货运中国签订了合同才可选择发票服务！',
					// 	icon: 'none',
					// 	duration: 2000
					// })
					return false;
				}
				this.needInvoiceFlag = 1;
			},
			closePopup() {
				this.$refs.hintPopup.close();
			},
			onKeyHopePriceInput(e){
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 6){
						let num  = Number(e.detail.value.length) - 6;
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
					this.hopePrice = e.detail.value
				})
			},
			onKeyInfoPriceInput(e){
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = e.detail.value.replace(/-/g, "");
					if(e.detail.value.length > 6){
						let num  = Number(e.detail.value.length) - 6;
						e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
					}else{
						e.detail.value = parseFloat(e.detail.value);
					}
				}else if (e.detail.value.indexOf(".") == 0) {
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}else if(!(/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value))){
					let ary = e.detail.value.split('.');
					let num = ary['1'].length - 2;
					e.detail.value = e.detail.value.substring(0, e.detail.value.length - num);
				}
				this.$nextTick(function(){
					this.infoPrice = e.detail.value
				})
			},
			saveCostData() {
				if(!this.quotationWay) {
					uni.showToast({
						title: '请选择报价方式',
						icon:'none'
					})
					return false;
				}
				if(this.quotationWay == 1) {
					if(!this.hopePriceSyb) {
						uni.showToast({
							title: '请选择报价单位',
							icon:'none'
						})
						return false;
					}
					if(!this.hopePrice) {
						uni.showToast({
							title: '请输入运费',
							icon:'none'
						})
						return false;
					}
				}
				if(this.informationFlag == 1 && !this.infoPrice) {
					uni.showToast({
						title: '请输入订金',
						icon:'none'
					})
					return false
				}
				getApp().globalData.costInformation.quotationWay = this.quotationWay;
				getApp().globalData.costInformation.infoPrice = this.infoPrice;
				getApp().globalData.costInformation.hopePrice = this.quotationWay == 1 ? this.hopePrice : '';
				getApp().globalData.costInformation.hopePriceSyb = this.hopePriceSyb ? this.hopePriceSyb : '';
				getApp().globalData.costInformation.needInvoiceFlag = this.needInvoiceFlag == 1 ? this.needInvoiceFlag : '';
				getApp().globalData.costInformation.informationFlag = this.informationFlag;
				uni.navigateBack();
			},
			toCallUser(mobile) { // 拨打电话
				let platformMsg = uni.getSystemInfoSync().platform;
				if(platformMsg == 'android') {
					let that = this;
					plus.android.requestPermissions(
						['android.permission.CALL_PHONE'],
						function(resultObj) {
							var result = 0;
							for(let i = 0; i < resultObj.granted.length; i++) {
								var grantedPermission = resultObj.granted[i];
								console.log('已获取的权限', grantedPermission);
								result = 1;
							}
							for(let i = 0; i < resultObj.deniedPresent.length; i++) {
								var deniedPresentPermission = resultObj.deniedPresent[i];
								console.log('拒绝本次申请的权限', deniedPresentPermission);
								result = 0;
							}
							for(let i = 0; i < resultObj.deniedAlways.length; i++) {
								var deniedAlwaysPermission = resultObj.deniedAlways[i];
								console.log('永久拒绝申请的权限', deniedAlwaysPermission);
								result = -1;
							}
							console.log(result);
							that.makePhoneCall(result, mobile);
						}
					)
				}else {
					this.makePhoneCall(1, mobile);
				}
			},
			makePhoneCall(result, mobile) {
				console.log('触发');
				if(result == 1) {
					uni.makePhoneCall({
					    phoneNumber: mobile,
					});
				}else {
					uni.showToast({
						title: '请开启拨号权限',
						icon: 'none'
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.costInformation {
		min-height:100vh;
		background-color: #FAFAFA;
		.mainTitle {
			padding: 48rpx 38rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #333333;
			line-height: 44rpx;
			.subTitle {
				font-size: 24rpx;
				color: #666666;
			}
		}
		.btnGroup {
			display: flex;
			justify-content: center;
			align-items: center;
			.btn + .btn {
				margin-left: 120rpx;
			}
			.btn {
				font-size: 32rpx;
				font-weight: 500;
				text-align: center;
				border-radius: 16rpx;
				width: 225rpx;
				height: 65rpx;
				line-height: 65rpx;
				border: 2rpx solid #2B72F0;
			}
			.checkedBtn {
				background-color: #2B72F0;
				color:#FFF;
			}
			.defaultBtn {
				background-color: #FFF;
				color:#2B72F0;
			}
		}
		.costBox {
			width: 678rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 16rpx 0px rgba(172,203,255,0.19);
			margin: 40rpx auto 0 auto;
			padding: 48rpx 0 48rpx 68rpx;
			border-radius: 16rpx;
			box-sizing: border-box;
			.rowItem + .rowItem {
				margin-top: 48rpx;
			}
			.rowItem {
				display: flex;
				align-items: center;
				.title {
					flex-shrink: 0;
					font-size: 32rpx;
					color: #333333;
					line-height: 38rpx;
					margin-right:8rpx;
				}
				.hintBtn {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				.hintMsg {
					font-size: 28rpx;
					color: #333333;
					line-height: 33rpx;
					margin-top:8rpx;
				}
				.rightContent {
					display: flex;
					align-items: center;
					.btn + .btn {
						margin-left: 24rpx;
					}
					.btn {
						font-size: 28rpx;
						font-weight: 500;
						text-align: center;
						border-radius: 4rpx;
						width: 116rpx;
						height: 52rpx;
						line-height: 52rpx;
						border: 2rpx solid #2B72F0;
					}
					.checkedBtn {
						background-color: #2B72F0;
						color:#FFF;
					}
					.defaultBtn {
						background-color: #F3F3F3;
						color: rgba(0,0,0,0.65);
					}
					.numInput {
						width: 116rpx;
						height: 52rpx;
						border: 2rpx solid #2B72F0;
						border-radius: 4rpx;
						text-align: center;
						font-size: 28rpx;
						font-weight: 500;
						color: 000;
					}
					.priceSyb {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
						padding: 0 24rpx;
					}
				}
			}
		}
		.comfirmBtn {
			position: fixed;
			bottom: 180rpx;
			left: 175rpx;
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #2B72F0;
			border-radius: 16rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
		.popupBox {
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 32rpx 28rpx 48rpx 28rpx;
			margin: 0 32rpx;
			.hintTitle {
				font-size: 34rpx;
				font-weight: 500;
				color: #333333;
				text-align: center;
				margin-bottom: 32rpx;
			}
			.hintMsg {
				font-size: 32rpx;
				color: #707071;
				line-height: 44rpx;
				padding: 0 42rpx;
				.num {
					font-size: 32rpx;
					color: #4AA2F3;
				}
			}
			.comMobile {
				font-size: 32rpx;
				color: #2B72F0;
				line-height: 37rpx;
				text-align: center;
				margin:32rpx 0 64rpx 0;
			}
			.btn {
				width: 380rpx;
				height: 92rpx;
				line-height: 92rpx;
				background-color: #4AA2F3;
				border-radius: 12rpx;
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				margin: 0 auto;
			}
		}
	}
</style>
