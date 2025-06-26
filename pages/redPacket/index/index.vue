<template>	
		<view class="container" :style="'height:'+(screenHeight<=736?'1624rpx':'100vh')">
				<!-- 上部分 -->
			<image class="all_bg level_bg" :style="'height:'+(screenHeight<=736?'1624rpx':'100vh')" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/index_background1.png" mode="cover" />
			<view class="top_header" :style="'top: ' + (statusBarHeight + 'px')">
				<image class="all_bg" @click="goBack" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/left_arrow1.png" mode="cover" />
			</view>
			<!-- 手指动画 -->
			<view class="circle">
				<view class="circle1"></view>
				<view class="circle2"></view>
				<view class="circle3"></view>
			</view>
			<image class="finger_icon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/finger_icon.png" />
			<view class="level_packet" @click="redStart">
				<view class="start_box">
					<view class="start_box_title1">去拆红包</view>
					<view class="start_box_title2">您今天还可玩{{ surplusNum.number }}次</view>
				</view>
			</view>
			 <view class="start_share">
				<view class="role_box">
					<view>1、每邀请1位卡友助力，即可增加1次机会.</view>
					<view>2、邀请新用户助力，认证行驶证后，你的红包金</view>
					<view>额会更大哦.</view>
				</view>
				<view class="btn_box">
					<view class="start_share_box" @click="goShare" data-item="directShare">
						<!-- <image class="start_share_btn"  src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/go_share_btn1.png"/> -->
						<view class="start_share_title">
							<view class="share_icon_box">
								<image
									class="share_icon"
									style="width: 34rpx; height: 34rpx; display: inline-block; box-sizing: border-box; left: 0rpx; top: 0rpx"
									src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_icon.png"
								/>
							</view>
							<view class="share_text">分享好友</view>
						</view>
					</view>
					<view class="start_share_box">
						<!-- <image class="start_share_btn" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/start_btn1.png"/> -->
						<view class="start_share_title_box" @click="goPoster">领取我的专属海报</view>
					</view>
				</view>
			</view>
			<!-- 红包记录/助力记录/排行榜 -->
			<view class="bottom" :style="(screenHeight<=812?'top:900rpx':'bottom:0rpx')">
				<image class="rankingList_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/RankingList_strip1.png" mode="cover" />
				<!-- <image class="title_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/RankingList_strip.png" mode="cover"/> -->
				<!-- <view class="leaderboard_item">排行榜</view> -->
				<block>
					<view class="leaderboard_box">
						<scroll-view class="scroll-view_H" scroll-x style="white-space: nowrap; display: flex" @click="scroll">
							<view class="leaderboard_title">
								<view id="myAssist" :style="'font-weight: ' + (active == 'myAssist' ? '600' : '400') + ';font-size: 32rpx;'">
									我的助力记录
									<view v-if="active == 'myAssist'" style="border-bottom: 2px solid red; width: 72rpx; margin: 0 auto; padding-top: 10rpx"></view>
								</view>
								<view id="myRed" :style="'font-weight: ' + (active == 'myRed' ? '600' : '400') + ';font-size: 32rpx;'">
									我的红包记录
									<view v-if="active == 'myRed'" style="border-bottom: 2px solid red; width: 72rpx; margin: 0 auto; padding-top: 10rpx"></view>
								</view>
								<view id="rankingList" :style="'font-weight: ' + (active == 'rankingList' ? '600' : '400') + ';font-size: 32rpx;'">
									巅峰榜
									<view v-if="active == 'rankingList'" style="border-bottom: 2px solid red; width: 72rpx; margin: 0 auto; padding-top: 10rpx"></view>
								</view>
							</view>
							<block v-if="active == 'myRed'">
								<block>
									<view class="details_box" v-if="RedPacketRecord.length == 0">
										<view class="none">暂无红包明细</view>
									</view>
									<view v-else class="details_box">
										<block>
											<view class="redPacket_item">
												<view class="total_money">
													<view class="total_text">已接住</view>
													<view class="total_num">{{ totalAmount }}</view>
													<view class="yuan"><view>元</view></view>
												</view>
												<view class="navigator_title">
													<text>小提示：邀请新用户助力，红包金额更大哦~</text>
												</view>
											</view>
										</block>
										<scroll-view
											:scroll-y="true"
											style="height: 250rpx"
											@refresherpulling="refreshNewMoeny"
											:show-scrollbar="false"
											refresher-enabled
											:refresher-triggered="refresherMoenyOnOff"
											refresher-background="transparent"
										>
											<view class="details_item" v-for="(item, index) in RedPacketRecord" :key="index">
												<view class="name_data">
													<view>{{ item.createdDt }}</view>
												</view>

												<view class="yuan">{{ item.redpacketAmount }}元</view>
											</view>
										</scroll-view>
										<view  style="height: 50rpx; text-align: center; color: #f62b11; font-size: 28rpx; width: 678rpx;display: flex;justify-content:center;">
											<view style="border-bottom: 1px solid red;width:76rpx;height: 15rpx;"></view>
											<view style="width:250rpx;">显示最新5条记录</view>
											<view style="border-bottom: 1px solid red;width:76rpx;height: 15rpx;"></view>
										</view>
									</view>
								</block>
							</block>
							<block v-if="active == 'myAssist'">
								<view class="help_box" v-if="AssistArr.length == 0">
									<view class="none">暂无邀请记录</view>
								</view>
								<view v-else class="help_box">
									<scroll-view
										:scroll-y="true"
										style="height: 760rpx"
										@refresherpulling="refreshNewAssis"
										:show-scrollbar="false"
										refresher-enabled
										:refresher-triggered="refresherAssisOnOff"
										refresher-background="transparent"
									>
										<view class="help_item" v-for="(item, index) in AssistArr" :key="index">
											<image class="avatar" v-if="item.avatar" :src="item.avatar" @error="imgAssisLoadError" :data-index="index" />

											<image class="avatar" v-if="!item.avatar" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png" />

											<view class="nickName">{{ item.nikeName }}</view>

											<view
												class="certification_title"
												:style="
													'color:' +
													(item.vehicleStatus == 1 ? '#64BD70' : '#F5250E') +
													';border: 2rpx solid ' +
													(item.vehicleStatus == 1 ? '#64BD70' : '#FFFFFF') +
													';background:' +
													(item.vehicleStatus == 1 ? ' ' : '#FFFFFF')
												"
											>
												{{ item.vehicleStatus == 1 ? '已认证' : '未认证' }}
											</view>

											<view class="data">{{ item.shareTime }}</view>
										</view>
										<view v-if="AssistArr.length >= 5" style="height: 50rpx; text-align: center; color: #f62b11; font-size: 28rpx; width: 678rpx;display: flex;justify-content:center;">
											<view style="border-bottom: 1px solid red;width:76rpx;height: 15rpx;"></view>
											<view style="width:250rpx;height:50rpx">显示最新5条记录</view>
											<view style="border-bottom: 1px solid red;width:76rpx;height: 15rpx;"></view>
										</view>
									</scroll-view>
								</view>
							</block>
							<block v-if="active == 'rankingList'">
								<view class="help_box" v-if="summitList.length == 0">
									<view class="none">排行榜暂无数据</view>
								</view>
								<view v-if="summitList.length != 0" class="rankimg_box">
									<view class="ranking_item" v-for="(item, index) in summitList" :key="index">
										<image class="left_avatar" v-if="item.avatar" :src="item.avatar" @error="imgLoadError" :data-index="index" />

										<image class="left_avatar" v-if="!item.avatar" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png" />

										<view class="nickName">{{ item.userName }}</view>

										<image class="medal" :src="medalArr[index]" />

										<view class="moeny">{{ item.sumAmount }}元</view>
									</view>
									<view v-if="summitList.length >= 5" style="height: 50rpx; text-align: center; color: #f62b11; font-size: 28rpx; width: 674rpx;display: flex;justify-content:center;">
										<view style="border-bottom: 1px solid red;width:76rpx;height: 15rpx;"></view>
										<view style="width:250rpx;height:50rpx">显示最新5条记录</view>
										<view style="border-bottom: 1px solid red;width:76rpx;height: 15rpx;"></view>
									</view>
								</view>
							</block>
						</scroll-view>
					</view>
				</block>
			</view>
			<!-- 未认证弹出框 -->
			<uni-popup ref="roleShowPopup" :mask-click="false" type="center">
					<view class="rz_box">
						<view class="rz_item">
							<image class="rz_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/certification_bg.png" />
							<view class="rz_title">
								<view class="title">提示</view>
								<view class="rz_detail">只有认证行驶证才可参加游戏哦</view>
								<view class="go_rz" >
									<view  class="rz_navigator" @click="goRz">
										去认证
									</view>							
								</view>
							</view>
							<image class="rz_btn" @click="closeRz" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/delete_circle.png" />
						</view>
					</view>
			</uni-popup>
			<!-- 游戏助力帮助弹出框 -->
			<uni-popup ref="helpMeShowPopup" :mask-click="false" type="center">
				<view class="helpMe_box">
					<view class="helpMe_item">
						<image class="helpMe_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/certification_bg1.png" />
						<view class="helpMe_title">
							<view class="title">
								<image v-if="beBoostedAvatar" :src="beBoostedAvatar" />
								<image v-else src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png"/>
							</view>
						</view>
						<view class="helpMe_detail">
							<view >我已经领到{{assistedSumAmount}}元现金了</view>
						</view>
						<view class="go_helpMe_box">
							<view class="go_helpMe" >
								<view  class="helpMe_navigator">
									帮TA助力
								</view> 
							</view>
							<view class="go_helpMe" >
								<view  class="helpMe_navigator" data-text="我也要玩1">
									我也要玩
								</view> 
							</view>
						</view>
						
						<image class="rz_btn" @click="closeZl" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/delete_circle.png" />
					</view>
				
				</view>
			</uni-popup>
			<!-- 次数上限弹出框 -->
			<uni-popup ref="NoneShowPopup" :mask-click="false" type="center">
				<view class="numNone_box">
					<view class="numNone_item">
						<image class="numNone_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/frequency_bg.png" />
						<view class="numNone_title title">
							<view >您今天抢红包的次数已</view>
							<view >经用完啦，明天再来</view>
							<view >玩吧~</view>
						</view>
					</view>					
				</view>
			</uni-popup>
			<!-- 次数用完邀请助力弹出框 -->
			<uni-popup ref="invitationShowPopup" :mask-click="false" type="center">
				<view class="invite_box">
					<view class="invite_item">
						<image class="invite_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/invite_bg.png" />
						<view class="invite_title">
							<view class="title">提示</view>
							<view class="invite_detail">
								<view >您今天抢红包的次数已经用</view>
								<view >完啦，快去邀请好友帮你</view>
								<view >助力吧~</view>
							</view>
							<view class="go_invite" @click="goShare" data-item="skipPage">
								<view  class="invite_navigator">
									分享给好友
								</view>
								
							</view>
						</view>
						<image class="invite_btn" @click="closeInvite" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/delete_circle.png" />
					</view>
				</view>
			</uni-popup>
			<!-- 只有卡友才能处理弹出框 -->
			<uni-popup ref="shareNoPopup" :mask-click="false" type="center">
				<view class="carFriend_help_box" >
					<view class="carFriend_help_item" >
						<image class="carFriend_help_bg"  src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/help_success.png" />
						<view class="carFriend_help_title" >
							<view class="carFriend_ts" >
								<view > 只有卡友才可以帮助</view>
								<view >助力哦~</view>
							</view>

						</view>
					</view>
				</view>
			</uni-popup>
			<!-- 助力成功弹出框 -->
			<uni-popup ref="shareOkPopup" :mask-click="false" type="center">
				<view class="help_success_box">
					<view class="help_success_item">
						<image class="help_success_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/help_success1.png" />
						<view class="help_success_title">
							<view class="title">
								<image  src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/handshake_icon.png"/>
							</view>
							<view class="help_success_detail">
							<view class="title_success">助力成功</view>
							<view class="success_signage">帮好友@{{assistedNikeName}}领取到红包</view>
							<view  class="me_to" data-text="我也要玩2">
								<view >我也要玩</view>
							</view>
							</view>
							
						</view>
						<image class="help_success_btn" @click="closeShareOk" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/delete_circle.png" />
					</view>
				</view>
			</uni-popup>
			<!-- 助力上限弹出框 -->
			<uni-popup ref="shareUpperlimitPopup" :mask-click="false" type="center">
				<view class="carFriend_help_box">
					<view class="carFriend_help_item">
						<image class="carFriend_help_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/help_success.png" />
						<view class="carFriend_help_title">
							<view class="carFriend_ts">
								<view >“你为别人助力的次数</view>
								<view >达到上限啦”</view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>	
			<!-- 助力失败弹出框 -->
			<uni-popup ref="helpFailurePopup" :mask-click="false" type="center">
				<view class="carFriend_help_box">
					<view class="carFriend_help_item">
						<image class="carFriend_help_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/help_success.png" />
						<view class="carFriend_help_title">
							<view class="carFriend_ts">
								<view >助力失败</view>
								<view >请稍后再试</view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>			
</template>

<script>
		import {WX_ORIGIN_ID} from "@/utils/baseUrl.js";
		import * as ship from "@/utils/ship"
		import uniPopup from '../../../uni_modules/uni-popup/components/uni-popup/uni-popup.vue';
		export default {
  		components: { uniPopup },		
		data() {
			return {
				statusBarHeight: "",
				redPaperwork: {}, //红包雨文案
				surplusNum: {
					number:0,
				}, //  剩余次数
				vantNoneShow: false, //红包雨游玩次数上限
				vantRoleShow: false, // 没认证
				vantInvitationShow: false, //没次数邀请好友助力
				myRedshowAction: false, //邀请/助力记录
				shareNo: false, //不可助力
				shareOk: false, //助力成功
				shareUpperlimit: false, //助力达到上限
				vantHelpMeShow: false, //游戏助力帮助弹出框
				RedPacketRecord: [], //我的红包记录
				active: "myAssist",
				AssistArr: [], //邀请记录
				userName: "",
				summitList: [], //巅峰榜
				totalAmount: '0.00', //总金额
				medalArr: [ //奖牌图片数组
					"https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/one_trophy.png",
					"https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/two_trophy.png",
					"https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/three_trophy.png",
				],
				beBoostedAvatar: "", //被助力人头像
				inviteTotal: "", //助力总页数；
				invitePages: 1, //助力当前页数
				moneyTotal: "", //获取金额总页数
				moneyPages: 1, //获取金额当前页数
				showLoadMoney: false, //显示加载完毕
				showLoadAssis: false, //显示邀请记录加载完毕
				vehicleVerify: false, //认证行驶证
				pageOnOff: true, //控制页面
				userInfo: {}, //用户信息
				helpFailure: false, // 助力失败
				refresherMoenyOnOff: false, //红包下拉刷新
				refresherAssisOnOff: false, //助力下拉刷新
				assistedSumAmount: "0.00", //被助力人金额
				assistedNikeName: "匿名用户", //被助力人姓名
				userRole:"",
				pageName:"",
				screenHeight:"",
			}
		},
		async onLoad(options) {
			let that=this;
			let userInfo={};
			if(uni.getStorageSync('userInfo')){
				userInfo=JSON.parse(uni.getStorageSync('userInfo')); //获取用户信息
			}
			if(options.pageName){
				that.pageName=options.pageName
			}
			that.vehicleVerify=userInfo.attrs.vehicleVerify==0?false:true;			 
			that.userInfo=userInfo;
			// console.log("userInfo",userInfo);
			let res = uni.getSystemInfoSync() ///微信api方法
			let H = res.statusBarHeight + 7
			console.log(res);
			that.statusBarHeight = H;
			that.screenHeight=res.screenHeight;			
			// console.log('that.vehicleVerify',that.vehicleVerify);
			let userRole=wx.getStorageSync('userRole'); //获取用户类型
			that.userRole=userRole;
			//  处理分享链接进入逻辑
			if(options.shareType && options.shareCode){
				// 分享助力
				// this.inShareStatus(options.shareType, options.shareCode);
				that.shareType = options.shareType;
				that.shareCode = options.shareCode;
			}
  		},
		onShow() {
			console.log('执行红包雨的onshow')
			let res = wx.getSystemInfoSync() ///微信api方法
			let H = res.statusBarHeight + 7
			this.statusBarHeight = H;
			let userInfo={};
			if(uni.getStorageSync('userInfo')){
				userInfo=JSON.parse(uni.getStorageSync('userInfo')); //获取用户信息
			}
			this.userInfo=userInfo;
			this.myRedShow();
			// 获取红包雨文案
			this.getRedPacketList();
			this. getSummitList();
		},
		onHide() {
			// console.log('隐藏页面')
			this.getRedPacketList()
		},
		methods:{
			// 获取红包雨文案
			async getRedPacketList(){
				let userInfo=this.userInfo; //获取用户信息				
				// 红包雨配置，拿到configSid和sid
				let redPaperwork=await ship.postRequest("/hby/game/getHbyGameConfig",{}) 
				if(redPaperwork.retCode=='0000000'){
					wx.setStorageSync('userGameInfo', JSON.stringify({configSid:redPaperwork.rspBody[0].configSid,sid:redPaperwork.rspBody[0].sid}));
					//获取剩余红包雨次数
					let surplusNum=await ship.postRequest('/hby/redPacket/getNumber',{ 
						userId:userInfo.userId,  //用户id
						businessType:this.userRole==1?10:20,  //处理用户类型
						gameSid:redPaperwork.rspBody[0].sid,  //游戏id
						gameConfigSid:redPaperwork.rspBody[0].configSid  //游戏动态配置id
					})
					// participant为1 需要行驶证认证 0为无条件
					// userInfo.attrs.vehicleVerify 行驶证字段
					if(redPaperwork.rspBody[0].participant==0){
						this.vehicleVerify = true
					}else if(redPaperwork.rspBody[0].participant==1 && userInfo.attrs.vehicleVerify==0){
						this.vehicleVerify = false
					}else if(redPaperwork.rspBody[0].participant==1 && userInfo.attrs.vehicleVerify==1){
						this.vehicleVerify = true
					}
					this.redPaperwork = redPaperwork.rspBody[0];
					this.surplusNum = surplusNum.rspBody;
					console.log('surplusNum.rspBody',surplusNum.rspBody);
					console.log('this.surplusNum',this.surplusNum);
					this.participant = redPaperwork.rspBody[0].participant;
					this.avatar = userInfo.attrs.avatar;
				}
			},
			// 我的红包记录和我的助力记录切换
			scroll(event) {
				let target=event.target;
				let {id} = target;
				if(id=="myRed"){
					this.active='myRed'
				}else if(id=="myAssist"){
					this.active='myAssist'
				}else if(id=='rankingList'){
					this.active='rankingList'
				}
			},
			 //获取巅峰榜数据和个人总金额
			async getSummitList(){
				let userInfo=this.userInfo;
				// 获取当前用户总金额
				let totalAmountRes= await ship.postRequest('/hby/redPacketRecordAmount/getRankingListOrAmountSum',{
					userId:userInfo.userId
				})
				//获取巅峰榜数据
				let summitList= await ship.postRequest('/hby/redPacketRecordAmount/getRankingListOrAmountSum',{})
				let totalAmount=0;
				if(summitList.retCode=='0000000'){
					if(totalAmountRes.rspBody.items.length!=0){
						totalAmount=totalAmountRes.rspBody.items[0].sumAmount
					}
					let tmpArr=this.summitList;
					if(summitList.rspBody.items){
						tmpArr=summitList.rspBody.items
						tmpArr.forEach(item=>{
						item.sumAmount+='';
						if(item.userName!='匿名用户' && item.userName.length<=2){
							item.userName=item.userName.substring(0,1)+'*'
						}else if(item.userName!='匿名用户' && item.userName.length>=3){
							item.userName=item.userName.substring(0,1)+'*'+item.userName.substring(2,3);
						}       
						})
						tmpArr=tmpArr.slice(0,5)       
					}  
					this.summitList = tmpArr;
					this.totalAmount = totalAmount;
				}
			},
			  // 展示助力/红包记录
			myRedShow(){
				if(this.userRole==1){
					this.getAssistRecord();    
					this.getRecordByAmount();
				}
				
			},
			//获取助力记录
			// inviteTotal:"", //邀请总页数；
			// invitePages:1, //邀请当前页数
			async getAssistRecord(){
				let that=this;
				let userInfo=this.userInfo;
				let res= await ship.postRequest('/hby/redPacketRecord/getRecordByUser',{
					pageSize:"10",
					pageNum:1,
					shareUserId:userInfo.userId,
				})
				if(res.retCode=='0000000'){
					if(res.rspBody.items.length!=0){
						res.rspBody.items.forEach(item=>{
							item.shareTime=that.changeDataFormat(item.shareTime,2)
							if(item.nikeName){
								item.nikeName=item.nikeName.substring(0,3)
								item.nikeName=item.nikeName+'...'
							}else{
								item.nikeName='匿名用户'
							}
						})
					}
					let AssistArr=this.AssistArr;
					if(res.rspBody.items){
						AssistArr=res.rspBody.items
					}
					if(AssistArr.length>5){
						AssistArr=AssistArr.slice(0,5);
					}
					this.AssistArr=AssistArr;
					this.inviteTotal=Math.ceil(res.rspBody.total/10);
				}
				
			},
			//获取红包记录
			async  getRecordByAmount(){
				let that=this;
				let userInfo=this.userInfo;
				let recordRes=await ship.postRequest('/hby/redPacketRecordAmount/getRecordByUser',{
					pageSize:"10",
					pageNum:1,
					userId:userInfo.userId,
				});
				if(recordRes.retCode=='0000000'){
				recordRes.rspBody.items.forEach(item => {
					item.createdDt=this.changeDataFormat(item.createdDt,1)
				});
				let RedPacketRecord=this.RedPacketRecord
				if(!RedPacketRecord){
					RedPacketRecord=[];
				}
				RedPacketRecord=recordRes.rspBody.items
				if(RedPacketRecord && RedPacketRecord.length>5  ){
					RedPacketRecord=RedPacketRecord.slice(0,5)
				}				
				this.RedPacketRecord = RedPacketRecord;
				this.userName = userInfo.userName;
				this.moneyTotal = (Math.ceil(recordRes.rspBody.total/10));
				}
			
			},
			  // 处理排行榜头像加载失败问题
			imgLoadError(e){
				let  _index = e.currentTarget.dataset.index;
				let _summitList=this.summitList;
				let tmpImgUrl="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png"
				_summitList[_index].avatar=tmpImgUrl;
				this.summitList=_summitList

			},
			goBack(){
				if(this.pageName=='carSource'){
					uni.switchTab({  
						url: '/pages/ship/index/index_car_source',
					})
				}else if(this.pageName=='ship'){
					uni.switchTab({
						url:"/pages/ship/index/index1"
					})
				}else{
					uni.switchTab({  
						url: '/pages/ship/index/index_car_source',
					})
				}
				
			},
			// 处理日期格式 format为1变成年月日格式   format为2格式变为xxxx/xx/xx
			changeDataFormat(data,format){
				// console.log('变化日期格式',format)
				if(format==1){
					let date = data.split(" ")[0].split('-')
					let time = data.split(" ")[1].split('-')
					time=time[0].slice(0,5)
					let month=date[1];
					if(month.charAt(0)==0){
						month=month.charAt(1)+'月'
					}else{
						month+='月'
					}
					let day=date[2];
					if(day.charAt(0)==0){
						day=day.charAt(1)+'日'
					}else{
						day+='日'
					}

					return month+day+time
				}else if(format==2){
					data=data.replace(/-/g,'/');
					data=data.slice(0,16)
					return  data
				}
			},
			//点击开始红包雨游戏
			async  redStart(){
				// 判断是否可玩，次数有没有达到上限   participant为1 需要行驶证认证 0为无条件 
				// surplusNum.type   1为可以玩 2次数不足请分享  3 参与次数超过最大限制次数
				// let userRole=uni.getStorageSync('userRole');				
				// console.log(userRole);
				// console.log('点击了开始抢红红包',this.userRole);
				if(this.userRole==1){     
					this.isParticipant();
				}else{
					uni.switchTab({  
						url: '/pages/index/index/index',
					})
				}
			},
			isParticipant(){
				let participant=this.participant;
				let surplusNum=this.surplusNum;
				let userInfo=this.userInfo; //获取用户信息
				// 判断是否可玩，次数有没有达到上限   participant为1 需要行驶证认证 0为无条件 
				// surplusNum.type   1为可以玩 2次数不足请分享  3 参与次数超过最大限制次数
				let that=this;
				if(participant==1){
					if(surplusNum.type==3){	
						that.$refs.NoneShowPopup.open()
						return setTimeout(()=>{
							that.$refs.NoneShowPopup.close()
						},2000);
						
					}else if(userInfo.attrs.vehicleVerify!=1){
						return	that.$refs.roleShowPopup.open()
					}else if(surplusNum.type==2){
						return  that.$refs.invitationShowPopup.open()
					}
				}else if(participant==0){
					if(surplusNum.type==3){
						that.$refs.NoneShowPopup.open()
						return setTimeout(()=>{
							that.$refs.NoneShowPopup.close()
						},2000);
					}else if(surplusNum.type==2){
						return that.$refs.invitationShowPopup.open()
					}
				}
				uni.navigateTo({
					url: '../redPacketRain/redPacketRain'
				}) 
			},
			// 去分享
			goShare(e){
				console.log(e);
				let item = e.currentTarget.dataset.item;
				if(item == 'directShare'){
					this.toWxApplet();
				}else if(item == 'skipPage'){
					this.closeInvite();
					// let userRole=wx.getStorageSync('userRole');		 
					if(this.userRole==1){
						uni.navigateTo({
							url: '../shareAssist/shareAssist'
						})		
					}else{
						uni.navigateTo({
							url: '../shareAssist/shareAssist'
						})	
					}	
				}
									
			},
			// 关闭次数用完去邀请弹出框
			closeInvite(){
				this.$refs.invitationShowPopup.close()
			}, 
			// 认证
			goRz(){
				uni.navigateTo({
					// url:"../../../../pages/my/carVerify/newCarVerify/newCarVerify"
                    url:"/pages/my/carVerify/newCarVerify?pageSign='redPacket"
				})
			},
			closeRz(){
				this.$refs.roleShowPopup.close()
			},
			 closeZl(){
				this.$refs.helpMeShowPopup.close();
			},
			async goHelp() { // 点击 ‘我要助力’
				this.closeZl();
				uni.showLoading();
				try {
					let isNewUser = getApp().globalData.isNewUser;
					let params = {
						mobile: this.userInfo.mobile, //登录人手机号
						businessType: 10, //登录人角色
						shareCode: this.shareCode, //被助力人userCode
						shareType: 1, //固定1
						isNewUser: isNewUser ? isNewUser : undefined
					}
					let that = this;
					var res = await ship.postRequest("/au/hby/share", params, 'POST', false)
					if(res.retCode == "0000000") {
						wx.hideLoading();
						// 返回参数：status 0： 助力上限 1：助力成功 2：被助力人已经注销助力失败 3：货主不能助力 4：不能给自己助力 avatar 助力成功后返回的被助力人头像
						if(res.rspBody.status == 0) {
							that.$refs.shareUpperlimitPopup.open()
							setTimeout(()=>{
								that.$refs.shareUpperlimitPopup.close()
							},2000)
						}else if(res.rspBody.status == 1){
							that.$refs.shareOkPopup.close()
						}else { 
							that.$refs.helpFailurePopup.open()
							setTimeout(()=>{
								that.$refs.helpFailurePopup.close()
							},2000)
						}
					}else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				}catch(e) {
					uni.hideLoading();
					// console.log(e)
				}
			},
			inShareStatus(shareType, shareCode) { // 分享助力
				if(this.userInfo.attrs.userCode == shareCode) {
					return false;
				}
				let redPacketShareInfo = getApp().globalData.redPacketShareInfo;
				if(!redPacketShareInfo || !redPacketShareInfo.shareCode) {
					return false;
				}
				getApp().globalData.redPacketShareInfo = {};
				// let userRole = uni.getStorageSync('userRole');
				let that = this;
				if(this.userRole == 2) { // userRole == 2货主
					this.$refs.shareNoPopup.open()
					setTimeout(()=>{
						this.$refs.shareNoPopup.close()
						uni.switchTab({  
							url: '/pages/index/index/index',
						})
					},2000)
				}else { // userRole == 1 司机
					that.checkUserHelpLimt(shareCode);
				}
			},
			async checkUserHelpLimt(shareCode) { // 检查助力次数是否已达到上限
				if(this.userInfo) {
					try {
						let that = this;
						let params = {
							shareCode: shareCode,
							userMobile: that.userInfo.mobile
						}
						// console.log('助力参数', params);
						var res = await ship.postRequest("/hby/redPacketRecord/getRecordByUserNumber", params)
						// console.log('检查助力次数结果', res)
						if(res.retCode == "0000000") {
							if(res.rspBody.status == 1){
								if(res.rspBody.nikeName && res.rspBody.nikeName!='匿名用户'){
								res.rspBody.nikeName=res.rspBody.nikeName.substring(0,1)+'*'
								}
								this.$refs.helpMeShowPopup.open();
								this.beBoostedAvatar = res.rspBody.avatar;
								this.assistedSumAmount = res.rspBody.sumAmount;
								this.assistedNikeName = res.rspBody.nikeName;
							}else { 
								this.$refs.shareUpperlimitPopup.open();
								setTimeout(()=>{
									that.$refs.shareUpperlimitPopup.close();
								},2000)
							}
						}else {
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					}catch(e) {
						// console.log(e)
					}
				}
			},
			// 处理助力记录头像加载失败问题
			imgAssisLoadError(e){
				let  that = this;
				let  _index = e.currentTarget.dataset.index;
				let _AssistArr=that.AssistArr;
				let tmpImgUrl="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png"
				_AssistArr[_index].avatar=tmpImgUrl;				
				that.AssistArr = _AssistArr;
			},
			 // 关闭助力成功弹出框
			closeShareOk(){
				this.$refs.shareOkPopup.close();
			},
			wantToStart(e){
				let that=this;
				let text = e.currentTarget.dataset.text
				// let userRole=uni.getStorageSync('userRole');
				if(this.userRole==2){
					uni.switchTab({  
						url: '/pages/index/index/index',
					})
					return;
				}else{
					if(text=='我也要玩1'){
						that.closeZl();
						that.redStart();
					}else if(text=='我也要玩2'){
						that.closeShareOk();
						that.redStart();
					}
				}
				
			},
			//下拉刷新红包记录
			async  refreshNewMoeny(){
				// console.log('红包记录下拉刷新')
				if(!this.refresherMoenyOnOff) {
					this.refresherMoenyOnOff = true;
					this.moneyPages = 1;
				try {
					let params = {
						pageSize: "10",
						pageNum: 1,
						userId: this.userInfo.userId
					}
					let that=this;
					var res = await ship.postRequest("/hby/redPacketRecordAmount/getRecordByUser", params, 'POST', false);
					uni.hideLoading();
					// console.log('下拉刷新之后的红包记录',res);
					if(res.retCode == "0000000") {
						that.getSummitList();
						res.rspBody.items.forEach(item => {
							item.createdDt=that.changeDataFormat(item.createdDt,1)
						});
						let RedPacketRecord=that.RedPacketRecord
						RedPacketRecord=res.rspBody.items
						if(RedPacketRecord.length>5){
							RedPacketRecord=RedPacketRecord.slice(0,5)
						}
						setTimeout(() => {
							that.RedPacketRecord = RedPacketRecord;
							that.userName = that.userInfo.userName,
							that.moneyTotal = (Math.ceil(res.rspBody.total/10));
							that.refresherMoenyOnOff = false;
						}, 2000)
					}else {
						this.refresherMoenyOnOff = false;
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
				} catch (e) {
					this.efresherMoenyOnOff = false;
					// console.log(e);
				}
				}
			},
			// 下拉刷新邀请记录
			async refreshNewAssis(){
				let that=this;
				if(!that.refresherAssisOnOff){
					this.refresherAssisOnOff = true;
					this.invitePages = 1;
					try{
						let res= await ship.postRequest('/hby/redPacketRecord/getRecordByUser',{
							pageSize:"10",
							pageNum:1,
							shareUserId: that.userInfo.userId,
						})
						uni.hideLoading();
						if(res.retCode=='0000000'){
							res.rspBody.items.forEach(item=>{
								item.shareTime=that.changeDataFormat(item.shareTime,2)
								if(item.nikeName){
									item.nikeName=item.nikeName.substring(0,3)
									item.nikeName=item.nikeName+'...'
								}else{
									item.nikeName='匿名用户'
								}
								
							})
							let AssistArr=that.AssistArr;
							AssistArr=res.rspBody.items
							if(AssistArr.length>5){
								AssistArr=AssistArr.slice(0,5)
							}
							setTimeout(()=>{
								that.AssistArr = AssistArr;
								that.inviteTotal = Math.ceil(res.rspBody.total/10);
								that.refresherAssisOnOff = false;
							},2000)
						}else{
							that.refresherAssisOnOff=false;
							uni.showToast({
								title: res.retDesc,
								icon: 'none'
							})
						}
					}catch (e){
						that.refresherAssisOnOff=false;
					}
				}

			},
			goPoster(){
				uni.navigateTo({
					url:"../redPacketPoster/redPacketPoster"
				})
			},
			toWxApplet() {
                // console.log("点击了分享按钮");
                let that = this;
                let userCode="";
                let userInfo = uni.getStorageSync("userInfo");
                if(userInfo){
                    userInfo=JSON.parse(userInfo);
                    userCode=userInfo.attrs.userCode
                    ship.postRequest('/hby/redPacketShareRecord/add', {
                        userId: userInfo.userId,
                        userCode: userCode
                    })
                }
                console.log(userInfo);
                let titleArr = [
                    "新用户行驶证认证后助力，金额翻10倍！",
                    "老铁，就差你了，咱们一起领包包！",
                    "帮我助力一下吧，非常感谢！",
                    "我的已到账，邀您一起玩！",
                    "据可靠线报，这场包包雨下的更大吆！",
                    "日积月累，从行动开始，点它！",
                    "买彩票不一定中，这个点开肯定中！",
                ];
                let imgUrlArr=[
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link1.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link4.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link2.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link7.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link3.jpg",
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link6.jpg",   
                    "https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/share_link5.jpg",
                ]
                let randomNum = Math.floor(Math.random() * 7);
                let qrValue = '/pages/index/index/index?shareCode=' + userCode + '&shareType=1';
                uni.share({
                    provider: 'weixin',
                    scene: "WXSceneSession",
                    type: 5,
                    imageUrl: imgUrlArr[randomNum],
                    title: '【货运中国】'+titleArr[randomNum],
                    miniProgram: {
                        id: WX_ORIGIN_ID,
                        path: qrValue,
                        type: 0, //微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
                        webUrl: 'https://m-test.hyzgapp.com/#/privacy'
                    },
                    success: ret => {
                        console.log(JSON.stringify(ret));
                    }
                });
            },
			
		}
		
	}
</script>

<style lang="less">
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	page {
		overflow: hidden;
	}


	.container {
		width: 100vw;
		position: relative;
		// height  : 1624rpx;
		background-color: #D84B47;
		.circle {
			/*创建一个盒子*/
			width: 48rpx;
			height: 48rpx;
			transform: translate(-50%,-50%);
			// background-color: black;
			position: absolute;
			top:620rpx;
			z-index: 101;
			right: 1rpx;
        

			.circle1,
			.circle2,
			.circle3
			{
				position: absolute;
				left: 50%;
				top: 50%;
				margin: -50px 0 0 -50px;
				width: 38rpx;
				height: 38rpx;
				border-radius: 50%;
				border: 1rpx solid rgb(255, 255, 255, 0.8);
			} 
			.circle1 {
				animation: circle 3s linear infinite;
				-webkit-animation:circle 3s linear infinite;
			}
		
			.circle2 {
				animation: circle 3s linear 0.8s infinite;
				-webkit-animation: circle 3s linear 0.8s infinite;
			}
		
			.circle3 {
				animation: circle 3s linear 1.6s infinite;
				-webkit-animation: circle 3s linear 1.6s infinite;
			}
		
			@keyframes circle {
		
				/* Safari and Chrome */
				from {
					opacity: 1;
					transform: scale(0);
				}
		
				to {
					opacity: 0;
					transform: scale(3);
				}
			}
   		}
		.finger_icon{
			position: absolute;
			z-index: 102;
			width: 84rpx;
			height: 100rpx;
			animation: finger 1.5s linear infinite;
			-webkit-animation: finger 1.5s linear infinite;
		}
		@keyframes finger {
			0%{right: 30rpx;top: 551rpx;}
			50%{right: 60rpx;top:530rpx;}
			100%{right: 30rpx;top: 551rpx;}

		}
		.all_bg {
			width: 100vw;
			// height: 1624rpx;
		}

		.rain_gif_left {
			position: absolute;
			z-index: 3;
		}

		.rain_gif_right {
			position: absolute;
			z-index: 2;
			display: inline-block;
			-moz-transform: scaleX(-1);
			-webkit-transform: scaleX(-1);
			-o-transform: scaleX(-1);
			transform: scaleX(-1);
		}

		.level_bg {
			position: absolute;
			z-index: 1;
		}

		.big_packet {
			position: absolute;
			z-index: 3;
			height: 1696rpx;
			width: 750rpx;
			margin-top: 20rpx;
		}

		.go_shareBtn {
			width: 128rpx;
			height: 144rpx;
			z-index: 3;
			margin-top: 480rpx;
			margin-left: 622rpx;
			position: absolute;
		}

		.go_rzBtn {
			width: 128rpx;
			height: 144rpx;
			z-index: 3;
			margin-top: 605rpx;
			margin-left: 622rpx;
			position: absolute;
		}

		  .level_packet{
			position: absolute;
			z-index: 100;
			text-align: center;
			margin-top: 485rpx;
			width: 100vw;
			image{
				margin: 0 auto;
				width: 678rpx;
				height: 88rpx;
			}
			.start_box{
				// position: absolute;
				margin: 0 auto;
				width: 678rpx;
				height: 100rpx;
				line-height: 88rpx;
				background: #FFDF3A;
				box-shadow: 0rpx 0rpx 12rpx 0rpx #FFD338;
				border-radius: 84rpx;
				// top: 0;
				display: flex;
				justify-content: center;
				.start_box_title1{
					line-height: 100rpx;
					margin-right: 16rpx;
					font-size: 36rpx;
					font-weight: 600;
					color: #E72534;
				}
				.start_box_title2{
					line-height: 100rpx;
					font-size: 24rpx;
					font-weight: 600;
					color: #E72534;
				}
			}
		
		}

		.top_header {
			position: fixed;
			width: 100vw;
			left: 0;
			z-index: 100;
			display: flex;
			align-items: center;

			image {
				width: 76rpx;
				height: 76rpx;
				padding-left: 32rpx;
				padding-right: 32rpx;
				display: block;
			}

			.title {
				font-size: 28rpx;
				height: 60rpx;
				width: 150rpx;
				line-height: 60rpx;
				text-align: center;
				color: #FFD681;
				border-radius: 62rpx;
				background-image: linear-gradient(#E63315, #AD1900);
				border: 2px solid #F8E59C;
				margin-left: 150rpx;
				font-weight: 600;
			}
		}

		.start {
			position: fixed;
			z-index: 10;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 990rpx;
			display: flex;

			.title_bg {
				width: 462rpx;
				height: 87rpx;
				position: absolute;
				z-index: 2;
				margin-top: -35rpx;
				transform: translateX(-50%);
			}

			.start_bg {
				position: absolute;
				z-index: 1;
				transform: translateX(-50%);
				width: 678rpx;
				height: 500rpx;
			}

			.moeny_bg {
				position: absolute;
				z-index: 3;
				transform: translateX(-50%);
				width: 574rpx;
				height: 198rpx;
				top: 120rpx;
			}


			.title_item {
				position: absolute;
				z-index: 3;
				width: 462rpx;
				transform: translateX(-50%);
				text-align: center;
				height: 100rpx;
				line-height: 100rpx;
				margin-top: -35rpx;
				color: #FFD681;
				font-size: 40rpx;
				letter-spacing: 4rpx;
				background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-weight: 600;
			}

			.hint_item {
				position: absolute;
				z-index: 3;
				line-height: 50rpx;
				font-size: 28rpx;
				width: 600rpx;
				top: 60rpx;
				left: 75rpx;
				transform: translateX(-50%);
				font-family: PingFang SC-Semibold, PingFang SC;
				font-weight: 600;
				color: #F62B11;
			}

			.moeny_item {
				position: absolute;
				z-index: 4;
				transform: translateX(-50%);
				top: 140rpx;
				height: 198rpx;
				width: 564rpx;
				text-align: center;
				font-size: 26rpx;
				font-weight: 400;
				line-height: 40rpx;
				letter-spacing: 4rpx;
				color: #F62B11;
			}


			.start_btn {
				transform: translateX(-50%);
				width: 408rpx;
				height: 126rpx;
				position: absolute;
				z-index: 4;
				top: 340rpx;
			}

			.start_item {
				position: absolute;
				z-index: 4;
				transform: translateX(-50%);
				top: 185rpx;
				height: 100rpx;
				width: 200rpx;
				text-align: center;

				.title {
					position: relative;
					top: 165rpx;
					width: 200rpx;
					font-size: 36rpx;
					font-family: Alibaba PuHuiTi 2.0-105 Heavy, Alibaba PuHuiTi 20;
					font-weight: 600;
					line-height: 40rpx;
					// text-shadow: 0px 4rpx 2rpx rgba(0,0,0,0.25);
					background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}

				.frequency {
					position: relative;
					top: 170rpx;
					width: 200rpx;
					font-size: 20rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					line-height: 20rpx;
					background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}

		}

		  .start_share{
			z-index: 10;
			position : absolute;
			left     : 50%;
			transform: translateX(-50%);
			// top      : 1150rpx;
			top: 610rpx;
			// background-color: black;
			width: 678rpx;
			height: 274rpx;
			// background: linear-gradient(180deg, #FF1F3A 100%, #F4E9D1 100%);
			border-radius: 52rpx ;  
			border: 4rpx solid transparent;
			background-clip: padding-box, border-box;
			background-origin: padding-box, border-box;
			background-image: linear-gradient(180deg, rgba(255, 31, 58, 1), rgba(244, 233, 209, 0.1)), linear-gradient(180deg, rgba(248, 225, 200, 1), rgba(240, 226, 195, 0.04));
			
			.btn_box{
				width: 678rpx;
				height: 122rpx;
				position: absolute;
				bottom: 0;
				display: flex;
				justify-content: center;
				.start_share_box{
					width: 288rpx;
					height: 122rpx;
					.start_share_btn{
						width: 286rpx;
						height: 122rpx;
					}
					.start_share_title{
						width: 272rpx;
						height: 72rpx;
						font-size: 28rpx;
						color: #E72534;
						text-align: center;
						position: absolute;
						top: 20rpx;
						font-weight: 600;
						background: #FFDF3A;
						box-shadow: 0rpx 0rpx 12rpx 0rpx #FFD338;
						border-radius: 84rpx ;
						line-height: 72rpx;
						.share_icon_box{
							height: 34rpx;
							// padding-top: 10rpx;
							position: absolute;
							left: 55rpx;
							bottom: 20rpx;
							.share_icon{
								width: 34rpx;
								height: 34rpx;
							}
						}
						.share_text{
							position: absolute;
							right: 25%;
							height: 72rpx;
							line-height: 72rpx;
						}
						
					}
					.start_share_title_box{
						width: 288rpx;
						height: 72rpx;
						color: #E72534;
						font-weight: 600;
						line-height: 72rpx;
						font-size: 28rpx;
						background: #FFDF3A;
						box-shadow: 0rpx 0rpx 12rpx 0rpx #FFD338;
						border-radius: 84rpx;
						text-align: center;
						position: absolute;
						top: 18rpx;
						.title{
							font-size: 36rpx;
							font-weight: 600;
						}
						.num_title{
							font-size: 20rpx;
						}
					}
				}
				
			}
			.role_box{
				width: 678rpx;
				text-align: center;
				font-size: 26rpx;
				height: 152rpx;
				font-weight: 600;
				color: #FFFFFF;
				margin-top: 30rpx;
				view{
					line-height: 40rpx;
				}
			}
			
			
		
		}

		 .bottom{
			z-index: 10;
			position : absolute;
			left     : 50%;
			transform: translateX(-50%);
			// bottom: 0;
			display: flex;
			width: 678rpx;
			height: 40vh;

			.rankingList_bg{
				width: 678rpx;
				height: 705rpx;
			}

			.title_bg{
				position: absolute;
				z-index: 2;
				margin-top: -35rpx;
				width: 462rpx;
				height: 87rpx;
				transform: translateX(25%);
			}


			.leaderboard_item{
				position: absolute;
				transform: translateX(25%);
				margin-top: -35rpx;
				line-height: 100rpx;
				z-index: 3;  
				width: 462rpx;
				height: 100rpx;
				text-align: center;
				font-size: 40rpx;
				font-weight: 600;
				letter-spacing: 4rpx;
				background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}

			.leaderboard_box{
				width: 678rpx;
				position: absolute;
				z-index: 3; 
				top: 50rpx;
				.scroll-view_H{
					white-space: nowrap;
					position: absolute;
					top: -50rpx;
					.leaderboard_title{
						margin: 0 auto;
						width: 630rpx;
						justify-content: space-around;
						padding: 32rpx 0 20rpx 0;
						display: flex;
						text-align: center;
						font-size: 32rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 40rpx;
						color:#F62B11;
						
					}
					.redPacket_item{
						width: 618rpx;
						// height: 372rpx;
						height: 228rpx;
						background: #FFFFFF;
						border-radius: 24rpx;
						margin: 10rpx auto;
						overflow: hidden;
						.avatar{
							width: 96rpx;
							height: 96rpx;
							border-radius: 50%;
							margin-top: 24rpx;
						}
						.nickName{
							text-align: center;
							font-size: 28rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							line-height: 40rpx;
						}
						.total_money{
							display: flex;
							justify-content: center;
							margin-top: 40rpx;
							.total_text{
								font-size: 36rpx;
								background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
								font-weight: 600;
								line-height: 72rpx;
								margin-right: 20rpx;
							}
							.total_num{
								text-align: center;
								// width: 300rpx;
								font-size: 72rpx;
								font-family: Alibaba PuHuiTi 2.0-105 Heavy, Alibaba PuHuiTi 20;
								font-weight: 600;
								line-height: 72rpx;
								color:#F62B11;
							}
							.yuan{
								width: 48rpx;
								height: 48rpx;
								background: linear-gradient(180deg, #F76C5B 0%, #E2200E 100%);
								border-radius: 50%;
								margin-top: 13rpx;
								text-align: center;
								margin-left: 20rpx;

								view{
									width: 48rpx;
									line-height: 48rpx;
									font-size: 28rpx;
									font-family: Alibaba PuHuiTi 2.0-105 Heavy, Alibaba PuHuiTi 20;
									font-weight: 600;
									background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
								}
							}
						}

						.navigator_title{
							text-align: center;
							padding: 32rpx 0;
							text:first-of-type{
								font-size: 28rpx;
								font-family: PingFang SC-Regular, PingFang SC;
								font-weight: 400;
								line-height: 28rpx;
								color:#F62B11;
							}
							text:last-of-type{
								font-size: 28rpx;
								font-family: PingFang SC-Medium, PingFang SC;
								font-weight: 500;
								line-height: 28rpx;
								color:#F62B11;
							}
						}
					}

					.hb_details{
						text-align: center;
						font-size: 36rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 40rpx;
						color:#F62B11;
					}

					.details_box{
						width: 680rpx;
						height: 595rpx;
						position: relative;
						.none{
							position: absolute;
							top: 0;
							bottom: 0;
							left: 0;
							right: 0;
							margin: auto;
							width: 216rpx;
							height: 130rpx;
							font-size: 36rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							line-height: 72rpx;
							color:#F62B11;
						}

						.details_item{
							width: 618rpx;
							margin: 0 auto;
							line-height: 50rpx;
							height: 50rpx;
							display: flex;
							align-items: center;
							.avatar{
								width: 76rpx;
								height: 76rpx;
								border-radius: 50%;
								margin-top: 24rpx;
							}
							.name_data{
								width: 200rpx;
								view:first-of-type{
									font-size: 32rpx;
									font-family: PingFang SC-Medium, PingFang SC;
									font-weight: 500;
									// line-height: 28rpx;
									color:#F62B11;
									padding-bottom: 10rpx;
								}
								view:last-of-type{
									font-size: 32rpx;
									font-family: PingFang SC-Regular, PingFang SC;
									font-weight: 400;
									// line-height: 24rpx;
									color:#F62B11;
								}

							}

							.yuan{
								// padding-top: 30rpx;
								width: 400rpx;
								text-align: right;
								font-size: 34rpx;
								font-family: PingFang SC-Regular, PingFang SC;
								font-weight: 400;
								// line-height: 24rpx;
								color:#F62B11;
							}
						}
						.redPacket_item{
							width: 618rpx;
							height: 228rpx;
							background: #FFFFFF;
							border-radius: 24rpx;
							margin: 5rpx auto;

							.avatar{
								width: 96rpx;
								height: 96rpx;
								border-radius: 50%;
								margin-top: 24rpx;
							}
							.nickName{
								text-align: center;
								font-size: 28rpx;
								font-family: PingFang SC-Regular, PingFang SC;
								font-weight: 400;
								line-height: 40rpx;
							}
							.total_money{
								display: flex;
								justify-content: center;
								margin-top: 32rpx;
								.total_num{
									text-align: center;
									// width: 300rpx;
									font-size: 72rpx;
									font-family: Alibaba PuHuiTi 2.0-105 Heavy, Alibaba PuHuiTi 20;
									font-weight: 600;
									line-height: 72rpx;
									color:#F62B11;
								}
								.yuan{
									width: 48rpx;
									height: 48rpx;
									background: linear-gradient(180deg, #F76C5B 0%, #E2200E 100%);
									border-radius: 50%;
									// margin-top: 20rpx;
									text-align: center;

									text{
										font-size: 28rpx;
										font-family: Alibaba PuHuiTi 2.0-105 Heavy, Alibaba PuHuiTi 20;
										font-weight: 600;
										background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
										-webkit-background-clip: text;
										-webkit-text-fill-color: transparent;
									}
								}
							}

							.navigator_title{
								text-align: center;
								padding: 32rpx 0;
								text:first-of-type{
									font-size: 28rpx;
									font-family: PingFang SC-Regular, PingFang SC;
									font-weight: 400;
									line-height: 28rpx;
									color:#F62B11;
								}
								text:last-of-type{
									font-size: 28rpx;
									font-family: PingFang SC-Medium, PingFang SC;
									font-weight: 500;
									line-height: 28rpx;
									color:#F62B11;
								}
							}
						}

					}
					.help_box{
						width: 680rpx;
						height: 595rpx;
						// margin-top: 30rpx;
						position: relative;

						.none{
							position: absolute;
							top: 0rpx;
							bottom: 0;
							left: 0;
							right: 0;
							margin: auto;
							width: 216rpx;
							height: 130rpx;
							font-size: 36rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							line-height: 72rpx;
							color:#F62B11;
						}


						.help_item{
							width: 630rpx;
							height: 96rpx;
							margin: 0 auto;
							// line-height: 76rpx;
							display: flex;
							align-items: center;
							.avatar{
								width: 76rpx;
								height: 76rpx;
								border-radius: 50%;
								margin-top: 24rpx;
								margin-right: 10rpx;
							}

							.nickName{
								width: 100rpx;
								margin-left: 20rpx;
								width: 85rpx;
								font-size: 28rpx;
								font-family: PingFang SC-Medium, PingFang SC;
								font-weight: 500;
								color:#F62B11;
							}

							.certification_title{
								margin-left: 37rpx;
								width: 92rpx;
								height: 32rpx;
								line-height: 32rpx;
								text-align: center;
								border-radius: 164rpx;
								font-size: 20rpx;
								font-weight: 400;
								flex-shrink: 0;
							}
							

							.data{
								// margin-left: 0rpx;
								width: 300rpx;
								// text-align: right;
								text-align: right;
								font-size: 28rpx;
								font-family: PingFang SC-Medium, PingFang SC;
								font-weight: 500;
								line-height: 36rpx;
								color:#F62B11;
							}
						}
					}
				}
				.test{
					background-color: #AD1900;
				}
				.rankimg_box{
					width: 680rpx;
					height: 595rpx;
					.ranking_item{
						margin: 0 auto;
						line-height: 107rpx;
						height: 96rpx;
						width: 642rpx;
						display: flex;
						align-items: center;
						.left_avatar{
							width: 76rpx;
							height: 76rpx;
							border-radius: 50%;
							vertical-align: middle;
							margin-left: 15rpx;
						}
						.nickName{
							width: 112rpx;
							height: 28rpx;
							padding: 0 0 0 32rpx;
							font-size: 28rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 500;
							line-height: 28rpx;
							color:#F62B11;
						}
						.medal{
							width: 52rpx;
							height: 71rpx;
							padding: 0 0 0 40rpx;
						}
						.moeny{
							text-align: right;
							font-size: 36rpx;
							width: 282rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 500;
							line-height: 36rx;
							color:#F62B11;
						}
					}
				}
				
			}


			.leaderboard_none{
				text-align: center;
				top:100rpx;
				font-size: 36rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color:#F62B11;
			}
		}




		.record_container {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 101;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.8);
			overflow: hidden;

			.record_top_img {
				width: 463rpx;
				height: 389rpx;
				z-index: -1;
				transform: translateX(31%);
				position: absolute;
				top: -230rpx;
			}

			.record {
				position: absolute;
				bottom: -10rpx;
				left: 0;

				.record_bg {
					width: 100vw;
					height: 950rpx;
				}

				.scroll-view_H {
					white-space: nowrap;
					position: absolute;
					top: 0;

					.title {
						display: inline-block;
						padding: 32rpx 0;
						width: 50%;
						text-align: center;
						font-size: 36rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 40rpx;
						color: #F62B11;
					}

					.redPacket_item {
						width: 678rpx;
						height: 372rpx;
						background: #FFFFFF;
						border-radius: 24rpx;
						margin: 44rpx auto;

						.avatar {
							width: 96rpx;
							height: 96rpx;
							border-radius: 50%;
							margin-top: 24rpx;
						}

						.nickName {
							text-align: center;
							font-size: 28rpx;
							font-family: PingFang SC-Regular, PingFang SC;
							font-weight: 400;
							line-height: 40rpx;
						}

						.total_money {
							display: flex;
							justify-content: center;
							margin-top: 32rpx;

							.total_num {
								text-align: center;
								width: 300rpx;
								font-size: 72rpx;
								font-family: Alibaba PuHuiTi 2.0-105 Heavy, Alibaba PuHuiTi 20;
								font-weight: 600;
								line-height: 72rpx;
								color: #F62B11;
							}

							.yuan {
								width: 48rpx;
								height: 48rpx;
								background: linear-gradient(180deg, #F76C5B 0%, #E2200E 100%);
								border-radius: 50%;
								margin-top: 20rpx;
								text-align: center;

								text {
									font-size: 28rpx;
									font-family: Alibaba PuHuiTi 2.0-105 Heavy, Alibaba PuHuiTi 20;
									font-weight: 600;
									background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
								}
							}
						}

						.navigator_title {
							text-align: center;
							padding: 32rpx 0;

							text:first-of-type {
								font-size: 28rpx;
								font-family: PingFang SC-Regular, PingFang SC;
								font-weight: 400;
								line-height: 28rpx;
								color: #F62B11;
							}

							text:last-of-type {
								font-size: 28rpx;
								font-family: PingFang SC-Medium, PingFang SC;
								font-weight: 500;
								line-height: 28rpx;
								color: #F62B11;
							}
						}
					}

					.hb_details {
						text-align: center;
						font-size: 36rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 40rpx;
						color: #F62B11;
					}

					// .details_box {
					// 	width: 750rpx;
					// 	height: 420rpx;
					// 	position: relative;

					// 	.none {
					// 		position: absolute;
					// 		top: 0;
					// 		bottom: 0;
					// 		left: 0;
					// 		right: 0;
					// 		margin: auto;
					// 		width: 216rpx;
					// 		height: 216rpx;
					// 		font-size: 36rpx;
					// 		font-family: PingFang SC-Regular, PingFang SC;
					// 		font-weight: 400;
					// 		line-height: 72rpx;
					// 		color: #F62B11;
					// 	}

					// 	// .details_item {
					// 	// 	width: 678rpx;
					// 	// 	margin: 0 auto;
					// 	// 	line-height: 76rpx;
					// 	// 	height: 76rpx;
					// 	// 	display: flex;
					// 	// 	align-items: center;

					// 	// 	.avatar {
					// 	// 		width: 76rpx;
					// 	// 		height: 76rpx;
					// 	// 		border-radius: 50%;
					// 	// 		margin-top: 24rpx;
					// 	// 	}

					// 	// 	.name_data {
					// 	// 		width: 200rpx;
					// 	// 		padding-left: 16rpx;

					// 	// 		view:first-of-type {
					// 	// 			font-size: 28rpx;
					// 	// 			font-family: PingFang SC-Medium, PingFang SC;
					// 	// 			font-weight: 500;
					// 	// 			line-height: 28rpx;
					// 	// 			color: #F62B11;
					// 	// 			padding-bottom: 10rpx;
					// 	// 		}

					// 	// 		view:last-of-type {
					// 	// 			font-size: 24rpx;
					// 	// 			font-family: PingFang SC-Regular, PingFang SC;
					// 	// 			font-weight: 400;
					// 	// 			line-height: 24rpx;
					// 	// 			color: #F62B11;
					// 	// 		}

					// 	// 	}

					// 	// 	.yuan {
					// 	// 		padding-top: 30rpx;
					// 	// 		width: 400rpx;
					// 	// 		text-align: right;
					// 	// 		font-size: 24rpx;
					// 	// 		font-family: PingFang SC-Regular, PingFang SC;
					// 	// 		font-weight: 400;
					// 	// 		line-height: 24rpx;
					// 	// 		color: #F62B11;
					// 	// 	}
					// 	// }
					// }
				}

				// .help_box {
				// 	width: 750rpx;
				// 	height: 920rpx;
				// 	margin-top: 30rpx;
				// 	position: relative;

				// 	.none {
				// 		position: absolute;
				// 		top: 350rpx;
				// 		bottom: 0;
				// 		left: 0;
				// 		right: 0;
				// 		margin: auto;
				// 		width: 216rpx;
				// 		height: 920rpx;
				// 		font-size: 36rpx;
				// 		font-family: PingFang SC-Regular, PingFang SC;
				// 		font-weight: 400;
				// 		line-height: 72rpx;
				// 		color: #F62B11;
				// 	}


				// 	.help_item {
				// 		width: 680rpx;
				// 		// height: 126rpx;
				// 		margin: 0 auto;
				// 		// line-height: 76rpx;
				// 		display: flex;
				// 		align-items: center;

				// 		.avatar {
				// 			width: 76rpx;
				// 			height: 76rpx;
				// 			border-radius: 50%;
				// 			margin-top: 24rpx;
				// 		}

				// 		.nickName {
				// 			margin-left: 20rpx;
				// 			width: 100rpx;
				// 			font-size: 28rpx;
				// 			font-family: PingFang SC-Medium, PingFang SC;
				// 			font-weight: 500;
				// 			color: #F62B11;
				// 		}

				// 		.certification_title {
				// 			margin-left: 32rpx;
				// 			width: 92rpx;
				// 			height: 32rpx;
				// 			line-height: 32rpx;
				// 			text-align: center;
				// 			border-radius: 164rpx;
				// 			font-size: 20rpx;
				// 			font-weight: 400;
				// 			flex-shrink: 0;
				// 		}


				// 		.data {
				// 			margin-left: 40rpx;
				// 			text-align: right;
				// 			font-size: 32rpx;
				// 			font-family: PingFang SC-Medium, PingFang SC;
				// 			font-weight: 500;
				// 			line-height: 36rpx;
				// 			color: #F62B11;
				// 		}
				// 	}
				// }

				.record_btn {
					position: absolute;
					width: 58rpx;
					height: 58rpx;
					top: -5vh;
					right: 30rpx;
				}
			}

		}



		.rule_box {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 101;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.8);

			.rule_item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 618rpx;
				height: 478rpx;
				background: #FFFFFF;
				border-radius: 36rpx;
				box-sizing: border-box;

				.rule_bg {
					width: 618rpx;
					height: 478rpx;
					padding-bottom: 32rpx;
				}

				.rule_title {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 618rpx;
					height: 478rpx;
					padding-bottom: 32rpx;
					z-index: 100;

					.title {
						text-align: center;
						margin-top: 50rpx;
						margin-bottom: 32rpx;
						width: 618rpx;
						height: 48rpx;
						font-size: 48rpx;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						line-height: 48rpx;
						color: #F62B11;
					}

					.rule_detail {
						width: 498rpx;
						height: 400rpx;
						margin: 0 auto;
						font-size: 36rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 44rpx;
						letter-spacing: 14rpx;
						color: #F62B11;
					}
				}

				.rule_btn {
					position: absolute;
					width: 58rpx;
					height: 58rpx;
					right: 0;
					top: -80rpx;

				}

			}
		}




		.rz_box {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 101;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.8);
			position: relative;

			.rz_item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 618rpx;
				height: 370rpx;
				background: #FFFFFF;
				border-radius: 36rpx;
				box-sizing: border-box;

				.rz_bg {
					width: 618rpx;
					height: 370rpx;
					padding-bottom: 32rpx;
				}

				.rz_title {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 618rpx;
					height: 370rpx;
					padding-bottom: 32rpx;
					z-index: 100;

					.title {
						text-align: center;
						margin-top: 60rpx;
						margin-bottom: 32rpx;
						width: 618rpx;
						height: 48rpx;
						font-size: 48rpx;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						line-height: 48rpx;
						color: #F62B11;
					}

					.rz_detail {
						width: 504rpx;
						height: 52rpxrpx;
						margin: 0 auto;
						font-size: 36rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 52rpx;
						height: 52rpx;
						color: #F62B11;
					}

					.go_rz {
						width: 400rpx;
						height: 80rpx;
						background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
						border-radius: 16rpx;
						text-align: center;
						margin: 68rpx auto;

						.rz_navigator {
							font-size: 32rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 500;
							line-height: 80rpx;
							height: 80rpx;
							background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
							-webkit-background-clip: text;
							-webkit-text-fill-color: transparent;
						}
					}
				}

				.rz_btn {
					position: absolute;
					width: 58rpx;
					height: 58rpx;
					right: 0;
					top: -80rpx;


				}

			}
		}


		.numNone_box {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 101;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.8);

			.numNone_item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 582rpx;
				height: 330rpx;
				background: #FFFFFF;
				border-radius: 36rpx;
				box-sizing: border-box;

				.numNone_bg {
					width: 582rpx;
					height: 330rpx;
				}

				.numNone_title {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					z-index: 100;
					width: 454rpx;
					// height: 186rpx;
				}

				.title {
					width: 460rpx;
					// height: 186rpx;
					text-align: center;
					font-size: 40rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					line-height: 62rpx;
					letter-spacing: 6rpx;
					color: #F62B11;
				}

			}
		}


		.invite_box {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 101;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.8);

			.invite_item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 618rpx;
				height: 502rpx;
				background: #FFFFFF;
				border-radius: 36rpx;
				box-sizing: border-box;

				.invite_bg {
					width: 618rpx;
					height: 502rpx;
					padding-bottom: 32rpx;
				}

				.invite_title {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 618rpx;
					height: 502rpx;
					z-index: 100;
					text-align: center;

					.title {
						margin-top: 60rpx;
						margin-bottom: 32rpx;
						width: 618rpx;
						height: 48rpx;
						font-size: 48rpx;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						line-height: 48rpx;
						height: 48rpx;
						color: #F62B11;
					}

					.invite_detail {
						width: 472rpx;
						height: 52rpxrpx;
						margin: 0 auto;
						font-size: 36rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 62rpx;
						letter-spacing: 1rpx;
						color: #F62B11;
					}

					.go_invite {
						width: 400rpx;
						height: 80rpx;
						background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
						border-radius: 16rpx;
						text-align: center;
						margin: 48rpx auto;

						.invite_navigator {
							font-size: 32rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 500;
							line-height: 80rpx;
							height: 80rpx;
							background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
							-webkit-background-clip: text;
							-webkit-text-fill-color: transparent;
						}
					}
				}

				.invite_btn {
					position: absolute;
					width: 58rpx;
					height: 58rpx;
					right: 0;
					top: -80rpx;


				}

			}
		}



		.help_success_box {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 101;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.8);

			.help_success_item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				// width: 582rpx;
				// height: 336rpx;
				width: 540rpx;
				height: 594rpx;
				background: #FFFFFF;
				border-radius: 36rpx;
				box-sizing: border-box;

				.help_success_bg {
					// width: 582rpx;
					// height: 336rpx;
					width: 540rpx;
					height: 594rpx;
				}

				.help_success_title {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					// width: 582rpx;
					// height: 336rpx;
					width: 540rpx;
					height: 594rpx;
					z-index: 100;
					text-align: center;

					.title {
						margin-top: 20rpx;
						width: 540rpx;
						// height: 96rpx;

						image {
							width: 194rpx;
							height: 194rpx;
							// border-radius: 50%;
							// margin-bottom: -20rpx;
						}
					}

					.help_success_detail {
						width: 540rpx;
						height: 380rpx;
						margin: 0 auto;
						font-size: 40rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 62rpx;
						letter-spacing: 3rpx;
						color: #F62B11;

						.title_success {
							font-size: 48rpx;
							font-weight: 600;
							color: #6E3409;
						}

						.success_signage {
							font-size: 32rpx;
							font-weight: 600;
							color: #6E3409;
						}

						.me_to {
							margin: 80rpx auto;
							width: 400rpx;
							height: 80rpx;
							background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
							border-radius: 16rpx;

							view {
								font-weight: 600;
								line-height: 80rpx;
								height: 80rpx;
								font-size: 32rpx;
								background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
							}
						}
					}

					.help_ts {
						width: 472rpx;
						height: 200rpx;
						margin: 100rpx auto;
						font-size: 40rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						letter-spacing: 3rpx;
						color: #F62B11;
					}
				}

				.help_success_btn {
					position: absolute;
					width: 58rpx;
					height: 58rpx;
					right: 0;
					top: -80rpx;


				}
			}
		}


		.helpMe_box {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 101;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.8);

			.helpMe_item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				// width: 618rpx;
				// height: 468rpx;
				width: 750rpx;
				height: 1624rpx;
				// background   : #000000 81%;
				// border-radius: 36rpx;
				box-sizing: border-box;

				.helpMe_bg {
					// width: 618rpx;
					// height: 468rpx;
					width: 750rpx;
					height: 1624rpx;
					padding-bottom: 32rpx;
				}

				.helpMe_title {
					position: absolute;
					top: 35%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 618rpx;
					height: 200rpx;
					padding-bottom: 32rpx;
					z-index: 100;

					.title {
						text-align: center;
						margin-top: 60rpx;
						width: 618rpx;
						height: 96rpx;
						margin-bottom: 48rpx;

						image {
							width: 96rpx;
							height: 96rpx;
							border-radius: 50%;

						}
					}

				}

				.helpMe_detail {
					position: absolute;
					top: 58%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 618rpx;
					height: 200rpx;
					padding-bottom: 32rpx;
					z-index: 100;
					// margin-top: 120rpx;
					font-size: 36rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 600;
					line-height: 52rpx;
					color: #E83624;
					text-align: center;
				}

				.go_helpMe_box {
					position: absolute;
					top: 72%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 618rpx;
					// height: 200rpx;
					padding-bottom: 32rpx;
					z-index: 100;

					.go_helpMe {

						width: 430rpx;
						height: 108rpx;
						// background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
						// border-radius: 16rpx;
						background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/help_btn.png');
						background-repeat: no-repeat;
						background-size: cover;
						text-align: center;
						margin: 28rpx auto;

						.helpMe_navigator {
							font-size: 36rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 600;
							line-height: 108rpx;
							height: 108rpx;
							color: #E83624;
						}
					}
				}



				.rz_btn {
					position: absolute;
					width: 58rpx;
					height: 58rpx;
					right: 13%;
					top: 22%;


				}

			}
		}

		.carFriend_help_box {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 101;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.8);

			.carFriend_help_item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 582rpx;
				height: 336rpx;
				background: #FFFFFF;
				border-radius: 36rpx;
				box-sizing: border-box;

				.carFriend_help_bg {
					width: 582rpx;
					height: 336rpx;

				}

				.carFriend_help_title {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 582rpx;
					height: 336rpx;
					z-index: 100;
					text-align: center;

					.carFriend_ts {
						width: 472rpx;
						height: 200rpx;
						margin: 100rpx auto;
						font-size: 40rpx;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 400;
						letter-spacing: 3rpx;
						color: #F62B11;
					}
				}
			}
		}

	}
</style>
