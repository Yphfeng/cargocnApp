<template>
	<view class="">
		<view scroll-y="true" class="page" v-if="isLoaded">
			<!-- <view class="input-whole">
				<view class="input-label">
					<text class="red">*</text>标题
				</view>
				<input type="text" class="input" placeholder-class="placeholder-class" v-model="params.title" placeholder="请输入标题" />
			</view> -->
			<view class="headBox">
				<!-- <i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777; font-size: 27px;"></i> -->
				<image class="uniIcon" @tap="backToFromPage()" src="../../../static/images/back.png"></image>
				{{pageName ? pageName : '发布互助'}}
			</view>
			<view class="input-whole">
				<view class="input-label">
					<text class="red">*</text>地理位置
				</view>
				<view :class="['input', !params.address?'placeholder-class':'']" @click="chooseLocation">{{params.address?params.address:'请输入位置或点击定位'}}</view>
				<view class="input-location" @click="location()">
					<image src="../../../static/images/location.png" class="location-img" mode=""></image>
					定位
				</view>
			</view>
			<view class="input-whole-extra">
				<view class="input-label">
					<text class="red">*</text>
					<text>互助类型</text>
				</view>
				<view class="input-extra">
					<view class="btn-item font-13" v-for="(item, index) in typeArr" :key="index" :class="{'active': params.typeId == item.id}" @click="setHzStatus(item)">{{item.typeName}}</view>
				</view>
			</view>
			<view class="input-whole-extra">
				<view class="input-label">
					<text class="red">*</text>互助时效
				</view>
				<view class="input-extra">
					<view class="btn-item font-13" v-for="(item, index) in helpArr" :key="index" :class="{'active': params.period == item.id}" @click="setHelpStatus(item)">{{item.type==1?item.hour+'小时':'长期'}}</view>
				</view>
				
			</view>
			<view class="input-whole-extra">
				<view class="input-label noRequire">
					相关图片
				</view>
				<view class="input-extra">
					<g-upload ref='gUpload' :mode="imgList" @chooseFile='chooseFile' @imgDelete='imgDelete' :control='control' :columnNum="columnNum"></g-upload>
				</view>
			</view>
			<view class="input-whole-textArea">
				<view class="input-label">
					<text class="red">*</text>
					互助说明
				</view>
				
				<textarea placeholder-class="placeholder-class" v-model="params.description" placeholder="请输入互助说明" class="textarea" />
				
			</view>
		</view>
		<view class="send" @click="send">
			发布
		</view>
	</view>
	
</template>

<script>
	import * as base from '../../../utils/config.js';
	import * as utils from "@/utils/service.js";
	import gUpload from "@/components/g-upload/g-upload.vue";
	var QQMapWX = require("../../../utils/qqmap-wx-jssdk.min.js");
	var qqmapsdk = new QQMapWX({
	  key: utils.tentCentMapKey
	});
	var commonHtmlTitle = '发布互助';
	export default {
		comments:{
			gUpload
		},
		data() {
			return {
				isClicking: false,
				pageName: '',
				isLoaded: false,
				helpArr: [], //时效
				typeArr: [], //互助状态列表
				columnNum: 1,
				control: true,
				imgList: [],
				endText: '查看全部',
				filterData:[
					[{ text: '全部', value: '' }, { text: '状态1', value: 1 }, { text: '状态2', value: 2 }, { text: '状态3', value: 3 }, { text: '状态3', value: 3 }, { text: '状态3', value: 3 }, { text: '状态3', value: 3 }],
					[{ text: '全部', value: '' }, { text: '类型1', value: 1 }, { text: '类型2', value: 2 }, { text: '类型3', value: 3 }],
				],
				defaultIndex:[0,0],
				more: 'more',
				avatarList: [],
				params: {
					title: '',
					typeId: '',
					address: '',
					latitude: '',
					longitude: '',
					period: '',
					description: '',
					facadeImage: '',
					provinceCode: '',
					cityCode: '',
					areaCode: '',
				},
				codeObj: '',
				regionData: [],
				adcode: ''
			}
		},
		onPullDownRefresh() {
			console.log('下拉111')
			setTimeout(function(){
				uni.stopPullDownRefresh();
			}, 3000);
		},
		//页面滚动到底部的事件
		onReachBottom(){
		 //下拉刷新
			console.log('滚动到底部')
			if(timer != null){
				clearTimeout(timer);
			}
			var timer = setTimeout(() =>{
				this.more="noMore"
			}, 1000);
		},
		onLoad(options) {
			this.isClicking = false;
			var pageName = options.pageName;
			var detailsObj = options.detailsObj;
			if (pageName) {
				//表示是编辑
				this.pageName = pageName;
				var detailsObj = JSON.parse(detailsObj);
				console.log(detailsObj, 'asa');
				var params = this.params;
				for (var i in params) {
					if (detailsObj[i] !== undefined) {
						params[i] = detailsObj[i]
					}
				}
				this.params = params;
				this.params.id = detailsObj.id;
				this.codeObj = [detailsObj.provinceCode, detailsObj.cityCode, detailsObj.areaCode].join(',');
				if (detailsObj.facadeImage) {
					this.imgList = [detailsObj.facadeImage];
				}
				
				
			}
			
			var width = uni.getSystemInfoSync().windowWidth;
			this.width = width;
			this.height = (uni.getSystemInfoSync().windowHeight)*2 + 'rpx';
			this.agingEvent();
			this.query();
			
			let that = this;
			uni.getStorage({ // 检查地区数据，服务站、路况、互助上报时均需匹配地区code
			    key: 'regionData',
			    success: function (rRes) {
			        console.log('本地地区数据无误！');
					that.regionData = rRes.data;
			    },
				fail: function (rErr) {
					console.log('本地缓存无地区数据！', rErr);
					that.getRegionInfo();
				}
			});
		},
		methods: {
			backToFromPage() {
				uni.navigateBack({
					delta: 1
				})
			},
			agingEvent(){
				//时效
				var that = this;
				utils.postRequest('/mu/situation/dead-type/list', {commonHtmlTitle: commonHtmlTitle})
				.then(res=>{
					if(res.retCode == "0000000"){
						console.log(res, '时效')
						that.helpArr = res.rspBody;
						console.log(res.rspBody)
					} else{
						
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			chooseLocation(){
				var that = this;
				uni.chooseLocation({
				    success: function (res) {
						that.params.latitude = res.latitude;
						that.params.longitude = res.longitude;
						that.params.address = res.address;
						that.getAddressDetails();
				    }
				});
			},
			getAddressDetails() {
				console.log('执行定位解析');
				let that = this;
				let parameters = 'key=6ae872d0bc86389b263ecdf64521a42a' + '&location=' + that.params.longitude + ',' + that.params.latitude;
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo?' + parameters, //仅为示例，并非真实接口地址。
					method: 'GET',
					data: {},
					header: {},
					success: (aRes) => {
						console.log('成功', aRes);
						that.adcode = aRes.data.regeocode.addressComponent.adcode;
						that.getCodeObj(that.adcode);
					},
					fail: (err) => {
						console.log('失败', err);
					},
				});
			},
			
			getRegionInfo() {
				let that = this;
				utils.postRequest('/au/nationDict/getBasicData', {commonHtmlTitle: commonHtmlTitle})
				.then(res=>{
					if(res.retCode == "0000000"){
						console.log('省市区code获取成功');
						that.regionData = res.rspBody;
						uni.setStorage({
						    key: 'regionData',
						    data: res.rspBody,
						    success: function (saveRes) {
								console.log('地区数据缓存成功！', saveRes);
						    },
							fail: function (saveErr) {
								console.log('地区数据缓存失败！', saveErr);
							}
						});
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log(err);
				})
			},
			getCodeObj(areaCode) {
				console.log('开始匹配省市区code');
				let region = this.regionData;
				for(let a in region) {
					for(let b in region[a].cities) {
						for(let c in region[a].cities[b].areas) {
							if(region[a].cities[b].areas[c].code == areaCode) {
								this.codeObj = region[a].code + ',' + region[a].cities[b].code + ',' + region[a].cities[b].areas[c].code
								console.log('匹配的code', this.codeObj);
								break;
							}
						}
					}
				}
			},
			//定义方法
			reverseGeocoder(){
				//地址逆解析
				var that = this;
				that.save();
			},
			query() {
				//获取类别
				utils.postRequest("/mu/helptype/find", {commonHtmlTitle: commonHtmlTitle})
				.then(res => {
					this.isLoaded = true;
					if (res.retCode == "0000000") {
						console.log(res.rspBody, '互助类型')
						this.typeArr = res.rspBody;
					} else {
						uni.showToast({
							title:res.retDesc,
							icon: 'none'
						})
					}
				}).catch(err => {
					this.isLoaded = true;
					uni.showToast({
						title:err.retDesc,
						icon: 'none'
					})
				})
			},
			//设置互助实效
			setHelpStatus(item) {
				this.params.period = item.id;
				
			},
			setHzStatus(item) {
				//设置互助状态
				this.params.typeId = item.id
			},
			pub() {
				uni.navigateTo({
					url:"../publish/index"
				})
			},
			goDetail() {
				//去互助详情
				console.log('互助详情1')
				uni.navigateTo({
					url: "../detail/detail"
				})
			},
			onSelected(res){
				uni.showToast({
					icon:'none',
					title:'控制台查看筛选结果'
				})
			},
			dateChange(d){
			   uni.showToast({
				   icon:'none',
				   title:d
			   })
			},
			setList() {
				this.endText = this.endText == '查看全部' ? '显示列表' : '查看全部'
			},
			location() {
				var _this = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						console.log(res, '参数')
						_this.params.longitude = res.longitude;
						_this.params.latitude = res.latitude;
						_this.params.address = res.address.province + res.address.city + res.address.district + res.address.poiName;
						_this.getAddressDetails();
					}
				})
			},
			send() {
				var _this = this;
				var params = this.params;
				console.log(params)
				var userInfo = uni.getStorageSync("userInfo");
				console.log(userInfo, 'assa')
				if (!userInfo) {
					uni.showModal({
						title: '请登录后操作',
						success: function(res) {
							if (res.confirm) {
								utils.loginSelf()
							}
						}
					})
					return;
				}
				var isDriveAC = JSON.parse(userInfo).attrs.driverVerify;
				
				var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
				if (!isDriveAC && !vehicleVerify) {
					uni.showModal({
						title: '请认证驾驶证或行驶证',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../../my/driverVerify/newDriverVerify'
								})
							}
						}
					})
					return;
				} 
				// if (!vehicleVerify) {
				// 	uni.showModal({
				// 		title: '请认证行驶证',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				uni.navigateTo({
				// 					url: '../../my/carVerify/newCarVerify'
				// 				})
				// 			}
				// 		}
				// 	})
				// 	return;
				// }
				
				// if (!params.title) {
				// 	uni.showToast({
				// 		title: '请输入标题',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				if (!params.address) {
					uni.showToast({
						title: '请输入地址',
						icon: 'none'
					})
					return
				}
				if (!params.typeId) {
					uni.showToast({
						title: '请选择互助状态',
						icon: 'none'
					})
					return
				}
				if (!params.period) {
					uni.showToast({
						title: '请选择互助实效',
						icon: 'none'
					})
					return
				}
				if (!params.description) {
					uni.showToast({
						title: '请输入互助说明',
						icon: 'none'
					})
					return
				}
				// _this.reverseGeocoder();
				_this.save();
			},
			save() {
				
				let code = this.codeObj ? this.codeObj.split(',') : [];
				if(!this.codeObj) {
					var provinceCode = this.adcode.substring(0,2) + '0000';
					var cityCode = this.adcode.substring(0,4) + '00';
				}
				console.log('省市区code', code)
				this.params.provinceCode = this.codeObj ? code[0] : provinceCode;
				this.params.cityCode = this.codeObj ? code[1] : cityCode;
				this.params.areaCode = this.codeObj ? code[2] : this.adcode;
				this.params.commonHtmlTitle = commonHtmlTitle;
				console.log('发布互助参数', this.params)
				
				if (this.isClicking) {
					return
				}
				this.isClicking = true
				uni.showLoading();
				var that = this;
				utils.postRequest("/mu/help/save", this.params)
				.then(res => {
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: "发布成功"
						});
						if (this.pageName) {
							uni.$emit("refreshApi");
						}
						setTimeout(() => {
							that.isClicking = false
							uni.navigateBack({
								delta: 1,
								success: function(ret) {
									uni.$emit("refreshData_mutual");
								}
							})
						}, 2000)
					} else {
						that.isClicking = false
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
				})
				.catch(err => {
					this.isClicking = false
					console.log(err, '阿斯顿')
					uni.hideLoading();
				})
			},
			uploadImg() {
				this.$refs.gUpload.uploadImg()
			 },
			chooseFile(list, v) {
			        console.log("上传图片_list：", list)
			        console.log("上传图片_v：", v);
			        this.uploadFileToServe(v)
			},
			imgDelete(list, eq) {
			        console.log("删除图片_list：", list)
			        console.log("删除图片_eq：", eq)
					this.control = true;
					this.imgList = [];
					this.params.facadeImage = "";
			},
			uploadFileToServe(urlList) {
				this.control = false
				if (!urlList || urlList.length <= 0) {
				  return
				};
				console.log(urlList, '图片')
				
			  utils.upLoadFile("/file/upload", urlList[0])
			  .then(res => {
		
				  console.log(res, '图标1')
				  if (res.retCode == "0000000") {
					  this.params.facadeImage = res.rspBody[0].url;
					  this.imgList = [res.rspBody[0].url];
				  } else {
					  uni.showToast({
					  	title: res.retDesc,
						icon:"none"
					  })
				  }
			  }).catch(err => {
				  console.log(err)
			  })
				 
			}
		},
	}
	
	
	
</script>

<style lang="scss">
	.placeholder-class{
		color: #999;
	}
	.page {
		padding-bottom: 200rpx;
	}
	
	.input-whole {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		width: 100%;
		box-sizing: border-box;
		.input-label {
			text-align: left;
			font-size: 28rpx;
			width: 130rpx;
		}
		.input {
			flex: 1;
			justify-content: flex-start;
			align-items: center;
			display: flex;
			margin-left: 20rpx;
		}
	}
	.input-whole-extra {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding: 20rpx 30rpx;
		width: 100%;
		box-sizing: border-box;
		&::after {
			content: "";
			clear: both;
			display: table;
		}
		.input-label {
			text-align: left;
			font-size: 28rpx;
			width: 130rpx;
			padding-top: 6rpx;
			
		}
		.noRequire {
			padding-left: 12rpx;
		}
	}
	.input-extra {
		flex: 1;
		margin-left: 24rpx;
		.btn-item {
			height: 48rpx;
			width: 120rpx;
			background-color: #ccc;
			line-height: 48rpx;
			text-align: center;
			float: left;
			margin-left: 10rpx;
			margin-bottom: 16rpx;
			&.active {
				color: rgba(0, 119, 255, 1);
				background-color: rgba(0, 119, 255, .2);
			}
		}
	}
	.img {
		width: 190rpx;
		height: 160rpx;
	}
	.input-whole-textArea {
		padding: 0 30rpx;
		width: 100%;
		box-sizing: border-box;
		.input-label {
			height: 80rpx;
			line-height: 80rpx;
		}
		.textarea {
			height: 328rpx;
			border: 1px solid #ccc;
			width: 100%;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
		}
	}
	.send {
		position: fixed;
		bottom: 50rpx;
		left: 0;
		width: 80%;
		margin-left: 10%;
		height: 64rpx;
		background-color: rgba(255, 141, 2, 1);
		color: #fff;
		border-radius: 32rpx;
		text-align: center;
		line-height: 64rpx;
	}
	.input-location {
		color: rgba(0, 119, 255, 1);
		font-size: 26rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.location-img {
		width: 28rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}
	.headBox {
		padding:70rpx 0 0 0;
		background-color: #FFFFFF;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size:34rpx;
		font-weight: 500;
		color:#333;
		// box-sizing: border-box;
		.headRight {
			position: absolute;
			right: 0;
			top:  70rpx;
		}
		.uniIcon {
			width: 22rpx;
			height: 40rpx;
			position: absolute;
			left:40rpx;
			margin-top:10rpx;
		}
		.memberMoreIcon {
			width: 42rpx;
			height: 42rpx;
			position: absolute;
			right:40rpx;
			margin-top:10rpx;
		}
	}
</style>
