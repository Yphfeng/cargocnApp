<template>
	<view class="fleetCreate">
		<view class="newHeader">
		</view>
		<view class="headBox">
			<i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: rgb(255, 255, 255); font-size: 27px;"></i>
			{{isEdit ? '编辑车队' : '组建新车队'}}
		</view>
		<view class="createFrom">
			<view class="teamLogoBox">
				<view class="upLoadBox" @click="upFile">
					<view class="upLoadBtn" v-if="params.badgeImage">
						<image :src="params.badgeImage" class="upRemoteImg"></image>
					</view>
					<view class="upLoadBtn" v-else>
						<!-- <image src="../../../../static/images/upFile.png" class="upImg"></image> -->
						<image src="/static/images/goodsDelivery/fleet-head.png" class="upRemoteImg"></image>
					</view>
				</view>
				<view class="upLoadMsg">
					<text class="title">车队徽章</text>
					<text class="hint">（点击上传）</text>
				</view>
			</view>
			<view>
				<view class="teamMsgInput">
					<view class="inputTitle">车队名称<text class="badge">*</text></view>
					<input class="valueInput" v-model="params.name" @input="inputName" @keyboardheightchange="onBlur" maxlength="30"  placeholder-class="hintClass" type="text"  placeholder="请填写车队名称" />
				</view>
				
				<view class="teamMsgInput">
					<view class="inputTitle">车队简介</view>
					<textarea class="valueInput" v-model="params.introduction" auto-height="true" @keyboardheightchange="onBlur" maxlength="512"  placeholder-class="hintClass" type="text"  placeholder="请输入" />
				</view>
				
				<view class="teamMsgInput">
					<view class="inputTitle">车队口号<text class="badge">*</text></view>
					<textarea class="valueInput" v-model="params.slogan" @input="inputSlogan" auto-height="true" maxlength="20" placeholder-class="hintClass" type="text"  placeholder="在此输入您的车队口号" />
				</view>
				<view class="teamMsgInput contact-box">
					<view class="inputTitle">车型车长<text class="badge">*</text></view>
					<view class="attr-arr" @click="goCarType">
						<view class="attr-select">{{newModel?newModel:'请选择'}}</view>
						<image class="icon_right" src="/static/images/icon_right.png" mode=""></image>
					</view>
				</view>
				<view class="teamMsgInput">
					<view class="inputTitle">优势路线</view>
					<textarea class="valueInput" v-model="params.route" auto-height="true" @keyboardheightchange="onBlur" placeholder-class="hintClass" maxlength="50" type="text" placeholder="手动输入主要或优势线路" />
				</view>
				<view class="teamMsgInput contact-box">
					<view class="inputTitle">优势区域</view>
					<!-- <textarea class="valueInput" v-model="params.advantageArea" auto-height="true" @keyboardheightchange="onBlur" placeholder-class="hintClass" maxlength="50" type="text" placeholder="手动输入优势区域" /> -->
					<view class="attr-arr" @click="goArea">
						<view class="attr-select" style="flex: 1;">{{params.advantageArea?params.advantageArea:'请选择'}}</view>
						<image class="icon_right" src="/static/images/icon_right.png" mode=""></image>
					</view>
				</view>
				<view class="teamMsgInput contact-box">
					<view class="inputTitle">优势行业</view>
					<!-- <textarea class="valueInput" v-model="params.advantageIndustry" auto-height="true" @keyboardheightchange="onBlur" placeholder-class="hintClass" maxlength="50" type="text" placeholder="手动输入优势行业" /> -->
					<view class="attr-arr" @click="goIndustry">
						<view class="attr-select" style="flex: 1;">{{!params.advantageIndustry && !customText?'请选择':customText && params.advantageIndustry?(params.advantageIndustry + ',' + customText):(params.advantageIndustry && !customText)?params.advantageIndustry:customText}}</view>
						<image class="icon_right" src="/static/images/icon_right.png" mode=""></image>
					</view>
				</view>
				<view class="teamMsgInput contact-box">
					<view class="inputTitle">所在省市<text class="badge">*</text></view>
					<view class="attr-arr" @click="showAddressPopup">
						<view class="attr-select">{{addressArea?addressArea:'请选择'}}</view>
						<image class="icon_right" src="/static/images/icon_right.png" mode=""></image>
					</view>
				</view>
				<view class="teamMsgInput attr-box">
					<view class="inputTitle">车队类型<text class="badge">*</text></view>
					<view class="attr-arr">
						<view :class="[params.fleetAttributes==item.typeName?'attr-text':'attr-text1']" v-for="(item, index) in attrArr" @click="attrTap(item.typeName)">
							{{item.typeName}}
						</view>
					</view>
				</view>
				<view class="teamMsgInput contact-box">
					<view class="inputTitle">加入验证<text class="badge">*</text></view>
					<view class="attr-arr">
						<view :class="[params.verificationMethod===item.val?'verify-text':'verify-text1']" v-for="(item, index) in verifyArr" @click="verifyTap(item.val)">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="teamMsgInput contact-box" style="flex-direction: column;">
					<view class="" style="display: flex; justify-content: space-between; width: 100%;">
						<view class="inputTitle">谁可以见<text class="badge">*</text></view>
						<view class="attr-arr">
							<view :class="[params.fleetVisibility == item.val?'verify-text':'verify-text1']" v-for="(item, index) in visibleArr" @click="visibleTap(item.val)">
								{{item.name}}
							</view>
						</view>
					</view>
					<view class="visible-tip" v-if="params.fleetVisibility">{{params.fleetVisibility==1?'其他用户在物流车队可见您的车队，司机可申请加入，货主可联系到车队':'仅车队成员可见'}}</view>
				</view>
				<view class="teamMsgInput contact-box">
					<view class="inputLongTitle">允许货主联系车队</view>
					<view class="attr-arr">
						<view :class="[params.allowConsignorContact==item.val?'verify-text':'verify-text1']" v-for="(item, index) in allowArr" @click="allowTap(item.val, 2)">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="teamMsgInput contact-box">
					<view class="inputLongTitle">允许司机联系车队</view>
					<view class="attr-arr">
						<view :class="[params.allowDriverContact==item.val?'verify-text':'verify-text1']" v-for="(item, index) in allowArr" @click="allowTap(item.val, 1)">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="ruleBox" v-show="!textareaFocus">
			<view class="rule-text" v-show="!params.id">
				<image
					class="checkRuleIcon"
					@tap="ruleCheckFlag = !ruleCheckFlag"
					:src="ruleCheckFlag ? '../../../../static/images/ruleChecked.png' : '../../../../static/images/ruleDefault.png'">
				</image>
				<view class="ruleDetail" @click="lookRule()">
					我承诺，会遵守中国各项法律及货运中国网相关规章制度
				</view>
			</view>
			<view class="submitBtn" @tap="submit">确认提交</view>
		</view>
		
		<uni-popup ref="chooseAreaPopup" type="bottom">
			<view class="chooseAreaBox">
				<view class="areaPopupHead">
					<view class="checkedAreaBox">
						<view class="areaList" v-if="chooseAreaPopupData.length == 0">
							<view class="areaMsg checkedArea">全国</view>
							<view class="checkedLine"></view>
						</view>
						<view class="areaList" v-if="chooseAreaPopupData.length > 0" v-for="(item, selectindex) in chooseAreaPopupData" :key="selectindex" @tap="changeSelectFlag(selectindex)">
							<view class="areaMsg" :class="selectAreaFlag == selectindex ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
							<view :class="selectAreaFlag == selectindex ? 'checkedLine' : 'defaultLine'"></view>
						</view>
					</view>
					<view class="closeAreaPopupConfirm" @click="toSaveArea">确定</view>
					<!-- <image class="closeAreaPopupIcon" @tap="toCloseAreaPopup()" src="/static/images/goodsDelivery/closeAreaPopupIcon.png"></image> -->
				</view>
				<scroll-view :scroll-top="scrollTop" class="areaPopupBody" scroll-y="true" :show-scrollbar="true">
					<view v-if="areaSetp == '0'" class="detailsList" v-for="(item, provinceIndex) in allAreaInfo" :key="provinceIndex" @click="checkProvince(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[0] && chooseAreaPopupData[0].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="/static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
					<view v-if="areaSetp == '1'" class="detailsList" v-for="(item, cityIndex) in showCityInfo" :key="cityIndex" @click="checkCity(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[1] && chooseAreaPopupData[1].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="/static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view>
					<!-- <view v-if="areaSetp == '2'" class="detailsList" v-for="(item, areaIndex) in showAreaInfo" :key="areaIndex" @click="checkArea(item)">
						<view class="detailsMsg" :class="chooseAreaPopupData[2] && chooseAreaPopupData[2].code == item.code ? 'checkedArea' : 'defaultArea'">{{item.name}}</view>
						<image class="areaRightIcon" src="/static/images/goodsDelivery/checkAreaRightIcon.png"></image>
					</view> -->
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "../../../../utils/service.js"
	import * as ship from "@/utils/ship"
	var isClicking = false;
	export default {
		data() {
			return {
				windowHeight: 0,
				ruleCheckFlag: false,
				validationFlag: 2,
				oldValidationFlag: 2,
				validationColor: '#5BBC80',
				oldParams: {
					
				},
				params: {
					bgImg: '',
					badgeImage: '',
					name: '', //车队名称
					introduction: '', //车队简介
					advantageArea: '', //优势区域
					advantageIndustry: '', //优势行业
					fleetAttributes: '', //车队类型
					fleetVisibility: 1, //车队可见性
					allowConsignorContact: 1, //允许货主联系车队
					allowDriverContact: 1, //允许司机联系车队
					verificationMethod: '',
					cartLength: '', //车长
					model: '', //车型
					route: '',
					advantageArea: '', //优势区域
					slogan: '',
					// route: '',
					// model: [],
					// code: '',
				},
				newModel: '',
				checkedCarLongVal: 0,
				defaultValue: '',
				isEdit: false,
				isShow: true,
				userRole: 1,
				attrArr: [],
				verifyArr: [
					{name: '需审核', val: 2}, 
					{name: '无需审核', val: 1}, 
					{name: '不能主动加入', val: 0},
				],
				allowArr: [{name: '允许', val: 1}, {name: '不允许', val: 0}],
				visibleArr: [{name: '全平台', val: 1}, {name: '仅车队成员', val: 2}],
				textareaFocus: false,
				
				chooseAreaPopupData: [],
				scrollTop: 0,
				allAreaInfo: [], // 所有省市区
				showCityInfo: [], // 省市区弹出框展示的市
				showAreaInfo: [], // 省市区弹出框展示的区
				checkedAreaData: [], // 选中的省市区
				areaSetp: '0',
				addressArea: '', // 地区msg
				customText: '', //自定义优势行业
				selectAreaFlag: ''
			}
		},
		async onLoad(options) {
			console.log(options, '参数')
			var that = this;
			isClicking = false;
			that.windowHeight = uni.getSystemInfoSync().windowHeight;
			that.userRole = uni.getStorageSync("userRole");
			uni.$on('advantageEvent', val=>{
				console.log(val)
				if(val.type == 1){
					that.params.advantageArea = val.areaText;
				} else {
					that.customText = val.customText;
					that.params.advantageIndustry = val.industryText
				}
			})
			uni.$on('driverVal', val=>{
				console.log(val)
				this.params.cartLength = val.checkedCarLongVal;
				var model = '';
				var newModel = '';
				val.vehicleModel.map((data, index)=>{
					console.log(data);
					if(index==0){
						model = data.typeName;
						newModel = data.typeName;
					} else {
						model = model + ',' + data.typeName;
						newModel = newModel + '/' + data.typeName;
					}
				})
				console.log(model);
				this.params.model = model;
				this.newModel = newModel + '/' + val.checkedCarLongVal;
			})
			var fleetDetail = options.fleetDetail?JSON.parse(options.fleetDetail):{};
			console.log(fleetDetail.id);
			if (!fleetDetail.id) {
				//表示是新建
				this.isEdit = false
			} else {
				//编辑
				this.isEdit = true;
				this.customText = options.customText?options.customText:'';
				// if(fleetDetail.advantageIndustry && fleetDetail.advantageIndustry.indexOf('*')>-1){
				// 	var advantageIndustryText =  fleetDetail.advantageIndustry.split('*');
				// 	console.log(advantageIndustryText)
				// 	fleetDetail.advantageIndustry = advantageIndustryText[0];
				// 	console.log(fleetDetail.advantageIndustry);
				// 	this.customText =  advantageIndustryText[1];
				// }
				this.params = Object.assign(this.params, fleetDetail);
				this.oldParams = {
					...fleetDetail
				};
				console.log(fleetDetail);
				this.validationFlag = fleetDetail.verificationMethod;
				this.oldValidationFlag = fleetDetail.verificationMethod;
				if(fleetDetail.model){
					this.newModel = fleetDetail.model + '/' + fleetDetail.cartLength;
				}
				var checkedArr = [];
				var addressAreaTest = '';
				if(fleetDetail.cityCode){
					console.log('ssssssss')
					if(fleetDetail.provinceCode){
						checkedArr.push({code: fleetDetail.provinceCode, name: fleetDetail.provinceName})
						addressAreaTest = fleetDetail.provinceName;
					}
					checkedArr.push({code: fleetDetail.cityCode, name: fleetDetail.cityName})
					this.addressArea = addressAreaTest?(addressAreaTest + '-' + fleetDetail.cityName):fleetDetail.cityName;
				}
				console.log(this.addressArea);
				this.checkedAreaData = checkedArr;
				console.log(this.checkedAreaData);
			}
			this.allAreaInfo = uni.getStorageSync('regionData');
			if(this.allAreaInfo && this.allAreaInfo.length > 0) {
				// for(let i in this.allAreaInfo) {
				// 	if(this.allAreaInfo[i].code == '310000' || this.allAreaInfo[i].code == '110000' || this.allAreaInfo[i].code == '500000' || this.allAreaInfo[i].code == '120000') {
				// 		this.allAreaInfo[i].name = this.allAreaInfo[i].name + '市';
				// 	}
				// }
			}
			that.getMotorcade();
		},
		onShow() {},
		onReady() {},
		onUnload() {
			uni.$off("driverVal");
			uni.$off("advantageEvent");
		},
		methods: {
			moveHandle(){
				
			},
			changeSelectFlag(key) { // 切换选中的tab
				// console.log(key);
				// for(let i in this.checkedAreaData) {
				// 	console.log(i);
				// }
				if(this.selectAreaFlag != key){
					this.scrollTop = 1;
					this.$nextTick(function() {
						this.scrollTop = 0;
						console.log(this.scrollTop)
					});
				}
				this.selectAreaFlag = key;
				this.areaSetp = key.toString();
				
			},
			toCloseAreaPopup() {
				this.$refs.chooseAreaPopup.close();
			},
			showAddressPopup() {
				this.selectAreaFlag = '';
				this.areaSetp = '0';
				this.chooseAreaPopupData = this.checkedAreaData;
				// console.log(this.chooseAreaPopupData);
				if(this.chooseAreaPopupData.length == 2) {
					this.areaSetp = '1';
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == this.checkedAreaData['0'].code) {
							if(this.checkedAreaData['0'].code == '310000' || this.checkedAreaData['0'].code == '110000' || this.checkedAreaData['0'].code == '500000' || this.checkedAreaData['0'].code == '120000') {
								this.showCityInfo = this.allAreaInfo[i].cities['0'].areas;
								this.selectAreaFlag = 1;
								break;
							}else {
								this.showCityInfo = this.allAreaInfo[i].cities;
								this.selectAreaFlag = 1;
								break;
							}
						}
					}
				}else if(this.chooseAreaPopupData.length == 3) {
					this.areaSetp = '2';
					for(let i in this.allAreaInfo) {
						if(this.allAreaInfo[i].code == this.checkedAreaData['0'].code) {
							this.showCityInfo = this.allAreaInfo[i].cities;
							console.log('市', this.showCityInfo);
						}
						for(let a in this.allAreaInfo[i].cities) {
							if(this.allAreaInfo[i].cities[a].code == this.checkedAreaData['1'].code) {
								console.log(this.allAreaInfo[i].cities[a].code ,this.checkedAreaData['1'].code);
								this.showAreaInfo = this.allAreaInfo[i].cities[a].areas;
								this.selectAreaFlag = 2;
								console.log('区', this.showAreaInfo);
								break;
							}
						}
					}
				}
				this.$refs.chooseAreaPopup.open();
			},
			checkProvince(item) { // 选择省
				console.log('选择的省', item);
				this.chooseAreaPopupData = [];
				if(item.code == '310000' || item.code == '110000' || item.code == '500000' || item.code == '120000') {
					this.showCityInfo = item.cities['0'].areas;
				}else {
					this.showCityInfo = item.cities;
				}
				let obj = {
					"code": item.code,
					"name": item.name,
				};
				this.chooseAreaPopupData.push(obj);
				// if(this.chooseAreaPopupData.length == 0) {
				// 	let obj = {
				// 		"code": item.code,
				// 		"name": item.name,
				// 	};
				// 	this.chooseAreaPopupData.push(obj);
				// }else {
				// 	this.chooseAreaPopupData['0'] = {
				// 		"code": item.code,
				// 		"name": item.name,
				// 	};
				// }
				this.selectAreaFlag = 0;
				if(item.code == '310000' || item.code == '110000' || item.code == '500000' || item.code == '120000'){
					
				} else {
					this.areaSetp = '1';
				}
				this.scrollTop = 1;
				this.$nextTick(function() {
					this.scrollTop = 0;
					console.log(this.scrollTop)
				});
			},
			checkCity(item) { // 选择市
				console.log('选择的市', item);
				if(this.chooseAreaPopupData.length == 1) {
					let obj = {
						"code": item.code,
						"name": item.name,
					};
					this.chooseAreaPopupData.push(obj);
				}else {
					this.chooseAreaPopupData.pop();
					this.chooseAreaPopupData['1'] = {
						"code": item.code,
						"name": item.name,
					};
				}
				this.selectAreaFlag = 1;
				if(
					this.chooseAreaPopupData['0'].code == '310000' ||
					this.chooseAreaPopupData['0'].code == '110000' ||
					this.chooseAreaPopupData['0'].code == '500000' ||
					this.chooseAreaPopupData['0'].code == '120000'
				) {
					if(this.chooseAreaPopupData.length == 3) {
						this.chooseAreaPopupData.pop();
					}
					this.toSaveArea();
				}else {
					// this.toSaveArea();
					// this.areaSetp = '2';
					// this.showAreaInfo = item.areas;
				}
				this.scrollTop = 1;
				this.$nextTick(function() {
					this.scrollTop = 0;
					console.log(this.scrollTop)
				});
			},
			checkArea(item) {
				console.log('选择的区', item);
				if(this.chooseAreaPopupData.length == 2) {
					let obj = {
						"code": item.code,
						"name": item.name,
					};
					this.chooseAreaPopupData.push(obj);
				}else {
					this.chooseAreaPopupData['2'] = {
						"code": item.code,
						"name": item.name,
					};
				}
				this.selectAreaFlag = 2;
				this.toSaveArea();
			},
			toSaveArea() {
				this.checkedAreaData = [];
				this.checkedAreaData = this.chooseAreaPopupData;
				this.addressArea = '';
				for(let i in this.checkedAreaData) {
					this.addressArea = this.addressArea + this.checkedAreaData[i].name + '-';
				}
				this.addressArea = this.addressArea.slice(0, this.addressArea.length - 1);
				console.log(this.addressArea, this.checkedAreaData);
				this.$refs.chooseAreaPopup.close();
			},
			getMotorcade(){
				var that = this;
				 var fleetInfo = this.params;
				  var params = new Object();
				  if (fleetInfo) {
					if (fleetInfo.fleetAttributes == "车型" || fleetInfo.fleetAttributes == "线路" || fleetInfo.fleetAttributes == "行业") {
					  params = {
						typeChannel: 2
					  }
					} else {
					  params = {
						typeChannel: 1
					  }
					}
				  } else {
					params = {
					  typeChannel: 1
					}
				  }
				ship.postRequest('/ts/motorcade/type/get', params)
				.then(res=>{
					if(res.retCode == '0000000') {
						console.log(res)
						that.attrArr = res.rspBody.items;
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
							duration: 3000
						})
					}
				})
			},
			goCarType(){
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/fleetCarType?newFleet=1&checkedCarLongVal=' + this.params.cartLength + '&model=' + this.params.model
				})
			},
			goArea(){
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/advantageArea?areaText=' + this.params.advantageArea
				})
			},
			goIndustry(){
				uni.navigateTo({
					url: '/pages/goodsDelivery/fleetIndex/advantageIndustry?industryText=' + this.params.advantageIndustry + '&customText=' + this.customText
				})
			},
			attrTap(val){
				this.params.fleetAttributes = val
			},
			verifyTap(val){
				this.params.verificationMethod = val
			},
			visibleTap(val){
				this.params.fleetVisibility = val
			},
			allowTap(val, type){
				if(type ==1){
					this.params.allowDriverContact = val
				} else {
					this.params.allowConsignorContact = val
				}
			},
			onBlur(e){
				if(e.detail.height){
					this.textareaFocus = true;
				} else {
					this.textareaFocus = false;
				}
			},
			checkSize(e) {
				console.log(e, 'asa')
				var val = e.detail.value;
				this.$nextTick(function() {
					this.params.name = this.limitstr(val,32);
				})
				
				
			},
			inputName(e){
				var val = e.detail.value;
				this.$nextTick(function() {
					this.params.name = val.replace(/\s+/g, '');
				})
			},
			inputSlogan(e){
				var val = e.detail.value;
				this.$nextTick(function() {
					this.params.slogan = val.replace(/\s+/g, '');
					console.log(this.params.slogan.length)
				})
			},
			//口号
			checkSloganSize(e) {
				var val = e.detail.value;
				this.$nextTick(function() {
					this.params.slogan = this.limitstr(val,32);
				})
				
			},
			limitstr(strval,strnum) {
				let re = "";
				let strleng = strval.length;
				//返回字符串的总字节数
				let byteleng = strval.replace(/[^\x00-\xff]/g,'**').length;
				
				if(byteleng<=strnum)return strval;
				for(var i=0, bytenum=0;i<strleng;i++){
				  var byte = strval.charAt(i);
				  if(/[\x00-\xff]/.test(byte)){
				   bytenum++;//单字节字符累加1
				  }else{
				   bytenum+=2;//非单字节字符累加2
				  }
				  if(bytenum<=strnum){re+=byte}else{return re}
				 }
			},
			showValidationStatus(flag, status) { // 根据选中的状态改变颜色及标题文字
				switch(status) {
					case 2:
						return flag == 'color' ? '#5BBC80;' : '需要验证';
					case 1:
						return flag == 'color' ? '#0077FF;' : '无需验证';
					case 0:
						return flag == 'color' ? '#FF7D4A;' : '拒绝加入';
				}
			},
			changeBtnStyle(status) { // 根据选中状态给予按钮不同的颜色
				let color = this.showValidationStatus('color', status);
				let backgroundColor = 'background:' + color;
				let borderLeftColor = 'border-left-color:' + color;
				let borderRightColor = 'border-right-color:' + color;
				let borderBottomColor = 'border-bottom-color:' + color;
				return backgroundColor + borderLeftColor + borderRightColor + borderBottomColor;
			},
			backToFromPage() {
				uni.navigateBack()
			},
			upFile() {
				//上传车队徽章
				var that = this;
				uni.chooseImage({
					count: 1, // 默认9  
					crop: { width: 1060, height: 1060, quality: 100, resize: true },
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
					success: function(res) {
						console.log(res);
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
						var tempFilePaths = res.tempFilePaths
						console.log(tempFilePaths, '图片上传')
						that.uploadFrontImage(tempFilePaths[0]);
						
					}
				})
				
			},
			uploadFrontImage(path) {
				var that = this;
				uni.showLoading({
					title: '请稍候...',
				})
				utils.upLoadFile("/file/upload", path)
				.then(result => {
					uni.hideLoading()
					if (result.retCode == '0000000') {
						that.params.badgeImage = result.rspBody[0].url;	
						that.$forceUpdate();
						console.log(that.params.badgeImage);
					} else {
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						})
					}
					
				}).catch(err => {
					uni.hideLoading()
				})
			},
			async submit() {
				console.log('开始保存');
				//提交
				if (!ship.btnRepeat()) return;
				var params = this.params;
				if (!this.params.name) {
					uni.showToast({
						title: '请输入车队名称',
						icon: 'none'
					})
					return;
				}
				if (!this.params.name) {
					uni.showToast({
						title: '请输入车队名称',
						icon: 'none'
					})
					return;
				}
				if (!this.params.slogan) {
					uni.showToast({
						title: '请输入车队口号',
						icon: 'none'
					})
					return
				}
				if (!this.params.cartLength || !this.params.model) {
					uni.showToast({
						title: '请选择车型车长',
						icon: 'none'
					})
					return;
				}
				if(this.checkedAreaData.length==0){
					uni.showToast({
						title: '请选择所在省市',
						icon: 'none'
					})
					return
				}
				if (!this.params.fleetAttributes) {
					uni.showToast({
						title: '请选择车队类型',
						icon: 'none'
					})
					return;
				}
				if (this.params.verificationMethod === '') {
					uni.showToast({
						title: '请选择验证方式',
						icon: 'none'
					})
					return;
				}
				if (!this.params.fleetVisibility) {
					uni.showToast({
						title: '请选择可见性',
						icon: 'none'
					})
					return;
				}
				if (!this.params.id && !this.ruleCheckFlag){
					uni.showToast({
						title: '请勾选协议',
						icon: 'none'
					})
					return;
				};
				
				try{
					isClicking = true;
					uni.showLoading({
						title: '提交中',
					})
					if(this.params.id){
						
					} else {
						params.role = this.userRole;
					}
					var willParams = {
						...params
					}
					if (this.isEdit) {
						//如果是编辑，只传改变的字段
						if (params.name == this.oldParams.name) {
							willParams.name && delete willParams.name
						}
					} else {
						var arr = [];
						// params.verificationMethod = this.validationFlag;
					}
					if(this.checkedAreaData.length<2){
						willParams.provinceName = '';
						willParams.provinceCode = '';
						willParams.cityName = this.checkedAreaData[0].name;
						willParams.cityCode = this.checkedAreaData[0].code;
					} else if(this.checkedAreaData.length<3) {
						willParams.provinceName = this.checkedAreaData[0].name;
						willParams.provinceCode = this.checkedAreaData[0].code;
						willParams.cityName = this.checkedAreaData[1].name;
						willParams.cityCode = this.checkedAreaData[1].code;
					}
					if(this.customText){
						willParams.advantageIndustry = willParams.advantageIndustry + '*' + this.customText
					}
					console.log(willParams);
					console.log(JSON.stringify(willParams), '参数')
					let that = this;
					willParams.isRecommend != undefined && delete willParams.isRecommend;
					var res = await ship.postRequest("/cd/fleet/save", willParams);
					console.log(res, '新建成功');
					uni.hideLoading();
					isClicking = false;
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						})
						
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							})
						}, 1000)
						
						if (that.isEdit) {
							// if(params.version){
							// 	params.version = params.version + 1;
							// }
							uni.$emit("editFleetDetail", params);
						} else {
							uni.$emit('refresFleetList');
						}
						that.subscribeGroup(res.rspBody.toString());
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
					
				}catch(e){
					isClicking = false;
					uni.hideLoading();
					//TODO handle the exception
				}
				
			},
			subscribeGroup(groupId) { // 订阅群聊
				var groupIds = [];
				groupIds.push(groupId);
				this.goEasy.im.subscribeGroup({
					groupIds:groupIds, //聊天对象的userId
					onSuccess: function () { //标记成功
						console.log("订阅成功") 
					},
					onFailed: function (error) { //标记失败
						console.log("订阅失败", error);
					}
				});
			},
			lookRule() {
				// uni.navigateTo({
				// 	url: '../rule/rule'
				// })
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2;
	}
	.fleetCreate {
		padding-bottom: 100rpx;
		.newHeader {
			width: 750rpx;
			padding:70rpx 0 0 0;
			height: 550rpx;
			border-radius: 0 0 10% 10%;
			position: fixed;
			z-index: -1;
			top: 0;
			left: 0;
			right: 0;
			// background: linear-gradient(30deg, rgba(0, 250, 255, 1) 30%, rgba(0, 119, 255, 1) 100%);
			// background: linear-gradient(360deg, #1E52C4 0%, #497FFB 100%);
			background-color: #497FFB;
		}
		.headBox {
			position: fixed;
			left: 0;
			right: 0;
			top: 0rpx;
			height: 234rpx;
			box-sizing: border-box;
			background-color: #497FFB;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 99;
			text-align: center;
			font-size:36rpx;
			color:#FFF;
			.uniIcon {
				position: absolute;
				left:40rpx;
			}
		}
		.createFrom {
			// position: fixed;
			// top: 234rpx;
			// left: 0;
			// right: 0;
			// bottom: 230rpx;
			// margin:-24rpx 24rpx 0 24rpx;
			margin: 230rpx 24rpx 0 24rpx;
			background-color: #FFF;
			border-radius: 12rpx;
			padding: 60rpx 32rpx 180rpx 32rpx;
			box-shadow: 0px 0px 12rpx 0px rgba(0,0,0,0.18);
			.teamLogoBox {
				position: fixed;
				top: 220rpx;
				left: 50rpx;
				right: 50rpx;
				display: flex;
				z-index: 99;
				align-items: flex-end;
				.upLoadBox {
					width: 118rpx;
					height: 118rpx;
					padding: 10rpx;
					background: #FFFFFF;
					border-radius: 16rpx;
					margin:-60rpx 24rpx 0 0;
					.upLoadBtn {
						width: 118rpx;
						height: 118rpx;
						// background: #EFF3F4;
						border-radius: 16rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						.upImg {
							width: 118rpx;
							height: 118rpx;
						}
						.upRemoteImg {
							width: 118rpx;
							height: 118rpx;
							border-radius: 16rpx;
						}
					}
				}
				.upLoadMsg {
					height: 53rpx;
					line-height: 53rpx;
					padding-bottom:10rpx;
					position: fixed;
					top: 230rpx;
					right: 24rpx;
					left: 183rpx;
					background-color: #fff;
					border-top-right-radius: 12rpx;
					.title {
						font-size:30rpx;
						color:#333;
					}
					.hint {
						font-size:26rpx;
						color:#777;
					}
				}
			}
			.teamMsgInput + .teamMsgInput {
				border-top: 2rpx solid rgba(237, 237, 237, 0.5);
			}
			.visible-tip{
				font-size: 24rpx;
				color: #9A9A9A;
				text-align: right;
				line-height: 34rpx;
				width: 100%;
			}
			.teamMsgInput {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx 0 20rpx 0;
				&.contact-box{
					justify-content: space-between;
					align-items: flex-start;
					flex-direction: row;
					.inputLongTitle {
						line-height: 46rpx;
						font-size: 30rpx;
						color: #333333;
						height: 46rpx;
					}
					.attr-arr{
						width: 394rpx;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						flex-wrap: wrap;
						.attr-select{
							font-size: 26rpx;
							color: #333;
							text-align: right;
						}
						.icon_right{
							width: 16rpx;
							height: 28rpx;
							margin-left: 16rpx;
						}
						.verify-text{
							padding: 16rpx 32rpx;
							background-color: #FF7D4A;
							color: #fff;
							font-size: 24rpx;
							border-radius: 36rpx;
							margin-bottom: 24rpx;
							margin-left: 32rpx;
						}
						.verify-text1{
							padding: 16rpx 32rpx;
							background-color: #fff;
							color: #333;
							font-size: 24rpx;
							border-radius: 36rpx;
							border: 2rpx solid #D3D3D3;
							box-sizing: border-box;
							margin-bottom: 24rpx;
							margin-left: 32rpx;
						}
					}
				}
				&.attr-box{
					justify-content: space-between;
					align-items: flex-start;
					flex-direction: row;
					.inputTitle {
						line-height: 46rpx;
						font-size: 30rpx;
						color: #333333;
						height: 46rpx;
						padding: 0;
						display: flex;
						align-items: center;
					}
					.attr-arr{
						width: 420rpx;
						display: flex;
						flex-direction: row;
						// justify-content: space-between;
						justify-content: flex-end;
						align-items: center;
						flex-wrap: wrap;
						.attr-text{
							width: 116rpx;
							height: 52rpx;
							border-radius: 26rpx;
							background-color: #FF7D4A;
							text-align: center;
							line-height: 52rpx;
							color: #fff;
							font-size: 24rpx;
							margin-bottom: 24rpx;
							margin-left: 25rpx;
						}
						.attr-text1{
							width: 116rpx;
							height: 52rpx;
							border-radius: 26rpx;
							background-color: #fff;
							text-align: center;
							line-height: 52rpx;
							color: #333;
							font-size: 24rpx;
							margin-bottom: 24rpx;
							border: 2rpx solid #D3D3D3;
							box-sizing: border-box;
							margin-left: 25rpx;
						}
					}
				}
				&.modelWhole {
					justify-content: flex-start;
					align-items: flex-start;
					flex-direction: row;
					.inputTitle {
						line-height: 46rpx;
						font-size: 30rpx;
						color: #333333;
						width: 120rpx;
						height: 46rpx;
						padding: 0;
					}
					.modelArr {
						flex: 1;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						flex-wrap: wrap;
						.modelItem {
							width: 140rpx;
							box-sizing: border-box;
							padding: 0 32rpx;
							height: 46rpx;
							border-radius: 23rpx;
							border: 1px solid #D3D3D3;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 24rpx;
							margin-left: 32rpx;
							margin-bottom: 16rpx;
							&.input {
								width: 140rpx;
							}
							&.active {
								background-color: #FF7D4A;
								color: #FFFFFF;
								border-color: #FF7D4A;
							}
						}
					}
				}
				.inputTitle {
					line-height: 42rpx;
					font-size: 30rpx;
					color: #333333;
					padding-right:32rpx;
				}
				.hintClass {
					font-size: 24rpx;
					color: rgba(119, 119, 119, 0.74);
				}
				.valueInput {
					font-size: 30rpx;
					color: #333333;
					flex: 1;
					text-align: right;
				}
				.validationBox {
					height: 130rpx;
					.validationMsg {
						border-width: 2rpx;
						border-style: solid;
						border-radius: 12rpx 12rpx 0 0;
						width:214rpx;
						height: 64rpx;
						line-height: 64rpx;
						text-align: center;
						font-size: 26rpx;
					}
					.validationBtnGroup {
						// display: flex;
						width:218rpx;
						.validationBtn {
							border-bottom-width: 2rpx;
							border-left-width: 2rpx;
							border-right-width: 2rpx;
							border-bottom-style: solid;
							border-left-style: solid;
							border-right-style: solid;
							border-radius: 0 0 12rpx 12rpx;
							height: 18rpx;
							display: flex;
							padding:15rpx 0;
							position: absolute;
							.validationBtnIcon1 {
								width: 16rpx;
								height: 18rpx;
							}
							.validationBtnIcon2 {
								width: 16rpx;
								height: 16rpx;
								margin-top:1rpx;
							}
						}
						.validationBtnChecked {
							width: 78rpx;
							justify-content: center;
							box-shadow: 0px 2rpx 4rpx 0px rgba(0,0,0,0.33);
							z-index: 100;
						}
						.validationBtnDefault {
							width: 52rpx;
							background-color: #FFF;
							border-bottom-color: #777;
							border-left-color: #777;
							border-right-color: #777;
							z-index: 98;
						}
					}
				}
			}
		}
		.ruleBox {
			padding: 32rpx 64rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			background-color: #F2F2F2;
			.rule-text{
				display: flex;
				.checkRuleIcon {
					width: 32rpx;
					height: 32rpx;
					margin-right:22rpx;
				}
				.ruleDetail {
					font-size: 26rpx;
					color: #707071;
					line-height: 37rpx;
					.ruleDetailBtn {
						font-size: 26rpx;
						color: #0077FF;
					}
				}
			}
			.submitBtn {
				width:610rpx;
				height: 76rpx;
				line-height: 76rpx;
				background: #0077FF;
				border-radius: 38rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
				margin-top: 30rpx;
			}
		}
		
		.chooseAreaBox {
			background-color: #FFF;
			height: 900rpx;
			.checkedArea {
				color:#4AA2F3;
			}
			.defaultArea {
				color:#333;
			}
			.areaPopupHead {
				padding: 0 36rpx 0 28rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #E3E3E3;
				height: 92rpx;
				.checkedAreaBox {
					display: flex;
					align-items: center;
					.areaList + .areaList {
						margin-left: 36rpx;
					}
					.areaList {
						min-width:100rpx;
						text-align: center;
						padding-top: 22rpx;
						.areaMsg {
							font-size: 28rpx;
							line-height: 40rpx;
							margin-bottom:22rpx;
							max-width:200rpx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							word-break: break-all;
						}
						.checkedLine {
							height: 6rpx;
							background: #4AA2F3;
							border-radius: 2rpx;
						}
						.defaultLine {
							height: 6rpx;
							background: #FFF;
							border-radius: 2rpx;
						}
					}
				}
				.closeAreaPopupIcon {
					width: 24rpx;
					height: 24rpx;
				}
				.closeAreaPopupConfirm{
					color: #0171F9;
					font-size: 28rpx;
				}
			}
			
			.areaPopupBody {
				height: 808rpx;
				.detailsList + .detailsList {
					border-top: 2rpx solid #E3E3E3;
				}
				.detailsList {
					height: 72rpx;
					padding: 0 36rpx 0 28rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.detailsMsg {
						font-size: 28rpx;
						line-height: 40rpx;
					}
					.areaRightIcon {
						width: 18rpx;
						height: 32rpx;
					}
				}
			}
		}
	}
	.badge {
		color: red;
		height: 46rpx;
		line-height: 46rpx;
	}
	.tips {
		font-size: 24rpx;
		color: rgba(119, 119, 119, 0.74);
		line-height: 34rpx;
		border-bottom: 1px solid rgba(237, 237, 237, 1);
		padding-bottom: 20rpx;
	}
	/deep/.uni-scroll-view ::-webkit-scrollbar {
		 /* 隐藏滚动条，但依旧具备可以滚动的功能 */
		 display: none;
		 width: 0;
		 height: 0;
		 color: transparent;
		 background: transparent;
	}
	/deep/::-webkit-scrollbar {
		 display: none;
		 width: 0;
		 height: 0;
		 color: transparent;
		 background: transparent;
	}
</style>
