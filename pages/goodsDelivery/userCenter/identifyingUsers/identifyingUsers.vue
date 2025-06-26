<template>
	<view class="identifyingUsers">
		<view v-show="!isDetail || !isEdit2" class="certificationStatus">
			<view class="statusBox" :class="activity == 1 ? 'statusCss2' : 'statusCss3'">
				<text class="statusMsg" style="color:#FFF;">身份证验证</text>
				<!-- <image class="statusIcon" :src="activity == 1 ? statusIcon1 : statusIcon2"></image> -->
			</view>
			<view class="line-left" :class="activity == 1 ? 'lineLeftStatusCss2' : 'lineLeftStatusCss3'"></view>
			<view class="line-right"
				:class="activity == 1 ? 'lineRightStatusCss1' : activity == 2 ? 'lineRightStatusCss2' : 'lineRightStatusCss3'">
			</view>
			<view class="statusBox" :class="activity == 1 ? 'statusCss1' : activity == 2 ? 'statusCss2' : 'statusCss3'">
				<text class="statusMsg" style="color:#FFF;">人脸验证</text>
			</view>
		</view>
		<view v-show="isEdit2 && isDetail" class="tips-title">点击图片可重新上传身份证照片</view>

		<!-- 第一步 -->
		<view v-show="pageStep == 1" class="step-1">
			<view class="imageUploadBox">
				<view class="idCardImg" @click='faceSelect(1)'
					style="background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/idCard.png');">
					<image class="img" v-if="faceImageUrl" :src="faceImageUrl"></image>
					<image v-else src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png" class="addImage">
					</image>
					<view v-if="!faceImageUrl" class="upLoadHint">上传身份证正面</view>
				</view>
				<view class="idCardImg" @click='faceSelect(2)'
					style="background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/idbackCard.png');">
					<image class="img" v-if="backImage" :src="backImage"></image>
					<image v-else src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wx/upIdCard1.png" class="addImage">
					</image>
					<view v-if="!backImage" class="upLoadHint">上传身份证反面</view>
				</view>
			</view>
			<view class="info-status" :class="{active: identityVerify}" v-if="!isEdit2 && identityVerify != undefined">
				<image v-if="identityVerify == 1" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/selected.png"
					class="recognize"></image>
				<image v-else src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/recognizeNo.png" class="recognize">
				</image>
				<text class="reco-text">{{identityVerify ? '已认证' : '未认证'}} {{showMsg()}}</text>
			</view>
			<view class="line" />
			<view class="inputBox">
				<view class="title">姓名<text class="red" v-if="isEdit2">*</text></view>
				<input class="msgInput" :class="{edit: isEdit2}" :disabled="!isEdit2" placeholder="请输入"
					placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="name" />
			</view>
			<view class="inputBox">
				<view class="title">身份证号<text class="red" v-if="isEdit2">*</text></view>
				<!--  @click="showKeyBoard()" -->
				<input class="msgInput" :class="{edit: isEdit2}" :disabled="!isEdit2" placeholder="请输入"
					placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="cardNum" />
			</view>
			<view class="inputBox">
				<view class="title">身份证地址<text class="red" v-if="isEdit2">*</text></view>
				<input class="msgInput" :class="{edit: isEdit2}" :disabled="!isEdit2" placeholder="请输入"
					placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="address" />
			</view>
			<view class="inputBox">
				<view class="title">有效期起<text class="red" v-if="isEdit2">*</text></view>
				<view class="uni-input">
					<view v-if="!isEdit2">
						<input class="msgInput" :class="{edit: isEdit2}" :disabled="!isEdit2" placeholder="请选择"
							placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="dataFrom" />
					</view>
					<view v-else>
						<!-- <uni-datetime-picker
							:bgClass="isEdit2 ? 'bgClass' : 'defaultStyle'"
							type="date"
							:showIcon="false"
							:border="false"
							:disabled="!isEdit2"
							:clear-icon="false"
							:placeholder="'请选择'"
							v-model="dataFrom"
							@change="changeDateFrom"
						/> -->
						<picker class="msgInput " :class="{edit: isEdit2}" mode="date" :disabled="!isEdit2"
							@change="changeDateFrom" :value="dataFrom" fields="day">
							<view v-if="dataFrom" class="uni-input">{{dataFrom}}</view>
							<view v-else class="uni-input defaultVal">请选择有效期起</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="inputBox">
				<view class="title">有效期止<text class="red" v-if="isEdit2">*</text></view>
				<view class="uni-input">
					<view v-if="!isEdit2">
						
						<input class="msgInput" :class="{errorRed: idStatus != 1 || isUpDateEnd}" :disabled="!isEdit2"
							placeholder="请选择" placeholder-style="font-size:28rpx;color:#C2C2C9" v-model="dataTo == '长期' ? '长期' : dataTo" />
					</view>
					<view v-else>
						<!-- <uni-datetime-picker
							:bgClass="isEdit2 ? 'bgClass' : 'defaultStyle'"
							type="date"
							:showIcon="false"
							:border="false"
							:disabled="!isEdit2"
							:clear-icon="false"
							:placeholder="'请选择'"
							v-model="dataTo"
							@change="changeDateTo"
						/> -->
					<!-- 	<picker class="msgInput " :class="{edit: isEdit2}" mode="date" :disabled="!isEdit2" @change="changeDateTo" :value="dataTo" fields="day">
							<view v-if="dataTo" class="uni-input" >{{dataTo}}</view>
							<view v-else  class="uni-input defaultVal" >请选择有效期止</view>
						</picker> -->
						<view class="msgInput" :class="{edit: isEdit2, errorRed: isUpDateEnd}" @click="showDatePop">
							<view v-if="dataTo" class="uni-input">{{dataTo == "长期" ? '长期' : dataTo}}</view>
							<view v-else class="uni-input defaultVal">请选择有效期止</view>
						</view>

					</view>

				</view>
			</view>
			<!-- <view class="inputBox" v-if="isEdit">
				<view class="title">认证状态</view>
				<view>{{showStatus()}}</view>
			</view> -->
		</view>

		<!-- 第二步 -->
		<view v-show="pageStep == 2">
			<view class="identifyTitle">
				<image class="identifyLogo" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/identifyLogo.png">
				</image>
				货运中国+申请使用
			</view>
			<view class="identifyHint">人脸识别验证你的身份信息，</view>
			<view class="identifyHint">请确保为 {{userRole == 1 ? userInfo.userName : userInfo.userName}} 本人操作</view>
		</view>

		<!-- 第三步 -->
		<view v-show="pageStep == 3">
			<image class="identifyStatusIcon"
				:src="identifyStatus ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/identifySuccess.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/identifyError.png'">
			</image>
			<view class="identifyStatusMsg">{{identifyStatus ? '识别完成' : '您已进行人脸认证，正等待校验返回，请稍后刷新或退出重新登录'}}</view>
		</view>

		<!-- 操作按钮 -->

		<view v-show="showEditBtn()" class="nextStepBtn" :class="{active: isAllSet, noEdit: isDetail && !isEdit2}"
			@click="changePageStep()">{{showBtnMsg}}</view>

		<view class="identifyBtnGroup" v-show="pageStep == 2">
			<view class="agreementBox">
				<view class="agreeBtn" v-show="!isAgree" @click="isAgree = true"></view>
				<image class="agreeBtnIcon" v-show="isAgree"
					src="../../../../static/images/goodsDelivery/payCheckedIcon.png" @click="isAgree = false"></image>
				<view class="agreeMsg">
					您同意服务提供者及货运中国使用并传送相关数据用于身份核验。
					<text class="agreeDetails" @click="jumpToDigitalCertificate()">数字证书使用协议</text>
				</view>
			</view>
			<view class="startBtn" @click="getFaceUrl()">开始人脸识别验证</view>
		</view>
		<view v-show="pageStep == 3" class="nextStepBtn" @click="backToCenter()">确定</view>


		<!-- 测试模块 -->
		<!-- <view class="testBtnGroup">
			<view v-show="activity != 3" class="changeStatusBtn" @click="changeStatus(1)">重置</view>
			<view v-show="activity != 3" class="changeStatusBtn" @click="changeStatus(3)">人脸已认证</view>
			
			<view class="changeStatusBtn" @click="identifyStatus = !identifyStatus">改变认证状态</view>
		</view> -->

		<!-- 自定义软键盘 -->
		<uni-popup ref="keyboardPopup" type="bottom">
			<view class="keyboardPopupBox">
				<view class="keyCol">
					<view class="keyRow">1</view>
					<view class="keyRow">4</view>
					<view class="keyRow">7</view>
					<view class="keyRow">X</view>
				</view>
				<view class="keyCol">
					<view class="keyRow">2</view>
					<view class="keyRow">5</view>
					<view class="keyRow">8</view>
					<view class="keyRow">0</view>
				</view>
				<view class="keyCol">
					<view class="keyRow">3</view>
					<view class="keyRow">6</view>
					<view class="keyRow">9</view>
					<view class="keyRow"></view>
				</view>
				<view class="keyCol">
					<view class="keyBoardDelete">
						<image class="deleteIcon"
							src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/keyBoardDelete.png"></image>
					</view>
					<view class="keyBoardConfirm">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="backPopup" type="center">
			<view class="backPopup1">
				<view class="backTitle1">提示</view>
				<view class="cont1">您还没完成人脸验证，是否退出!</view>
				<view class="optbtn1">
					<view class="cancel1 opt1" @click="cancelBack">退出</view>
					<view class="confirm1 opt1" @click="confirmBack">继续认证</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="backPopup1" type="center">
			<view class="backPopup">
				<view class="cont">您还没保存信息，是否退出</view>
				<view class="optbtn">
					<view class="cancel opt" @click="cancelBack1">取消</view>
					<view class="confirm opt" @click="confirmBack1">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="datePopup" type="bottom">
			<view class="datePopUp">
				<view class="opt">
					<view class="cancel item" @click="cancelTo">取消</view>
					<view class="confirm item" @click="confirmTo">确定</view>
				</view>
				<view class="cont" @click="chooseLong" :class="{active: isChooseLong}">长期</view>
				<picker-view :value="dateValue" :indicator-style="indicatorStyle" @change="bindChange" class="picker-view">
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in months" :key="index">{{item}}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in days" :key="index">{{item}}日</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>

		<uni-popup ref="mobilePopup" type="center">
			<view class="mobilePopup">
				<view class="mobile-title">提示</view>
				<view class="cont">当前身份证号已被手机号为{{willUpPhone}}的用户占用</view>
			</view>
			<view class="mobilePopup-opt">
				<view class="optItem one" @click="confirmSwitchBack">使用现有尾号{{nowAtPhone}}手机号，继续认证</view>
				<view class="optLine" />
				<view class="optItem two" @click="switchBack">切换尾号{{willAtUpPhone}}手机号，继续使用</view>
				<view class="optLine2" />
				<view class="optItem cancel" @click="cancelSwitchBack">取消</view>
			</view>

		</uni-popup>
		<uni-popup ref="oilPopup" type="center">
			<view class="backPopup">
				<view class="cont">点击‘确定’后之前绑定的手机号数据将清除，之后有问题可联系客服！</view>
				<view class="optbtn">
					<view class="cancel opt" @click="cancelOilBack">取消</view>
					<view class="confirm opt" @click="confirmOilBack">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="center">
			<view class="alertUp" v-if="photoType == 'front'">
				<view class="alertTitle">请按照示例上传</view>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/exp_id_1.png" class="exp_id_1"></image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/exp_id_2.png" class="exp_id_2"></image>
				<view class="photo-content">
					为了使用身份认证的相关功能或服务，您需上传身份证证照，点击拍照会调起手机拍照权限，点击从手机相册选择会访问您的相册权限
				</view>
				<view class="optAlertItem">
					<view class="alertItem" @click="sendPhotoPower">拍照</view>
					<view class="alertLine" />
					<view class="alertItem" @click="chooseFromPhoto">从手机相册选择</view>
					<view class="alertLine cancel" />
					<view class="alertItem" @click="cancel">取消</view>
				</view>

			</view>
			<view class="alertUp" v-else>
				<view class="alertTitle">请按照示例上传</view>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/id_back_1.png" class="exp_id_1"></image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/upfile/id_back_2.png" class="exp_id_2"></image>
				<view class="photo-content">
					为了使用身份认证的相关功能或服务，您需上传身份证证照，点击拍照会调起手机拍照权限，点击从手机相册选择会访问您的相册权限
				</view>
				<view class="optAlertItem">
					<view class="alertItem" @click="sendPhotoPower">拍照</view>
					<view class="alertLine" />
					<view class="alertItem" @click="chooseFromPhoto">从手机相册选择</view>
					<view class="alertLine cancel" />
					<view class="alertItem" @click="cancel">取消</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="backPopup2" type="center">
			<view class="backPopup1">
				<view class="backTitle1">提示</view>
				<view class="cont1">退出后，您上传的资料将清除，需要重新上传!</view>
				<view class="optbtn1">
					<view class="cancel1 opt1" @click="confirmBack2">退出</view>
					<view class="confirm1 opt1" @click="cancelBack2">继续认证</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	import IMService from "@/utils/imservice.js";
	import * as commonUtils from "@/utils/utils"
	const bdFaceLive = uni.requireNativePlugin('liyahong-BDFace-v4');
	var platForm = uni.getSystemInfoSync().platform;
	var PhotoModule = uni.requireNativePlugin("PhotoModule");
	export default {
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			var once = year - 1990;
			for (let i = 1990; i <= 2099; i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i < 10 ? '0' + i : i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i < 10 ? '0' + i : i)
			}
			return {
				willAtUpPhone: '',
				nowAtPhone: '',
				pageFrom: "",
				start: "1990-1-1",
				end: "2099-1-1",
				activity: '',
				pageStep: 1,
				statusIcon1: '../../../../static/images/goodsDelivery/certificationStatus2.png',
				statusIcon2: '../../../../static/images/goodsDelivery/certificationStatus1.png',
				name: '',
				cardNum: '',
				address: '',
				date: '',
				dataFrom: '',
				dataTo: '',
				isAgree: false,
				identifyStatus: true,
				faceImageUrl: '',
				backImage: '',
				birthday: '',
				gender: '',
				userInfo: {},
				userRole: '',

				webviewStyles: {
					progress: false
				},
				webUrl: '',
				hasUrl: false,
				hasJump: false,
				idStatus: 1,
				identityVerify: 0,
				identityVerifyInfo: "",
				pageFromNewUsers: false,
				isEdit2: false,
				isDetail: false,
				photoType: 'front',
				willUpPhone: '',
				isClickSave: false,
				dateValue: [once, month - 1, day - 1],
				years,
				year,
				months,
				month,
				days,
				day,
				isChooseLong: false,
				indicatorStyle: `height: 40px;`
			};
		},
		onLoad(options) {
			var that = this;
			var userInfo = uni.getStorageSync("userInfo");
			this.pageFrom = options.pageFrom;
			this.userInfo = userInfo ? JSON.parse(userInfo) : {};
			var mobile = this.userInfo.mobile;
			this.nowAtPhone = mobile.substring(7, 11);
			this.userRole = uni.getStorageSync('userRole');
			console.log('用户信息', options);
			var result = options.result;
			if (result) {

				this.pageFromNewUsers = true;
				this.isDetail = false;
				this.isEdit2 = true
				this.activity = 1;
				var jsonResult = JSON.parse(result);
				this.faceImageUrl = jsonResult.userFront.image;
				this.backImage = jsonResult.userBack.image;
				this.name = jsonResult.userFront.name;
				this.cardNum = jsonResult.userFront.idNo;
				this.address = jsonResult.userFront.addr;
				this.dataFrom = jsonResult.userBack.validFrom;
				this.dataTo = jsonResult.userBack.validTo;
				this.birthday = jsonResult.userFront.birthday;
				this.gender = jsonResult.userFront.gender;
				

			} else {
				this.isDetail = true;
				this.getIdentifyingDetails();
				this.pageStep = 1;
			}
			uni.$on("refreshIdNo", () => {

				this.getIdentifyingDetails();
				this.pageStep = 1;
			})
		},
		onBackPress(e) {
			console.log(e);
			if (e.from == 'backbutton') {
				var userInfo = this.userInfo;
				console.log(this.isDetail, this.isEdit2, this.pageStep)
				if (this.isEdit2 && this.pageStep == 1) {
					this.$refs.backPopup2.open();
					return true;
				} else {
					if (userInfo.attrs.faceVerify != 1 && userInfo.attrs.identityVerify == 1) {
						this.$refs.backPopup2.open();
					} else {
						uni.navigateBack({
							delta: this.pageFromNewUsers ? 2 : 1
						})
					}

					return true
				}

			}
		},

		onPullDownRefresh() { // 下拉刷新
			console.log('下拉刷新');
			this.getUserInfo();
		},
		computed: {
			isUpDateEnd() {
				var dataTo = this.dataTo;
				if (!dataTo) return false
				var nowTime = new Date().getTime();
				var fromTime = new Date(dataTo).getTime();
				if (fromTime - nowTime < 0) {
					return true
				}
				return false
			},
			showBtnMsg() {
				var faceVerify = this.userInfo.attrs.faceVerify;
				var identityVerify = this.userInfo.attrs.identityVerify;
				var isEdit2 = this.isEdit2;
				var isDetail = this.isDetail;
				if (!isDetail) {
					return '下一步';
				} else if (isDetail && !isEdit2) {
					if (faceVerify) {
						return "修改身份证信息"
					} else {
						return identityVerify ? '下一步' : '修改身份证信息'
					}

				} else {
					if (faceVerify == 1) {
						return "保存"
					} else {
						return "下一步"
					}
				}
			},
			isAllSet() {
				var faceImageUrl = this.faceImageUrl;
				var backImage = this.backImage;
				var name = this.name;
				var cardNum = this.cardNum;
				var address = this.address;
				var dataFrom = this.dataFrom;
				var dataTo = this.dataTo;
				if (faceImageUrl && backImage && name && cardNum && address && dataFrom && dataTo) {
					return true
				}
				return false
			}
		},
		methods: {
			cancelBack() {
				this.$refs.backPopup.close();
				var pageFromNewUsers = this.pageFromNewUsers;
				setTimeout(() => {
					uni.navigateBack({
						delta: pageFromNewUsers ? 2 : 1
					})
				}, 1000)
			},
			confirmBack() {
				this.$refs.backPopup.close();
			},
			cancelBack1() {
				this.$refs.backPopup1.close()
			},
			confirmBack1() {
				this.$refs.backPopup1.close();
				uni.navigateBack({
					delta: 1
				})

			},
			switchBack() {
				this.$refs.mobilePopup.close()
				//切换账户，跳转登录页面
				this.logoutDefault();

			},
			logoutDefault() {
				var that = this;
				var userRole = uni.getStorageSync("userRole");
				var cid = plus.push.getClientInfo().clientid;
				let userInfo = uni.getStorageSync("userInfo");
				var userId = JSON.parse(userInfo).userId;
				utils.postRequest("/xxq/device/exp", {
					cid: cid,
					userId: userId
				}).then(res => {
					console.log(res)
					console.log("设备注销")
				})
				if (userRole == 1) {
					// that.logout(); // 退出goeasy链接
					// //关闭socket

					// var app = getApp();
					// if (app.globalData.consignorSocketTask) {
					// 	app.globalData.consignorSocketTask.close();
					// }
					uni.hideTabBarRedDot({
						index: 3
					})
					uni.removeStorageSync('userInfo');
					uni.removeStorageSync('driverInfo');
					uni.removeStorageSync('token');
					uni.removeStorageSync('driverVerify');
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login/login'
						});
					}, 1000);
				} else {
					that.logout(); // 退出goeasy链接
					var app = getApp();
					if (app.globalData.consignorSocketTask) {
						app.globalData.consignorSocketTask.close();
					}
					uni.removeStorageSync('userInfo');
					uni.removeStorageSync('driverInfo');
					uni.removeStorageSync('token');
					uni.removeStorageSync('driverVerify');
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login/login'
						});
					}, 1000);
				}
			},
			cancelOilBack() {
				this.$refs.oilPopup.close();
			},
			confirmOilBack() {
				var that = this;
				this.$refs.oilPopup.close();
				//修改手机号跳转人脸识别
				var plateForm = uni.getSystemInfoSync().platform;
				this.updateMobile = true;
				if (plateForm == "android") {
					this.scan();
				} else {
					var userName = that.name;
					var idNo = that.cardNum;
					uni.navigateTo({
						url: './face?type=updateMobile&userName=' + userName + '&idNo=' + idNo
					})
				}
			},
			confirmSwitchBack() {
				var that = this;
				this.$refs.mobilePopup.close();
				setTimeout(() => {
					that.$refs.oilPopup.open();
				}, 500)
				return;
				// this.changePageStep(1);
				//修改手机号跳转人脸识别
				//开始人脸认证
				var plateForm = uni.getSystemInfoSync().platform;
				this.updateMobile = true;
				if (plateForm == "android") {
					this.scan();
				} else {
					var userName = that.name;
					var idNo = that.cardNum;
					uni.navigateTo({
						url: './face?type=updateMobile&userName=' + userName + '&idNo=' + idNo
					})
				}

			},
			cancelSwitchBack() {
				this.$refs.mobilePopup.close()
			},

			showMsg() {
				var isEdit2 = this.isEdit2;
				var identityVerifyInfo = this.identityVerifyInfo;
				var arr = [];
				if (isEdit2) return "";
				if (identityVerifyInfo) {
					arr.push(identityVerifyInfo)
				}
				//根据证照缺失显示未认证信息
				var faceImageUrl = this.faceImageUrl;
				var backImage = this.backImage;
				if (!faceImageUrl) {
					arr.push("身份证主页未上传")
				}
				if (!backImage) {
					arr.push("身份证反页未上传")
				}
				return arr.join(",")

			},
			showStatus() {
				//认证状态
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					if (this.userInfo.attrs.faceVerify == 1 && this.userInfo.attrs.identityVerify == 1) {
						return '已认证';
					} else {
						return '未认证';
					}

				} else {
					if (this.userInfo.attrs.faceVerify == 1 && this.userInfo.attrs.identityVerify == 1) {
						return '已认证';
					} else {
						return '未认证';
					}
				}
			},
			showEditBtn() {
				if (this.pageStep == 1) {
					return true;
				} else {
					return false;
				}
			},
			getUserInfo() { // 货主状态 
				let that = this;
				utils.postRequest('/yh/user/get/face/result', {})
					.then(res => {
						console.log('获取人脸认证url', res);
						if (res.retCode == '0000000') {
							let faceVerify = res.rspBody;
							if (faceVerify) {
								var userRole = uni.getStorageSync("userRole");
								var identityVerify = that.userInfo.attrs.identityVerify;
								if (userRole == 1) {
									that.userInfo.attrs.faceVerify = 1;

									that.isEdit2 = false;


								} else {
									that.userInfo.attrs.faceVerify = 1;
									var identityVerify = that.userInfo.attrs.identityVerify;

									that.isEdit2 = false;

								}
								uni.setStorageSync('userInfo', JSON.stringify(that.userInfo));
								that.activity = 3;
								that.pageStep = 1;


							}
						}
					})
					.catch(err => {})
				uni.stopPullDownRefresh();
			},
			getIdentifyingDetails() { // 获取已认证的详情
				let that = this;
				var userRole = uni.getStorageSync("userRole");
				if (userRole == 1) {
					var userCode = that.userInfo.attrs.userCode;
				} else {
					var userCode = that.userInfo.attrs.userCode
				}

				// console.log('用户详细信息参数', params);
				utils.postRequest('/yh/user/verify/select/person/identity/info?userCode=' + userCode, {}, 'GET')
					.then(res => {
						console.log('用户详细信息', res);
						uni.hideLoading();
						if (res.retCode == "0000000") {
							var body = res.rspBody;
							that.name = body.userName ? body.userName : '';
							that.cardNum = body.idNo ? body.idNo : '';
							that.address = body.addr ? body.addr : '';
							that.faceImageUrl = body.idFrontImg ? body.idFrontImg : '';
							that.birthday = body.birth ? body.birth : '';
							that.gender = body.gender ? body.gender : '';
							that.dataFrom = body.userValidFrom ? body.userValidFrom : '';
							that.dataTo = body.userValidTo ? body.userValidTo : '';
							if (body.userValidTo && body.userValidTo == "长期") {
								this.isChooseLong = true
							}
							if (body.userName) {
								that.identityVerify = body.identityVerify;
								that.idStatus = body.idStatus;
								that.identityVerifyInfo = body.identityVerifyInfo;
								that.userInfo.attrs.identityVerify = body.identityVerify;
								that.userInfo.userName = that.name;
								that.userInfo.attrs.faceVerify = body.faceVerify;
								if (!body.identityVerify) {
									that.activity = 1
								} else if (!body.faceVerify) {
									that.activity = 2
								} else {
									that.activity = 3
								}



								getApp().globalData.defaultContact = {
									userName: that.name,
									mobile: that.userInfo.mobile,
								};
								uni.setStorageSync('userInfo', JSON.stringify(that.userInfo));
								console.log('更新后的用户信息', that.userInfo);
								that.$forceUpdate();
							} else {

								that.identityVerifyInfo = "";
							}

							that.backImage = body.idBackImg ? body.idBackImg : '';
							this.isEdit2 = false;
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						uni.hideLoading();
						console.log(err);
					})


			},
			cancel() {
				this.$refs.popup.close();
			},
			chooseFromPhoto() {
				let that = this;
				commonUtils.savePower(() => {
					that.checkFrom();
				})
			},
			checkFrom() {
				//安卓从相册选择
				var that = this;
				var photoType = that.photoType;
				that.$refs.popup.close();
				if (photoType == "front") {
					//身份证主页识别

					uni.chooseImage({
						count: 1, // 默认9  
						sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
						sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有  
						success: function(res) {
							console.log('选择的图片', res);
							console.log('选择的图片大小', res.tempFiles['0'].size);
							var tempFiles = res.tempFiles;
							var size = tempFiles[0].size;
							if (size - 1024*1024*2 > 0) {
								uni.showToast({
									title:"上传文件过大，请重新上传！",
									icon: 'none'
								})
								return;
							}
							var tempFilePaths = res.tempFilePaths
							that.uploadIdcard(tempFilePaths[0], 1);
						},
						fail: function(err) {
							console.log(err, 'asd')


						}
					})


				} else {
					//身份证副业识别

					uni.chooseImage({
						count: 1, // 默认9  
						sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
						sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有  
						success: function(res) {
							console.log('选择的图片', res);
							console.log('选择的图片大小', res.tempFiles['0'].size);
							var tempFiles = res.tempFiles;
							var size = tempFiles[0].size;
							if (size - 1024*1024*2 > 0) {
								uni.showToast({
									title:"上传文件过大，请重新上传！",
									icon: 'none'
								})
								return;
							}
							var tempFilePaths = res.tempFilePaths
							that.uploadIdcard(tempFilePaths[0], 2);
						},
						fail: function(err) {
							console.log(err, 'asd')


						}
					})


				}
			},
			sendPhotoPower() {
				let that = this;
				commonUtils.caramePower(() => {
					console.log("执行")
					that.sendPhoto();
				})
			},
			//安卓拍照
			sendPhoto() {
				var that = this;
				var platForm = uni.getSystemInfoSync().platform;
				that.$refs.popup.close();
				var photoType = that.photoType;
				if (photoType == "front") {
					if (platForm == "android") {
						//身份证主页识别
						PhotoModule.sendForCarema({
							type: 'front'
						}, res => {
							that.uploadIdcard(res.uri, 1);
						})
					} else {
						uni.chooseImage({
							count: 1, // 默认9  
							sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
							sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  
							success: function(res) {
								console.log('选择的图片', res);
								console.log('选择的图片大小', res.tempFiles['0'].size);
								var tempFiles = res.tempFiles;
								var size = tempFiles[0].size;
								if (size - 1024*1024*2 > 0) {
									uni.showToast({
										title:"上传文件过大，请重新上传！",
										icon: 'none'
									})
									return;
								}
								var tempFilePaths = res.tempFilePaths
								that.uploadIdcard(tempFilePaths[0], 1);
							},
							fail: function(err) {
								console.log(err, 'asd')


							}
						})
					}

				} else {
					//身份证副业识别
					if (platForm == "android") {
						PhotoModule.sendForCarema({
							type: 'back'
						}, res => {
							that.uploadIdcard(res.uri, 2);
						})
					} else {
						uni.chooseImage({
							count: 1, // 默认9  
							sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
							sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  
							success: function(res) {
								console.log('选择的图片', res);
								console.log('选择的图片大小', res.tempFiles['0'].size);
								var tempFiles = res.tempFiles;
								var size = tempFiles[0].size;
								if (size - 1024*1024*2 > 0) {
									uni.showToast({
										title:"上传文件过大，请重新上传！",
										icon: 'none'
									})
									return;
								}
								var tempFilePaths = res.tempFilePaths
								that.uploadIdcard(tempFilePaths[0], 2);
							},
							fail: function(err) {
								console.log(err, 'asd')


							}
						})
					}

				}
			},
			faceSelect(flag) {
				var that = this;
				if (!this.isEdit2) {
					//预览
					var urlArr = [];
					if (flag == 1) {
						urlArr.push(that.faceImageUrl)
					} else {
						urlArr.push(that.backImage)
					}
					uni.previewImage({
						current: 1, //预览图片的下标
						urls: urlArr //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
					})
					return;
				};
				var that = this;
				if (flag == 1) {
					this.photoType = "front";
				} else {
					this.photoType = "back";
				}
				that.$refs.popup.open();
			},
			uploadIdcard: function(image, flag) {
				var url = flag == 1 ? '/baidu/ocr/v1/user/front' : '/baidu/ocr/v1/user/back';
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				let params = {
					'file': image
				};
				console.log('身份证参数', params)
				utils.upLoadFile(url, image, params)
					.then(res => {
						console.log('身份证信息', res)
						uni.hideLoading();
						if (res.retCode == "0000000") {
							var body = res.rspBody;
							if (flag == 1) {
								//身份证正面
								that.name = body.name ? body.name : '';
								that.cardNum = body.idNo ? body.idNo : '';
								that.address = body.addr ? body.addr : '';
								that.faceImageUrl = body.image ? body.image : '';
								that.birthday = body.birthday ? body.birthday : '';
								that.gender = body.gender ? body.gender : '';
							} else if (flag == 2) {
								//身份证副页
								that.dataFrom = body.validFrom ? body.validFrom : '';
								that.dataTo = body.validTo ? body.validTo : '';
								that.backImage = body.image ? body.image : '';
							}
							that.$forceUpdate();
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}

					}).catch(err => {
						console.log(err);
						uni.hideLoading();
						uni.showToast({
							title: '未识别出有效信息，请重试',
							icon: 'none'
						})
					})


			},
			changeStatus(flag) {
				this.activity = this.activity == flag ? this.activity : flag;
			},
			confirmBack2() {
				this.$refs.backPopup2.close();
				uni.navigateBack({
					delta: this.pageFromNewUsers ? 2 : 1
				})
			},
			cancelBack2() {
				this.$refs.backPopup2.close();
			},
			mobileUp() {
				//修改手机号

				uni.showLoading({
					title: '请稍候...',
				})
				let that = this;
				var userRole = uni.getStorageSync("userRole");
				console.log(that.userInfo, 'aaa');
				var url = "";
				if (userRole == 1) {
					var params = {
						id: that.userInfo.attrs.personId,
						userId: that.userInfo.userId,
						idFrontImg: that.faceImageUrl,
						idBackImg: that.backImage,
						userValidFrom: that.dataFrom,
						userValidTo: that.dataTo,
						idAddress: that.address,
						addr: that.address,
						idNo: that.cardNum,
						userName: that.name,
						birthday: that.birthday,
						gender: that.gender,
						userCode: that.userInfo.attrs.userCode,
					}
					url = "/yh/person/identity/upload"
				} else {
					var params = {
						id: that.userInfo.attrs.personId,
						userId: that.userInfo.userId,
						idFrontImg: that.faceImageUrl,
						idBackImg: that.backImage,
						userValidFrom: that.dataFrom,
						userValidTo: that.dataTo,
						idAddress: that.address,
						addr: that.address,
						idNo: that.cardNum,
						userName: that.name,
						birthday: that.birthday,
						gender: that.gender,
						userCode: that.userInfo.attrs.userCode,
					}
					url = "/yh/person/authorization/of/identity"
				}

				params.updatePhoneFlag = 1;


				console.log('修改手机号成功', url, params);
				utils.postRequest(url, params)
					.then(res => {
						console.log('修改手机号成功', res);
						uni.hideLoading();
						that.updateMobile = false;
						if (res.retCode == "0000000") {
							if (userRole == 1) {
								that.userInfo.attrs.identityVerify = 1;
								that.userInfo.attrs.identityVerify = 1;
								that.userInfo.userName = that.name;
								that.toChangeGoEasyStatus(that.userInfo);
							} else {
								that.userInfo.attrs.identityVerify = 1;
								that.userInfo.userName = that.name;
								that.toChangeGoEasyStatus(that.userInfo);
							}

							getApp().globalData.defaultContact = {
								userName: that.name,
								mobile: that.userInfo.mobile,
							};
							uni.setStorageSync('userInfo', JSON.stringify(that.userInfo));
							uni.showToast({
								title: '修改成功',
								icon: 'none'
							})
							that.getIdentifyingDetails();
							that.isDetail = true;
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						that.updateMobile = false;
						uni.hideLoading();
						console.log(err);
					})




			},
			saveInfo(type) {
				uni.showLoading({
					title: '请稍候...',
				})
				let that = this;
				var userRole = uni.getStorageSync("userRole");
				console.log(that.userInfo, 'aaa');
				var url = "";
				if (userRole == 1) {
					var params = {
						id: that.userInfo.attrs.personId,
						userId: that.userInfo.userId,
						idFrontImg: that.faceImageUrl,
						idBackImg: that.backImage,
						userValidFrom: that.dataFrom,
						userValidTo: that.dataTo,
						idAddress: that.address,
						addr: that.address,
						idNo: that.cardNum,
						userName: that.name,
						birthday: that.birthday,
						gender: that.gender,
						userCode: that.userInfo.attrs.userCode,
					}
					url = "/yh/person/identity/upload"
				} else {
					var params = {
						id: that.userInfo.attrs.personId,
						userId: that.userInfo.userId,
						idFrontImg: that.faceImageUrl,
						idBackImg: that.backImage,
						userValidFrom: that.dataFrom,
						userValidTo: that.dataTo,
						idAddress: that.address,
						addr: that.address,
						idNo: that.cardNum,
						userName: that.name,
						birthday: that.birthday,
						gender: that.gender,
						userCode: that.userInfo.attrs.userCode,
					}
					url = "/yh/person/authorization/of/identity"
				}
				
				params.updatePhoneFlag = type ? type : 0;
				
				
				console.log('认证信息', url, params);
				utils.postRequest(url, params)
					.then(res => {
						console.log('认证信息保存', res);
						that.isClickSave = true;
						uni.hideLoading();
						if (res.retCode == "0000000") {
							if (userRole == 1) {
								that.userInfo.attrs.identityVerify = 1;
								that.userInfo.attrs.idNo = that.cardNum;
								that.userInfo.userName = that.name;
								that.toChangeGoEasyStatus(that.userInfo);
							} else {
								that.userInfo.attrs.identityVerify = 1;
								that.userInfo.attrs.idNo = that.cardNum;
								that.userInfo.userName = that.name;
								that.toChangeGoEasyStatus(that.userInfo);
							}
				
							getApp().globalData.defaultContact = {
								userName: that.name,
								mobile: that.userInfo.mobile,
							};
							uni.setStorageSync('userInfo', JSON.stringify(that.userInfo));
							if (that.userInfo.attrs.faceVerify == 1) {
				
								setTimeout(() => {
									uni.showToast({
										title: '保存成功',
										icon: 'success'
									})
								}, 100)
				
							} else {
								that.activity = 2;
								that.pageStep = 2;
							}
							that.getIdentifyingDetails();
							that.isDetail = true;
						} else {
				
							if (res.retCode == "100002") {
								//修改手机号
								var willUpPhone = res.rspBody.phone;
								if (willUpPhone) {
									that.willUpPhone = willUpPhone.substr(0, 3) + '****' + willUpPhone.substr(-4);
									that.willAtUpPhone = willUpPhone.substr(-4);
								}
								that.$refs.mobilePopup.open();
							} else {
								that.isDetail = true;
								that.getIdentifyingDetails();
							}
				
						}
					})
					.catch(err => {
						uni.hideLoading();
						console.log(err);
					})
			},
			changePageStep(type) {
				let that = this;
				if (this.userInfo.attrs.identityVerify && this.userInfo.attrs.faceVerify != 1) {
					this.activity = 2;
					this.pageStep = 2;
					return;
				}
				if (!this.isEdit2) {
					this.isEdit2 = true;
					return
				}
				var str = []
				if (!this.faceImageUrl) {
					str.push("身份证主页")
				}
				if (!this.backImage) {
					str.push("身份证副页")
				}

				if (!this.name) {
					str.push("姓名")
				}
				if (!this.cardNum) {
					str.push("身份证号")
				}
				if (!this.address) {
					str.push("地址")
				}
				if (!this.dataFrom) {
					str.push("有效期起")
				}
				if (!this.dataTo) {
					str.push("有效期止")
				}
				if (str.length > 0) {
					str = str.join(',');
					uni.showToast({
						title: '您还有' + str + '字段未填写，请补充。',
						icon: 'none',
						duration: 4000
					})
					return;
				}
				if (this.isUpDateEnd) {
					uni.showModal({
						content: '身份证有效期不可用，请修改!',
						confirmText: "继续保存",
						cancelText: '去修改',
						success:function(res) {
							if (res.confirm) {
								that.saveInfo(type);
							}
						}
					})
					return;
				}

				var dataFrom = this.dataFrom;
				var dataTo = this.dataTo;
				dataFrom = dataFrom.replace(/-/g, "/");
				dataTo = dataTo.replace(/-/g, "/");

				var dataToStr = new Date(dataTo).getTime();
				var dataFromStr = new Date(dataFrom).getTime();
				if (dataFromStr > dataToStr) {
					uni.showToast({
						title: '起始日期不能超过截止日期',
						icon: 'none',
						duration: 3000
					})
					return;
				}
				this.saveInfo(type);
			},
			toChangeGoEasyStatus(userInfo) {
				if (!userInfo) return;
				if (this.goEasy.getConnectionStatus() == 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy, this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
					uni.$emit("refreshData_message"); // 更新会话列表，并重新订阅群聊
				} else {
					this.logout();
				}

			},
			logout() { // 进入登录页需先退出断开goEasy链接
				let im = this.goEasy;
				let that = this;
				if (im.getConnectionStatus() == 'disconnected') {

				} else {
					im.disconnect({
						onSuccess: function() {
							console.log('断连成功')
							getApp().globalData.imService = null;
							that.toChangeGoEasyStatus();
						},
						onFailed: function(error) {
							uni.showToast({
								title: '断连失败'
							})
						}
					});
				}


			},
			getFaceUrl() { // 获取人脸认证url
				if (!utils.btnRepeat()) return false; // 防抖
				if (!this.isAgree) {
					uni.showToast({
						title: '请同意身份核验协议',
						icon: 'none',
					})
					return false;
				};
				// let that = this;
				//开始人脸认证
				var plateForm = uni.getSystemInfoSync().platform;
				if (plateForm == "android") {
					this.scan();
				} else {
					uni.navigateTo({
						url: './face'
					})
				}
				// uni.showLoading({
				// 	title: '人脸识别启动中',
				// 	mask: true

				// })
				// setTimeout(() => {
				// 	uni.hideLoading();
				// 	uni.navigateTo({
				// 		url: 'face',
				// 		success: function(res){
				// 		},
				// 		fail: function(error){
				// 		    uni.showToast({
				// 		    	title: error,
				// 		    	icon: 'none',
				// 		    })
				// 		}
				// 	})
				// }, 1000)
			},
			//安卓人脸识别
			scan() {
				let that = this;
				// 调用插件开始采集人脸
				bdFaceLive.liveFace({
					liveRandom: true, // 选填【动作是否随机】，默认有序，false：有序|true：随机
					sound: 0, // 选填【是否有声】，默认有声，0：有声|1：无声
					camera: 0, // 选填【前置|后置摄像头】，默认前置，0：前置|1：后置
					openMask: true, // 选填【是否开启戴口罩采集】，默认false不开启
					hintTextColor: '#333333', // 选填【提示文字颜色】，默认#333333
					backgroundColor: '#FFFFFF',
				}, result => {
					console.log(result, 'renliande1212')
					that.doResult(result);
				})

			},
			doResult(result) {
				//安卓处理结果
				var that = this;
				console.log(result, '认证结果11');
				console.log(result.code, '认证的状态');
				console.log(result.base64ImageResult, 'base64ImageResult认证');
				console.log(result.otherBase64Image, 'otherBase64Image认证');

				switch (result.code) {
					case 1: // 人脸采集成功
						uni.showLoading({
							title: '人脸识别中...'
						})
						let userInfo = JSON.parse(uni.getStorageSync("userInfo"));
						let userCode = userInfo.attrs.userCode
						let data = {
							frontImage: result.base64ImageResult,
							userCode: userCode,
							sideImage: result.otherBase64Image
						}

						var updateMobile = that.updateMobile;
						var willUpPhone = that.willUpPhone;
						var url = '';
						if (updateMobile) {
							data.userName = that.name;
							data.idNo = that.cardNum;
							url = "/yh/person/doing/face/verify/by/baidu/no_check"
						} else {
							url = '/yh/person/doing/face/verify/by/baidu'
						}

						console.log(data, 'ocr人脸');

						utils.postRequest(url, data).then(faceRes => {
							console.log(faceRes, '返回值')
							uni.hideLoading();
							if (faceRes.retCode == "0000000") {
								console.log(faceRes, "认证成功")
								// uni.showToast({
								// 	title: '认证成功',
								// 	icon: 'success',
								// 	duration: 3000,
								// })
								//认证成功后修改手机号
								var updateMobile = that.updateMobile;
								var willUpPhone = that.willUpPhone;
								if (updateMobile) {
									that.mobileUp();
									return;
								}

								uni.navigateTo({
									url: './faceResult?type=success&msg=认证成功'
								})

								var userInfo = JSON.parse(uni.getStorageSync("userInfo"));
								var userRole = uni.getStorageSync("userRole");
								console.log(userInfo, userRole, 'aaa');
								if (userRole == 1) {
									if (userInfo) {
										userInfo.attrs.faceVerify = 1;
										uni.setStorageSync('userInfo', JSON.stringify(userInfo))
									}
								} else {
									if (userInfo) {
										userInfo.attrs.faceVerify = 1;
										uni.setStorageSync('userInfo', JSON.stringify(userInfo))
									}
								}
								//刷新当前页面
								that.getUserInfo();

							} else {
								console.log(faceRes, "认证失败")
								that.getFaceResult(0, faceRes.retDesc)
							}
						})

						return
				}
			},
			//获取人脸识别认证结果
			getFaceResult(status, msg = "") {
				this.pageStep = 1;
				if (status == 1) {
					var userInfo = uni.getStorageSync("userInfo");
					var userRole = uni.getStorageSync("userRole");
					console.log(userInfo, userRole, 'aaa');
					if (userRole == 1) {
						if (userInfo) {
							var userInfo1 = JSON.parse(userInfo);
							userInfo1.attrs.faceVerify = 1;
							this.userInfo.attrs.faceVerify = 1;
							uni.setStorageSync(userInfo, JSON.stringify(userInfo1))
						}

					} else {
						if (userInfo) {
							var userInfo1 = JSON.parse(userInfo);
							userInfo1.attrs.faceVerify = 1;
							this.userInfo.attrs.faceVerify = 1;
							uni.setStorageSync(userInfo, JSON.stringify(userInfo1))
						}
					}
					this.identifyStatus = true;
					this.activity = 3;
					setTimeout(() => {
						uni.showToast({
							title: '认证成功',
							icon: 'success',
						})
					}, 1000)
				} else {
					var platform = uni.getSystemInfoSync().platform;
					if (platform == 'android') {
						uni.navigateTo({
							url: './faceResult?type=error&msg=' + msg
						})
					}

				}
			},
			backToCenter() {
				if (this.userRole == 1) {
					uni.switchTab({
						url: '/pages/my/index/index'
					})
				} else {
					uni.switchTab({
						url: '../userCenter'
					})
				}
			},
			jumpToDigitalCertificate() {
				uni.navigateTo({
					url: '../../../allAgreement/digitalCertificate'
				})
			},
			showKeyBoard() {
				this.$refs.keyboardPopup.open();
			},
			changeDateTo(e) {
				console.log(e)
				this.dataTo = e.detail.value;
				this.$forceUpdate();
			},
			bindChange(e) {
				console.log("e", e);
				const val = e.detail.value
				var year = this.years[val[0]]
				var month = this.months[val[1]]
				var day = this.days[val[2]]
				this.year = year;
				this.month = month;
				this.day = day;
				this.isChooseLong = false;
				this.dateValue = val;
				this.$forceUpdate();
			},
			changeDateFrom(e) {
				console.log(e)
				this.dataFrom = e.detail.value
				this.$forceUpdate();
			},
			showDatePop() {
				this.$refs.datePopup.open();
			},
			chooseLong() {
				this.isChooseLong = !this.isChooseLong;
			},
			cancelTo() {
				this.$refs.datePopup.close()
			},
			confirmTo() {
				this.$refs.datePopup.close()
				var isChooseLong = this.isChooseLong;
				if (isChooseLong) {
					this.dataTo = "长期" 
				} else {
					this.dataTo = this.year + '-' + this.month + '-' + this.day
				}
				console.log("day", this.day, this.dataTo);
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss">
	.identifyingUsers {
		background-color: #f8f8f8;
		min-height: 100vh;
		padding-bottom: 200rpx;
		box-sizing: border-box;

		.alertUp {
			width: 508rpx;
			height: 504rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			.photo-content {
				height: 100rpx;
				font-size: 26rpx;
				padding: 20rpx
				
			}
			.alertTitle {
				font-size: 32rpx;
				color: #000000;
				font-weight: 500;
				margin: 24rpx 0 14rpx;
			}

			.exp_id_1 {
				width: 260rpx;
				height: 166rpx;
				margin-bottom: 24rpx;
			}

			.exp_id_2 {
				width: 438rpx;
				height: 106rpx;
			}
		}

		.step-1 {
			background-color: #FFFFFF;
		}

		.mobilePopup {
			width: 568rpx;
			height: 300rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #FFFFFF;
			border-radius: 24rpx;

			.mobile-title {
				font-size: 48rpx;
				color: #333333;
				font-weight: 600;
				margin: 56rpx 0 32rpx;
			}

			.cont {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				line-height: 33rpx;
				color: #666666;
				padding: 0 28rpx;
				text-align: center;
			}

			.optItem {
				height: 74rpx;
				color: #4EADF1;
				font-weight: 500;
				font-size: 28rpx;
				border-bottom: 1px solid #DFDFDF;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 568rpx;

				&:last-child {
					border: none
				}
			}


		}

		.backPopup {
			width: 480rpx;
			height: 282rpx;
			display: flex;
			flex-direction: column;
			background-color: #FFFFFF;
			border-radius: 24rpx;

			.cont {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				font-weight: 500;
				padding: 0 40rpx;

			}

			.optbtn {
				border-top: 1px solid #F1F1F1;
				display: flex;
				flex-direction: row;
				height: 90rpx;

				.opt {
					flex: 1;
					font-size: 28rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					&.confirm {
						color: #B2B2B2;
					}

					&.cancel {
						color: #4EADF1;
						border-right: 1px solid #F1F1F1;
					}
				}
			}

		}

		.line-left {
			width: 0;
			height: 0;
			border-top: 70rpx solid red;
			border-right: 70rpx solid transparent;
		}

		.line-right {
			width: 0;
			height: 0;
			border-bottom: 70rpx solid red;
			border-left: 70rpx solid transparent;
			margin-left: -66rpx;
		}

		.testBtnGroup {
			padding: 120rpx 32rpx 0 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.changeStatusBtn {
				padding: 0 20rpx;
				border-radius: 12rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: #4AA2F3;
				color: #FFF;
				font-size: 24rpx;
				margin-right: 32rpx;
			}
		}

		.statusCss1 {
			background: #8AC8F4;
			text-align: center;
		}

		.statusCss2 {
			background: #8AC8F4;
		}

		.statusCss3 {
			background: #4EADF1;
		}

		.lineLeftStatusCss2 {
			border-top-color: #8AC8F4;
		}

		.lineLeftStatusCss3 {
			border-top-color: #4EADF1;
		}

		.lineRightStatusCss1 {
			border-bottom-color: #8AC8F4;
		}

		.lineRightStatusCss2 {
			border-bottom-color: #8AC8F4;
		}

		.lineRightStatusCss3 {
			border-bottom-color: #4EADF1;
		}

		.certificationStatus {
			display: flex;
			align-items: center;

			.statusBox {
				flex: 1;
				height: 70rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.statusMsg {
					padding: 0 0 0 100rpx;
					font-size: 28rpx;
				}

				.statusIcon {
					width: 24rpx;
					height: 24rpx;
					margin-right: 32rpx;
				}
			}
		}

		.line {
			height: 12rpx;
			background-color: #F8F8F8;
			width: 100vw;
		}

		.imageUploadBox {
			padding: 38rpx 48rpx;
			display: flex;
			justify-content: space-between;

			.idCardImg {
				width: 308rpx;
				height: 182rpx;
				border: 2rpx dashed #E9EDF5;
				background-repeat: no-repeat;
				background-size: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.upLoadHint {
					font-size: 28rpx;
					color: #000;
					text-align: center;
					line-height: 40rpx;
					font-weight: 500;
				}

				.addImage {
					width: 48rpx;
					height: 48rpx;
				}

				.img {
					width: 308rpx;
					height: 182rpx;
				}
			}
		}

		.inputBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12rpx 36rpx;
			box-sizing: border-box;

			.title {
				font-size: 32rpx;
				color: #666;

				.red {
					color: #FF0000;
					font-weight: 500;
				}
			}

			.msgInput {
				height: 80rpx;
				width: calc(100vw - 300rpx);
				padding-right: 16rpx;
				height: 80rpx;
				text-align: right;
				font-size: 32rpx;
				color: #666666;
				font-weight: 500;
				transition: all .3s ease-in;
				border-radius: 12rpx;

				&.edit {
					background-color: #F8F8F8;
				}

				&.errorRed {
					color: red;
				}

				.uni-input {
					height: 80rpx;
					line-height: 80rpx;
				}

				.defaultVal {
					color: #999999;
					font-weight: 400;
				}
			}
		}

		.nextStepBtn {
			position: absolute;
			bottom: 138rpx;
			left: 135rpx;
			width: 480rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 16rpx;
			background-color: rgba(151, 181, 255, 1);
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;

			&.active {
				background-color: #5283FF;
			}

			&.noEdit {
				background-color: #FC5C06;
			}
		}

		.identifyTitle {
			padding: 92rpx 0 24rpx 64rpx;
			font-size: 28rpx;
			color: #777777;
			display: flex;
			align-items: center;

			.identifyLogo {
				width: 48rpx;
				height: 48rpx;
				margin-right: 20rpx;
			}
		}

		.identifyHint {
			font-size: 44rpx;
			font-weight: 500;
			color: #333333;
			line-height: 60rpx;
			padding-left: 64rpx;
		}

		.identifyBtnGroup {
			position: absolute;
			bottom: 24rpx;
			padding: 0 58rpx;
			width: 634rpx;

			.agreementBox {
				padding: 0 30rpx 44rpx 30rpx;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;

				.agreeBtn {
					width: 32rpx;
					height: 32rpx;
					border: 2rpx solid #C2C2C9;
					border-radius: 100%;
				}

				.agreeBtnIcon {
					width: 36rpx;
					height: 36rpx;
				}

				.agreeMsg {
					flex: 1;
					padding-left: 24rpx;
					font-size: 26rpx;
					color: #777777;
					line-height: 36rpx;

					.agreeDetails {
						font-size: 26rpx;
						color: #4AA2F3;
					}
				}
			}

			.startBtn {
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 44rpx;
				background-color: #4AA2F3;
				box-shadow: 0px 4rpx 8rpx 0px rgba(38, 158, 255, 0.5);
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
		}

		.identifyStatusIcon {
			width: 88rpx;
			height: 88rpx;
			display: block;
			margin: 160rpx auto 56rpx auto;
		}

		.identifyStatusMsg {
			padding: 0 56rpx;
			text-align: center;
			font-size: 40rpx;
			font-weight: 500;
			color: #333333;
		}

		.keyboardPopupBox {
			background-color: #FFF;
			display: flex;

			.keyCol+.keyCol {
				border-left: 2rpx solid #C2C2C9;
			}

			.keyCol {
				flex: 0 0 25%;
				display: flex;
				flex-direction: column;

				.keyRow {
					border-bottom: 2rpx solid #C2C2C9;
					height: 120rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.keyBoardDelete {
					border-bottom: 2rpx solid #C2C2C9;
					height: 240rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					.deleteIcon {
						width: 32rpx;
						height: 32rpx;
					}
				}

				.keyBoardConfirm {
					border-bottom: 2rpx solid #C2C2C9;
					height: 240rpx;
					line-height: 240rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #4AA2F3;
				}
			}
		}

		.datePopUp {
			width: 100vw;
			height: 550rpx;
			display: flex;
			flex-direction: column;
			background-color: #ffffff;
			border-radius: 12rpx 12rpx 0 0;

			.opt {
				width: 100vw;
				padding: 0 36rpx;
				height: 100rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.item {
					font-size: 32rpx;

					&.cancel {
						color: #666;
					}

					&.confirm {
						color: #5283FF;
					}
				}
			}
			.cont {
				width: calc(100vw - 72rpx);
				height: 84rpx;
				border-radius: 8rpx;
				color: #464646;
				margin: 10rpx 36rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				box-shadow: 0 0 16rpx 2rpx rgba(67,150,248,0.28);
				background-color: #FFF;
				&.active {
					background-color: #4396F8;
					color: #ffffff;
				}
			}
			.picker-view {
				width: 750rpx;
				flex: 1;
				margin-top: 20rpx;
			}
			.picker-item {
				height: 40px;
				line-height: 40px;
				text-align: center;
			}
		}
	}

	.error {
		color: red;
		padding-top: 20rpx;
		padding-left: 20rpx;
	}

	.tips-title {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		padding-left: 36rpx;
		color: #000000;
		font-size: 44rpx;
		font-weight: 500;
	}

	.optAlertItem {
		z-index: 9999;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
		background-color: #FFFFFF;
		border-radius: 23rpx 24rpx 0 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.alertLine {
			height: 2rpx;
			background-color: #EDEDED;
			width: 100vw;

			&.cancel {
				height: 12rpx;
				background-color: #F8F8F8;
			}
		}

		.alertItem {
			width: 100vw;
			height: 110rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #333333;
			font-size: 32rpx;
			font-weight: 500;
		}

	}

	.backPopup1 {
		width: 618rpx;
		height: 416rpx;
		padding-bottom: 48rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 24rpx;
		background-color: #FFFFFF;
		box-sizing: border-box;

		.backTitle1 {
			font-weight: 500;
			color: #000000;
			font-size: 44rpx;
			padding-top: 48rpx;
			text-align: center;
		}

		.cont1 {
			width: 424rpx;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			font-size: 36rpx;
			color: #000000;
			line-height: 48rpx;
		}

		.optbtn1 {
			display: flex;
			flex-direction: row;
			height: 80rpx;

			.opt1 {
				flex: 1;
				font-size: 32rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 16rpx;
				font-weight: 500;

				&.confirm1 {
					color: #ffffff;
					width: 270rpx;
					background-color: rgba(252, 92, 6, 1);
					margin-left: 44rpx;
				}

				&.cancel1 {
					width: 208rpx;
					background-color: rgba(200, 200, 200, 1);
					color: #ffffff;
				}
			}
		}

	}

	.info-status {
		text-align: right;
		padding: 18rpx 50rpx 0;
		box-sizing: border-box;
		color: #EB6464;
		font-weight: 600;
		font-size: 28rpx;
		line-height: 38rpx;

		&.active {
			color: #56B836;
		}

		.recognize {
			width: 28rpx;
			height: 28rpx;
			margin-right: 10rpx;
			display: inline-block;
			vertical-align: middle;
			margin-bottom: 10rpx;
		}
	}

	.mobilePopup-opt {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
		border-radius: 24rpx 24rpx 0 0;
		background-color: #FFF;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.optItem {
			height: 110rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			font-weight: 500;

			&.one {
				color: #FC5C06;
			}

			&.two {
				color: #5283FF;
			}

			&.cancel {
				color: #333333;
			}
		}

		.optLine {
			height: 1rpx;
			background-color: #EDEDED;
			width: 100vw;
		}

		.optLine2 {
			height: 12rpx;
			background-color: #F8F8F8;
			width: 100vw;
		}
	}
</style>
