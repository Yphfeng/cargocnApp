<template>
	<view class="mapCarSourceList" :class="{noScroll: isCollapse}">
		
		<view class="header-box">
			<view class="statusBar" :style="{height: statusBarHeight + 'rpx'}" />
			<view class="header">
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_left_arrow.png" class="car_source_left_arrow" @click="back"></image>
				<text>{{info ? info.name : '成员列表' }}</text>
			</view>
			
		</view>
		<view class="headerSendebox" :style="{height: (statusBarHeight + 88) + 'rpx'}" />
		
		<view class="selected-content">
			<view class="selected-title" :style="{top: (statusBarHeight + 88) + 'rpx'}">
				<view class="selected-item" v-for="(item, index) in chooseArr" :class="{active: item.active}" @click="showPop(index)">
					<text class="selected-title-text" v-if="index == 0">{{item.value ? item.value : '请选择'}}</text>
					<text class="selected-title-text" v-else>{{item.value}}</text>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/icon_down.png" class="icon_down" v-if="!item.active"></image>
					<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/icon_down_active.png" class="icon_down" v-else></image>
				</view>
			</view>
			<view style="height: 100rpx;" />
			<view class="selected-pop" :style="{top: (statusBarHeight + 188) + 'rpx'}" :class="{active: isCollapse}" @touchmove.prevent @click.stop="closePop">
				<view class="pop-content" v-show="isActive == 0">
					<view class="pop-title">
						<view class="pop-title-item">省份</view>
						<view class="pop-title-item">城市</view>
					</view>
					<view class="pop-inner">
						<scroll-view class="province-item" :scroll-y="true">
							<view v-for="(item, index) in provinceArr" class="item-pop pl-34" @click.stop="switchProIndex(index)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png" class="check" v-if="index == selectedProvinceIndex"></image>
								<text :class="{proActive: index == selectedProvinceIndex}">{{item.name}}</text>
							</view>
						</scroll-view>
						
						<scroll-view class="province-item" :scroll-y="true">
							<view v-for="(item, index) in cityArr" class="item-pop" @click.stop="switchCityIndex(index)">
								<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"  class="check" v-if="index == selectedCityIndex"></image>
								<text :class="{proActive: index == selectedCityIndex}">{{item.name}}</text>
							</view>
						</scroll-view>
					</view>
					<view class="pop-btn">
						<view class="pop-btn-item reset" @click.stop="reset">重置</view>
						<view class="pop-btn-item look" @click.stop="look">查看</view>
					</view>
				</view>
				<view class="pop-content" v-show="isActive == 1" @click.stop="hidePop()">
					<view class="status-item" :class="{active: index == selectedStatusIndex}" v-for="(item, index) in statusArr" @click.stop="switchStatus(index)">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"  class="check" v-if="index == selectedStatusIndex"></image>
						{{item}}
					</view>
					
				</view>
			</view>
		</view>
		<view class="list">
			<view class="noData01" v-if="carSourceList.length == 0 && isNoData != 'loading'">
				<noData></noData>
			</view>
			<view class="list-item" v-for="item in carSourceList">
				<view class="avatar-content">
					<view class="avatar">
						<image :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'" class="avatar-icon"></image>
						<!-- <view class="dot">签约</view> -->
					</view>
					<view class="avatar-title" :class="{active: item.taskStatus == 2}">
						<view class="dot" :class="{active: item.taskStatus == 2}" />
						<text>{{item.taskStatus != 2 ? '可接单' : '忙碌'}}</text>
					</view>
				</view>
				<view class="item-content">
					<view class="row">
						<view>
							<text class="name">{{showUserName(item)}}</text>
							<text class="nameType" v-if="item.isOwner || item.isAdmin">{{item.isOwner ? '（车队长）' : '（管理员）'}}</text>
							<text class="lenAndType">{{item.model?setModel(item.model):''}}</text>
						</view>
						<view />
					</view>
					<view class="row mt-16" v-if="item.circuitCombo">
						<view>
							<text class="route">常跑:</text>
							<text class="addr">{{item.circuitCombo}}</text>
						</view>
					</view>
					<view class="row row-start mt-16" v-if="showAddr(item)">
						<view class="location-icon">
							<view class="icon_content">
								<image src="/static/images/ship/beidou_icon.png" class="beidou_icon" v-if="item.dataSrc == 4"></image>
								<image src="/static/images/ship/beidou_no_icon.png" class="beidou_no_icon" v-else></image>
							</view>
							<text class="addr-text">{{showAddr(item)}}</text>
						</view>
						<view class="time">{{showDate(item)}}</view>
					</view>
					<view class="line" />
					<view class="row row-opt">
						<view class="opt-item opt-first" v-if="info.isAdmin || info.isOwner" @click="makePhoneCall(item)">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-call.png" class="point-icon"></image>
							<text>电话</text>
						</view>
						<view v-else class="opt-item"  />
						<view class="opt-item opt-middle" v-if="info.isMember == 1" @click="toChatDetails(item)">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png" class="point-icon"></image>
							<text>私信</text>
						</view>
						<view  v-else class="opt-item" />
						<view class="opt-item opt-last" @click="toTrack(item)">
							<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-location.png" class="point-icon"></image>
							<text>轨迹</text>
						</view>
					</view>
					
				<!-- 	<view class="row">
						<view class="btn-content">
							<view class="btn-item">绿通</view>
							<view class="btn-item">华中</view>
							<view class="btn-item">短途</view>
						</view>
					</view> -->
				</view>
			</view>
      <template v-for="(item,index) in carSourceList">
        <view class="car_source_item"  v-if="true">
          <view class="head">
            <image
              :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'" />
            <view class="sign_status">签约</view>
            <view class="order_receive_status">
              <view></view>
              <text>可接单</text>
            </view>
            <view class="order_receive_status_2">
              <view></view>
              <text>忙碌</text>
            </view>
          </view>
          <view class="right_content">
            <view class="name_model" style="margin-top: 4rpx">
              <view class="user_name">宋师傅</view>
              <view class="user_model">13米高栏</view>
              <image v-if="item.isCheck" @click="isAllChecked(item,index)" src="../../../static/images/isPhone.png" />
              <image v-else @click="isAllChecked(item,index)" src="../../../static/images/isPnone_block.png" />
            </view>
            <view class="name_model" style="margin-top: 24rpx">
              <view class="citys">上海 - 北京</view>
              <view class="details">
                <view>详情</view>
                <image src="../../../static/images/ChinaTravel/arrow.png" />
              </view>
            </view>
            <view class="name_model" style="margin-top: 24rpx">
              <image class="addr_icon" src="../../../static/images/satellite.png" />
              <view class="address">江苏省南通市文明区</view>
              <view class="times">10分钟前</view>
            </view>
            <view class="name_model" style="margin-top: 22rpx">
              <view class="btn-content">
                <view class="btn-item">绿通</view>
                <view class="btn-item">华中</view>
                <view class="btn-item">短途</view>
              </view>
            </view>
            <view class="line" />
            <view class="row row-opt">
              <view class="opt-item opt-first" v-if="info.isAdmin || info.isOwner" @click="makePhoneCall(item)">
                <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-call.png" class="point-icon"></image>
                <text>电话</text>
              </view>
              <view v-else class="opt-item"  />
              <view class="opt-item opt-middle" v-if="info.isMember == 1" @click="toChatDetails(item)">
                <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-news.png" class="point-icon"></image>
                <text>私信</text>
              </view>
              <view  v-else class="opt-item" />
              <view class="opt-item opt-last" @click="toTrack(item)">
                <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/point-location.png" class="point-icon"></image>
                <text>轨迹</text>
              </view>
            </view>
          </view>
        </view>
        <view class="car_source_item_cargo" v-else>
          <view class="head">
            <image
              :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'" />
          </view>
          <view class="right_content">
            <view class="name_model">
              <view class="user_name">宋师傅</view>
              <view class="user_model">（管理员-货主）</view>
              <image src="../../../static/images/isPhone.png" />
              <image src="../../../static/images/isPnone_block.png" />
            </view>
            <view class="name_model" style="margin-top: 24rpx">
              <image class="addr_icon" src="../../../static/images/fleet_loaction.png" />
              <view class="address">江苏省南通市文明区</view>
              <view class="times">10分钟前</view>
            </view>
          </view>
        </view>
      </template>
			<uni-morebox :isMore="isMore" :containerStyle="{'margin-top': '24rpx'}"></uni-morebox>
		</view>
		<view class="footBtnGroup">
      <view class="checkedBox">
        <image class="checkIcon"  @click="checkAllItem"
          :src="allCheckedFlag ? '/static/images/vehicleOptions/checked.png' : '/static/images/vehicleOptions/checkDefault.png'">
        </image>
        <view class="checkedMsg" :style="allCheckedFlag ? 'color:#3888FF;' : 'color:#333;'">全选</view>
        <view class="checkedNumMsg">已选中{{allCheckedNum}}条</view>
      </view>
      <view class="btn_list">
        <view class="see_line">群发短信</view>
        <view class="add_fleet">加入我的车队</view>
        <!-- <view class="contact" @click="toContact">联系他</view> -->
      </view>
      <image class="bounce_image" src="../../../static/images/hand_block.png" />
    </view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship";
	import * as utilDate from "@/utils/utils.js"
	import UniMorebox from "@/components/uni-morebox.vue";
	import noData from "@/components/noData.vue";
	export default {
		components: {
			UniMorebox,
			noData
		},
		data() {
			return {
        allCheckedFlag: false,
        allCheckedNum: 0,
				showOpt: 0,
				chooseArr: [{
					name: '城市',
					value: '',
				},{
					name: '状态',
					value: '状态',
				}],
				provinceArr: [],
				cityArr: [],
				statusArr: ["可接单", "忙碌"],
				carSourceList: [],
				isCollapse: false,
				isActive: 0,
				selectedProvinceIndex: -1,
				selectedCityIndex: -1,
				selectedStatusIndex: -1,
				params: {
					count: false,
					status: 1,
					fleetId: '',
					provinceName: '',
					cityName: '',
					"pageSize": 10,
					"pageNum": 1,
					sender: '',
					senderCode: '',
					source: '',
				},
				defaultParams: {
					status: 1,
					sender: '',
					senderCode: '',
					selectedCityIndex: -1,
					selectedProvinceIndex: -1,
					fleetId: '',
					
				},
				carSourceParams: {
					count: false,
					status: 1,
					"pageSize": 10,
					"pageNum": 1,
					fleetId: '',
					userIdList: [],
				},
				isNoData: 'loading',
				isMore: 'more',
				refreshing: false,
				info: null,
				source: '',
				statusBarHeight: '',
			}
		},
		async onLoad(options) {
			//加载默认的起始地
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.statusBarHeight = statusBarHeight*2
			console.log("携带的参数",options);
			var type = options.type;
			this.type = type;
			var sender = options.sender;
			
			if (options.sender) {
				var provinceName = options.provinceName;
				if (provinceName == "上海市" || provinceName == "重庆市" || provinceName == "天津市" || provinceName == "北京市") {
					
					this.defaultParams = {
						provinceName: options.provinceName,
						cityName: options.provinceName,
						areaName: options.sender,
						sender: options.sender,
						senderCode: options.senderCode,
						fleetId: options.fleetId,
						source: 1,
					}
					this.params.cityName = options.provinceName;
					this.params.provinceName = options.provinceName;
					this.params.areaName = options.sender;
					if (type != "carSource") {
						this.params.sender = options.sender;
						this.params.senderCode = options.senderCode;
					}
					
				} else {
					this.defaultParams = {
						provinceName: options.provinceName,
						cityName: options.sender,
						sender: options.sender,
						senderCode: options.senderCode,
						fleetId: options.fleetId,
						source: 2,
					}
					this.params.cityName = options.sender;
					this.params.provinceName = options.provinceName;
					if (type != "carSource") {
						this.params.sender = options.sender;
						this.params.senderCode = options.senderCode;
					}
					
				}
				this.carSourceParams.fleetId = options.fleetId;
				this.params.fleetId = options.fleetId;
				this.carSourceParams.source = 1;
				this.params.source = 1;
				var chooseArr =  this.chooseArr;
				if (type == "carSource") {
					chooseArr[0].value = "";
				} else {
					chooseArr[0].value = options.sender;
				}
				
				this.chooseArr = chooseArr;
				await this.getFleetInfo();
				console.log("source的只", type)
				if (type == "carSource") {
					uni.showLoading();
					await this.getFleetUser("refresh");
					await this.getData('refresh');
				} else {
					await this.getData('refresh');
				}
				
				await this.getProvince();
			} else {
				this.params.cityName != undefined && delete this.params.cityName
				this.params.provinceName != undefined &&  delete this.params.provinceName
				this.params.areaName != undefined &&  delete this.params.areaName
				this.params.fleetId = options.fleetId;
				this.params.source = 1;
				this.defaultParams = {
					fleetId: options.fleetId,
					source: 1,
				}
				//跳转全部的成员列表
				uni.showLoading();
				await this.getFleetInfo();
				
				await this.getData('refresh');
				await this.getProvince();
				
			}
		
			
		},
		onPullDownRefresh() {
			if (this.isNoData == "loading") return;
			this.isNoData = 'loading';
			this.getData('refresh');
		},
		onReachBottom() {
			if(this.isMore == "loading" || this.isMore == "noMore") return;
			this.isMore = "loading";
			this.getData("more");
		},
		methods: {
      toContact() {
        let that = this
        console.log(this.optionsParams)
        // let optionsParams = this.optionsParams
        // uni.navigateTo({
        //   url: '/pages/goodsDelivery/fleetIndex/fleetmemberList?userCode=' + optionsParams.userCode + '&sender=' +
        //     optionsParams.senderName + '&senderCode=' + optionsParams.senderCode + "&provinceCode=" +
        //     optionsParams.provinceCode + '&provinceName=' + optionsParams.provinceName + '&fleetId=' + optionsParams
        //     .fleetId + '&type=' + optionsParams.source
        // })
        // uni.navigateTo({
        //   url: '/pages/goodsDelivery/fleetIndex/fleetmemberList?userCode=' + optionsParams.userCode + '&sender=' +
        //     optionsParams.sender +
        //     '&senderCode=' + optionsParams.senderCode + "&provinceCode=" + optionsParams.provinceCode +
        //     '&provinceName=' + optionsParams.provinceName +
        //     '&fleetId=' + optionsParams.fleetId + '&type=' + optionsParams.type
        // })

      },
      calculationCheckNum(){
        let that = this
        let num = 0
        that.carSourceList.forEach(item => {
          if(item.isCheck){
            num+=1
          }
        })
        that.allCheckedNum = num
      },
      isAllChecked(item,index){
        let that = this
        if(item.isCheck){
          that.$set(that.carSourceList[index], 'isCheck', false)
        }else{
          that.$set(that.carSourceList[index], 'isCheck', true)
        }
        let allChecFlag = true
        that.carSourceList.some(el => {
          if(!el.isCheck){
            allChecFlag = false
            return true
          }
        })
        if(allChecFlag){
          that.allCheckedFlag = true
        }else{
          that.allCheckedFlag = false
        }
        that.calculationCheckNum()
      },
      checkAllItem() {
        let that = this
        that.allCheckedFlag = !that.allCheckedFlag
        that.carSourceList.forEach(item => {
          if (that.allCheckedFlag) {
            item.isCheck = true
          } else {
            item.isCheck = false
          }
        })
        that.calculationCheckNum()  
      },
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			makePhoneCall(item) {
				uni.makePhoneCall({
				    phoneNumber: item.displayMobile ? item.displayMobile : item.mobile //仅为示例
				});
			},
			toChatDetails(item) {
				var userInfo = uni.getStorageSync("userInfo");
				var currentUserCode = JSON.parse(userInfo).attrs.userCode;
				if(currentUserCode == item.userCode){
					uni.showToast({
						title: '您不能给自己发私信',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中'
				})
				console.log('车队详情', this.info);
				let userRole = uni.getStorageSync('userRole'); // 1为司机2为货主1
				let userData = uni.getStorageSync("userInfo");
				console.log('用户信息', JSON.parse(userData));
				if(Number(userRole) == 1) {
					userInfo = userData ? JSON.parse(userData) : {};
					let avatarObj = JSON.parse(userData);
					userInfo.attrs.avatar = avatarObj.attrs.avatar;
				}else {
					userInfo = userData ? JSON.parse(userData) : {};
				}
				let userName = item.userName ? item.userName.substr(0, 1) + '**' : '';
				if(this.goEasy.getConnectionStatus() == 'disconnected') {
					getApp().globalData.imService = new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(userInfo);
					uni.hideLoading();
					let avatar = item.avatar ? item.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png';
					uni.navigateTo({
						url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
					})
				}else {
					uni.hideLoading();
					let avatar = item.avatar ? item.avatar : '../../../static/images/goodsDelivery/shipUserLogo.png';
					uni.navigateTo({
						url: '../userMessage/chatDetails?receiverId=' + item.userCode + '&avatar=' + avatar + '&nickname=' + userName + '&userId=' + item.userId
					})
				}
			},
			toTrack(item) {
				var userCode = item.userCode;
				var address = item.address;
				if (!address) {
					uni.showToast({
						title: '暂无轨迹',
						icon: 'none'
					})
					return;
				};
				var info = this.info;
				 uni.navigateTo({
				 	url: '/pages/goodsDelivery/fleetIndex/locationView?fleetDetail=' + JSON.stringify(info) + '&userCode=' + userCode
				 })
			},
			async getFleetUser() {
				try{
					var params = {
						...this.params
					}
					if (this.type == "carSource") {
						params.sender = this.defaultParams.sender;
						params.senderCode = this.defaultParams.senderCode;
						params.source = 2;
					}
					console.log(params, 'a111aaa');
					var res = await ship.newQueryPostRequest("/olnanas/recommend/getCarSourceBySender", params)
					console.log(res, '用户信息');
					if (res.retCode == "0000000") {
						var carSourceVOS = res.rspBody.carSourceVOS;
						var userIds = [];
						if (carSourceVOS.length < 1) {
							this.carSourceParams.userIdList = [];
							return;
						};
						carSourceVOS.forEach(item => {
							userIds.push(item.userId)
						})
						this.carSourceParams.userIdList = userIds;
					}
				}catch(e){
					console.log(e, 'asa')
					//TODO handle the exception
				}
			},
			async getFleetInfo() {
				//获取车队信息
				try{
					console.log({
						id: this.defaultParams.fleetId,
						pageSize: 10,
						pageNum: 1
					}, "车队信息212")
					
					var res = await ship.newQueryPostRequest("/cd/fleet/list", {
						id: this.defaultParams.fleetId,
						pageSize: 10,
						pageNum: 1
					})
					if (res.retCode == "0000000") {
						console.log("车队信息", res.rspBody);
						var info = res.rspBody.items[0];
						this.info = info;
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					//TODO handle the exception
				}
				
			},
			showUserName(item) {
				var that = this;
				var userName = item.userName;
				var userCode = item.userCode;
				if (userName) {
					if(item.isOwner && that.info.fleetAttributes == '平台') {
						return '货运中国'
					} else if (that.info.isAdmin || that.info.isOwner) {
						return userName
					} else {
						return userName.slice(0, 1) + '*'
					}
				} else {
					return "卡友号：" + userCode
				}
			},
			
			showAddr(item) {
				var address = item.address;
				if (!address) return '';
				var reg = /.+?(县|区)/g
				var addrArr = address.match(reg);
				var addr = "";
				if (addrArr) {
					addr = addrArr[0]
				} else {
					addr = address
				}
				if(this.info.isAdmin || this.info.isOwner) {
					return addr;
				}else {
					return addr ? addr.slice(0, 4) + '****' : ''
				}
			},
			showDate(item) {
				var locationDate = item.locationUpdatedDt;
				if (!locationDate) return '';
				return utilDate.findBeidouDateDesc(locationDate)
			},
			setModel(str){
				if(str.indexOf(',')>-1){
					str = str.split(",")[0];
				}
				return str
			},
			async getData(num) {
				if (num == 'refresh') {
					this.params.pageNum = 1;
					this.carSourceParams.pageNum = 1;
				} else {
					this.params.pageNum ++;
					this.carSourceParams.pageNum ++;
				}
				try{
					console.log(this.params, 'asasas');
					var type = this.type;
					var params = this.params;
					if (type == "carSource") {
						params = this.carSourceParams;
					} else {
						params = this.params
					}
					console.log("cheeae1",params);
					var res = await ship.newQueryPostRequest("/cd/fleetWithUser/list", params)
					uni.stopPullDownRefresh();
					uni.hideLoading();
					console.log(res, '车队列表数据')
					if (res.retCode == "0000000") {
						var carSourceVOS = res.rspBody.items;
						var len = carSourceVOS.length;
						if (num == "refresh") {
							this.carSourceList = carSourceVOS;
							if (len < 1) {
								this.isNoData = true;
								this.isMore = "more";
								return;
							}
							this.isNoData = false;
							if (type == "carSource") {
								this.isMore = len < this.carSourceParams.pageSize ? 'noMore' : 'more'
							} else {
								this.isMore = len < this.params.pageSize ? 'noMore' : 'more'
							}
							
						} else {
							this.isNoData = false;
							if (type == "carSource") {
								this.isMore = len < this.carSourceParams.pageSize ? 'noMore' : 'more'
							} else {
								this.isMore = len < this.params.pageSize ? 'noMore' : 'more'
							}
							
							this.carSourceList = this.carSourceList.concat(carSourceVOS);
						}
						
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e){
					uni.hideLoading();
					uni.stopPullDownRefresh();
					//TODO handle the exception
				}
			},
			async reset() {
				if (this.type == "detail") {
					this.chooseArr[0].value = "";
					this.selectedProvinceIndex = -1;
					this.selectedCityIndex = -1;
					this.params.cityName != undefined && delete this.params.cityName
					this.params.provinceName != undefined &&  delete this.params.provinceName
					this.params.areaName != undefined &&  delete this.params.areaName
				} else if (this.type == "carSource") {
					this.selectedCityIndex = -1;
					this.selectedProvinceIndex = -1;
					this.carSourceParams.provinceName != undefined && delete this.carSourceParams.provinceName
					this.carSourceParams.cityName != undefined && delete this.carSourceParams.cityName
					this.carSourceParams.areaName != undefined && delete this.carSourceParams.areaName
				} else {
					this.getProvince();
				}
			},
			async look() {
				var selectedProvinceIndex = this.selectedProvinceIndex;
				var selectedCityIndex = this.selectedCityIndex;
				if (selectedCityIndex < 0 && selectedProvinceIndex < 0 && this.type != "fleetSource") {
					//搜索全部
					this.isCollapse = 0;
					console.log(this.params, 'sass');
					this.$forceUpdate();
					uni.showLoading();
					if (this.type == 'carSource') {
						await this.getFleetUser();
						this.chooseArr[0].value = "";
					}
					await this.getData("refresh");
					return;
				}
				
				if (selectedProvinceIndex < 0) {
					uni.showToast({
						title: '请选择',
						icon: 'none'
					})
					return;
				};
				if (selectedCityIndex < 0) {
					uni.showToast({
						title: '请选择',
						icon: 'none'
					})
					return;
				};
				var cityArr = this.cityArr;
				var provinceArr = this.provinceArr;
				if (selectedCityIndex == 0) {
					this.chooseArr[0].value = cityArr[selectedCityIndex].proName;
					var cityName = cityArr[selectedCityIndex].proName;
				} else {
					this.chooseArr[0].value = cityArr[selectedCityIndex].name;
					var cityName = cityArr[selectedCityIndex].name;
				}
				var proName = provinceArr[selectedProvinceIndex].name;
				this.params.provinceName = provinceArr[selectedProvinceIndex].name;
				this.carSourceParams.provinceName = proName;
				console.log(cityName, proName, 'asas');
				if (proName == "上海市" || proName == "重庆市" || proName == "天津市" || proName == "北京市") {
					if (cityName !== "上海市" && cityName !== "重庆市" && cityName !== "天津市" && cityName !== "北京市") {
						console.log(this.params, "zxzxzxzx1111111");
						this.params.cityName = proName;
						this.params.areaName = cityName;
						this.params.sender = cityName;
						this.params.senderCode = cityArr[selectedCityIndex].code;
						
						this.carSourceParams.cityName = proName;
						this.carSourceParams.areaName = cityName;
					} else {
						this.params.cityName = cityName;
						this.params.areaName != undefined && delete this.params.areaName;
						this.params.sender = proName;
						this.params.senderCode = provinceArr[selectedProvinceIndex].code;
						this.carSourceParams.cityName = cityName;
						this.carSourceParams.areaName != undefined && delete this.carSourceParams.areaName
						console.log(this.params, "zxzxzxzx");
					}
				} else {
					this.params.areaName != undefined && delete this.params.areaName;
					this.carSourceParams.areaName != undefined && delete this.carSourceParams.areaName
					if (selectedCityIndex == 0) {
						this.carSourceParams.cityName && delete this.carSourceParams.cityName;
						this.params.cityName && delete this.params.cityName;
					} else {
						this.carSourceParams.cityName = cityArr[selectedCityIndex].name;
						this.params.cityName = cityArr[selectedCityIndex].name;
					}
					this.params.sender = cityName;
					this.params.senderCode = cityArr[selectedCityIndex].code;
				}
				this.isCollapse = 0;
				console.log(this.params, 'sass');
				this.$forceUpdate();
				uni.showLoading();
				if (this.type =="carSource") {
					await this.getFleetUser();
				}
				await this.getData("refresh");
				
			},
			async getProvince() {
				var provinceLocal = uni.getStorageSync("provinceLocal");
				if (!provinceLocal) {
					var res = await ship.postRequest("/ts/nationDict/getBasicData");
					var provinceArr = res.rspBody;
					this.provinceArr = provinceArr;
					this.cityArr = provinceArr[0].cities;	
					uni.setStorageSync("provinceLocal", JSON.stringify(provinceArr));
					return;
				}
				var provinceName = this.defaultParams.provinceName;
				var cityName = this.defaultParams.cityName;
				var areaName = this.defaultParams.areaName;
				var provinceArr = JSON.parse(provinceLocal);
				this.provinceArr = provinceArr;
				if (this.type == "carSource") {
					this.selectedProvinceIndex = -1;
					this.selectedCityIndex = -1;
					this.defaultParams.selectedProvinceIndex = -1;
					this.defaultParams.selectedCityIndex = -1;
					var cities = this.provinceArr[0].cities;
					var provinceName = this.provinceArr[0].name;
					if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "北京市" || provinceName == "重庆市") {
						var coties = [{
								name: provinceName,
								proName: "全市",
							}, ...cities]
					} else {
						var coties = [{
								name: provinceName,
								proName: "全省",
							}, ...cities]
					}
					this.cityArr = coties;
					return;
				}
				var findIndex = provinceArr.findIndex(item => {
					return item.name == provinceName
				});
				console.log("asasasas", findIndex);
				if (findIndex < 0) {
					this.selectedProvinceIndex = -1;
					var cities = this.provinceArr[0].cities;
					var coties = [{
							name: "全省",
							proName: provinceName,
						}, ...cities]
					this.cityArr = coties;
					return;
				}
				this.selectedProvinceIndex = findIndex;
				this.defaultParams.selectedProvinceIndex = findIndex;
				var cities = provinceArr[findIndex].cities;
				
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "北京市" || provinceName == "重庆市") {
					var coties = [{
							name: "全市",
							proName: provinceName,
						}, ...cities]
						
					this.cityArr = coties;
					if (areaName) {
						var cityIndex = coties.findIndex(item => {
							return item.name == areaName
						})
					} else {
						var cityIndex = coties.findIndex(item => {
							return item.name == cityName
						})
					}
					
				} else {
					var coties = [{
							name: "全省",
							proName: provinceName,
						}, ...cities]
						
					this.cityArr = coties;
					var cityIndex = coties.findIndex(item => {
						return item.name == cityName
					})
				}
				console.log("cityIndex", cityIndex);
				if (cityIndex < 0) {
					this.selectedCityIndex = -1;
					return;
				}
				this.defaultParams.selectedCityIndex = cityIndex;
				this.selectedCityIndex = cityIndex;
			},
			
			showPop(index) {
				var isCollapse = this.isCollapse;
				if (isCollapse == index + 1) {
					this.isCollapse = 0;
					return
				}
				this.isActive = index;
				
				this.isCollapse = index + 1;
				
				
			},
			hidePop() {
				this.isCollapse = false
			},
			noPop() {
				return false
			},
			switchProIndex(index) {
				if (index == this.selectedProvinceIndex) return;
				this.selectedProvinceIndex = index;
				this.selectedCityIndex = -1;
				//切换城市
				var provinceArr = this.provinceArr;
				var provinceName = provinceArr[index].name;
			
				var cities = provinceArr[index].cities;
				if (provinceName == "上海市" || provinceName == "天津市" || provinceName == "北京市" || provinceName == "重庆市") {
					var coties = [{
						name: '全市',
						proName: provinceName
					}, ...cities]
				} else {
					var coties = [{
						name: '全省',
						proName: provinceName
					}, ...cities]
				}
				
				
				this.cityArr = coties;
			},
			switchCityIndex(index) {
				this.selectedCityIndex = index
			},
			closePop() {
				this.isCollapse = 0;
			},
			switchStatus(index) {
				this.selectedStatusIndex = index;
				var type = this.type;
				if (type == "carSource") {
					this.carSourceParams.taskStatus = index + 1;
				} else {
					this.params.taskStatus = index + 1;
				}
				
				var chooseArr = this.chooseArr;
				chooseArr[1].value = index == 0 ? '可接单' : '忙碌';
				this.chooseArr = chooseArr;
				uni.showLoading();
				this.isCollapse = 0;
				this.getData("refresh");
			}
		}
	}
</script>

<style scoped lang="scss">

  @keyframes bounce-up {
    25% {
      transform: translateX(20rpx);
    }
    50%,
    100% {
      transform: translateX(0);
    }
    75% {
      transform: translateX(-20rpx);
    }
  }
  .animate-bounce-up {
    -webkit-animation: bounce-up 0.1s linear 3;
    animation: bounce-up 0.1s linear 3;
  }
	.mapCarSourceList {
		min-height: 100vh;
		background-color: #FAFAFA;
		display: flex;
		flex-direction: column;
		width: 100vw;
		padding: 0 34rpx;
		box-sizing: border-box;
		overflow: hidden;
		&.noScroll {
			overflow: hidden;
		}
		.header-box {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			z-index: 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #FFFFFF;
			.header {
				width: 100vw;
				height: 88rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				color: rgba(51, 51, 51, 1);
				.car_source_left_arrow {
					position: absolute;
					left: 38rpx;
					top: 30rpx;
					width: 16rpx;
					height: 30rpx;
				}
			}
		}
		.selected-content {
			.selected-title {
				background-color: #FAFAFA;
				box-sizing: border-box;
				padding-left: 34rpx;
				position: fixed;
				top: 0;
				left: 0;
				height: 100rpx;
				width: 100vw;
				z-index: 9;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				.selected-item {
					display: flex;
					flex-direction: row;
					align-items: center;
					&:last-child {
						margin-left: 80rpx;
					}
					.icon_down {
						width: 24rpx;
						height: 12rpx;
						margin-left: 12rpx;
					}
					.selected-title-text {
						color: #333333;
						font-size: 36rpx;
						font-weight: 500;
					}
				}
			}
			.selected-pop {
				position: fixed;
				top: 100rpx;
				left: 0;
				width: 100vw;
				height: 0;
				opacity: 0;
				overflow: hidden;
				background-color: rgba(84, 84, 84, 0.71);
				z-index: 2;
				&.active {
					opacity: 1;
					height: calc(100vh - 100rpx);
				}
				.pop-content {
					background-color: #FFFFFF;
					display: flex;
					flex-direction: column;
					align-items: center;
					.status-item {
						height: 80rpx;
						color: #rgba(51, 51, 51, 1);
						font-size: 28rpx;
						width: 100vw;
						padding-left: 34rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						&.active {
							color: rgba(43, 114, 240, 1);
							font-weight: 500;
						}
						.check {
							width: 30rpx;
							height: 22rpx;
							margin-right: 10rpx;
						}
					}
					.pop-title {
						width: 100vw;
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						height: 108rpx;
						border-top: 1rpx solid rgba(234, 234, 234, 1);
						border-bottom: 1rpx solid rgba(234, 234, 234, 1);
						color: rgba(51, 51, 51, 1);
						font-size: 32rpx;
						font-weight: 500;
						.pop-title-item {
							width: 50vw;
							&:first-child {
								padding-left: 34rpx;
								box-sizing: border-box;
							}
						}
					}
					.pop-item {
						height: 50vh;
					}
					.pop-inner {
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
						align-items: center;
						height: 50vh;
						width: 100vw;
						.item-pop {
							height: 80rpx;
							color: rgba(51, 51, 51, 1);
							font-size: 28rpx;
							box-sizing: border-box;
							display: flex;
							flex-direction: row;
							align-items: center;
							.check {
								width: 30rpx;
								height: 22rpx;
								margin-right: 10rpx;
							}
							.proActive {
								color: rgba(43, 114, 240, 1);
								font-weight: 500;
							}
							
						}
						.province-item {
							flex: 1;
							display: flex;
							flex-direction: column;
							align-items: center;
							height: 50vh;
							.pl-34 {
								padding-left: 34rpx;
								box-sizing: border-box;
							}
						}
					}
					.pop-btn {
						height: 78rpx;
						width: 666rpx;
						display: flex;
						flex-direction: row;
						background-image: url("https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_pop_bg.png");
						background-size: cover;
						background-repeat: no-repeat;
						background-position: 100%;
						border-radius: 25rpx;
						margin-bottom: 66rpx;
						.pop-btn-item {
							width: 50vw;
							display: flex;
							justify-content: center;
							align-items: center;
							font-weight: 500;
							&.reset {
								color: rgba(43, 114, 240, 1);
							}
							&.look {
								color: #FFFFFF;
								
							}
						}
					}
				}
			}
			
		}
		.list {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			
			.list-item {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				background-color: #FFFFFF;
				width: calc(100vw - 68rpx);
				margin-bottom: 20rpx;
				box-shadow: 0 0 18rpx 2rpx rgba(106, 106, 106, 0.09);
				border-radius: 12rpx;
				.avatar-content {
					width: 148rpx;
					padding-top: 30rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					align-items: center;
					.avatar {
						width: 80rpx;
						height: 80rpx;
						position: relative;
						.avatar-icon {
							width: 80rpx;
							height: 80rpx;
							border-radius: 80rpx;
							background-color: #CCCCCC;
						}
						.dot {
							width: 60rpx;
							height: 20rpx;
							border-radius: 70rpx;
							background-image: linear-gradient(to bottom, #51A2FE, #1081F9);
							position: absolute;
							left: 10rpx;
							bottom:  0;
							z-index: 1;
							font-size: 16rpx;
							color: #FFFFFF;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
					.avatar-title {
						display: flex;
						flex-direction: row;
						color: #4ACD1B;
						font-size: 28rpx;
						margin-top: 10rpx;
						justify-content: center;
						align-items: center;
						&.active {
							color: #E2633B;
						}
						.dot {
							width: 14rpx;
							height: 14rpx;
							background-color: #4ACD1B;
							border-radius: 14rpx;
							margin-right: 6rpx;
							&.active {
								background-color: #E2633B;
							}
						}
					}
					
				}
				.item-content {
					width: calc(100vw - 68rpx - 148rpx);
					display: flex;
					flex-direction: column;
					padding-top: 16rpx;
					box-sizing: border-box;
					.line {
						margin-right: 16rpx;
						margin-top: 20rpx;
						height: 1rpx;
						background-color: rgba(224, 224, 224, 1);
						
					}
					.row {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						&.row-start {
							justify-content: flex-start;
							align-items: flex-start;
						}
						&.mt-16 {
							margin-top: 16rpx;
						}
						&.row-opt {
							justify-content: flex-end;
							padding: 18rpx 20rpx 18rpx 0;
							box-sizing: border-box;
							.opt-item {
								flex: 1;
								display: flex;
								flex-direction: row;
								justify-content: center;
								align-items: center;
								font-size: 28rpx;
								color: rgba(0, 0, 0, 1);
								&.opt-first {
									display: flex;
									flex-direction: row;
									justify-content: flex-start;
									align-items: center;
								}
								&.opt-middle {
									display: flex;
									flex-direction: row;
									justify-content: center;
									align-items: center;
								}
								&.opt-last {
									display: flex;
									flex-direction: row;
									justify-content: flex-end;
									align-items: center;
								}
								.point-icon {
									width: 48rpx;
									height: 48rpx;
									margin-right: 10rpx;
								}
							}
						}
						.name {
							font-size: 28rpx;
							color: rgba(51, 51, 51, 1);
							font-weight: 600;
						}
						.nameType {
							color: rgba(102, 102, 102, 1);
							font-size: 24rpx;
							margin-left: 10rpx;
						}
						.lenAndType {
							color: rgba(51, 51, 51, 1);
							font-size: 32rpx;
							line-height: 38rpx;
							margin-left: 10rpx;
						}
						.route {
							color: rgba(51, 51, 51, 1);
							font-size: 36rpx;
							line-height: 42rpx;
							margin-right: 10rpx;
						}
						.addr {
							color: rgba(52, 137, 233, 1);
							font-size: 36rpx;
							line-height: 42rpx;
							font-weight: 500;
						}
						.location-icon {
							flex: 1;
							display: flex;
							flex-direction: row;
							justify-content: flex-start;
							align-items: flex-start;
							color: rgba(51, 51, 51, 1);
							font-size: 36rpx;
							line-height: 42rpx;
							.icon_content {
								height: 42rpx;
								display: flex;
								align-items: center;
								justify-content: center;
							}
							.beidou_icon {
								width: 20rpx;
								height: 20rpx;
								margin-right: 8rpx;
							}
							.beidou_no_icon {
								width: 32rpx;
								height: 32rpx;
								margin-right: 8rpx;
							}
							.addr-text {
								flex: 1;
								color: rgba(51, 51, 51, 1);
								font-size: 36rpx;
								padding-left: 2px;
								line-height: 42rpx;
								
							}
						}
						.time {
							color: rgba(102, 102, 102, 1);
							font-size: 28rpx;
							margin-left: 18rpx;
							padding-top: 8rpx;
							margin-right: 54rpx;
						}
						.btn-content {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							margin-top: 18rpx;
							.btn-item {
								padding: 5rpx 10rpx;
								color: rgba(82, 131, 255, 1);
								border: 1px solid rgba(82, 131, 255, 1);
								border-radius: 8rpx;
								font-size: 24rpx;
								margin-right: 20rpx;
							}
						}
						
					}
					
				}
			}
      .car_source_item {
        display: flex;
        border-radius: 12rpx;
        width: 100%;
        height: 340rpx;
        padding: 20rpx 32rpx 20rpx 36rpx;
        box-sizing: border-box;
        background: #FFFFFF !important;
        margin-bottom: 20rpx;

        .head {
          padding-top: 15rpx;
          display: flex;
          flex-direction: column;
          align-items: center;

          image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
          }

          .sign_status {
            margin-top: -16rpx;
            z-index: 1;
            width: 62rpx;
            height: 20rpx;
            background: linear-gradient(180deg, #51A2FE 0%, #1081F9 100%);
            border-radius: 70rpx;
            font-size: 16rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            text-align: center;
            line-height: 20rpx;
          }

          .order_receive_status {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 10rpx;

            view {
              width: 14rpx;
              height: 14rpx;
              background: #4ACD1B;
            }

            text {
              margin-left: 6rpx;
              font-size: 28rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #4ACD1B;
            }
          }

          .order_receive_status_2 {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 10rpx;

            view {
              width: 14rpx;
              height: 14rpx;
              background: #E2633B;
            }

            text {
              margin-left: 6rpx;
              font-size: 28rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #E2633B;
            }
          }

        }

        .right_content {
          // width: 100%;
          padding-left: 20rpx;
          box-sizing: border-box;
          flex: 1;

          .name_model {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .user_name {
              font-size: 32rpx;
              font-family: PingFang SC-Semibold, PingFang SC;
              font-weight: 600;
              color: #333333;
            }

            .user_model {
              margin-left: 12rpx;
              font-size: 32rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            image {
              margin-left: auto;
              width: 41rpx;
              height: 41rpx;
            }

            .citys {
              font-size: 32rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #3489E9;
            }

            .details {
              margin-left: auto;
              font-size: 24rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              display: flex;
              align-items: center;

              image {
                margin-left: 10rpx;
                width: 10rpx;
                height: 20rpx;
                // transform: rotate(180deg);
              }
            }

            .addr_icon {
              margin-left: 0;
              width: 20rpx;
              height: 20rpx
            }

            .address {
              margin-left: 8rpx;
              font-size: 32rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            .times {
              margin-left: auto;
              font-size: 24rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
            }

            .btn-content {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;

              // margin-top: 18rpx;
              .btn-item {
                padding: 5rpx 10rpx;
                color: rgba(82, 131, 255, 1);
                border: 1px solid rgba(82, 131, 255, 1);
                border-radius: 8rpx;
                font-size: 24rpx;
                margin-right: 20rpx;
              }
            }

            .is_see {
              margin-top: 5rpx;
              margin-left: auto;
              font-size: 24rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #E8520D;
            }
          }
          .line {
						margin-right: 16rpx;
						margin-top: 20rpx;
						height: 1rpx;
						background-color: rgba(224, 224, 224, 1);
						
					}
          .row-opt {
							justify-content: flex-end;
							padding: 18rpx 20rpx 18rpx 0;
							box-sizing: border-box;
							.opt-item {
								flex: 1;
								display: flex;
								flex-direction: row;
								justify-content: center;
								align-items: center;
								font-size: 28rpx;
								color: rgba(0, 0, 0, 1);
								&.opt-first {
									display: flex;
									flex-direction: row;
									justify-content: flex-start;
									align-items: center;
								}
								&.opt-middle {
									display: flex;
									flex-direction: row;
									justify-content: center;
									align-items: center;
								}
								&.opt-last {
									display: flex;
									flex-direction: row;
									justify-content: flex-end;
									align-items: center;
								}
								.point-icon {
									width: 48rpx;
									height: 48rpx;
									margin-right: 10rpx;
								}
							}
						}
        }
      }

      .car_source_item_cargo {
        display: flex;
        border-radius: 12rpx;
        width: 100%;
        height: 156rpx;
        padding: 16rpx 32rpx 20rpx 36rpx;
        box-sizing: border-box;
        background: #FFFFFF !important;
        margin-bottom: 20rpx;

        .head {
          padding-top: 15rpx;
          display: flex;
          flex-direction: column;
          align-items: center;

          image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
          }

          .sign_status {
            margin-top: -16rpx;
            z-index: 10;
            width: 62rpx;
            height: 20rpx;
            background: linear-gradient(180deg, #51A2FE 0%, #1081F9 100%);
            border-radius: 70rpx;
            font-size: 16rpx;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            text-align: center;
            line-height: 20rpx;
          }

          .order_receive_status {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 10rpx;

            view {
              width: 14rpx;
              height: 14rpx;
              background: #4ACD1B;
            }

            text {
              margin-left: 6rpx;
              font-size: 28rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #4ACD1B;
            }
          }

          .order_receive_status_2 {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 10rpx;

            view {
              width: 14rpx;
              height: 14rpx;
              background: #E2633B;
            }

            text {
              margin-left: 6rpx;
              font-size: 28rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #E2633B;
            }
          }

        }

        .right_content {
          // width: 100%;
          padding-left: 20rpx;
          box-sizing: border-box;
          flex: 1;

          .name_model {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .user_name {
              font-size: 32rpx;
              font-family: PingFang SC-Semibold, PingFang SC;
              font-weight: 600;
              color: #333333;
            }

            .user_model {
              margin-left: 12rpx;
              font-size: 32rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            image {
              margin-left: auto;
              width: 41rpx;
              height: 41rpx;
            }

            .citys {
              font-size: 32rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #3489E9;
            }

            .details {
              margin-left: auto;
              font-size: 24rpx;
              font-family: PingFang SC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              display: flex;
              align-items: center;

              image {
                margin-left: 10rpx;
                width: 10rpx;
                height: 20rpx;
                // transform: rotate(180deg);
              }
            }

            .addr_icon {
              margin-left: 0;
              width: 20rpx;
              height: 20rpx
            }

            .address {
              margin-left: 8rpx;
              font-size: 32rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            .times {
              margin-left: auto;
              font-size: 24rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
            }

            .btn-content {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              margin-top: 18rpx;

              .btn-item {
                padding: 5rpx 10rpx;
                color: rgba(82, 131, 255, 1);
                border: 1px solid rgba(82, 131, 255, 1);
                border-radius: 8rpx;
                font-size: 24rpx;
                margin-right: 20rpx;
              }
            }

            .is_see {
              margin-top: 5rpx;
              margin-left: auto;
              font-size: 24rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #E8520D;
            }
          }
        }
      }
		}
    .footBtnGroup {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 178rpx;
      box-sizing: border-box;
      background-color: #FFF;
      box-shadow: 0px -4rpx 16rpx 2rpx rgba(172, 172, 172, 0.41);

      .checkedBox {
        padding-top: 18rpx;
        padding-left: 32rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        .checkIcon {
          width: 32rpx;
          height: 32rpx;
          display: block;
        }

        .checkedMsg {
          font-size: 28rpx;
          font-weight: 600;
          line-height: 44rpx;
          padding: 0 24rpx 0 4rpx;
        }

        .checkedNumMsg {
          font-size: 24rpx;
          color: #333333;
          line-height: 44rpx;
          text-align: right;
        }
      }
      .bounce_image{
          width: 50rpx;
          height: 50rpx;
          position: absolute;
          right: 20rpx;
          top: 80rpx;
          animation: bounce-up 1s linear infinite;
        }
      .btn_list {
        position: relative;
        margin-top: 16rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100vw;
        box-sizing: border-box;
        padding: 0 36rpx;
        
        view {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 36rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          border-radius: 90rpx;
          height: 76rpx;
        }

        .see_line {
          width: 260rpx;
          background: #3888FF;
        }

        .add_fleet {
          background: linear-gradient(90deg, #4368EA 0%, #BC3AEA 100%);
          width: 260rpx;
        }

        .contact {
          width: 160rpx;
          background: linear-gradient(90deg, #EA8E43 0%, #EA6A3A 100%);
        }
      }
    }
	}
</style>
