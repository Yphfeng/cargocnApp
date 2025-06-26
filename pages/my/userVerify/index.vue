<template>
	<view class="backgroundView">
	  <view class='inputView'>
	    <text style='font-size: 30rpx;'>上传身份证，完善身份信息。</text>
	    <text style='font-size: 24rpx;color:#999999;margin-top: 10rpx;'>确保图片清晰，四角完整</text>
	  </view>
	  <view class='cardView1'>
	    <rich-text>
	    <!-- {{type?'身份证照片':'请上传身份证正反面照片'}} -->
	      <text style="color:red;">*</text>请上传身份证正反面照片</rich-text>
	    <view class='imageView'>
	      <image class='card' style='border: 1rpx dashed #999999;' :src="faceImage" @click='faceSelect(1)'></image>
	      <image class='card' style='border: 1rpx dashed #999999;' :src="backImage" @click='faceSelect(2)'></image>
	    </view>
	  </view>
	  <view class="infoView">
	    <view class='nameView'>
	      <text>姓名</text>
	      <input placeholder='请输入姓名' :disabled="!isEdit" v-model="username"></input>
	    </view>
	    <view class='nameView'>
	      <text>身份证号</text>
	      <input placeholder='请输入身份证号' :disabled="!isEdit" v-model="idcardnum"></input>
	    </view>
	    <view class='nameView'>
	      <text>身份证地址</text>
	      <input placeholder='请输入身份证地址' :disabled="!isEdit" v-model="address"></input>
	    </view>
	  </view>
	  <view class="infoView" style="height:160rpx;">
	    <view class='nameView'>
	      <text>有效期</text>
	      <input placeholder='请输入身份证有限期'  :disabled="!isEdit" v-model="date"></input>
	    </view>
		
<!-- 	    <view class='nameView'>
	      <text>发证机关</text>
	      <input placeholder='请输入身份证发证机关' :disabled="!isEdit" v-model="company"></input>
	    </view> -->
	  </view>
	  <view class="infoView" style="height:160rpx;">
	  	    <view class='nameView'>
	  	      <text>认证状态</text>
	  	      <text>{{isEdit ? '已认证' : '未认证'}}</text>
	  	    </view>
	  	  </view>
	  
	  <view class='SaveView' v-if="isEdit">
	    <button class="SaveView_button" @click='saveInfoSelect'>{{saveBtnTitle}}</button>
	  </view>
	</view>
</template>

<script>
	import {upLoadFile, postRequest} from "../../../utils/service.js";
	var commonHtmlTitle = '实名认证';
	export default {
		data() {
			return {
				isEdit: true,
				faceImage: "https://cargocn.oss-cn-beijing.aliyuncs.com/20200904165134.png",
				faceImageUrl: '',
				faceImageStatus: false,
		
		
				backImage: "https://cargocn.oss-cn-beijing.aliyuncs.com/20200904165128.png",
				backImageUrl: '',
				backImageStatus: false,
		
				username: '',
				saveBtnTitle: '提交',
				address: '',
				idcardnum: '',
				date: '',
				company: '',
				dataFrom: '',
				dataTo: ''
			}
		},
		onLoad() {
			this.getDriverInfo(); //获取用户资料
		},
		methods: {
		   faceSelect(flag) {
				var that = this;
				if (!this.isEdit) {
					return;
				}
				uni.chooseImage({
					count: 1, // 默认9  
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
						var tempFilePaths = res.tempFilePaths
						that.uploadIdcard(tempFilePaths[0], flag);
					},
					fail: function(err) {
						console.log(err, 'asd')
					}
				})
			},
			uploadIdcard: function(image, flag) {
				var that = this;
				var params = new Object();
				var url = "/file/ocr/idCard"; 
				if (flag == 1) {
					params = {
						side: 'front'
					}
				} else if (flag == 2) {
					params = {
						side: 'back'
					}
				}
				uni.showLoading({
					title: '请稍候...',
				})
				upLoadFile(url, image, params)
				.then(res => {
					console.log('身份证信息', res)
					uni.hideLoading();
					if (res.retCode == "0000000") {
						var body = res.rspBody;
						var words_result = body.words_result;
						if (flag == 1) {
							//身份证正面
							this.username = words_result.name || '';
							this.idcardnum = words_result.idNo || '';
							this.address = words_result.address || '';
							this.faceImage = this.faceImageUrl = body.url || "";
							this.birthday = words_result.birthday || '';
							this.gender = words_result.gender || '';
						} else if (flag == 2) {
							//身份证副页
							
							this.dataFrom = words_result.validFrom,
							this.dataTo = words_result.validTo;
							this.date = this.dataFrom + '-' + this.dataTo;
							// var date = words_result.validTo;
							// if (date.length > 7) {
							// 	this.date = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6)
							// } else {
							// 	this.date = ""
							// }
							this.backImage = this.backImageUrl = body.url || "";
							
						} 
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: '未识别出有效信息，请重试',
						icon: 'none'
					})
				})
			},
			goHZ() {
				uni.navigateTo({
					url:"../mutualAssistance/index"
				})
			},
			saveInfoSelect() {
				var that = this;
				if (!that.faceImageUrl) {
					uni.showToast({
						title: '身份证正面为空',
						icon: 'none'
					})
					return;
				}
				if (!that.backImageUrl ) {
					uni.showToast({
						title: '身份证背面为空',
						icon: 'none'
					})
					return;
				}
				if (!that.username) {
					uni.showToast({
						title: '姓名为空',
						icon: 'none'
					})
					return;
				}
				if (!that.idcardnum){
					uni.showToast({
						title: '身份证号为空',
						icon: 'none'
					})
					return;
				}
				if (!that.address) {
					uni.showToast({
						title: '身份证地址为空',
						icon: 'none'
					})
					return;
				}
				if (!that.date){
					uni.showToast({
						title: '身份证日期为空',
						icon: 'none'
					})
					return;
				}
				var parm = {
					userName: that.username,
					idNo: that.idcardnum,
					idAddress: that.address,
					validFrom: that.dataFrom,
					validTo: that.dataTo,
					idAuthority: that.company, 
					idFrontImg: that.faceImageUrl,
					idBackImg: that.backImageUrl,
					commonHtmlTitle: commonHtmlTitle,
					birthday: this.birthday,
					gender: this.gender
				}
				console.log('认证信息',parm);
				uni.showLoading();
				postRequest("/au/user/driverAC", parm).then(function(res) {
					uni.hideLoading();
					if (res.retCode == '0000000') {
						uni.showToast({
							title: '实名认证成功',
							icon: 'success'
						})
						var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
						
						userInfo.attrs.identityVerify = 1
						uni.setStorageSync("userInfo", JSON.stringify(userInfo));
						uni.switchTab({
							url: '/pages/my/index/index'
						})
					} else {
						uni.showModal({
							title: '提示',
							content: res.retDesc,
							showCancel: false
						})
					}
						
				});
			},
			//这里是账户
			getDriverInfo: function() {
				var that = this;
				postRequest("/au/user/detail", {commonHtmlTitle: commonHtmlTitle}).then(function(res) {
					console.log(res, '账号') 
					if (res.retCode == '0000000') {
						let resData = res.rspBody.attrs;
						that.isEdit = resData.identityVerify == 1 ? false : true;
						let [username, idcardnum, address, date] = [resData.realName, resData.idNo, resData.idAddress, resData.validDate]
						that.faceImage = resData.idFrontImg ? resData.idFrontImg : that.data.faceImage;
						that.backImage = resData.idBackImg ? resData.idBackImg : that.data.backImage;
						that.faceImageUrl = resData.idFrontImg ? resData.idFrontImg : '';
						that.backImageUrl = resData.idBackImg ? resData.idBackImg : '';

						that.username = username || '';
						that.idcardnum = idcardnum || '';
						that.address = address || '';
						that.date = date || '';
						console.log(that.username, 'asas')
						that.$forceUpdate()
					
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					
				}).catch(err => {
					
				})
			},
		}
	}
</script>

<style>
	.navTop {
	    background: #fff;
	    height: 130rpx;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
	}
	
	.navTop view {
	    height: 65rpx;
	}
	
	.navTop view image {
	    width: 33rpx;
	    height: 33rpx;
	    position: absolute;
	    left: 10rpx;
	    top: 75rpx;
	}
	
	.topView {
	    height: 120rpx;
	    width: 100%;
	    margin-top: 0;
	    /* width: 200rpx; */
	    background: #F4F4F4;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	}
	
	.backgroundView {
		overflow-x: hidden;
	}
	
	.roundView1 {
	    margin-top: 30rpx;
	    width: 20rpx;
	    height: 20rpx;
	    background: #FF7142;
	    border-radius: 20rpx;
	}
	
	.roundView2 {
	    margin-top: 30rpx;
	    width: 16rpx;
	    height: 16rpx;
	    /* background:  red ; */
	    border-radius: 16rpx;
	    border: 1px solid gray;
	}
	
	.lineView {
	    margin-top: 38rpx;
	    width: 140rpx;
	    height: 2rpx;
	    background: #999999;
	}
	
	.topView text {
	    margin-top: 10rpx;
	    font-size: 20rpx;
	    color: #999999;
	    width: 170rpx;
	    text-align: center;
	}
	
	.inputView {
	    padding:0 20rpx;
	    background: white;
	    height: 140rpx;
	    display: flex;
	    flex-direction: column;
	    justify-content: flex-start;
	}
	
	.infoView {
	    border-top: 1rpx solid #DDDDDD;
	}
	
	.nameView {
	    background: white;
	    width: 100%;
	    height: 80rpx;
	    text-align: left;
	    display: flex;
	    flex-direction: row;
	    /* background: blue; */
	}
	
	.nameView text {
	    margin-left: 20rpx;
	    font-size: 28rpx;
	    width: 30%;
	    height: 80rpx;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    line-height: 80rpx;
	    /* background: red; */
	}
	
	.nameView input {
	    font-size: 28rpx;
	    width: 80%;
	    text-align: right;
	    padding-right: 40rpx;
	    line-height: 80rpx;
	    /* background: red; */
	    height: 80rpx;
	}
	
	.bankAddBtn {
	    margin-top: 4vh;
	    background: white;
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	    font-size: 32rpx;
	    color: #469DFC;
	    height: 10vh;
	}
	
	.bankAddBtn image {
	    /* margin-top: 34rpx; */
	    width: 68rpx;
	    height: 10vh;
	}
	
	.bankAddBtn text {
	    height: 10vh;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	}
	
	.bankItemView {
	    height: 140rpx;
	    border-top-left-radius: 15rpx;
	    border-top-right-radius: 15rpx;
	    box-shadow: 0 6rpx 10rpx 2rpx #E9ECF2;
	    /*for Android*/
	    -webkit-box-shadow: 0px 3px 5px 1px #E9ECF2;
	    /*for IOS*/
	    display: flex;
	    flex-direction: row;
	}
	
	.cardView1 {
	    width: 100%;
	    margin-top: 20rpx;
	    height: 280rpx;
	    background: white;
	    padding-left: 20rpx;
	    padding-top: 20rpx;
	}
	
	.cardView1 rich-text {
	    font-size: 28rpx;
	}
	
	.imageView {
	    margin-top: 20rpx;
	    width: 100%;
	    height: 200rpx;
	    /* background: red; */
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	}
	
	.card {
	    width: 50%;
	    height: 200rpx;
	    /* background: blue;  */
	    margin-right: 40rpx;
	}
	
	.checkView {
	    margin: 20rpx 20rpx 0rpx 20rpx;
	    font-size: 24rpx;
	    display: flex;
	    flex-direction: row;
	}
	
	.checkView checkBox {
	    width: 24rpx;
	    height: 24rpx;
	    zoom: 60%;
	}
	
	.checkView rich-text {
	    margin-left: 20rpx;
	    height: 30rpx;
	}
	
	.SaveView {
	    width: 100%;
	    height: 94rpx;
	    /* position: absolute;
	  bottom: 20rpx; */
	}
	
	.SaveView_button {
	    width: 80%;
	    color: white;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    font-size: 36rpx;
	    border-radius: 47rpx;
		background-color: #469DFC;
	}
	
	.show {
	    display: block;
	}
	
	.disappear {
	    display: none;
	}
</style>
