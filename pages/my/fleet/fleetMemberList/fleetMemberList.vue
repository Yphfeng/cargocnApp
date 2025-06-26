<template>
	<view class="fleetMemberList">
		<view class="newHeader">
			<view class="headBox">
				<!-- <i class="uni-btn-icon uniIcon" @click="backToFromPage()" style="color: #777; font-size: 27px;"></i> -->
				<image class="uniIcon" @tap="backToFromPage()" src="../../../../static/images/back.png"></image>
				{{titleName ? titleName : '车队成员'}}
				<view class="headRight" v-if="fleetDetail.isAdmin == 1 || fleetDetail.isOwner == 1">
					<!-- <image v-if="!managerEdit && !managerAudit && !managerCheck" class="memberMoreIcon" @tap="showManagePopup()" src="../../../../static/images/memberMore.png"></image> -->
					<image v-if="managerAudit && !managerCheck" class="exitManageModelIcon" @tap="closeAllModel()" src="../../../../static/images/exitManageModel.png"></image>	
					<image v-if="managerCheck && !managerAudit " src="../../../../static/images/fleetSet.png" class="memberEditIcon" @click="doManagerEdit()"></image>
				</view>
				
			
			</view>
			<view class="searchBox">
				<image class="searchIcon" src="../../../../static/images/search.png"></image>
				<input class="searchInput" placeholder-class="hintClass" type="text" placeholder="输入卡友号、手机号、车牌号" confirm-type="search" @confirm="searchConfirm" />
			</view>
		</view>
		<!-- <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
		                @scroll="scroll"> -->
		<view class="mainBox">
			<!-- 分组成员在此循环⬇️⬇️ -->
			<view class="noData-box" v-if="noData">
				<image
					class="noData"
					src="/static/images/noData.png"
					mode="widthFix"
				></image>
				<view class="">暂无数据</view>
			</view>
			<view class="memberBox" v-for="(item, index) in memberData" :key="index" :id="item.label">
				<view class="memberDetails" :class="managerAudit ? 'detailsAudit' : 'detailsDefault'">
					<!-- 成员列表在此循环⬇️⬇️ -->
					<view class="detailsBox"
						v-for="(child, cIndex) in item.children"
						:key="cIndex"
						:class="managerAudit ? 'auditDetailsBox smallBox' : child.editFlag ? 'largeBox' : 'smallBox'">
						<view class="checkMemberBox" :class="managerAudit ? 'checkBoxShow' : 'checkBoxHidden'" :style="child.auditFlag ? 'background-color:#3B97FF;' : 'background-color:rgba(74, 162, 243, 0.39);;'" v-if="managerAudit">
							<view v-if="!child.auditFlag" @tap="toCheckMember(child)" class="btnDefault"></view>
							<image v-if="child.auditFlag" @tap="toCheckMember(child)" class="btnChecked" src="../../../../static/images/memberAuditChecked.png"></image>
						</view>
						<view class="detailsHead">
							<view class="memberNameBox" @tap="showAllMsg(child)">
								<view :class="child.editFlag ? 'avatarEdit' : 'avatarDefault'">
									<image :src="child.avatar" class="avatar" v-if="child.avatar"></image>
									<image src="../../../../static/logo.png" class="avatar" v-else></image>
									
								</view>
								<view class="msgBox">
									<view class="memberName">
										{{child.userName}}
										<view v-if="child.isOwner == 1 && child.isOwner == 1" class="head_01">车队队长</view>
										<view v-if="child.isAdmin == 1 && child.isOwner !== 1" class="head_02">管理员</view>
										
										<view v-if="child.isAdmin !== 1 && child.isOwner !== 1" class="head_03">成员</view>
										<image v-show="child.editFlag" @click.stop="callUser(child.mobile)" class="callMemberIcon" src="../../../../static/images/callMember.png"></image>
										<text v-show="child.editFlag" @click.stop="callUser(child.mobile)" class="mainMsg">{{ fleetDetail.isAdmin == 1 ? child.mobile : child.hideMobile}}</text>
									</view>
									<view class="memberCarNumber" :style="child.editFlag ? 'display:flex;align-item:center;' : ''">
										<view class="content mainMsg">卡友号：{{child.userCode}}</view>
									</view>
								</view>
							</view>
							<view class="mine" v-if="userId == child.userId && !child.editFlag">我</view>
							<image class="showAllBtn" v-if="managerEdit" @tap="showAllMsg(child)" :src="child.editFlag ? '../../../../static/images/memberOpen.png' : '../../../../static/images/memberClose.png'"></image>
						</view>
						<view class="detailsBody" v-show="child.editFlag">
							<view class="memberLabelBox">
								<view class="mainMsg routeCar" style="margin-right: 20rpx;">车型车长</view>
								<view class="carLabelWhole" v-if="child.modelArr.length > 0"><view class="carLabel" v-for="atem in child.modelArr">{{atem}}</view></view>
								<view class="carLabelWhole noCarData" v-else>暂无</view>
							</view>
							<view class="memberLabelBox">
								<view class="mainMsg routeCar" style="margin-right: 20rpx;">车牌号码</view>
								<view v-if="fleetDetail.isAdmin == 1" class="carLabelWhole">
									<view class="carLabelWhole" v-if="child.plateNo.length > 0"><view class="carLabel" v-for="atem in child.plateNo">{{atem}}</view></view>
									<view class="carLabelWhole noCarData" v-else>暂无</view>
								</view>
								<view v-else>
									<view class="carLabelWhole" v-if="child.hidePlateNo.length > 0"><view class="carLabel" v-for="atem in child.hidePlateNo">{{atem}}</view></view>
									<view class="carLabelWhole noCarData" v-else>暂无</view>
								</view>
							</view>
							<view class="routeWhole">
								<view class="mainMsg route" style="margin-right: 20rpx;"><text>优势路线</text></view>
								<view class="lineLabel rightRoute" v-if="child.route">{{child.route}}</view>
								<view class="lineLabel rightRoute" v-else>暂无</view>
							</view>
							<view class="detailsMsg" style="padding-top: 20rpx; padding-bottom: 16rpx;" v-if="child.status == 1">
								<view class="msgSyb"></view>
								<text class="mainMsg">加入时间：{{child.updatedDt}}</text>
							</view>
							<view class="detailsMsg">
								<view class="msgSyb2"></view>
								<text class="mainMsg remark">备注：{{child.remark || "暂无"}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="moreBox">
				<uni-morebox :isMore="isMore"></uni-morebox>
			</view>
			
			
		</view>
		
		<view class="auditBtnGroup" v-if="managerAudit && titleName == '卡友审核'">
			<view class="btn deleteBtn" @click="setManager('refuse')">拒绝</view>
			<view class="btn addBtn" @click="checkUserMemberData()">通过</view>
		</view>
		<view class="auditBtnGroup" v-if="managerAudit && titleName == '管理查看' && isCommonRole && fleetDetail.isOwner == 1">
			<view class="btn deleteBtn" @click="setManager('delete')">删除成员</view>
			<view class="btn addBtn" @click="setManager('set')" >设为管理员</view>
		</view>
		<view class="auditBtnGroup" v-if="managerAudit && titleName == '管理查看' && isCommonRole && fleetDetail.isOwner !== 1">
			<view class="btnItem" @click="setManager('delete')">删除成员</view>
		</view>
		<view class="auditBtnGroup" v-if="managerAudit && titleName == '管理查看' && !isCommonRole">
			<view class="btn deleteBtn" @click="setManager('delete')">删除成员</view>
			<view class="btn addBtn" @click="setManager('cancel')">取消管理员</view>
		</view>
		
		<!-- 管理员操作弹窗 -->
		<uni-popup ref="managePopup" type="bottom">
			<view class="operationBox">
				<view class="operationList" @tap="showManagerModel()">管理查看</view>
				<view class="operationList" style="margin-top:4rpx;" @tap="showAuditModel()">卡友审核</view>
				<view class="operationList" style="margin-top:24rpx;" @tap="closePopup()">取消</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="noSourceNumPopup" type="center">
			<view class="noSourceNumBox">
				<image @click="closeNoNumPopup()" class="closeIcon" src="/static/images/vehicleOptions/noSourceNumClose.png"></image>
				<view class="msgBox">
					<view class="mainTitle">提示</view>
					<view class="mainContent">您车队人数已经达到上限啦，快来点击下面了解详情吧</view>
					<view class="memberTouUpBtn" @click="jumpToUserMember()">
						<view class="msg">开通会员，可邀请{{mealBaseInfo ? mealBaseInfo : 0}}位司机加入您的车队</view>
						<view class="toBuyBtn">
							<view class="btnText">去购买</view>
							<image class="membersRightIcon" src="/static/images/vehicleOptions/membersRight.png"></image>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="feetMemberHintPopup" type="center">
			<view class="fleetAddMsgPopUp">
				<view class="fleetAddMsg">{{memberHintMsg}}</view>
				<view class="fleetAddMsgBtn" @click="closeFleetMemberHintPopup">我知道了</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import * as utils from "../../../../utils/service.js";
	import * as ship from "../../../../utils/ship";
	import UniMorebox from "@/components/uni-morebox.vue"
	export default {
		components: {
			UniMorebox
		},
		data() {
			return {
				userId: '',
				defaultAvatar: 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/topBackground.jpg',
				willDoMember: [], //选中的成员
				isCommonRole: true, //是否选中的是普通成员
				titleName: '',
				noData: false,
				managerEdit: false,
				managerAudit: false,
				managerCheck: false,
				scrollView: '', // 锚点
				memberData: [],
				memberHeadData: [],
				memberOnlyData: [], //我自己
				letterChange: true,
				timer: null,
				scrollBoxHeight: '',
				fleetDetail: {},
				params: {
					pageSize: 20,
					pageNum: 1,
					count: false
				},
				freshing: false,
				fleetmemsize: '',
				mealBaseInfo: 0,
				memberHintMsg: '',
				isMore: 'more',
			}
		},
		onLoad(options) {
			let that = this;
			uni.getSystemInfo({
			    success: function (res) {
			        console.log(res);
					that.scrollBoxHeight = ((res.windowHeight) * 2) - 270;
					console.log(that.scrollBoxHeight);
			    }
			});
			//获取用户信息
			var userInfo = uni.getStorageSync("userInfo");
			if (userInfo) {
				var userId = JSON.parse(userInfo).userId;
				this.userId = userId;
			}
			this.getMealBaseList(); // 获取会员套餐信息
			//获取卡友信息
			var fleetDetail = options.fleetDetail;
			var type = options.type;
			var name = options.name;
			this.fleetDetail = JSON.parse(fleetDetail);
			console.log(fleetDetail, '卡友详情')
			uni.showLoading({
				title: '加载中'
			});
			this.params.fleetId = JSON.parse(fleetDetail).id;
			this.params.status = name == "卡友审核" ? 2 : 1;
			if (type == "check") {
				//表示是从卡友审核进来
				this.managerCheck = true;
				this.managerEdit = true;
			}
			if (name) {
				this.titleName = name;
			}
			console.log(this.params, '参数')
			this.getList("refresh");
		},
		onShow() {
			
		},
		onBackPress() {
			if (!this.managerCheck) {
				this.managerCheck = true;
				this.managerEdit = true;
				this.managerAudit = false;
				return true
			} 
		},
		onPullDownRefresh() {
			this.getList("refresh");
		},
		onReachBottom() {
			var isMore = this.isMore;
			if (isMore == "loading" || isMore == "noMore") return;
			this.isMore = "loading";
			this.getList("more");
		},
		methods: {
			getList(type) {
				var params = this.params;
				if (type == "refresh") {
					params.pageNum = 1
				} else {
					params.pageNum ++
				}
				this.params = params;
				this.getCargomember(type);
			},
			getMealBaseList() { // 会员套餐列表
				let params = {
					"setmfree": "0",
					"setmrole": "cargo",
					"setmchannel": "app",
					setmdisp: 1,
				}
				console.log('会员套餐参数', params);
				let that = this;
				ship.postRequest('/cp/set/meal/base/list', params)
				.then(function (res) {
					console.log('会员套餐结果', res);
					if(res.retCode == '0000000'){
						let rspBody = res.rspBody;
						that.mealBaseInfo = 0;
						let defvalAry = [];
						if(rspBody && rspBody.length > 0) {
							let items = rspBody[rspBody.length - 1];
							let setmitemsJson = items.setmitems.replace(/\//g, '');
							let obj = JSON.parse(setmitemsJson);
							that.mealBaseInfo = Number(obj.fleetmemsize.defval);
							console.log('套餐可加入车队人数', that.mealBaseInfo);
							// uni.hideLoading();
						}
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					console.log('会员套餐请求失败', res.retDesc);
				})
			},
			closeFleetMemberHintPopup() {
				this.$refs.feetMemberHintPopup.close();
			},
			getCargomember(type) {
				console.log(this.params, '参数')
				uni.showLoading({
					title: '加载中'
				});
				ship.newQueryPostRequest("/cd/fleetWithUser/list", this.params).then(res => {
					console.log(res, '卡友信息')
					uni.hideLoading();
					
					uni.stopPullDownRefresh();
					if (res.retCode == "0000000") {
						var memberArr = res.rspBody.items;
						
						var memberData = [];
						var headChildren = [];
						
						try{
							memberArr.forEach(item=> {
								var plateNo = item.plateNo;
								var plateNoArr = [];
								var hidePlateNoArr = [];
								if (plateNo) {
									plateNoArr = plateNo.split(",");
									plateNoArr.forEach(at => {
										var pl = at.charAt(0) + '***' + at.charAt(at.length - 1)
										hidePlateNoArr.push(pl);
									})
								}
								var model = item.model || "";
								var route = item.route || "";
								var mobile = item.mobile || "";
								console.log("电话",mobile)
								mobile = mobile.toString();
								
								var cartLength = item.cartLength;
								
								console.log("电话1",mobile)
								headChildren.push({
									editFlag: false,
									auditFlag: false,
									...item,
									hidePlateNo: hidePlateNoArr,
									hideMobile: mobile.slice(0, 3) + '****' + mobile.slice(-3),
									modelArr: model? model.split(',') : [],
									routeArr: route ? route.split(',') : [],
									cartLengthArr: cartLength ? cartLength.split(',') : [],
									plateNo: plateNoArr,
								})
								
							})
							
							
							uni.hideLoading();
							console.log(memberData, '卡友数据', headChildren)
							var newArr = [];
							if (headChildren.length > 0) {
								memberData.unshift({
									children: headChildren,
								})
							}
							console.log(memberData, 'asas');
							var memberList = this.memberData;
							if (type == "refresh") {
								this.memberData = memberData;
								this.noData = memberData.length < 1
								this.isMore = "more"
								
							} else {
								this.memberData = memberList.concat(memberData);
								this.noData = false;
								console.log("more长度",memberData[0].children.length, this.params.pageSize)
								this.isMore = memberData[0].children.length < this.params.pageSize ? 'noMore' : 'more'
							}
							
							
							
						}catch(e){
							this.isMore = "more";
							//TODO handle the exception
							console.log(e, '错误信息')
						}
					
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					
				}).catch(err => {
					uni.hideLoading();
				})
			},
			showAllMsg(item) { // 查看详情，展开当前选中成员并关闭其他展开的成员
				//判断是否是编辑模式
				if (this.managerAudit && !this.managerCheck && !this.managerEdit) {
					this.toCheckMember(item);
					return;
				}
				if(this.managerAudit) return false;
				for(let i in this.memberData) {
					for(let c in this.memberData[i].children) {
						if(this.memberData[i].children[c].id == item.id) {
							this.memberData[i].children[c].editFlag = !this.memberData[i].children[c].editFlag
						}else {
							this.memberData[i].children[c].editFlag = false;
						}
					}
				}
				this.$forceUpdate();
			},
			toCheckMember(item) { // 选中成员,保存成员时根据所选成员的选中状态 push或indexOf 成员ID
				//判断我的身份
				var fleetDetail = this.fleetDetail;
				var myIsOwner = fleetDetail.isOwner;
				var myIsAdmin = fleetDetail.isAdmin;
				var willDoMember = this.willDoMember;
				var isOwner = item.isOwner;
				//判断该用户是管理员还是普通成员
				var isAdmin = item.isAdmin;
				
				if (isOwner == 1) {
					uni.showToast({
						title: '不能操作车队长',
						icon: 'none'
					})
					
					return;
				}
				
				if (myIsAdmin ==  1 && isAdmin == 1 && myIsOwner !== 1 ) {
					uni.showToast({
						title: '管理员只能操作普通用户',
						icon: 'none',
					})
					return;
				}
				console.log(willDoMember, 'asas')
				if (willDoMember.length > 0) {
					var findIndex = willDoMember.findIndex(atem => {
						return atem.isAdmin !== item.isAdmin;
					})
					if (findIndex > -1) {
						uni.showToast({
							title: '只可同时操作管理员或普通用户',
							icon: 'none'
						})
						return;
					}
				}
				if (item.isAdmin == 1) {
					this.isCommonRole = false
				} else {
					this.isCommonRole = true
				}
				
				for(let i in this.memberData) {
					for(let c in this.memberData[i].children) {
						
						if(this.memberData[i].children[c].id == item.id) {
							
							this.memberData[i].children[c].auditFlag = !this.memberData[i].children[c].auditFlag;
							if (this.memberData[i].children[c].auditFlag) {
								willDoMember.push(item)
							} else {
								var findIndex = willDoMember.findIndex(atem => {
									return atem.isAdmin == item.isAdmin;
								})
								willDoMember.splice(findIndex, 1);
								
							}
						}
					}
				}
				this.willDoMember = willDoMember;
				this.$forceUpdate();
			},
			backToFromPage() {
				//返回前一页
				if (!this.managerCheck) {
					this.managerCheck = true;
					this.managerEdit = true;
					this.managerAudit = false
				} else {
					uni.navigateBack()
				}
			},
			showManagePopup() { // 打开弹窗
				this.$refs.managePopup.open();
			},
			closePopup() { // 关闭弹窗
				this.$refs.managePopup.close();
			},
			showManagerModel() { // 开启查看详情模式
				this.managerEdit = true;
				this.$refs.managePopup.close();
			},
			showAuditModel() { // 开启审核模式
				this.managerAudit = true;
				this.$refs.managePopup.close();
				console.log(this.fleetDetail, '阿萨')
				
				this.params.status = 2
				this.getList("refresh");
				
			},
			doManagerEdit() {
				//开启管理模式
				for(let i in this.memberData) {
					for(let c in this.memberData[i].children) {
						this.memberData[i].children[c].editFlag = false;
						this.memberData[i].children[c].auditFlag = false;
					}
				}
				this.managerAudit = true;
				this.managerCheck = false;
				this.managerEdit = false;
				this.$refs.managePopup.close();
				console.log(this.fleetDetail, '阿萨')
				
			},
			closeAllModel() { // 关闭管理员查看模式
				for(let i in this.memberData) {
					for(let c in this.memberData[i].children) {
						this.memberData[i].children[c].editFlag = false;
						this.memberData[i].children[c].auditFlag = false;
					}
				}
				this.managerEdit = true;
				this.managerAudit = false;
				this.managerCheck = true;
				this.$refs.managePopup.close();
			},
			searchConfirm(e) {
				
				//搜索车队成员
				console.log(this.params, 'asas', e)
				var value = e.detail.value;
				if (!value) {
					this.params.keyword && delete this.params.keyword
				} else {
					this.params.keyword = value;
				}
				uni.hideKeyboard();
				
				this.getList("refresh");
				
			},
			callUser(mobile) {
				if(this.fleetDetail.isAdmin != 1) return;
				uni.makePhoneCall({
				    phoneNumber: mobile,
				});
			},
			checkUserMemberData() {
				if(this.fleetDetail.ext3 && (this.fleetDetail.ext3 == 'SUPER_FLEET' || this.fleetDetail.ext3 == '平台')) {
					this.setManager('pass');
				}else {
					let params = {
						"usersid": this.fleetDetail.userId,
						"setmchannel": "app"
					}
					console.log('剩余条数费参数', params);
					let that = this;
					ship.postRequest('/cp/member/queryByUser', params)
					.then(function (res) {
						console.log('剩余条数结果', res);
						if(res.retCode == '0000000'){
							let noteStr = res.rspBody.setmitems;
							noteStr = noteStr.replace(/\//g, '');
							noteStr = JSON.parse(noteStr);
							console.log('JSON剩余条数结果', noteStr);
							that.fleetmemsize = Number(noteStr.fleetmemsize.nowsurnum);
							if(that.fleetmemsize < 1) {
								if(that.fleetDetail.isOwner) { // 当前为车队长
									if(that.fleetDetail.serviceType == 20) { // 车队长角色为货主
										that.$refs.noSourceNumPopup.open();
									}else {
										that.memberHintMsg = '您当前车队人数达到最大上限。需要扩充人数，请联系400-016-0606';
										that.$refs.feetMemberHintPopup.open();
									}
								}else if(that.fleetDetail.isAdmin) { // 当前为管理员
									if(that.fleetDetail.serviceType == 20) { // 车队长角色为货主
										that.memberHintMsg = '当前车队人数已经达到上限啦～快让车队创建人去充值会员吧';
										that.$refs.feetMemberHintPopup.open();
									}else {
										that.memberHintMsg = '您当前车队人数达到最大上限。需要扩充人数，请联系400-016-0606';
										that.$refs.feetMemberHintPopup.open();
									}
								}
							}else {
								that.setManager('pass');
							}
						} else{
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					})
					.catch(err=>{
						console.log('剩余条数请求失败', res.retDesc);
					})
				}
			},
			setManager(type) {
				//拒绝成员/通过
				var that = this;
				var memberData = this.memberData;
				console.log(memberData, '参数111', this.fleetDetail)
				
				var willData = {
					fleetId: this.fleetDetail.id,
				};
				var idList = [];
				if (type == "refuse") {
					// willData.status = 0;
					// memberData.forEach(item => {
					// 	var children = item.children;
					// 	children.forEach(atem => {
					// 		if (atem.auditFlag) {
					// 			idList.push(atem.id)
					// 		}
					// 	})
					// })
					// willData.idList = idList;
					memberData.forEach(item => {
						var children = item.children;
						children.forEach(atem => {
							if (atem.auditFlag) {
								idList.push(atem.id)
							}
						})
					})
					willData.idList = idList;
				} else if (type == "pass") {
					willData.status = 1;
					memberData.forEach(item => {
						var children = item.children;
						children.forEach(atem => {
							if (atem.auditFlag) {
								idList.push(atem.id)
							}
						})
					})
					willData.idList = idList;
				} else if (type == "set") {
					willData.isAdmin = 1;
					memberData.forEach(item => {
						var children = item.children;
						children.forEach(atem => {
							if (atem.auditFlag) {
								idList.push(atem.id)
							}
						})
					})
					willData.idList = idList;
				} else if (type == "delete") {
					memberData.forEach(item => {
						var children = item.children;
						children.forEach(atem => {
							if (atem.auditFlag) {
								idList.push(atem.id)
							}
						})
					})
					willData.idList = idList;
				} else if (type == "cancel") {
					willData.isAdmin = 0;
					memberData.forEach(item => {
						var children = item.children;
						children.forEach(atem => {
							if (atem.auditFlag) {
								idList.push(atem.id)
							}
						})
					})
					willData.idList = idList;
				}
				
				if (willData.idList.length < 1) {
					uni.showToast({
						title: '请选择成员',
						icon: 'none'
					})
					
					return
				}
				var title = "", url = "";
				if (type == "refuse") {
					title = "确定拒绝吗";
					// url = "/cd/fleetWithUser/save"
					url = "/cd/fleetWithUser/remove"
				} else if (type == "pass") {
					title = "确定通过吗?";
					url = "/cd/fleetWithUser/save";
				} else if (type == "set") {
					title = "确定设为管理员吗?";
					url = "/cd/fleetWithUser/save"
				} else if (type == "delete") {
					title = "确定删除吗?";
					url = "/cd/fleetWithUser/remove"
				} else {
					title = "确定取消设置吗?";
					url = "/cd/fleetWithUser/save"
				}
				
				var successInfo = '操作成功';
				console.log(willData, '提交的参数')
				uni.showModal({
					title: title,
					success: function(res) {
						if (res.confirm) {
							uni.showLoading();
							console.log(willData, '数据1')
							ship.postRequest(url, willData)
							.then(res => {
								console.log(res, 'asa')
								uni.hideLoading();
								if (res.retCode == '0000000') {
									uni.showToast({
										title: successInfo,
										icon: 'none',
									})
									that.willDoMember = [];
									setTimeout(() => {
										that.managerCheck = true;
										that.managerEdit = true;
										that.managerAudit = false;
										that.memberData = [];
										setTimeout(() => {
											that.getList("refresh");
										}, 500)
										
										uni.$emit("refreshMember");
										uni.$emit("memberRefresh"); // 刷新车队详情内成员
										
									}, 1000)
								} else {
									uni.showToast({
										title: res.retDesc,
										icon: 'none'
									})
								}
							}).catch(err => {
								uni.hideLoading();
							})
						}
					}
				})
			},
			jumpToUserMember() { // 跳转会员列表
				this.$refs.noSourceNumPopup.close();
				uni.navigateTo({
					url: '/pages/goodsDelivery/userCenter/member/memberPage?pageName=sourceIndex'
				})
			},
			closeNoNumPopup() { // 关闭充值弹窗
				this.$refs.noSourceNumPopup.close();
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2;
	}
	.fleetMemberList {
		.moreBox {
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.newHeader {
			width: 750rpx;
			padding:70rpx 0 0 0;
			height: 200rpx;
			background: #FFF;
			position: fixed;
			top: 0;
			z-index: 10;
			.headBox {
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size:36rpx;
				color:#333;
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
					width: 34rpx;
					height: 8rpx;
					position: absolute;
					right:40rpx;
					margin-top:26rpx;
				}
				.memberEditIcon {
					width: 36rpx;
					height: 36rpx;
					position: absolute;
					right:40rpx;
					top: 0;
					margin-top:16rpx;
				}
				.exitManageModelIcon {
					width: 36rpx;
					height: 36rpx;
					position: absolute;
					right:40rpx;
					margin-top:14rpx;
				}
			}
			.searchBox {
				margin: 40rpx 24rpx 0 24rpx;
				padding: 0 24rpx 0 24rpx;
				height: 62rpx;
				background: rgba(216, 216, 216, 0.16);
				border-radius: 31rpx;
				display: flex;
				align-items: center;
				.searchIcon {
					width:26rpx;
					height: 26rpx;
				}
				.hintClass {
					font-size: 28rpx;
					color: #777777;
				}
				.searchInput {
					flex: 1;
					height: 62rpx;
					padding: 0 12rpx;
					font-size: 28rpx;
					color: #333;
				}
			}
		}
		.mainBox {
			padding-top:270rpx;
			.memberBox {
				.memberItemLabel {
					padding: 16rpx 24rpx;
					font-size: 26rpx;
					color: rgba(119, 119, 119, 0.84);
					line-height: 36rpx;
				}
				.detailsAudit {
					padding: 0 44rpx 0 0;
				}
				.detailsDefault {
					padding: 20rpx 44rpx 20rpx 20rpx;
					box-sizing: border-box;
				}
				.memberDetails {
					background-color: #FFF;
					@keyframes toLargeAnimation {
					    0% {
							padding-left: 4rpx;
							padding-right: 4rpx;
							height: 100rpx;
							overflow: hidden;
					    }
					    100% {
							box-shadow: 0px 0px 10rpx 0px rgba(59,151,255,0.42);
							border-radius: 12rpx;
							padding-top: 16rpx;
							padding-bottom: 26rpx;
							padding-left: 32rpx !important;
							padding-right: 16rpx !important;
							height: 100%;
					    }
					}
					.largeBox {
						animation: toLargeAnimation 0.4s;
						box-shadow: 0px 0px 10rpx 0px rgba(59,151,255,0.42);
						border-radius: 12rpx;
						padding-top: 16rpx;
						padding-bottom: 26rpx;
						padding-left: 32rpx !important;
						padding-right: 16rpx !important;
						height: 100%;
					}
					.smallBox {
						padding-left: 4rpx;
						padding-right: 4rpx;
						height: 100rpx;
						overflow: hidden;
						display: flex;
						justify-content: center;
						align-items: center;
						.detailsHead {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							width: calc(100vw - 48rpx);
							position: relative;
						}
						.showAllBtn {
							position: absolute;
							top: 0;
							right: 0;
						}
						.mine {
							position: absolute;
							bottom: 10rpx;
							right: 0;
							font-size: 24rpx;
							color: #777777;
						}
					}
					.auditDetailsBox + .auditDetailsBox {
						border-top: 2rpx solid rgba(151, 151, 151, 0.19);
					}
					.auditDetailsBox {
						display:flex;
						height:140rpx;
						margin-top:0 !important;
					}
					.detailsBox + .detailsBox {
						margin-top: 24rpx;
					}
					.detailsBox {
						@keyframes showCheckBox {
						    0% {
								width: 0;
								margin-right: 0rpx;
						    }
						    100% {
								width: 92rpx;
								margin-right: 32rpx;
						    }
						}
						.checkBoxShow {
							animation: showCheckBox 0.5s;
							width: 92rpx;
							margin-right: 32rpx;
						}
						.checkBoxHidden {
							width: 0;
							margin-right: 0rpx;
						}
						.checkMemberBox {
							height: 140rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							overflow: hidden;
							.btnDefault {
								width: 32rpx;
								height: 32rpx;
								border: 2rpx solid #FFFFFF;
								border-radius:100%;
							}
							.btnChecked {
								width: 36rpx;
								height: 36rpx;
							}
						}
						.mainMsg {
							font-size: 28rpx;
							color: #777777;
							&.route {
								width: 110rpx;
								font-size: 26rpx;
								
							}
							&.carLen {
								width: 110rpx;
								line-height: 46rpx;
								font-size: 26rpx;
							}
							&.routeCar {
								width: 110rpx;
								line-height: 46rpx;
								font-size: 26rpx;
							}
						}
						.detailsHead {
							display: flex;
							justify-content: space-between;
							
							.memberNameBox {
								flex: 1;
								display: flex;
								align-items: center;
								.avatarDefault {
									width: 86rpx;
									height: 86rpx;
									background-color: #777;
									border-radius:100%;
									.avatar {
										width: 86rpx;
										height: 86rpx;
										border-radius:100%;
									}
								}
								.avatarEdit {
									width: 76rpx;
									height: 76rpx;
									background-color: #777;
									border-radius:100%;
									.avatar {
										width: 76rpx;
										height: 76rpx;
										border-radius:100%;
									}
								}
								
								
								.msgBox {
									flex: 1;
									padding: 0 18rpx;
									position: relative;
									.memberName {
										height: 40rpx;
										line-height: 40rpx;
										font-size: 28rpx;
										color: #333333;
										display: flex;
										align-items: center;
										.head_01 {
											padding: 5rpx 10rpx;
											background-color: rgba(255, 145, 101, 1);
											color: #FFFFFF;
											font-size: 20rpx;
											margin-left: 20rpx;
											border-radius: 4rpx;
											display: flex;
											justify-content: center;
											align-items: center;
										}
										.head_02 {
											padding: 5rpx 10rpx;
											background-color: rgba(59, 151, 255, 1);
											color: #FFFFFF;
											font-size: 20rpx;
											margin-left: 20rpx;
											border-radius: 4rpx;
											display: flex;
											justify-content: center;
											align-items: center;
										}
										.head_03 {
											padding: 5rpx 10rpx;
											background-color: rgba(119, 119, 119, 1);
											color: #FFFFFF;
											font-size: 20rpx;
											margin-left: 20rpx;
											border-radius: 4rpx;
											display: flex;
											justify-content: center;
											align-items: center;
										}
										.callMemberIcon {
											margin: 0 12rpx 0 22rpx;
											width: 24rpx;
											height: 24rpx;
										}
									}
									.memberCarNumber {
										display: flex;
										flex-direction: row;
										margin-top: 8rpx;
										.plateNoMy {
											margin-left: 20rpx;
										}
										
									}
								}
							}
							.showAllBtn {
								width: 34rpx;
								height: 34rpx;
							}
						}
						.detailsBody {
							padding-top: 28rpx;
							.routeWhole {
								display: flex;
								flex-direction: row;
								justify-content: flex-start;
								align-items: flex-start;
								.route {
									width: 110rpx;
									line-height: 43rpx;
									font-size: 26rpx;
									color: rgba(119, 119, 119, 1);
								}
								.rightRoute {
									line-height: 40rpx;
									color: rgba(255, 129, 78, 1);
									font-size: 28rpx;
									flex: 1;
									
								}
							}
							.memberLabelBox {
								
								display: flex;
								flex-direction: row;
								align-items: flex-start;
								justify-content: flex-start;
								
								.carLabelWhole {
									flex: 1;
									flex-wrap: wrap;
									display: flex;
									flex-direction: row;
									justify-content: flex-start;
									align-items: flex-start;
									font-size: 28rpx;
									&.noCarData {
										color: #FF9165;
										line-height: 46rpx;
									}
								}
								.carLabel {
									margin-right:16rpx;
								}
								.carLabel{
									color: #FF9165;
									border: 1px solid #FF9165;
									border-radius: 23rpx;
									padding: 0 10rpx;
									width: 150rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									font-size: 24rpx;
									font-weight: 500;
									height: 46rpx;
									line-height: 46rpx;
									text-align: center;
									margin-bottom: 16rpx;
									box-sizing: border-box;

								}
								.lineLabel + .lineLabel {
									margin-left:16rpx;
								}
								.lineLabel{
									flex: 1;
									flex-wrap: wrap;
									display: flex;
									flex-direction: row;
									justify-content: flex-start;
									align-items: center;
									font-size: 28rpx;
									font-weight: 500;
									color: #FF9165;
									
									&.rightRoute {
										height: 40rpx;
										line-height: 40rpx;
									}
									
									
								}
							}
							.detailsMsg {
								display: flex;
								.msgSyb {
									width: 4rpx;
									height: 22rpx;
									background: #3B97FF;
									border-radius: 3rpx;
									margin-top: 6rpx;
									margin-right: 6rpx;
								}
								.msgSyb2 {
									width: 4rpx;
									height: 22rpx;
									background: #3B97FF;
									border-radius: 3rpx;
									margin-top: 8rpx;
									margin-right: 6rpx;
								}
								.remark {
									line-height: 40rpx;
									font-size: 26rpx;
								}
							}
						}
					}
				}
			}
		}
		.auditBtnGroup {
			width: 750rpx;
			height: 100rpx;
			position: fixed;
			bottom: 0;
			display: flex;
			border-radius: 20rpx 20rpx 0px 0px;
			overflow: hidden;
			.btnItem {
				
				flex: 1;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
				background-color: #FF9165;
				border-radius: 20rpx 20rpx 0px 0px;
			}
			.btn {
				width: 50%;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
			.deleteBtn {
				background-color: #FF9165;
			}
			.addBtn {
				background-color: #3B97FF;
			}
		}
		.operationBox {
			border-radius: 20rpx 20rpx 0px 0px;
			overflow: hidden;
			background-color: #E7E8E9;
			.operationList {
				background-color: #FFF;
				height: 96rpx;
				line-height: 96rpx;
				font-size: 34rpx;
				color: #333333;
				text-align: center;
			}
		}
		.fleetAddMsgPopUp {
			background-color: #FFFFFF;
			width: 630rpx;
			height: 384rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			padding: 62rpx 50rpx 60rpx;
			box-sizing: border-box;
			border-radius: 24rpx;
			.fleetAddMsg {
				font-size: 40rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 1);
				line-height: 58rpx;
			}
			.fleetAddMsgBtn {
				width: 344rpx;
				height: 72rpx;
				border-radius: 12rpx;
				background-color: rgba(43, 114, 240, 1);
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: 500;
			}
		}
		.noSourceNumBox {
			width: 630rpx;
			.closeIcon {
				width: 48rpx;
				height: 48rpx;
				display: block;
				margin: 0 0 10rpx 582rpx;
			}
			.msgBox {
				width: 630rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				box-sizing: border-box;
				padding: 38rpx 0;
				.mainTitle {
					font-size: 40rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
				}
				.mainContent {
					margin-top: 30rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 44rpx;
					text-align: center;
					padding: 0 54rpx;
				}
				.singleTouUpBtn {
					height: 80rpx;
					padding: 0 18rpx 0 26rpx;
					margin: 44rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #E55516 0%, #EE9456 100%);
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 44rpx;
					}
					.sigleRightIcon {
						height: 30rpx;
						width: 30rpx;
						display: block;
					}
				}
				.memberTouUpBtn {
					height: 92rpx;
					padding: 0 18rpx 0 12rpx;
					margin: 20rpx 26rpx 0 26rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: linear-gradient(90deg, #31313F 0%, #1F1F28 100%);
					.msg {
						font-size: 28rpx;
						font-weight: 500;
						color: #F0AB88;
						line-height: 44rpx;
						text-align: center;
					}
					.toBuyBtn {
						flex-shrink: 0;
						margin-left: 6rpx;
						width: 128rpx;
						height: 48rpx;
						border-radius: 228rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: linear-gradient(90deg, #F1D7C8 0%, #F0A27C 100%);
						.btnText {
							font-size: 28rpx;
							font-weight: 500;
							color: #422507;
						}
						.membersRightIcon {
							width: 28rpx;
							height: 28rpx;
							display: block;
						}
					}
				}
			}
		}
	}
	.noData {
	  width: 400rpx;
	  margin-bottom: 30rpx;
	}
	.noData-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		background-color: #FFFFFF;
		height: 100%;
	}
</style>
