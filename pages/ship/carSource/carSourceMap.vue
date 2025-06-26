<template>
	<view class="carSourceMap">
		<web-view 
			:src="webUrl"
			 @onPostMessage="recivePostMessage"
			 @message="reciveMessage"
		></web-view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	import IMService from "@/utils/imservice.js";
	export default {
		data() {
			return {
				webUrl: ship.carSourceMap,
			}
		},
		onLoad(options) {
			var params = JSON.parse(options.params);
			uni.showLoading({
				title: '加载中...'
			})
			this.webUrl = ship.carSourceMap + '?ApiRootUrl=' + params.ApiRootUrl +'&Authorization=' + params.Authorization + '&latitude=' + params.latitude + '&longitude=' + params.longitude + '&params=' + JSON.stringify(params)
			console.log(this.webUrl, "11")
			
		},
		onBackPress(e) {
			if (e.from == "backbutton") {
				return true
			}
			return false;
		},
		methods: {
			recivePostMessage(e) {
				console.log(e)
			},
			reciveMessage(e){ // 地图传递参数
				console.log('地图传递参数', e.detail);
				let obj = e.detail.data[0];
				if (obj.type == "back") {
					uni.navigateBack({
						delta: 1
					})
					return;
				}
				if (obj.type == "loadComplete") {
					uni.hideLoading();
					return;
				}
				if (obj.type == "startLoad") {
					uni.showLoading({
						title: '加载中...'
					})
					return;
				}
				
				if (obj.type == "call") {
					//打电话
					var mobile = obj.data.mobile;
					var driverInfo = obj.data;
					let userData = uni.getStorageSync("userInfo");
					var userInfo = userData ? JSON.parse(userData) : {};
					let currentUserCode = userInfo.attrs.userCode;
					
					
					if(currentUserCode == driverInfo.userCode){
						uni.showToast({
							title: '您不能给自己打电话',
							icon: 'none'
						})
						return
					}
					uni.makePhoneCall({
						phoneNumber: mobile
					})
					return;
				}
				
				if (obj.type == "toGoEasy") {
					//跳转goEasy
					var driverInfo = obj.data;
					console.log(this.goEasy, '啊啊啊啊');
					let userData = uni.getStorageSync("userInfo");
					var userInfo = userData ? JSON.parse(userData) : {};
					let currentUserCode = userInfo.attrs.userCode;
					
					
					if(currentUserCode == driverInfo.userCode){
						uni.showToast({
							title: '您不能给自己发私信',
							icon: 'none'
						})
						return
					}
				
					let avatarObj = JSON.parse(userData);
					userInfo.attrs.avatar = avatarObj.attrs.avatar;
								   
					let userName = driverInfo.userName ? driverInfo.userName.substr(0, 1) + '**' : '';
					let avatar = driverInfo.avatar ? driverInfo.avatar : '/static/images/goodsDelivery/shipUserLogo.png';
					if(this.goEasy.getConnectionStatus() == 'disconnected') {
						getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
						getApp().globalData.imService.connect(userInfo);
						uni.hideLoading();
						uni.navigateTo({
							url: '/pages/goodsDelivery/userMessage/chatDetails?receiverId=' + driverInfo.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + driverInfo.userId
						})
					}else {
						uni.hideLoading();
						uni.navigateTo({
							url: '/pages/goodsDelivery/userMessage/chatDetails?receiverId=' + driverInfo.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + driverInfo.userId
						})
					}
					return;
				}
				
				if(e.detail.data[0].selectData){
					var selectedMapItem = e.detail.data[0].selectData;
					var updateDt = selectedMapItem.locationUpdatedDt;
					if (updateDt) {
						var dateDesc = util.findDateDesc(updateDt);
						selectedMapItem.dateDesc = dateDesc;
					}
					this.selectedMapItem = selectedMapItem;
					
				}
				this.showMapLoading = false;
				uni.hideLoading();
			},
		}
	}
</script>

<style scoped>
	.carSourceMap {
		width: 100vw;
		height: 100vh;
		position: relative;
	}
</style>
