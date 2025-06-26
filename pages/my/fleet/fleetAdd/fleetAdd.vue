<template>
	<view class="fleetCreate">
		<view class="newHeader">
			<view class="headBox" v-if="!isAddMember">
				<i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: rgb(255, 255, 255); font-size: 27px;"></i>
				{{isEdit ? '编辑车队' : '加入车队'}}
			</view>
			<view class="headBox" v-if="isAddMember">
				<i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: rgb(255, 255, 255); font-size: 27px;"></i>
				 添加合作车队
			</view>
		</view>
		<view class="createFrom">
			<view class="teamLogoBox">
				
			</view>
			<view class="teamMsgInput">
				<view class="inputTitle"><text class="label">*</text>车队号</view>
				<input class="valueInput" v-model="params.code" @blur="getDetails('code')" @input="getDetailsByCode" @confirm="getDetails('code')" placeholder-class="hintClass" @focus="focus" maxlength="32" placeholder="在此输入需加入的车队号" />
			</view>
			<view class="teamMsgInput">
				<view class="inputTitle">车队名称</view>
				<input class="valueInput" v-model="params.name"  @input="checkNameSize" @blur="getDetails('name')" @focus="focus" @confirm="getDetails('name')" placeholder-class="hintClass" type="text" placeholder="在此输入需加入的车队名" />
			</view>
			<view class="teamMsgInput">
				<view class="inputTitle">车队徽章</view>
				<view class="badge">
					<image :src="params.badgeImage ? params.badgeImage : defaultAvatar" class="badge"></image>
				</view>
			</view>
			<view class="teamMsgInput">
				<view class="inputTitle">创始人</view>
				<view class="teamText">
					{{createName}}
				</view>
			</view>
			<view class="teamMsgInput">
				<view class="inputTitle">加入说明</view>
				<input class="valueInput" v-model="params.remark" placeholder-class="hintClass" type="text" @focus="focus" @blur="blur"  placeholder="输入加入说明" />
			</view>
		</view>
		<view class="ruleBox">
			<view class="ruleDetail">
				请确认加入的车队名、车队号、创始人及车队徽章是
				否一致！
			</view>
			<view class="ruleDetail">
				请严格遵守“货运中国”车队管理办法，不得从事任何
				违反国家法律法规、危害国家安全的事情。
			</view>
		</view>
		<view class="submitBtn" @click="submit">{{isAddMember ? '确认添加': '确认加入'}}</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/service.js"
	import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				isShow: true,
				defaultAvatar: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/images/fleetAvatar.jpg',
				params: {
					badgeImage: '',
					name: '',
					code: '',
					remark: '',
				},
				createName: '',
				oldParams: {},
				defaultValue: '',
				isEdit: false,
			}
		},
		onLoad(options) {
			console.log(options, '参数')
			var type = options.type;
			var state = options.state;
			if (state == 'addMember') {
				//表示是加入合作车队
				this.isAddMember = true
			} else {
				this.isAddMember = false
			}
			if (type == "create") {
				//表示是新建
				this.isEdit = false
			} else {
				//编辑
				this.isEdit = true;
				this.params = {...JSON.parse(options.fleetInfo)};
				this.oldParams = {
					...JSON.parse(options.fleetInfo)
				}
				this.validationFlag = JSON.parse(options.fleetInfo).verificationMethod;
				this.oldValidationFlag = JSON.parse(options.fleetInfo).verificationMethod;
				var oldModelArr = JSON.parse(options.fleetInfo).model;
				var modelArr  = this.modelArr;
				oldModelArr.forEach(item => {
					var findIndex = modelArr.findIndex(atem => {
						return atem.name == item;
					})
					if (findIndex > -1) {
						modelArr[findIndex].selected = true
					} else {
						modelArr.push({
							name: item,
							selected: true,
						})
					}
				})
				this.modelArr = modelArr;
				this.oldModelArr = oldModelArr;
			}
			
		},
		onShow() {},
		onReady() {},
		methods: {
			focus() {
				this.isShow = false
			},
			blur() {
				this.isShow = true
			},
			checkCodeSize(e) {
				var val = e.detail.value;
				console.log(val,'aaaa')
				this.$nextTick(function() {
					this.params.code = this.limitstr(val,32);
				})
			},
			checkNameSize(e) {
				var val = e.detail.value;
				this.$nextTick(function() {
					this.params.name = this.limitstr(val,32);
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
			
			findCode() {
				console.log('aa')
				this.isShow = true;
				var code = this.params.code;
				var params = {
					pageSize: 10,
					pageNum: 1,
				};
				console.log('aa', code)
				if (!code || code.length < 8) {
					return;
				}
				params.code = code;
							
				ship.newQueryPostRequest("/cd/fleet/list", params).then(res => {
					console.log(res, '要加入的车队')
					if (res.retCode == "0000000") {
						var items = res.rspBody.items;
						if (items.length > 0) {
							var userName = res.rspBody.items[0].userName;
							if (userName.length > 2) {
								this.createName = "**" + userName.substr(userName.length-1,1)
							} else {
								this.createName = "*" + userName.substr(userName.length-1,1)
							}
							this.params = res.rspBody.items[0];
						} else {
							
							
							this.params.name = "";
							this.createName = "";
							this.params.badgeImage = "";
								
							
						}
				
					}
				})
			},
			debounce(fn, wait) {
			  if (this.timer !== null) {
				clearTimeout(this.timer)
			  }
			  this.timer = setTimeout(() => {
				  fn()
			  }, wait)
			},
			getDetailsByCode() {
				//根据车队号关联出车队信息
				var that = this;
				this.debounce(this.findCode, 500);
				
			},
			getDetails(type) {
				//根据车队号关联出车队信息
				this.isShow = true;
				var code = this.params.code;
				var name = this.params.name;
				var params = {
					pageSize: 10,
					pageNum: 1,
				};
				if (type == 'code') {
					if (!code) {
						return;
					}
					params.code = code;
				} else {
					if (!name) {
						return
					}
					params.name = name;
				}
				ship.newQueryPostRequest("/cd/fleet/list", params).then(res => {
					console.log(res, '要加入的车队')
					if (res.retCode == "0000000") {
						uni.hideKeyboard();
						var items = res.rspBody.items;
						if (items.length > 0) {
							var userName = res.rspBody.items[0].userName;
							if (userName.length > 2) {
								this.createName = "**" + userName.substr(userName.length-1,1)
							} else {
								this.createName = "*" + userName.substr(userName.length-1,1)
							}
							this.params = res.rspBody.items[0];
						} else {
							uni.showToast({
								title: '车队不存在',
								icon: 'none'
							})
							if (type == "code") {
								this.params.name = "";
								this.createName = "";
								this.params.badgeImage = "";
								
							} else {
								this.params.code = "";
								this.createName = "";
								this.params.badgeImage = "";
							}
						}
				
					}
				})
			},
			backToFromPage() {
				uni.navigateBack()
			},
	
			async submit() {
				//提交
				if (!this.params.code) {
					uni.showToast({
						title: '车队号不能为空',
						icon: 'none'
					})
					return;
				}
				if (!this.params.name) {
					uni.showToast({
						title: '车队名称不能为空',
						icon: 'none'
					})
					return;
				}
				var params = {...this.params};
				var oldParams = {
					...this.oldParams
				}
				var newParams = {};
				
	
				if (this.isEdit) {
					//如果是编辑，只传改变的字段
					if (oldParams.badgeImage !== params.badgeImage) {
						newParams.badgeImage = params.badgeImage
					}
					if (oldParams.name !== params.name) {
						newParams.name = params.name
					}
					if (oldParams.slogan !== params.slogan) {
						newParams.slogan = params.slogan
					}
					if (oldParams.route !== params.route) {
						newParams.route = params.route
					}
					if (this.validationFlag !== this.oldValidationFlag) {
						newParams.verificationMethod = this.validationFlag;
					}
					if (arr.join(",") !== oldModelArr.join(',')) {
						newParams.model = arr.join(",");
					}
					if (JSON.stringify(newParams) == "{}") {
						uni.showToast({
							title: '请编辑后提交',
							icon: 'none'
						})
						return;
					}
					newParams.id = oldParams.id;
					
				} else { 
					newParams.fleetId = this.params.id;
					newParams.remark = this.params.remark;
				}
				
				try{
					console.log(newParams, '参数')
					
					uni.showLoading({
						title: '提交中',
					})
					if (this.isAddMember) {
						//合作车队
						newParams.status = 3
					}
					console.log(newParams, '加入的参数111');
					var res = await ship.postRequest("/cd/fleetWithUser/save", newParams);
					console.log(res, '新建成功');
					uni.hideLoading();
					if (res.retCode == "0000000") {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						})
						//加入成功后记录日志
						var userRole = uni.getStorageSync("userRole");
						if (userRole == 1) {
							uni.$emit('refresFleetAddList');
							var changeInfo = ['加入车队成功'];
							await utils.postRequest("/au/page/change/log/insert", {
								primaryTableId: this.params.id,
								pageName: '申请加入车队',
								changeInfo: JSON.stringify(changeInfo)
							})
						} else {
							uni.$emit('refresFleetList');
						}
						
						uni.navigateBack({
							delta: 1,
						})
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none',
						})
					}
					
				}catch(e){
					uni.hideLoading();
					//TODO handle the exception
				}
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2;
	}
	.fleetCreate {
		overflow-y: scroll;
		.newHeader {
			width: 750rpx;
			padding:70rpx 0 0 0;
			height: 170rpx;
			background: linear-gradient(30deg, rgba(0, 250, 255, 1) 30%, rgba(0, 119, 255, 1) 100%);
			.headBox {
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size:36rpx;
				color:#FFF;
				.uniIcon {
					position: absolute;
					left:40rpx;
				}
			}
		}
		.createFrom {
			margin:-24rpx 24rpx 0 24rpx;
			background-color: #FFF;
			border-radius: 12rpx;
			padding: 0 32rpx;
			min-height:200rpx;
			box-shadow: 0px 0px 12rpx 0px rgba(0,0,0,0.18);
			.teamLogoBox {
				display: flex;
				align-items: flex-end;
			
			}
			.badge {
				width: 68rpx;
				height: 68rpx;
				background-color: rgba(232, 232, 232, 1);
				border-radius: 6rpx;
			}
			
			.teamMsgInput + .teamMsgInput {
				border-top: 2rpx solid rgba(237, 237, 237, 0.5);
			}
			.teamText {
				font-size: 30rpx;
				color: #333333;
			}
			.teamMsgInput {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx 0 20rpx 0;
				.inputTitle {
					line-height: 42rpx;
					font-size: 30rpx;
					color: #333333;
					padding-right:32rpx;
					.label {
						color: red;
					}
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
			display: flex;
			flex-direction: column;
			padding: 32rpx 76rpx;
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
			margin: 40rpx 0 0 70rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
