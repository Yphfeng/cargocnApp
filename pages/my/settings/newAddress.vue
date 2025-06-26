<template>
	<view class="all">
		<view class="content-box">
			<view class="content-text">收货人</view>
			<input type="text" placeholder="请使用真实姓名" maxlength="10" v-model="cargoReceiver" placeholder-class="placeholder-class" class="content-input" value="" />
		</view>
		<view class="content-box">
			<view class="content-text">联系电话</view>
			<input type="number" placeholder="收件人电话号码" maxlength="11" v-model="phone" placeholder-class="placeholder-class" class="content-input" value="" />
		</view>
		<view class="content-box">
			<view class="content-text">所在地区</view>
			<view :class="[regionText?'region-text':'placeholder-class2']" style="margin-left: 5rpx;" @tap="openRegionPopup()">{{regionText?regionText:'请选择'}}</view>
		</view>
		<view class="content-box1">
			<view class="content-text">详细地址</view>
			<textarea type="text" v-model="detailAddress" placeholder="输入地址" placeholder-class="placeholder-class" class="content-input1" value="" />
		</view>
		<view class="content-box1">
			<view class="content-text">备注</view>
			<textarea type="text" maxlength="30" v-model="remark" placeholder="输入备注" placeholder-class="placeholder-class" class="content-input1" value="" />
		</view>
		<view class="default-box">
			<view class="default-text">设置为默认地址</view>
			<view class="img-box">
				<image v-if="useDefault==1" @click="switchEvent(0)" class="default-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/onSwitch.png" mode=""></image>
				<image v-else class="default-img" @click="switchEvent(1)" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/switch.png" mode=""></image>
			</view>
		</view>
		<view v-if="cargoReceiver && phone && regionText && detailAddress" class="add-address1" @click="addressSave">保存收货地址</view>
		<view v-else class="add-address">保存收货地址</view>
		<uni-popup ref="regionPopup" type="bottom">
			<view class="popupBox">
				<view class="popupBtnGroup">
					<view class="cancleBtn" @click="closePopup()">取消</view>
					<view class="confirmBtn" @click="chooseRegion()">确定</view>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="regionVal" @change="regionChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item,index) in region" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in secondAry" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in thirdAry" :key="index">{{item.name}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		
		<uni-popup ref="newRegionPopup" type="bottom">
			<chooseRegion :checkedRegionObj="checkedRegionObj"></chooseRegion>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	import * as ship from "@/utils/ship"
	import chooseRegion from "../../../components/chooseRegion.vue"
	var commonHtmlTitle = '新建收货地址'
	export default {
		data(){
			return {
				region: [],
				regionVal: [0,0,0],
				secondAry: [],
				thirdAry: [],
				indicatorStyle: 'height:60rpx;',
				regionText: '',
				provinceCode: '',
				provinceName: '',
				cityCode: '',
				cityName: '',
				areaCode: '',
				areaName: '',
				cargoReceiver: '',
				phone: '',
				detailAddress: '',
				remark: '',
				id: '',
				useDefault: 0,
				userRole: 1,
				checkedRegionObj: {}
			}
		},
		components: { chooseRegion },
		onLoad(options) {
			console.log(options.map)
			this.userRole = uni.getStorageSync("userRole");
			if(options.map){
				var obj = JSON.parse(options.map);
				this.cargoReceiver = obj.cargoReceiver;
				this.phone = obj.phone;
				this.detailAddress = obj.detailAddress;
				this.remark = obj.remark;
				this.provinceCode = obj.provinceCode;
				this.provinceName = obj.provinceName;
				this.cityCode = obj.cityCode;
				this.cityName = obj.cityName;
				this.areaCode = obj.areaCode;
				this.areaName = obj.areaName;
				this.regionText = obj.provinceName || "" + ' ' + obj.cityName || "" + ' ' + obj.areaName || "";
				console.log(this.regionText);
				this.id = this.userRole == 1 ? obj.id : obj.sid;
				this.useDefault = obj.useDefault;
				console.log(obj);
				this.checkedRegionObj = {
					"provinceName": obj.provinceName,
					"provinceCode": obj.provinceCode,
					"cityName": obj.cityName,
					"cityCode": obj.cityCode,
					"areaName": obj.areaName,
					"areaCode": obj.areaCode,
				}
			}
			this.getRegionInfo();
			uni.$on("checkStartRegion", item => {
				console.log('装货地', item);
				this.provinceName = item.provinceName;
				this.provinceCode = item.provinceCode;
				this.cityName = item.cityName;
				this.cityCode = item.cityCode;
				this.areaName = item.areaName;
				this.areaCode = item.areaCode;
				this.regionText = (this.provinceName || "") + ' ' + (this.cityName || "") + ' ' + (this.areaName || "");
				this.checkedRegionObj = {
					"provinceName": item.provinceName,
					"provinceCode": item.provinceCode,
					"cityName": item.cityName,
					"cityCode": item.cityCode,
					"areaName": item.areaName,
					"areaCode": item.areaCode,
				}
				this.$refs.newRegionPopup.close();
			})
			
			uni.$on("closeRegionPopup", item => {
				this.$refs.newRegionPopup.close();
			})
		},
		methods:{
			switchEvent(type){
				console.log(type)
				this.useDefault = type;
			},
			addressSave(){
				let that = this;
				if(!that.cargoReceiver){
					uni.showToast({
						title: '请输入收货人',
						icon: 'none',
					})
					return;
				}
				if(!that.phone){
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none',
					})
					return;
				}
				if(!that.regionText){
					uni.showToast({
						title: '请选择地区',
						icon: 'none',
					})
					return;
				}
				if(!that.detailAddress){
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none',
					})
					return;
				}
				uni.showLoading({
					title: '请稍后...',
					mask: true
				})
				var data = {
					cargoReceiver: that.cargoReceiver,
					phone: that.phone,
					provinceCode: that.provinceCode,
					provinceName: that.provinceName,
					cityCode: that.cityCode,
					cityName: that.cityName,
					areaCode: that.areaCode,
					areaName: that.areaName,
					detailAddress: that.detailAddress,
					remark: that.remark,
					useDefault: that.useDefault,
					commonHtmlTitle: commonHtmlTitle,
				}
				console.log('收货地址保存参数', data)
				var userRole = this.userRole;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) return;
				if (userRole == 1) {
					if(that.id){
						data.id = that.id;
					}
					utils.postRequest('/au/shipping/address/save', data)
					.then(res=>{
						console.log('司机保存收货地址', res)
						uni.hideLoading();
						if(res.retCode == '0000000'){
							uni.navigateBack({
								
							})
						} else{
							uni.showToast({
								title: res.resDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						console.log(err);
					})
				} else {
					if(that.id){
						data.sid = that.id;
					}
					// console.log(userInfo)
					var url = that.id ? '/business/shipping/address/update' : '/business/shipping/address/add'
					data.userBusinessId = JSON.parse(userInfo).attrs.userBusinessId;
					ship.postRequest(url, data)
					.then(res=>{
						console.log('货主保存收货地址', res)
						uni.hideLoading();
						if(res.retCode == '0000000'){
							uni.navigateBack({
								delta: 1
							})
						} else{
							uni.showToast({
								title: res.resDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						console.log(err);
					})
				}
				
			},
			getRegionInfo() {
				let that = this;
				utils.postRequest('/au/nationDict/getBasicData', {commonHtmlTitle: commonHtmlTitle})
				.then(res=>{
					that.region = res.rspBody;
					that.secondAry = that.region[0].cities;
					that.thirdAry = that.region[0].cities[0].areas;
				})
				.catch(err=>{
					console.log(err);
				})
			},
			regionChange(e) {
				console.log(e);
				this.regionVal = e.detail.value;
				let key1 = this.regionVal[0];
				this.secondAry = this.region[key1].cities;
				let key2 = this.regionVal[1];
				this.thirdAry = this.region[key1].cities[key2].areas;
			},
			openRegionPopup() {
				this.$refs.newRegionPopup.open();
			},
			closePopup() {
				this.regionVal = [0, 0, 0];
				this.regionText = '';
				this.provinceCode = '';
				this.cityCode = '';
				this.areaCode = '';
				this.$refs.regionPopup.close();
			},
			chooseRegion() { // 选择地区
				let key1 = this.regionVal[0];
				let key2 = this.regionVal[1];
				let key3 = this.regionVal[2];
				console.log(this.region[key1], key2, key3);
				this.regionText = this.region[key1].name + ' ' + this.region[key1].cities[key2].name + ' ' + this.region[key1].cities[key2].areas[key3].name;
				this.provinceCode = this.region[key1].code;
				this.provinceName = this.region[key1].name;
				this.cityCode = this.region[key1].cities[key2].code;
				this.cityName = this.region[key1].cities[key2].name;
				this.areaCode = this.region[key1].cities[key2].areas[key3].code;
				this.areaName = this.region[key1].cities[key2].areas[key3].name;
				console.log(this.provinceCode, this.cityCode, this.areaCode);
				this.$refs.regionPopup.close();
				this.$forceUpdate();
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F2F2F2;
	}
	.all{
		margin-top: 10rpx;
		.content-box{
			padding: 24rpx 40rpx;
			background-color: #fff;
			border-bottom: 2rpx solid #F2F2F2;
			display: flex;
			align-items: center;
			.content-text{
				width: 150rpx;
				height: 42rpx;
				line-height: 42rpx;
				font-size: 30rpx;
				color: #333;
			}
			.content-input{
				width: 570rpx;
				margin-left: 20rpx;
				color: #333;
				font-size: 28rpx;
			}
			.placeholder-class{
				color: #999;
				font-size: 28rpx;
			}
			.placeholder-class2{
				color: #999;
				font-size: 28rpx;
				flex: 1;
			}
			.region-text{
				color: #333;
				font-size: 28rpx;
				flex: 1;
			}
		}
		.content-box1 + .content-box1 {
			border-top: 2rpx solid #F2F2F2;
		}
		
		.content-box1{
			padding: 24rpx 40rpx;
			background-color: #fff;
			display: flex;
			.content-text{
				width: 150rpx;
				height: 42rpx;
				line-height: 42rpx;
				font-size: 30rpx;
				color: #333;
			}
			.content-input1{
				width: 570rpx;
				margin-left: 20rpx;
				height: 110rpx;
				color: #333;
				font-size: 28rpx;
			}
			.placeholder-class{
				color: #999;
				font-size: 28rpx;
			}
		}
		.default-box{
			background-color: #fff;
			padding: 24rpx 40rpx;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.default-text{
				font-size: 30rpx;
				color: #333;
			}
			.img-box{
				display: flex;
				align-items: center;
				.default-img{
					width: 104rpx;
					height: 64rpx;
				}
			}
		}
		.add-address{
			position: fixed;
			bottom: 30rpx;
			left: 30rpx;
			right: 30rpx;
			height: 80rpx;
			background-color: #CCC;
			color: #fff;
			text-align: center;
			line-height: 80rpx;
			border-radius: 40rpx;
		}
		.add-address1{
			position: fixed;
			bottom: 30rpx;
			left: 30rpx;
			right: 30rpx;
			height: 80rpx;
			background-color: #FF7D4A;
			color: #fff;
			text-align: center;
			line-height: 80rpx;
			border-radius: 40rpx;
		}
		
		.popupBox {
			background-color: #FFF;
			border-radius: 24rpx 24rpx 0 0;
			.popupBtnGroup {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:20rpx 40rpx;
				.cancleBtn {
					font-size: 30rpx;
					color:#F56C6C;
					font-weight:bold;
				}
				.confirmBtn {
					font-size: 30rpx;
					color:#409EFF;
					font-weight:bold;
				}
			}
			.picker-view{
				width: 750rpx;
				height: 400rpx;
			}
			.item{
				height:60rpx;
				line-height: 60rpx;
				align-items: center;
				justify-content: center;
				text-align: center;
			}
		}
	}
</style>
