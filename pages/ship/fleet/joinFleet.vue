<template>
	<view class="">
		<uni-popup ref="confirmPopup2" type="bottom"  :maskClick="false">
			<view class="box_big">
				<image class="close-ed" @click="maskClick"  src="../../../static/images/ship/close-ed.png"></image>
			
			<view class="vehicle_infor">
				<!--  :is-mask-click="mask" -->
				<view class="title">请填写您的车辆加入车队，我们还会根据 您的喜好，为您推荐优质的货源哦</view>
				<view class="vehicle_box">
					<view class="vehicle_content">
						<view class="left">
							车长车型：
						</view>
						<view class="right">
							{{selectedCarList.cartLength}}米{{selectedCarList.model}}
						</view>
					</view>
					
					<view class="vehicle_content">
						<view class="left">
							<text class="asterisk">*</text>
							车牌号：
						</view>
						<view class="right">
							<input class="input" type="text" v-model="plateNoFleet" placeholder="请填写您的车牌号" />
						</view>
					</view>
				</view>
				
				<view class="btn_box" @click="joinHand">
					<view class="join">
						加入车队
					</view>
				</view>
				
			</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="confirmPopup3" type="center" :mask-click="false">			
			<view class="add_box">
					<image class="popupCloseIcon" @click="closeFleetHintPopup()" src="../../../static/images/ship/close-ed.png"></image>	
				<view class="add_conten">
					<view class="tips">
						<view class="text">您还没有{{selectedCarList.cartLength}}米{{selectedCarList.model}}的车,</view>
						<view class="text" style="margin-top: 10rpx;">是否添加车辆?</view>
					</view>
					<view class="confirmAdd" @click="addTo">
						去添加								
					</view>
				</view>
				
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data(){
			return {
				isOpting: false,
				modelList:[],   //绑定车辆数据
				selectedCarList:{},  //选中要加入得超级车队数据
				plateNoFleet:'',
				mask:true,
			}
		},
		onLoad(){
			
		},
		methods:{
			//加入超级车队 判断是否有车辆
			getCarList(item){				
				var userInfo = uni.getStorageSync("userInfo");
				var driverId = JSON.parse(userInfo).attrs.driverId
				let data = {
					driverId: driverId,
					pageSize: 20,
					pageNum: 1,
				}
				console.log(data,'data')
				ship.postRequest("/yh/vehicle/select/list/by/driver", data).then(res=>{
					console.log(res,'res')
					if (res.retCode == '0000000') {
						this.modelList = res.rspBody.items;  //绑定的车辆
						this.selectedCarList = item;   //选中要加入得超级车队数据
						//判断是否有车辆 有车就校验是否满足超级车队车型车长  不满足就去添加车辆
						if(res.rspBody.total == 0)	{ 
							uni.hideTabBar();
							this.$refs.confirmPopup2.open();
						}else {
							this.getModel()
						}
										
					} else { 
						uni.showToast({
						  title: res.retDesc,
						  icon:'none'
						})
					}
				}).catch(err=>{
					
				})
			},
			
			//判断是否满足超级车队的车型车长
			getModel(){
				console.log(this.modelList,'modelList')
				var selectedCarList = this.selectedCarList; 
				console.log(selectedCarList)
				//判断是否满足超级车队的车型车长
				let res = this.modelList.filter(val=>{
					if(val.ext1 == selectedCarList.model && val.vehicleLength == selectedCarList.cartLength) {
						return val;
					}
				})
				console.log(res,res.length,'length');
				// 大于0的时候说明有满足超级车队的车型车长
				if(res.length > 0) {
					//车辆的车长车型超级车队匹配  走车队审核校验
					this.addFleet(selectedCarList);
					
				}else {
					this.$refs.confirmPopup3.open();
				}
				
				
			},
			
			//走车队审核校验
			addFleet(item){
				console.log(item,'item')
				var fleetId = item.id;
				var userInfo = uni.getStorageSync("userInfo");
				var userCode = JSON.parse(userInfo).attrs.userCode;
				ship.postRequest("/cd/fleetWithUser/save", {fleetId: fleetId, userCode: userCode}).then(res=>{
					console.log(res,'resres')
					if(res.retCode == '0000000') {
						console.log(res,'0000000')
						// 车队是否需要审核    verifycationMethod - 验证方式：0-拒绝加入；1-无需验证；2-需要验证
						if(item.verificationMethod == 2) {
							uni.showToast({
								title:'申请成功啦，管理员审批通过后，会尽快通知您',
								icon:'none',
								duration:3500
							})
						}else if(item.verificationMethod == 1) {
							uni.navigateTo({
								url: '/pages/goodsDelivery/fleetIndex/newFleetDetails?info=' + JSON.stringify(item)
							})
							// uni.navigateTo({
							// 	url: '/pages/goodsDelivery/fleetIndex/fleetDetails?info=' + JSON.stringify(item)
							// })
							
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none',
							duration:3000
						})
					}
				}).catch(err =>{
					console.log(err,'er')
					uni.showToast({
						title: err.retDesc,
						icon:'none'
					})
				})
			},
			
			//去添加车牌号
			addTo(){
				uni.hideTabBar();
				this.$refs.confirmPopup3.close();
				this.$refs.confirmPopup2.open();
			},
			
			//加入车队
			joinHand(){
				var userInfo = uni.getStorageSync("userInfo");
				var infor = JSON.parse(userInfo);
				// var driverId = JSON.parse(userInfo).attrs.driverId
				console.log(this.plateNoFleet,this.plateNoFleet.length)
				if(this.plateNoFleet == "") {
					uni.showToast({
						title:'请输入车牌号',
						icon:'none'
					})
					return;
				}
				if(this.plateNoFleet.length > 8) {
					uni.showToast({
						title:'请输入正确车牌号',
						icon:'none'
					})
					return;
				}
				const plateNumber = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/
				if (!plateNumber.test(this.plateNoFleet)) {
					uni.showToast({
						title:'请输入正确车牌号',
						icon:'none'
					})
					return;
				}
				
				let res = this.modelList.filter(item=>{
					if(item.isDefault && item.isDefault == 1) {
						return item;
					}
				})
				
				let data = {
					 driverId:infor.attrs.driverId,
					 plateNo: this.plateNoFleet,
					 ext1: this.selectedCarList.model,
					 vehicleLength: this.selectedCarList.cartLength,
					 // isDefault: 1,
					 personId: infor.attrs.personId,
					 userCode: infor.attrs.userCode,
					 userId: infor.userId,
					 userPhone: infor.mobile,
				}
				//判断司机是否有默认绑定的车辆  如果有就不传默认车辆参数 么有就传
				if(res.length == 0) {
					data.isDefault = 1;
				}
				console.log(data,'datadatadata')
				var isOpting = this.isOpting;
				if (isOpting) return;
				this.isOpting = true;
				ship.postRequest('/yh/vehicle/save/bind/simple',data).then(res=>{
					console.log(res,'res')
					this.isOpting = false;
					if(res.retCode == "0000000") {
						if(res.rspBody == 1) {
							this.$refs.confirmPopup2.close();
							uni.showTabBar();
							uni.showToast({
								title:'加入成功'
							})							
						 this.plateNoFleet = "";
						 this.addFleet(this.selectedCarList);
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon:'none'
						})
					}
				}).catch(err=>{
					this.isOpting = false;
					console.log(err,'err')
					uni.showToast({
						title: err.retDesc,
						icon:'none'
					})	
				})
			},
			
			maskClick() {
				this.$refs.confirmPopup2.close();
				uni.showTabBar();			
			},
			
			closeFleetHintPopup(){
				this.$refs.confirmPopup3.close()
			},
		}
	}
</script>

<style lang="scss">	
.box_big {
	width: 100vw;
	.close-ed {
		display: block;
		position: absolute;
		top: -60rpx;
		right: 0;
		width: 60rpx;
		height: 60rpx;
	}
	
}
	.vehicle_infor {
		// width: 100vw;
		background: #FFFFFF;
		border-radius: 16rpx;
		background: #FFFFFF;
		font-size: 36rpx;
		font-weight: 500;
		color: #333333;
		.title {		
			padding: 68rpx 52rpx 0 50rpx;
		}
		.vehicle_box {
			padding-top: 88rpx;
			padding-left: 74rpx;
			
			.vehicle_content {
				display: flex;
				align-items: center;
				padding-bottom: 46rpx;
				
				.left {
					width: 180rpx;
					text-align: right;
					.asterisk {
						color: #F35944;
					}
				}
				.right {
					font-size: 32rpx;
					font-weight: 400;
					color: #666666;
				}
				.input {
					height: 60rpx;
					background: #FFFFFF;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					opacity: 1;
					border: 1px solid rgba(0, 0, 0, 0.2);
					padding: 0 10rpx;
				}
			}
		}
			
		.btn_box {
			padding: 118rpx 176rpx 124rpx 174rpx;
			
			.join {
				width: 400rpx;
				height: 80rpx;
				background: #2973FA;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				opacity: 1;
				font-size: 32rpx;
				font-family: PingFang SC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
				
			}
			
		}
	}
	
	.add_box {
		width: calc(100vw - 76rpx);
		height: 458rpx;
		
			.popupCloseIcon {
				display: block;
				position: absolute;
				top: 0;
				right: 0;
				width: 60rpx;
				height: 60rpx;
				
			}		
		.add_conten {
			background: #FFFFFF;
			border-radius: 12rpx;
			height: 384rpx;
			margin-top: 64rpx;
						
			.tips {
				font-size: 40rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #000000;
				letter-spacing: 5rpx;
			    padding-top: 74rpx;
				text-align: center;
				
			}	
			
			.confirmAdd {	
				// margin: 58rpx 166rpx 64rpx 164rpx;	
				margin: 58rpx auto 0 auto;
				width: 344rpx;
				height: 72rpx;
				background: #2973FA;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				font-size: 32rpx;
				font-family: PingFang SC-Semibold, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				// display: flex;
				// justify-content: center;
				// align-items: center;		
				text-align: center;
				line-height: 72rpx;
			}
			
		}
		
		
		
		
	}
</style>
