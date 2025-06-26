<template>
	<view class="container">
		<!--   <image
      class="propaganda_img"
      src="../../../static/images/propagandaImg.png"
    ></image> -->
		<view class="content_con">
			<view class="content_item">
				<view class="content-box">
					<view class="content-name">
						<view>名称<text>*</text></view>
					</view>
					<input class="input-box" placeholder-class="placeholder-class" type="text" maxlength="15"
						:value="providerName" @input="inputName" placeholder="请输入" />
				</view>
				<view class="content-box">
					<view class="content-name">
						<view class="">位置<text>*</text></view>
					</view>
					<view :class="['input-box', !address ? 'placeholder-class' : '']" @click="chooseLocation">
						{{ address ? address : "请选择地址或点击定位" }}</view>
					<view class="address" @click="getLocation(1)">
						<image mode="widthFix" class="screen-img" src="../../../static/images/uploadReport/Vector.png">
						</image>
						<view class="add_text">定位</view>
					</view>
				</view>
				<view class="content-box" v-if="userRole ==2">
					<view class="content-name">
						<view>类别<text>*</text></view>
					</view>
					<view class="select_item" v-for="(item,index) in labelArr" :class="item.id == categoryId ? 'avtive_item' : ''" @click="category(item)">{{item.typeName}}
					</view>
					<!-- <view class="lable-box">
						<view :class="[categoryId==item.id?'lable-select-child':'lable-child']" v-for="(item, index) in labelArr" @click="category(item)">{{item.typeName}}</view>
					</view> -->
					
					<!-- <view class="select_item" :class="labelId == 5 ? 'avtive_item' : ''" style="margin-left: 26rpx"
						@click="selectClass(5)">停车场</view> -->
				</view>
				<view class="content-box" v-else>
					<view class="content-name">
						<view>类别<text>*</text></view>
					</view>
					
					<view class="lable-box">
									<view :class="[labelId==item.id?'lable-select-child':'lable-child']" v-for="(item, index) in labelArr" @click="labelEvent(item)">{{item.typeName}}</view>
								</view>

						<!-- <view class="select_item" :class="labelId == 2 ? 'avtive_item' : ''" style="margin-left: 26rpx"
							@click="selectClass(2)">维修点</view> 
						<view class="select_item" :class="labelId == 5 ? 'avtive_item' : ''" style="margin-left: 26rpx"
							@click="selectClass(5)">停车场</view> -->
					
					
				</view>
				
				<view class="content-box" v-if="labelChild.length>0">
					<view class="content-name">
						<view style="width: 140rpx;">所属标签<text>*</text></view>
					</view>
					<view class="lable-box">
						<view :class="[item.isSelect==true?'lable-select-child':'lable-child']" v-for="(item, index) in labelChild" @click="labelSelectEvent(index)">{{item.labelName}}</view>
					</view>
				</view>


				<view class="content-box">
					<view class="content-name">
						<view>物流线路<text>*</text></view>
					</view>
					<input class="input-box" placeholder-class="placeholder-class" type="text" maxlength="15"
						:value="routeDetail" @input="inputName2" placeholder="请输入" />
				</view>

				<view class="content-box" style="align-items: flex-start">
					<view class="content-name">
						<view>站点照片<text>*</text></view>
					</view>
					<view class="photo_list">
						<view class="photo_item" v-for="(item, index) in imagesArr" :key="index"
							style="margin-right: 18rpx; margin-bottom: 18rpx">
							<image class="select_img" :src="item.url" @click="previewImage(item.url)"></image>
							<image class="cancel_img" src="/static/images/newCancel.png" @click="cancelEvent(index,'1')">
							</image>
						</view>
						<view class="photo_item" v-if="imagesArr.length < 4" @click="chooseImage('1')">
							<image class="defalut_img" src="../../../static/images/uploadReport/defalut.png"></image>
							<view class="add_box">
								<image src="../../../static/images/uploadReport/add.png"></image>
								<view style="white-space: nowrap;">上传照片</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="content-box" style="align-items: flex-start">
					<view class="content-name">
						<view>营业执照</view>
					</view>
					<view class="photo_list">
						<view class="photo_item" v-for="(item, index) in imagesArr2" :key="index"
							style="margin-right: 18rpx; margin-bottom: 18rpx">
							<image class="select_img" :src="item.url" @click="previewImage(item.url)"></image>
							<image class="cancel_img" src="/static/images/newCancel.png" @click="cancelEvent(index,'2')">
							</image>
						</view>
						<view class="photo_item" v-if="imagesArr2.length < 1" @click="chooseImage('2')">
							<image class="defalut_img" src="../../../static/images/uploadReport/defalut.png"></image>
							<view class="add_box">
								<image src="../../../static/images/uploadReport/add.png"></image>
								<view style="white-space: nowrap;">上传照片</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="content-box">
					<view class="content-name">
						<view>联系人<text>*</text></view>
					</view>
					<input class="input-box" placeholder-class="placeholder-class" type="text" maxlength="10"
						:value="concatName" @input="inputContact" placeholder="请输入" />
				</view>
				<view class="content-box" style="border: 0">
					<view class="content-name">
						<view>联系电话<text>*</text></view>
					</view>
					<input class="input-box" placeholder-class="placeholder-class" maxlength="11" type="number"
						:value="concatPhone" @input="inputConcatPhone" placeholder="请输入" />
				</view>
				<view class="submit_btn" @click="reverseGeocoder"> 确定 </view>
			</view>
			<!-- <view class="add_wx" @click="showWxCode">
        <view style="margin-top: -15rpx">扫描二维码添加专属客服</view>
        <view style="margin-top: -15rpx">去了解 ></view>
      </view>
      <view class="content_item">
        <image
          class="money_img"
          src="../../../static/images/uploadReport/money.png"
        ></image>
        <view class="top_title">现金奖励</view>
        <image
          class="goldCoins"
          src="../../../static/images/uploadReport/goldCoins.png"
        ></image>

        <view class="content_text" style="margin-top: 44rpx">
          卡友分享站点信息，经过平台审核确认站点信息合格，即可获得平台现金奖励：
        </view>
        <view class="content_text_red"
          >上传1-5个站点，每个奖金<text>20</text>元
        </view>
        <view class="content_text_red"
          >上传6个及以上站点，每个奖金<text>10</text>元
        </view>
        <view class="content_text">注: </view>
        <view class="content_text">
          1、卡友分享站点信息，经过平台审核确认站点信息
          合格，即可获得平台现金奖励；</view
        >
        <view class="content_text" style="margin-bottom: 30rpx">
          2、现金奖励：3日内转入卡友货运中国APP钱包账
          户，可绑定个人微信进行提现；
        </view>
      </view>
      <view class="content_item" style="margin-top: 74rpx">
        <view class="top_title" style="width: 544rpx"
          >货运中国首届“站点上传”活动</view
        >
        <image
          class="people_img"
          src="../../../static/images/uploadReport/people.png"
        ></image>
        <view
          class="content_text"
          style="margin-top: 44rpx; margin-bottom: 30rpx"
        >
          作为卡车司机，停车场、维修点是我们每位卡友都 比较熟悉的地方。<br />
          开车累了，就近找个停车场休息休息；<br />
          遇到故障了，去附近的维修点处理一下；<br />
          或是给维修点打个电话，师傅上门服务。<br />
          快来将你们知道的停车场、维修点分享给更多的<br />卡友，帮助卡友们在遇到问题时以备不时之需。<br />货运中国诚邀各位卡友，上传各地停车场、维修<br />点，满足平台标准，将获得现金奖励、荣誉奖励、积<br />分奖励等多重奖励！
        </view>
      </view>
      <view class="content_item" style="margin-top: 74rpx">
        <view class="top_title" style="width: 544rpx"
          >活动时间-2022年3月1日至12月31日</view
        >
        <view
          class="content_text"
          style="margin-top: 44rpx; margin-bottom: 30rpx; text-align: center"
        >
          参与方式：在货运中国APP“服务”板块，上传停车<br />
          场、维修点，经审核达标后，直接发放现金奖励；荣<br />誉奖励、积分奖励待达标后发放；<br />参与用户：货运中国完成三项认证的卡友；
        </view>
      </view>
      <view class="content_item" style="margin-top: 74rpx">
        <view class="top_title" style="width: 270rpx">合格标准</view>
        <view
          class="content_text"
          style="margin-top: 44rpx; margin-bottom: 30rpx; text-align: center"
        >
          1： 位置定位准确；<br />2：有站点清晰照片；<br />3：有准确联系人及电话；<br />
          4：服务站、点服务内容描述准确；<br />5：该服务站、点未被其他卡友上传过；
        </view>
      </view>
		</view>
		<view @click="closeMask" class="mask" :style="{ opacity: isShowTran ? 1 : 0 }" v-show="isShowWxCode">
			<view class="dialog" @click.stop :style="{ bottom: isShowDialog ? '0' : '-100vh' }">
				<image @click="closeMask" class="close_btn" src="../../../static/images/uploadReport/close.png"></image>
				<image class="head_img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/head.png"></image>
				<view class="dialog_nickname">团团</view>
				<view class="dialog_text">保存到手机后，打开微信扫码添加</view>
				<image class="qr_code" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/qrcode.png"></image>
				<view class="dialog_save_btn" @click="saveImg">保存</view>
				<view style="height: 50rpx"></view>
			</view>
		</view>
		 <view class="                                     ">
			<image class="uniIcon" @tap="backToFromPage()" src="../../../static/images/back.png"></image>
			{{pageName ? pageName : '服务站上报'}}
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view>服务站名称</view>
			</view>
			
			<input class="input-box" placeholder-class="placeholder-class" type="text" maxlength="15" :value="providerName" @input="inputName" placeholder="请输入" />
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">地理位置</view>
			</view>
			<view :class="['input-box', !address?'placeholder-class':'']" @click="chooseLocation">{{address?address:'请选择地址或点击定位'}}</view>
			<view class="address" @click="getLocation(1)">
				<image mode="widthFix" class="screen-img"
					src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/cargoChina/address.png"></image>
				<view class="">定位</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">所属类别</view>
			</view>
			<view class="lable-box">
				<view :class="[labelId==item.id?'lable-select-child':'lable-child']" v-for="(item, index) in labelArr" @click="labelEvent(item)">{{item.typeName}}</view>
			</view>
		</view>
		<view class="content-box" v-if="labelChild.length>0">
			<view class="content-name">
				<view class="mandatory">*</view>
				<view class="">所属标签</view>
			</view>
			<view class="lable-box">
				<view :class="[item.isSelect==true?'lable-select-child':'lable-child']" v-for="(item, index) in labelChild" @click="labelSelectEvent(index)">{{item.labelName}}</view>
			</view>
		</view>
		<view class="content-box">
			<view class="content-name">
				<view class="">服务站门照</view>
			</view>
			<view class="photos">
				<view class="select-img">
					<view :class="['selected-box', index%2==0?'selected-box1':'']" v-for="(item, index) in imagesArr">
						<image class="selected-img" :src="item.url" @click="previewImage(item.url)" mode="aspectFill"></image>
						<view class="select-cancel" @click="cancelEvent(index)">
							<image src="/static/images/newCancel.png"></image>
						</view>
					</view>
					<view v-if="imagesArr.length<4" class="photo-box" @click="chooseImage">
						<image class="photo-img" src="/static/images/photo.png"></image>
					</view>
				</view>
				<view class="remind">你反馈的信息非常重要，请现场拍摄门脸或建筑物外观照片，最多可添加四张</view>
			</view>
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view>服务站联系人</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="text" :value="concatName" @input="inputContact" placeholder="请输入" />
		</view>
		<view class="content-box align-box">
			<view class="content-name">
				<view>服务站电话</view>
			</view>
			<input class="input-box" placeholder-class="placeholder-class" type="number" :value="concatPhone" @input="inputConcatPhone"
				placeholder="用户需要时可联系" />
		</view>
		<view class="content-box">
			<view class="content-name">
				<view>服务站描述</view>
			</view>
		</view>
		<view class="content-box" style="border-bottom: 1rpx solid #fff;">
			<textarea class="describe" placeholder-class="placeholder-class" :value="providerDescription" @input="inputDescription" placeholder="请输入" />
		</view>
		<view class="btn-box">
			<view class="btn" @click="reverseGeocoder">提交</view>
		</view> -->
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js";
	import * as ship from "@/utils/ship"
	var QQMapWX = require("../../../utils/qqmap-wx-jssdk.min.js");
	var qqmapsdk = new QQMapWX({
		key: utils.tentCentMapKey,
	});
	var commonHtmlTitle = "服务站上报";
	export default {
		data() {
			return {
				isShowWxCode: false,
				isShowTran: false,
				isShowDialog: false,
				submitForm: {},
				isClicking: false,
				pageName: "服务站上报",
				detailsObj: null,
				providerName: "",
				routeDetail:"",
				address: "",
				concatName: "",
				concatPhone: "",
				providerDescription: "",
				imagesArr: [],
				imagesArr2:[],  //营业执照
				longitude: 0,
				latitude: 0,
				labelArr: [],
				labelChild: [],
				labelId: "",
				labelChildId: 0,
				codeObj: "",
				regionData: [],
				adcode: "",
				iconPath: "",
				userRole: '',
				categoryId:'',
				newLabelId:'',  //类别
			};
		},
		async onLoad(options) {
			this.getLocation(0);
			this.isClicking = false;
			this.userRole = uni.getStorageSync('userRole');
			let data = {
				commonHtmlTitle: commonHtmlTitle,
			}
			if(this.userRole == 2) {
				data.typeFlag = 2
			}
			
			var response = await utils.postRequest("/mu/providerType/list",data);
			console.log(response, "类别");
			var newItems = response.rspBody;
			this.labelArr = newItems;
			console.log(newItems);
			// that.selectByProviderId(res.rspBody[0].id)
			this.pageName = options.pageName;
			console.log(options.detailsObj, "aaaa");
			if (options.detailsObj) {
				var detailsObj = JSON.parse(options.detailsObj);
				this.detailsObj = detailsObj;
				console.log(detailsObj, "参数1", newItems);
				this.providerName = detailsObj.providerName;
				this.address = detailsObj.address;
				if(this.userRole == 2) {
					this.categoryId = detailsObj.typeId  //类别
				}else {
					this.labelId = detailsObj.typeId;
				}
				this.imagesArr2.push({
					url: detailsObj.businessLicense,
				});
				this.routeDetail = detailsObj.routeDetail;  //物流线路
				this.concatName = detailsObj.concatName;
				this.concatPhone = detailsObj.concatPhone;
				this.providerDescription = detailsObj.providerDescription;
				this.longitude = detailsObj.longitude;
				this.latitude = detailsObj.latitude;
				this.iconPath = detailsObj.iconPath;
				this.codeObj = [
					detailsObj.provinceCode,
					detailsObj.cityCode,
					detailsObj.areaCode,
				].join(",");
				var facadeImgs = detailsObj.facadeImgs;
				if (facadeImgs) {
					facadeImgs = facadeImgs.split(",");
					facadeImgs.forEach((item) => {
						this.imagesArr.push({
							url: item,
						});
					});
				}
				var id = detailsObj.typeId;
				var res = await utils.postRequest("/mu/providerLabel/selectByTypeId", {
					typeId: id,
					commonHtmlTitle: commonHtmlTitle,
				});
				var labelChild = res.rspBody;
				var labelVOS = detailsObj.labelVOS;
				console.log(labelChild, "啊啊啊标签");
				labelVOS.forEach((item) => {
					var findIndex = labelChild.findIndex((atem) => {
						return item.id == atem.id;
					});
					if (findIndex > -1) {
						labelChild[findIndex].isSelect = true;
					}
				});
				this.labelChild = labelChild;
			} else {
				var id = newItems[0].id;
				var res = await utils.postRequest("/mu/providerLabel/selectByTypeId", {
					typeId: id,
					commonHtmlTitle: commonHtmlTitle,
				});
				var labelChild = res.rspBody;
				console.log(labelChild, "标签");
				this.labelChild = labelChild;
			}
			let that = this;
			uni.getStorage({
				// 检查地区数据，服务站、路况、互助上报时均需匹配地区code
				key: "regionData",
				success: function(rRes) {
					console.log("本地地区数据无误！");
					that.regionData = rRes.data;
				},
				fail: function(rErr) {
					console.log("本地缓存无地区数据！", rErr);
					that.getRegionInfo();
				},
			});
			// that.selectClass(2);
		},
		methods: {
			selectClass(val) {
				let that = this;
				that.labelId = val;
			},
			category(item) {
				if (!item.id) {
					uni.showToast({
						title: "此类型正在维护",
						icon: "none",
					});
				} else {
					this.iconPath = item.iconPath;
					this.categoryId = item.id;
					this.selectByProviderId(item.id);
				}
			},
			saveImg() {
				let that = this;
				uni.showLoading({
					title: "请稍候...",
					mask: true,
				});
				uni.saveImageToPhotosAlbum({
					filePath: "https://hyzg-app.oss-cn-beijing.aliyuncs.com/uploadFWZ/downImg.png",
					success: function() {
						console.log("save success");
						uni.hideLoading();
						uni.showToast({
							title: "保存成功",
							icon: "success",
						});
						that.closeMask();
					},
				});
			},
			closeMask() {
				let that = this;
				that.isShowDialog = false;
				setTimeout(() => {
					that.isShowTran = false;
					setTimeout(() => {
						that.isShowWxCode = false;
					}, 100);
				}, 200);
			},
			showWxCode() {
				let that = this;
				that.isShowWxCode = true;
				setTimeout(() => {
					that.isShowTran = true;
					setTimeout(() => {
						that.isShowDialog = true;
					}, 100);
				}, 100);
			},
			previewImage(image) {
				console.log(image);
				uni.previewImage({
					urls: [image],
					longPressActions: {
						itemList: ["发送给朋友", "保存图片", "收藏"],
						success: function(data) {
							console.log(
								"选中了第" +
								(data.tapIndex + 1) +
								"个按钮,第" +
								(data.index + 1) +
								"张图片"
							);
						},
						fail: function(err) {
							console.log(err.errMsg);
						},
					},
				});
			},
			chooseLocation() {
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						console.log("位置名称：" + res.name);
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.address = res.address;
						console.log("详细地址：" + res.address);
						console.log("纬度：" + res.latitude);
						console.log("经度：" + res.longitude);
						that.getAddressDetails();
					},
				});
			},
			getAddressDetails() {
				console.log("执行定位解析");
				let that = this;
				let parameters =
					"key=6ae872d0bc86389b263ecdf64521a42a" +
					"&location=" +
					that.longitude +
					"," +
					that.latitude;
				uni.request({
					url: "https://restapi.amap.com/v3/geocode/regeo?" + parameters, //仅为示例，并非真实接口地址。
					method: "GET",
					data: {},
					header: {},
					success: (aRes) => {
						console.log("成功", aRes);
						that.adcode = aRes.data.regeocode.addressComponent.adcode;
						that.getCodeObj(that.adcode);
					},
					fail: (err) => {
						console.log("失败", err);
					},
				});
			},
			getRegionInfo() {
				let that = this;
				utils
					.postRequest("/au/nationDict/getBasicData", {
						commonHtmlTitle: commonHtmlTitle,
					})
					.then((res) => {
						if (res.retCode == "0000000") {
							console.log("省市区code获取成功");
							that.regionData = res.rspBody;
							uni.setStorage({
								key: "regionData",
								data: res.rspBody,
								success: function(saveRes) {
									console.log("地区数据缓存成功！", saveRes);
								},
								fail: function(saveErr) {
									console.log("地区数据缓存失败！", saveErr);
								},
							});
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: "none",
							});
						}
					})
					.catch((err) => {
						console.log(err);
					});
			},
			getCodeObj(areaCode) {
				console.log("开始匹配省市区code");
				let region = this.regionData;
				for (let a in region) {
					for (let b in region[a].cities) {
						for (let c in region[a].cities[b].areas) {
							if (region[a].cities[b].areas[c].code == areaCode) {
								this.codeObj =
									region[a].code +
									"," +
									region[a].cities[b].code +
									"," +
									region[a].cities[b].areas[c].code;
								console.log("匹配的code", this.codeObj);
								break;
							}
						}
					}
				}
			},
			inputName(e) {
				this.providerName = e.detail.value;
			},
			inputName2(e){
				this.routeDetail = e.detail.value;
			},
			inputAddress(e) {
				this.address = e.detail.value;
			},
			inputContact(e) {
				this.concatName = e.detail.value;
			},
			inputConcatPhone(e) {
				this.concatPhone = e.detail.value;
			},
			inputDescription(e) {
				this.providerDescription = e.detail.value;
			},
			getList() {
				var that = this;
				utils
					.postRequest("/mu/providerType/list", {
						commonHtmlTitle: commonHtmlTitle,
					})
					.then((res) => {
						console.log(res);
						var newItems = res.rspBody;
						that.labelArr = newItems;
						that.selectByProviderId(res.rspBody[0].id);
					})
					.catch((err) => {
						console.log(err);
					});
			},
			selectByProviderId(id) {
				console.log(id,'id')
				utils
					.postRequest("/mu/providerLabel/selectByTypeId", {
						typeId: id,
						commonHtmlTitle: commonHtmlTitle,
					})
					.then((res) => {
						console.log(res,'标签')
						 this.labelChild = res.rspBody;
						
					})
					.catch((err) => {
						console.log(err);
					});
			},
			labelEvent(item) {
				console.log(item);
				if (!item.id) {
					uni.showToast({
						title: "此类型正在维护",
						icon: "none",
					});
				} else {
					this.iconPath = item.iconPath;
					this.labelId = item.id;
					this.selectByProviderId(item.id);
				}
			},
			labelSelectEvent(index) {
				var arr = this.labelChild;
				if (!arr[index].isSelect) {
					arr[index].isSelect = true;
				} else {
					arr[index].isSelect = false;
				}
				this.labelChild = arr;
				this.$forceUpdate();
			},
			//定义方法
			reverseGeocoder() {
				var that = this;
				if (!that.address) {
					uni.showToast({
						title: "请获取地理位置",
						icon: "none",
					});
					return;
				}
				that.save();
				// qqmapsdk.geocoder({
				// 	// location: {
				// 	// 	latitude: that.latitude,
				// 	// 	longitude: that.longitude
				// 	// },
				// 	address: that.address,
				// 	success: function(res) {
				// 		console.log(res)
				// 		that.longitude = res.result.location.lng;
				// 		that.latitude = res.result.location.lat;
				// 		that.save();
				// 	},
				// 	fail: function(res) {
				// 		uni.showToast({
				// 			title: '定位失败',
				// 			icon: 'none'
				// 		});
				// 		console.log(res);
				// 	}
				// });
			},
			getLocation(type) {
				var that = this;
				uni.getLocation({
					type: "gcj02",
					geocode: true,
					success: function(res) {
						console.log(res);
						// console.log('当前位置的经度：' + res.longitude);
						// console.log('当前位置的纬度：' + res.latitude);
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						if (type == 1) {
							that.address =
								res.address.province +
								res.address.city +
								res.address.district +
								res.address.poiName;
						}
						that.getAddressDetails();
					},
					fail: function(err) {
						console.log(err);
					},
				});
			},
			chooseImage(index) {
				var that = this;
				var num
				if(index == 1) {
				   num = 4 - that.imagesArr.length;
				}else if(index == 2){
					num = 1 - that.imagesArr2.length;
				}
				
				uni.chooseImage({
					count: num,
					// 默认9
					sizeType: ["compressed"],
					// 可以指定是原图还是压缩图，默认二者都有
					sourceType: ["camera", "album"],
					// 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						var tempFilePaths = res.tempFilePaths;
						// var obj = {url: tempFilePaths[0]}
						// that.imagesArr.push(obj);
						res.tempFilePaths.map((val) => {
							that.uploadImg(val,index);
						});
					},
				});
			},
			cancelEvent(index,sign) {
				console.log(index,'indexindex')
				if(sign == 1) {
					this.imagesArr.splice(index, 1);
				}else {
					this.imagesArr2 = [];
				}
				
			},
			uploadImg(image,index) {
				uni.showLoading({
					title: "请稍候...",
				});
				var that = this;
				uni.uploadFile({
					url: ship.ApiRootUrl + "/file/upload",
					filePath: image,
					name: "file",
					// formData: {
					// 	userType: "84",
					// },

					success: function(res) {
						uni.hideLoading();
						var result = JSON.parse(res.data);
						console.log(result,'上传')
						if (result.retCode == "0000000") {
							var obj = {
								url: result.rspBody[0].url
							};
							if(index == 1) {
								that.imagesArr.push(obj);
							}else {
								that.imagesArr2.push(obj);
							}
							
						} else {
							uni.showToast({
								title: res.retDesc,
								icon: "none",
							});
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络错误!",
							icon: "none",
						});
						uni.hideLoading();
					},
				});
			},
			isThreeAuth(index) {
				let that = this
				console.log("三证校验结果")
				var userInfo = uni.getStorageSync("userInfo");
				let flag = false
				if (userInfo) {
					var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
					var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
					var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
					if (identityVerify !== 1) {
						uni.showToast({
							title: '请您先完成身份证认证再参与现金奖励活动哦~',
							icon: 'none'
						})
						return flag
					}
					if (driverVerify !== 1) {
						uni.showToast({
							title: '请您先完成驾驶证认证再参与现金奖励活动哦~',
							icon: 'none'
						})
						return flag
					}
					if (vehicleVerify !== 1) {
						uni.showToast({
							title: '请您先完成车辆认证再参与现金奖励活动哦~',
							icon: 'none'
						})
						return flag
					}
					if (identityVerify !== 1 || driverVerify !== 1 || vehicleVerify !== 1) {
						flag = false
					} else {
						flag = true
					}
				}
				return flag
			},
			save() {
				var that = this;
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
						title: "请登录后操作",
						success: function(res) {
							if (res.confirm) {
								utils.loginSelf();
							}
						},
					});
					return;
				}
				//货主不走三证认证
				if(this.userRole == 1) {
					if (!that.isThreeAuth()) {
						return
					}
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
				if (!this.providerName) {
					uni.showToast({
						title: "请输入服务站名称",
						icon: "none",
					});
					return;
				}
				if (!this.address) {
					uni.showToast({
						title: "请输入服务站地址",
						icon: "none",
					});
					return;
				}
				if(this.userRole == 2) {
					if (!this.categoryId) {
						uni.showToast({
							title: "请选择所属类别",
							icon: "none",
						});
						return;
					}
				}else {
					if (!this.labelId) {
						uni.showToast({
							title: "请选择所属类别",
							icon: "none",
						});
						return;
					}
				}
				
				if (!this.routeDetail) {
					uni.showToast({
						title: "请输入物流线路",
						icon: "none",
					});
					return;
				}
				var isSelectId = 0;
				var labelVOS = [];
				this.labelChild.map((val) => {
					if (val.isSelect) {
						isSelectId = 1;
						var obj = {
							id: val.id,
						};
						labelVOS.push(obj);
					}
				});
				if (!isSelectId && this.labelChild.length > 0) {
				  uni.showToast({
				    title: "请选择所属标签",
				    icon: "none",
				  });
				  return;
				}
				if (!this.providerName) {
					uni.showToast({
						title: "请输入服务站名称",
						icon: "none",
					});
					return;
				}

				var facadeImgs = "";
				this.imagesArr.map((val, index) => {
					if (index == 0) {
						facadeImgs = val.url;
					} else {
						facadeImgs = facadeImgs + "," + val.url;
					}
				});
				let code = this.codeObj ? this.codeObj.split(",") : [];

				if (!this.codeObj) {
					var provinceCode = this.adcode.substring(0, 2) + "0000";
					var cityCode = this.adcode.substring(0, 4) + "00";
				}
				if (!facadeImgs) {
					uni.showToast({
						title: "请上传站点图片",
						icon: "none",
					});
					return;
				}
				if (!this.concatName) {
					uni.showToast({
						title: "请上传联系人",
						icon: "none",
					});
					return;
				}
				if (!this.concatPhone) {
					uni.showToast({
						title: "请上传联系电话",
						icon: "none",
					});
					return;
				}
				console.log("省市区", code);
				var data = {
					providerName: this.providerName,
					address: this.address,
					concatName: this.concatName,
					concatPhone: this.concatPhone,
					providerDescription: this.providerDescription,
					longitude: this.longitude,
					latitude: this.latitude,
					labelVOS: labelVOS,
					typeId: this.userRole == 2 ? this.categoryId : this.labelId,
					facadeImgs: facadeImgs,
					provinceCode: this.codeObj ? code[0] : provinceCode,
					cityCode: this.codeObj ? code[1] : cityCode,
					areaCode: this.codeObj ? code[2] : this.adcode,
					commonHtmlTitle: commonHtmlTitle,
					iconPath: this.iconPath,
					routeDetail:this.routeDetail,  //物流线路
				};
				//营业执照
				if(this.imagesArr2.length > 0) {
					data.businessLicense = this.imagesArr2[0].url
				}
				if (this.detailsObj) {
					console.log(this.detailsObj, "上报服务站11");
					data.id = this.detailsObj.id;
				}

				if (this.isClicking) {
					return;
				}
				this.isClicking = true;

				console.log("上报服务站参数", data);
				uni.showLoading({
					title: "请稍候...",
					mask: true,
				});
				var that = this;
				utils
					.postRequest("/mu/provider/save", data)
					.then(function(res) {
						uni.hideLoading();
						console.log(res);
						if (res.retCode == "0000000") {
							uni.showToast({
								title: "提交成功",
								icon: "none",
							});
							setTimeout(() => {
								that.isClicking = false;
								uni.$emit("srevice-index", 1);
								uni.$emit("refreshData_service");
								uni.$emit("refreshApi");
								uni.navigateBack({});
							}, 1500);
						} else {
							that.isClicking = false;
							uni.showToast({
								title: res.retDesc,
								icon: "none",
							});
						}
					})
					.catch((err) => {
						this.isClicking = false;
						console.log(err);
						uni.hideLoading();
					});
			},
			backToFromPage() {
				uni.navigateBack({
					delta: 1,
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	.container {
		width: 100vw;

		.mask {
			position: fixed;
			left: 0;
			top: 0;
			z-index: 99;
			width: 100vw;
			height: 100vh;
			background: rgba(84, 84, 84, 0.58);
			opacity: 0;
			transition: opacity 0.2s;

			.dialog {
				position: absolute;
				width: 100vw;
				bottom: -100vh;
				left: 0;
				transition: bottom 0.2s;
				border-top-left-radius: 30rpx;
				border-top-right-radius: 30rpx;
				background: #ffffff;
				box-shadow: 0px 0px 16rpx 2rpx rgba(172, 203, 255, 0.19);
				text-align: center;

				.close_btn {
					position: absolute;
					width: 48rpx;
					height: 48rpx;
					top: 28rpx;
					right: 34rpx;
				}

				.head_img {
					margin-top: 50rpx;
					width: 136rpx;
					height: 136rpx;
					box-shadow: 0px 0px 12rpx 2rpx rgba(0, 0, 0, 0.14);
					border-radius: 50%;
					border: 6rpx solid #ffffff;
				}

				.dialog_nickname {
					margin-top: 20rpx;
					font-size: 40rpx;
					font-family: PingFang SC-Semibold, PingFang SC;
					font-weight: 600;
					color: #000000;
				}

				.dialog_text {
					margin-top: 60rpx;
					font-size: 36rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}

				.qr_code {
					margin-top: 66rpx;
					width: 240rpx;
					height: 240rpx;
				}

				.dialog_save_btn {
					margin: 66rpx auto 0 auto;
					width: 528rpx;
					height: 80rpx;
					background: #F75347;
					border-radius: 16rpx 16rpx 16rpx 16rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 32rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}

		.propaganda_img {
			display: block;
			width: 100%;
			height: 320rpx;
		}

		.content_con {
			width: 100vw;
			height: 80vh;
			background: #fbe7c1;
			padding: 50rpx 36rpx;
			box-sizing: border-box;

			.content_item {
				width: 100%;
				background: #ffffff;
				box-shadow: 0 8rpx 16rpx 2rpx #f1b18a;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				border: 14rpx solid #f9d99b;
				padding: 0 30rpx;
				box-sizing: border-box;
				position: relative;

				.submit_btn {
					margin: 8rpx auto 40rpx auto;
					width: 196rpx;
					height: 68rpx;
					background: linear-gradient(180deg, #f1af6e 0%, #dd4026 100%);
					border-radius: 114rpx 114rpx 114rpx 114rpx;
					font-size: 28rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #ffffff;
					text-align: center;
					line-height: 68rpx;
				}

				.content_text {
					width: 100%;
					font-size: 26rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #d1684e;
					line-height: 44rpx;
				}

				.top_title {
					position: absolute;
					top: -52rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 270rpx;
					height: 82rpx;
					background: linear-gradient(180deg, #f1af6e 0%, #dd4026 100%);
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 114rpx;
					font-size: 32rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #ffffff;
				}

				.money_img {
					position: absolute;
					left: 0;
					top: -85rpx;
					width: 108rpx;
					height: 125rpx;
					z-index: 10;
				}

				.goldCoins {
					position: absolute;
					right: 5rpx;
					bottom: 5rpx;
					width: 266rpx;
					height: 245rpx;
					z-index: 10;
				}

				.people_img {
					position: absolute;
					right: 30rpx;
					bottom: 0;
					width: 165rpx;
					height: 357rpx;
					z-index: 10;
				}

				.content_text_red {
					width: 100%;
					font-size: 26rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #ec3939;
					line-height: 44rpx;

					text {
						font-size: 40rpx;
					}
				}
			}

			.add_wx {
				margin: 40rpx auto 66rpx auto;
				background-image: url("../../../static/images/uploadReport/add_wx.png");
				background-repeat: no-repeat;
				background-size: 100% 100%;
				width: 594rpx;
				height: 120rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #ffffff;
				padding: 0 54rpx;
				box-sizing: border-box;
			}
		}
	}

	.content-box {
		display: flex;
		font-size: 30rpx;
		padding: 24rpx 0;
		box-sizing: border-box;
		color: #333;
		align-items: center;
		border-bottom: 2rpx solid #eaeaea;

		.content-name {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			width: 220rpx;
			padding-right: 56rpx;
			box-sizing: border-box;
			font-weight: 500;
			font-size: 32rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;

			text {
				font-size: 32rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #f12c2c;
			}
		}

		.photo_list {
			flex: 1;
			display: flex;
			flex-wrap: wrap;

			.photo_item {
				background: #f1f4f9;
				border-radius: 8rpx;
				position: relative;
				width: 166rpx;
				height: 166rpx;

				.select_img {
					border-radius: 8rpx;
					width: 166rpx;
					height: 166rpx;
				}

				.cancel_img {
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					width: 20rpx;
					height: 20rpx;
				}

				.defalut_img {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 68rpx;
					height: 68rpx;
					z-index: 1;
				}

				.add_box {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					z-index: 2;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 120rpx;
					height: 44rpx;

					image {
						margin-top: 3rpx;
						width: 24rpx;
						height: 24rpx;
					}

					view {
						margin-left: 2rpx;
						font-size: 24rpx;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
					}
				}
			}
		}

		.avtive_item {
			background: linear-gradient(180deg, #efaf70 0%, #db4327 100%) !important;
			box-shadow: 0px 0px 16rpx 2rpx rgba(172, 203, 255, 0.22) !important;
			color: #ffffff !important;
		}

		.select_item {
			width: 150rpx;
			height: 52rpx;
			background: #ffffff;
			box-shadow: 0px 0px 16px 2px rgba(172, 203, 255, 0.22);
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
		}
	}

	.placeholder-class {
		font-size: 28rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
	}

	.align-box {
		align-items: center;
	}

	.mandatory {
		color: #ff021f;
	}

	.address {
		display: flex;
		align-items: center;

		.add_text {
			margin-left: 5rpx;
			font-size: 24rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #3489e9;
		}

		image {
			margin-left: 4rpx;
			width: 22rpx;
			height: 30rpx;
		}
	}

	// .screen-img {
	//   width: 20rpx;
	//   margin-right: 10rpx;
	// }

	.input-box {
		// width: 300rpx;
		flex: 1;
		font-size: 30rpx;
	}

	.lable-box {
		display: flex;
		flex-wrap: wrap;
		width: 520rpx;
		font-size: 26rpx;
	}

	.lable-child {
		width: 121rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background-color: #e5e5e5;
		color: #3b3b3b;
		margin-right: 8rpx;
		margin-bottom: 15rpx;
		border-radius: 8rpx;
	}

	.lable-select-child {
		width: 121rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background-color: #d0e4fa;
		color: #3876eb;
		margin-right: 8rpx;
		margin-bottom: 15rpx;
		border-radius: 8rpx;
	}

	.photos {
		flex: 1;
	}

	.select-img {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.photo-box {
		width: 190rpx;
		height: 160rpx;
		background-color: #e5e5e5;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.selected-box {
		width: 240rpx;
		height: 160rpx;
		background-color: #e5e5e5;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 10rpx;
		position: relative;
	}

	/* .select-cancel{
		position: absolute;
		top: -5rpx;
		right: -5rpx;
		width: 30rpx;
		height: 30rpx;
	} */
	.select-cancel {
		position: absolute;
		top: -5rpx;
		right: -5rpx;
		width: 20rpx;
		height: 20rpx;
		padding: 0 0 20rpx 20rpx;
	}

	.select-cancel image {
		max-width: 100%;
		max-height: 100%;
	}

	.selected-box1 {
		margin-right: 10rpx;
	}

	.selected-img {
		width: 240rpx;
		height: 160rpx;
		border-radius: 10rpx;
	}

	.photo-img {
		width: 190rpx;
		height: 160rpx;
		border-radius: 10rpx;
	}

	.remind {
		font-size: 20rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
	}

	.describe {
		box-sizing: border-box;
		width: 100%;
		border: 1rpx solid #aaaaaa;
		padding: 10rpx;
		height: 160rpx;
		border-radius: 10rpx;
	}

	.btn-box {
		display: flex;
		font-size: 28rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		color: #333;
		align-items: flex-start;
		justify-content: center;
		position: fixed;
		bottom: 30rpx;
		left: 0;
		right: 0;
	}

	.btn {
		width: 612rpx;
		height: 64rpx;
		background-color: #ff8d02;
		border-radius: 32rpx;
		color: #fff;
		text-align: center;
		line-height: 64rpx;
	}

	.headBox {
		padding: 70rpx 0 0 0;
		background-color: #ffffff;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 36rpx;
		color: #333;

		.headRight {
			position: absolute;
			right: 0;
			top: 70rpx;
		}

		.uniIcon {
			width: 22rpx;
			height: 40rpx;
			position: absolute;
			left: 40rpx;
			margin-top: 10rpx;
		}

		.memberMoreIcon {
			width: 42rpx;
			height: 42rpx;
			position: absolute;
			right: 40rpx;
			margin-top: 10rpx;
		}
	}
</style>
