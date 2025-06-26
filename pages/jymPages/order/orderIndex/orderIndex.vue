<template>
	<view>
		<!-- style="disableScroll: true; height: 100vh;overflow-y:scroll" -->
		<view class="jym-container" style="height: 100vh">
			<view class="advs" v-if="activeAdvObj && activeAdvObj.info[0].advUrl">
				<image :src="activeAdvObj.info[0].advUrl" mode="aspectFill" @click="showBigBanner(activeAdvObj.info[1], activeAdvObj.info[1].advUrl)" class="mainBanner"image>
				<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adverties.gif"  class="advertiesGif"></image>
			</view>
			<view class="selectView">
				<view @tap="selectTap">
					<text :style="'color:' + item1SelectedColor">选择支付方式</text>
					<image :class="['select_img', show2&&'select_img_rotate']" :src="item1SelectImg"></image>
				</view>
				<view>
					<picker mode="date" fields="month" :value="year+month" start="2020-01" end="2025-12"
						@cancel="bindcancel" @change="bindDateChange">
						<text :style="'line-height:50rpx;color:' + item2SelectedColor">{{year}}-{{month}}</text>
					</picker>
					<image :src="item2SelectImg"></image>
				</view>
			</view>
			<view class="select_box" @tap="clickDisappear" :style="'height:' + (show1?100:0) + 'vh;'" :class="activeAdvObj && activeAdvObj.info[0].advUrl ? 'have_adv' : ''">
				<view class="option_box" :style="'height:' + (show1?876:0) + 'rpx;'">
					<scroll-view class="scrollView" scroll-y="true">
						<view class="cellView pay_mode pay_upline2" :data-type="3" @tap="selectCardItem3">
							<view class="flex pay_icon align-center">
								<image mode="aspectFit" class="online_pay"
									src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_qb.png">
								</image>
							</view>
							<view class="leftView1 flex align-cneter">
								<view>全部订单</view>
							</view>
						</view>
						<block v-for="(item, index) in cardListArr" :key="index">
							<view class="cellView" :data-type="2" @tap="selectCardItem2" :data-map="item"
								:style="'background: ' + (item.cardType==3?itemColor4:filter.checkCardFlagIsSite(item.cardFlag)==false?itemColor3:item.fuelType==1?itemColor:item.fuelType==2?itemColor1:itemColor2) + ';'">
								<view class="cellView1" :data-index="bindex"
									:style="'color: ' + (item.cardType==3?textColor4:filter.checkCardFlagIsSite(item.cardFlag)==false?textColor3:item.fuelType==1?textColor:item.fuelType==2?textColor1:textColor2) + ';'">
									<view class="cellView1_img" hover-class="none" hover-stop-propagation="false">
										<image
											:style="'height:' + (item.cardType == 3?'60rpx':filter.checkCardFlagIsSite(item.cardFlag)==false?'120rpx':item.fuelType==1?'140rpx':item.fuelType==2?'130rpx':'130rpx') + ';width:' + (item.fuelType==3?'130rpx':'150rpx')"
											:src="item.cardType==3?itemImg4:filter.checkCardFlagIsSite(item.cardFlag)==false?itemImg3:item.fuelType==1?itemImg:item.fuelType==2?itemImg1:itemImg2">
										</image>
									</view>

									<view class="leftView2">
										<view class="leftView_stationName">
											{{filter.checkCardFlagName(item.cardFlag)}}
										</view>
										<view class="leftView_compSecondName">
											卡号：{{item.cardNo}}
										</view>
										<view class="leftView_compSecondName" v-if="item.cardType!=3">
											{{item.compSecondName}}
										</view>
									</view>
									<view class="rightView2">
										<view class="rightView_view">
											<view class="amount">
												<view style="font-size: 28rpx;">￥</view>
												<view>
													{{filter.Amount(item.amount)[0]}}
												</view>
												<view style="font-size: 18rpx;">
													.{{filter.Amount(item.amount)[1]}}
												</view>
											</view>
											<view style="text-align: center;font-size: 24rpx;">
												余额
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						
						<!--
						<view class="cellView pay_mode pay_upline" :data-type="1" @tap="selectCardItem1">
							<view class="flex pay_icon align-center">
								<image mode="aspectFit" class="online_pay"
									src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_wx.png">
								</image>
							</view>
							<view class="leftView1 flex align-cneter">
								<view>微信支付</view>
							</view>
						</view>
						-->
						<view class="cellView pay_mode pay_upline1" :data-type="0" @tap="selectCardItem">
							<view class="flex pay_icon align-center">
								<image mode="aspectFit" class="online_pay"
									src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_offline.png">
								</image>
							</view>
							<view class="leftView1 flex align-cneter">
								<view>线下支付</view>
							</view>
						</view>
						<!-- <view class="cellView pay_mode pay_upline3" data-type="{{20}}" bindtap='selectCardItem4'>
					<view class="flex pay_icon align-center">
						<image mode='aspectFit' class="online_pay" src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/order_group.png"></image>
					</view>
					<view class="leftView1 flex align-cneter">
						<view>拼团订单</view>
					</view>
				</view> -->
					</scroll-view>
				</view>
			</view>
			<!-- hidden="{{showcard===''?true:false}}"  hidden="{{type}}" -->
			<view class="cardView">
				<view class="cardContainer" v-if="type==3" style="background-color:  #F2E9C9">
					<view class="cardViewBody">
						<view class="offline">
							<image
								src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_qbbox.png">
							</image>
						</view>
						<view class="offlineText">
							<view class="offlineText_1">
								全部订单
							</view>
						</view>
					</view>
				</view>
				<!-- :style="'color: ' + (showcard.cardType==3?textColor4:filter.checkCardFlagIsSite(showcard.cardFlag)==false?textColor3:showcard.fuelType==1?textColor:showcard.fuelType==2?textColor1:textColor2) + ';background: url({showcard.cardType==3?image5:filter.checkCardFlagIsSite(showcard.cardFlag)==false?image2:showcard.fuelType==1?image1:showcard.fuelType==2?image3:image4});background-size: cover'" -->
				<view class="cardView1" v-if="type==2"
					:style="'color: ' + (showcard.cardType==3?textColor4:filter.checkCardFlagIsSite(showcard.cardFlag)==false?textColor3:showcard.fuelType==1?textColor:showcard.fuelType==2?textColor1:textColor2) + ';'">
					<image style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;" :src="showcard.cardType==3?image5:filter.checkCardFlagIsSite(showcard.cardFlag)==false?image2:showcard.fuelType==1?image1:showcard.fuelType==2?image3:image4" mode=""></image>
					<view class="cardContainer1">
						<view class="card">

							<view class="headImageView" v-if="hasUserInfo" hover-class="none"
								hover-stop-propagation="false">
								<open-data class="headImageView1" type="userAvatarUrl"></open-data>
							</view>
							<view class="headImageView" v-else hover-class="none" hover-stop-propagation="false">
								<image class="headImageView"
									src="https://cargocn.oss-cn-beijing.aliyuncs.com/20200904170819.png"></image>
							</view>
							<view class="user">
								<view>{{showcard.userName}}</view>
								<view v-if="!filter.checkCardFlagIsSite(showcard.cardFlag)">{{showcard.plateNo}}</view>
							</view>
							<view class="cardType1">
								<view style="font-size: 33rpx">
									{{filter.checkCardFlagName(showcard.cardFlag)}}
								</view>

							</view>
						</view>
					</view>
					<view class="cardCenter">
						<view>余额（元）</view>
						<view class="amount">
							<view style="font-size: 36rpx;padding-top:21rpx;">￥</view>
							<view>
								{{filter.Amount(showcard.amount)[0]}}
							</view>
							<view style="font-size: 22rpx;padding-top:30rpx;margin-left:6rpx">
								.{{filter.Amount(showcard.amount)[1]}}
							</view>
						</view>
					</view>
					<view class="cardBottom">
						<view class="cardType2">
							<text style="font-size: 22rpx"
								v-if="showcard.cardType!=3">{{showcard.compSecondName}}</text>
						</view>
						<view style="font-size: 20rpx">卡号：{{showcard.cardNo}}</view>
					</view>
				</view>
				<!--
				<view class="cardContainer" v-if="type==1"
					style="background: linear-gradient(90deg, #C1DFC4 0%, #DEECDD 100%);">
					<view class="cardViewBody">
						<view class="cardViewBody">
							<view class="offline">
								<image
									src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_wxbox.png">
								</image>
							</view>
							<view class="offlineText">
								<view class="offlineText_1">
									微信支付
								</view>
							</view>
						</view>
					</view>
				</view>
				-->
				<view v-if="type==0" class="cardContainer" style="background-color: #E5F1F3">
					<view class="cardViewBody">
						<view class="offline">
							<image
								src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_offlinebox.png">
							</image>
						</view>
						<view class="offlineText">
							<view class="offlineText_1">
								线下支付
							</view>
							<view class="offlineText_2">
								现金或其他支付方式
							</view>
						</view>
					</view>
				</view>
				<view v-if="type==20" class="cardContainer" style="background-color: #85C7C2">
					<view class="cardViewBody">
						<view class="offline">
							<image
								src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_spell.png">
							</image>
						</view>
						<view class="offlineText">
							<view class="offlineText_1">
								拼团订单
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="top-wrap">
				<tab v-if="type==2||type==3" id="category" :tab-data="categoryMenu" :tab-cur="categoryCur" :size="88"
					:scroll="true" @change="toggleCategory">
				</tab>
				<tab v-if="type==0" id="category" :tab-data="[categoryMenu[0]]" :tab-cur="categoryCur" :size="88"
					:scroll="true" @change="toggleCategory">
				</tab>
				<tab v-if="type==1" id="category" :tab-data="[categoryMenu[0]]" :tab-cur="categoryCur" :size="88"
					:scroll="true" @change="toggleCategory">
				</tab>
				<groupTab v-if="type==20" id="category" :tab-data="categoryMenu1"
					:num="categoryData1[categoryCur1].listData.length" :tab-cur="categoryCur1" :size="88" :scroll="true"
					@change="toggleCategory">
				</groupTab>
			</view>
			<swiper class="order_View" :current="categoryCur1" v-if="type==20?true:false" :duration="duration"
				@animationfinish="animationFinish">
				<swiper-item v-for="(item, index) in categoryData1" :key="index">
					<view class="bankTitle" v-if="currentCur1 == 2?true:false">
						<!-- <rich-text>累计成功消费
					<label>{{item.extraData.total}}</label> 次 , 共
					<label>{{item.extraData.totalAmount}}</label>元
				</rich-text> -->
						<view class="bankTitle-view">累计成功消费
							<label>{{item.extraData.total}}</label> 次 , 共
							<label>{{item.extraData.totalAmount}}</label>元
						</view>
					</view>
					<view class="bankTitle" v-if="currentCur1 == 3?true:false">
						<!-- <rich-text>累计成功加油
					<label>{{item.extraData.total}}</label> 次 , 共
					<label>{{item.extraData.totalAmount}}</label>元
				</rich-text> -->
						<view class="bankTitle-view">累计成功消费
							<label>{{item.extraData.total}}</label> 次 , 共
							<label>{{item.extraData.totalAmount}}</label>元
						</view>
					</view>
					<scroll :requesting="item.requesting" :end="item.end" :empty-show="item.emptyShow"
						:list-count="item.listData.length" :has-top="true"
						:isOrder="true"
						:top-size="currentCur1==2||currentCur1==3?80:4" :bottom-size="400" @refresh="refresh"
						@more="more">
						<view class="cells">
							<view v-for="(item, index2) in item.listData" :key="index2" class="cell">
								<view :class="currentCur1==0?'show':'disappear'">
									<view class="bankItemView bankItemViewGroup bankItemViewBox"
										:style="bindex==0?'margin-top:0rpx;':''" @tap="selectItem1" :data-item="item">
										<view class="bankItemView2">
											<view>
												<view class="stationView">
													<image src="/static/images/jym/icon_oilstation_press.png"></image>
													<view class="stationSecondName" hover-class="none"
														hover-stop-propagation="false">
														<view>
															<text>{{tools.sub(item.stationSecondName)}} </text>
														</view>
													</view>
												</view>
												<view class="oil_stauts">
													<view :data-item="item"
														v-if="item.grouponStatus==9||item.payType==9?false:true"
														@tap.stop="closeDD">取消订单</view>
												</view>
											</view>
											<view class="order_stautsBox">
												<view class="order_time">{{item.finishDt||item.createdDt}}
												</view>
												<view class="order_stauts">
													<view class="timeViewItem1" :data-item="item"
														@tap.stop="invitation">邀请拼团</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view :class="currentCur1==1?'show':'disappear'">
									<view class="bankItemView bankItemViewGroup bankItemViewBox"
										:style="bindex==0?'margin-top:0rpx;':''" @tap="selectItem1" :data-item="item">
										<view class="bankItemView2">
											<view>
												<view class="stationView">
													<image src="/static/images/jym/icon_oilstation_press.png"></image>
													<view class="stationSecondName" hover-class="none"
														hover-stop-propagation="false">
														<view>
															<text>{{tools.sub(item.stationSecondName)}} </text>
														</view>
													</view>
												</view>
												<view class="oil_stauts">
													<view @tap.stop="closeDD"
														v-if="item.grouponStatus==9||item.payType==9?false:true"
														:data-item="item" class="timeViewItem1">取消订单</view>
													<text v-else class=" fuelStatus fuelStatus1">
														{{item.fuelName}}</text>
												</view>
											</view>
											<view class="order_stautsBox">
												<view class="order_time">{{item.finishDt||item.createdDt}}
												</view>
												<view class="order_stauts">
													<view v-if="item.orderStatus==2&&item.grouponStatus!=9?true:false"
														:data-item="item" @tap.stop="getPay">去支付</view>
													<view v-else-if="item.grouponStatus==9||item.payType==9?false:true"
														:data-item="item" @tap.stop="getPay">去支付</view>
													<view class="order_stauts" v-else>
														<text>{{item.isGrouponCancel==1?'被取消':item.orderStatus=='1'?'支付成功':item.grouponStatus==9?'已过期':(item.orderStatus=='2'?'支付失败':item.payType=='9'?'支付中': item.orderStatus == 5 ? '退款中' : item.orderStatus == 6 ? '已退款': item.orderStatus == 7 ? '退款失败' : '待支付')}}:
														</text>
														<text>{{filter.Amount2(item.fuelAmount)}}元</text>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- <view :class="currentCur1==2?'show':'disappear'">
							<view class="bankItemView bankItemViewGroup bankItemViewBox" :style="bindex==0?'margin-top:0rpx;':''" @tap="selectItem1" :data-item="item">
							<view class="bankItemView2">
									<view>
										<view class="stationView">
											<image src="/static/images/icon_oilstation_press.png"></image>
											<view class="stationSecondName" hover-class="none" hover-stop-propagation="false">
												<view>
													<text>{{tools.sub(item.stationSecondName)}} </text>
												</view>
											</view>
										</view>
										<view class="oil_stauts">
											<text class=" fuelStatus fuelStatus1"> {{item.fuelName}}</text> 
										</view>
									</view>
									<view>
										<view class="order_time">{{item.finishDt||item.createdDt}}   
										</view>
										<view class="order_stauts">
											<text>{{item.isGrouponCancel==1?'被取消':item.orderStatus=='1'?'支付成功':item.grouponStatus==9?'已过期':(item.orderStatus=='2'?'支付失败':item.payType=='9'?'支付中': item.orderStatus == 5 ? '退款中' : item.orderStatus == 6 ? '已退款': item.orderStatus == 7 ? '退款失败' : '待支付')}}: </text>
											<text>{{filter.Amount2(item.fuelAmount)}}元</text>	
										</view>
									</view>
								</view>
							</view>
						</view> -->
								<view :class="currentCur1==3?'show':'disappear'">
									<view class="bankItemView bankItemViewBox" :style="bindex==0?'margin-top:0rpx;':''"
										@tap="selectItem1" :data-item="item">
										<view class="bankItemView2">
											<view>
												<view class="stationView">
													<image src="/static/images/jym/icon_oilstation_press.png"></image>
													<view class="stationSecondName" hover-class="none"
														hover-stop-propagation="false">
														<view>
															<text>{{tools.sub(item.stationSecondName)}} </text>
														</view>
													</view>
												</view>
												<view class="oil_stauts">
													<text class=" fuelStatus fuelStatus1"> {{item.fuelName}}</text>
												</view>
											</view>
											<view>
												<view class="order_time">{{item.finishDt||item.createdDt}}
												</view>
												<view class="order_stauts">
													<text>{{item.isGrouponCancel==1?'被取消':item.orderStatus=='1'?'支付成功':item.grouponStatus==9?'已过期':(item.orderStatus=='2'?'支付失败':item.payType=='9'?'支付中': item.orderStatus == 5 ? '退款中' : item.orderStatus == 6 ? '已退款': item.orderStatus == 7 ? '退款失败' : '待支付')}}:
													</text>
													<text>{{filter.Amount2(item.fuelAmount)}}元</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll>
				</swiper-item>
			</swiper>
			<swiper class="order_View" disable-touch="true" :current="categoryCur" v-if="type==20?false:true" :duration="duration"
				@animationfinish="animationFinish">
				<swiper-item v-for="(item, index) in categoryData" :key="index">
					<view class="bankTitle">
						<!-- <rich-text>{{categoryCur == '0'?'累计成功消费':'累计充值'}}
				<label>{{item.extraData.total}}</label> 次 , 共
				<label>{{item.extraData.totalAmount}}</label>元
			</rich-text> -->
						<view class="bankTitle-view">
							{{categoryCur == '0'?'累计成功消费' : categoryCur == '2' ? '累计回收':'累计充值'}}
							<label>{{item.extraData.total}}</label> 次 , 共
							<label>{{item.extraData.totalAmount}}</label>元
						</view>
					</view>
					<!-- <scroll class="scrollView1" :requesting="item.requesting" :end="item.end"
						:empty-show="item.emptyShow" :list-count="item.listData.length" :isOrder="true" :has-top="true" :top-size="80"
						:bottom-size="460" @refresh="refresh" @more="more"> -->
							<scroll-view  :style="'height:'+'40vh;'+'padding-bottom: ' + 60 + 'rpx;' + 'padding-top: ' + 80 + 'rpx;' + 'overflow-anchor: [auto | none];'" 
							:scroll-y="true" refresher-enabled="true" :refresher-triggered="isRequest" refresher-threshold="60" 
							scroll-anchoring="true" :lower-threshold="80 + 'rpx'" @refresherrefresh="refresh2" 
							@scrolltolower="more(item.requesting,item.end)">
							
							<view class="cells">				
								<view v-for="(item, index2) in item.listData" :key="index2" class="cell">
									<view :class="categoryCur==0?'show':'disappear'">
										<view class="bankItemView bankItemViewBox" :style="bindex==0?'margin-top:0rpx;':''"
											@tap="selectItem1" :data-item="item">
											<view class="bankItemView2">
												<view :hidden="item.isGroupon!=1" class="group">
												</view>
												<view :hidden="item.isGroupon!=1" class="group1">
													<text>拼</text>
												</view>
												<view>
													<view class="stationView">
														<image src="/static/images/jym/icon_oilstation_press.png"></image>
														<view class="stationSecondName" hover-class="none"
															hover-stop-propagation="false">
															<view>
																<text>{{tools.sub(item.stationSecondName)}} </text>
															</view>
														</view>
													</view>
													<view class="oil_stauts">
														<text
															v-if="item.isGroupon==1&&item.fuelStatus==0&&item.orderStatus==1&&item.isGrouponCancel != 1?true:false"
															class="fuelStatus"> 未加油</text>
														<text
															v-else-if="item.isGroupon==1&&item.fuelStatus==1&&item.orderStatus==1&&item.isGrouponCancel != 1?true:false"
															class=" fuelStatus fuelStatus1"> 已加油</text>
														<text v-else class=" fuelStatus fuelStatus1">
															{{item.fuelName}}</text>
													</view>
												</view>
												<view>
													<view class="order_time">{{item.finishDt||item.createdDt}}
													</view>
													<view class="order_stauts">
														<text>{{item.isGrouponCancel==1?'被取消':item.orderStatus=='1'?'支付成功':item.grouponStatus==9?'已过期':(item.orderStatus=='2'?'支付失败':item.payType=='9'?'支付中': item.orderStatus == 5 ? '退款中' : item.orderStatus == 6 ? '已退款': item.orderStatus == 7 ? '退款失败' : '待支付')}}:
														</text>
														<text>{{item.fuelCouponAmount?filter.Amount2(item.fuelCouponAmount):filter.Amount2(item.fuelAmount)}}元</text>
													</view>
												</view>
											</view>
										</view>
									</view>
									<view :class="categoryCur== 1 ? 'show': categoryCur== 2 ? 'show':'disappear'">
										<view class="bankItemView bankItemViewBox" :style="bindex==0?'margin-top:0rpx;':''"
											@tap="selectItem2" :data-item="item">
											<view class="bankItemView2">
												<view>
													<view class="stationView">
														<image v-if="item.rechargeType==3?true:false"
															src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_recharge.png">
														</image>
														<image v-else
															src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_order_cd.png">
														</image>
														<view class="stationSecondName" hover-class="none"
															hover-stop-propagation="false">
															<view>
																<text>{{globalData.reChargeStatus(item.rechargeType, item.originRechargeType)}}</text>
															</view>
														</view>
													</view>
													<view class="oil_stauts">
														<text v-if="item.rechargeType && item.rechargeType == 11" class=" fuelStatus fuelStatus1">
															{{item.status=='1'?'回收成功':(item.status=='2'?'回收失败':'回收中')}}
														</text>
															<text v-else class=" fuelStatus fuelStatus1">
																{{item.status=='1'?'充值成功':(item.status=='2'?'充值失败':'充值中')}}
															</text>
													</view>
												</view>
												<view>
													<view class="order_time">{{item.finishDt||item.createdDt}}
													</view>
													<view class="order_stauts">
														<text  v-if="item.rechargeType && item.rechargeType == 11">{{item.status=='1'?'回收成功':(item.status=='2'?'回收失败':'回收中')}}:
														</text>
														<text v-else>{{item.status=='1'?'充值成功':(item.status=='2'?'充值失败':'充值中')}}:
														</text>
														<text :style="[{color:(item.rechargeType == 11 ? '#E51F4A' :'#4B4B4B')}]">{{filter.Amount2(item.amount)}}</text>
														<text>元</text>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view v-show="item.requesting && item.listData.length && !item.end">
									<view class="more-Box">
										<image
											class="moreLoading"
											src="../../../../static/images/listLoading.png"
										></image>加载中～
									</view>
								</view>
								<view v-show="item.end">
									<view class="more-Box">没有更多了～
									</view>
								</view>
							
						</view>
						</scroll-view>
					<!-- </scroll> -->
				</swiper-item>
			</swiper>
		</view>
		<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal"></view>
		<!-- 弹出层 -->
		<view class="modalDlg" v-if="showModal">
			<view class="modal_top modal_top1">
				提示
			</view>
			<view class="modal_top modal_con">确定要取消该订单</view>
			<view class="modal_btm">
				<view @tap.stop="cancel">取消</view>
				<button @tap.stop="confirm">确认</button>
			</view>
		</view>
		<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal1"></view>
		<!-- 弹出层 -->
		<view class="modalDlg" v-if="showModal1">
			<view class="modal_top modal_top1">
				提示
			</view>
			<view class="modal_top modal_con">还差1人，邀请好友来拼团</view>
			<view class="modal_btm">
				<view @tap.stop="cancel">取消</view>
				<button @tap.stop="cancel" open-type="share">确认</button>
			</view>
		</view>
		<view style="position: fixed; bottom: 80rpx; right: 10rpx;" @click="goApp">
			<image style="width: 80px; height: 80px;" src="/static/images/jym/community.png"></image>
		</view>
	</view>
</template>

<script module="globalData" lang="wxs" src="./globalData.wxs"></script>
<script module="tools" lang="wxs" src="@/config/we.wxs"></script>
<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>

<script>
	const app = getApp(); // pages/motorcade/motorcadeIndex/motorcadeIndex.js
	// pages/motorcade/motorcadeIndex/motorcadeIndex.js
	var api = require("@/config/api.js");
	var util = require("@/utils/jym-utils/util.js");
	let pageStart = 1;
	import tab from "@/components/jym-components/tab/index";
	import groupTab from "@/components/jym-components/groupTab/index";
	import scroll from "@/components/jym-components/scroll/index";
	import * as publicData from "@/utils/publicData"

	export default {
		data() {
			return {
				requested: false,
				scrollTop: 0,
				duration: 300,
				// swiper-item 切换过渡时间
				categoryCur: 0,
				// 当前数据列索引
				categoryCur1: 0,
				currentCur1: "",
				categoryMenu: [],
				// 分类菜单数据, 字符串数组格式
				categoryMenu1: [],
				categoryData: [],
				// 所有数据列
				categoryData1: [],
				// 所有数据列
				currentid: 0,
				grouponNo: "",
				//拼团单号
				oneOrderId: "",
				orderInfo: "",
				type: 3,
				caseTime: "2020-10-23 19:38:21",
				grouponSearchType: "",
				//这里是银行卡
				showModal: false,
				showModal1: false,
				bankClickIndex: -1,
				switch1Checked: true,
				defaultImage: 0,
				userId: "",
				orderList: [],
				showcard: [],
				year: '',
				month: '',
				currentPage: 1,
				show1: false,
				show2: false,
				xiaofeiNum: '',
				xiaofeiAmount: '',
				hasUserInfo: false,
				userInfo: {},
				recordsList: [],
				chongzhiNum: '',
				chongzhiAmount: '',
				fuelStatus: "",
				itemColor1: "#E6ECF7",
				itemColor: "#F7F1DF",
				itemColor3: " #C1D5E9",
				itemColor2: "#D5EDEF",
				itemColor4: "#81A1CB",
				textColor1: "#90B1F0",
				textColor: "#F7A129",
				textColor2: "#40BDCA",
				textColor3: "#205B9A;",
				textColor4: "#034284",
				image1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_cy.png",
				image3: 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_qy.png',
				image4: 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_yq.png',
				image2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_cd.png",
				itemImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasolineCard.png",
				itemImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_dieselCard.png",
				itemImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasCard.png",
				itemImg3: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_teamCard.png",
				itemImg4: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/platform.png",
				image5: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/platfromCar.png",
				item1SelectedColor: "#6D9AED",
				item2SelectedColor: "#8D8D8D",
				item1SelectImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png",
				item2SelectImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png",
				emptyType: "",
				cardListArr: "",
				selected: 0,
				bindex: 0,
				token: '',
				timer: null,
				isRequest: false,
				activeAdvObj: null,
				advList: [
					{typeName: '加油么订单', key: 'JYDD', info: []}
				],
			};
		},

		components: {
			tab,
			groupTab,
			scroll
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			that.$store.dispatch('getJymDDAdv').then(fleetAdvRes => {
				console.log(fleetAdvRes)
				that.advList.forEach((itemOne) => {
					fleetAdvRes.forEach(itemTwo =>{
						if(itemTwo.advLocation.indexOf(itemOne.key) != -1){
							itemOne.info.push(itemTwo)
						}
					})
				})
				that.setActiveAdv('加油么订单')
			})
			
			uni.getStorage({
				key: 'driverInfo',
				success: function(res) {
					that.userId = res.data.userId;
				}
			});
			that.token = uni.getStorageSync('token')
			let userInfo = app.globalData.userInfo;
			this.userInfo = userInfo;

			if (userInfo == null) {
				// this.hasUserInfo = true;
				this.hasUserInfo = false;
			} else {
				this.hasUserInfo = false;
			}
			console.log('+++++++++++>', this.hasUserInfo);

			let categoryMenu = [];
			let categoryData = [];
			let menu = ["消费", "充值","回收"]; //获取油卡号

			setTimeout(() => { // that.getCardList();
			}, 350);
			menu.forEach((item, index) => {
				categoryMenu.push(item);
				categoryData.push({
					categoryCur: index,
					requesting: false,
					end: false,
					emptyShow: false,
					page: pageStart,
					listData: [],
					extraData: '',
					billData: ''
				});
			});
			let categoryMenu1 = [];
			let categoryData1 = [];
			let menu1 = ["待分享", "待支付", "已支付", "已加油"];
			menu1.forEach((item, index) => {
				categoryMenu1.push(item);
				categoryData1.push({
					categoryCur1: index,
					requesting: false,
					end: false,
					emptyShow: false,
					page: pageStart,
					listData: [],
					extraData: '',
					billData: ''
				});
			});
			this.categoryMenu = categoryMenu;
			this.categoryMenu1 = categoryMenu1;
			this.categoryData = categoryData;
			this.categoryData1 = categoryData1;
			console.log(this.categoryMenu,this.categoryMenu1,'this.categoryMenu1')
			var timestamp = Date.parse(new Date());
			timestamp = timestamp / 1000;
			var n = timestamp * 1000;
			var date = new Date(n); //年  

			var Y = date.getFullYear(); //月  

			var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
			this.year = Y;
			this.month = M;
		},
		// onPullDownRefresh: function(){
		// 	this.refresh()
		// 	// setTimeout(() => {
		// 	// 	uni.stopPullDownRefresh()
		// 	// },3000)
		// },
		// 转发
		onShareAppMessage: function(res) {
			if (res.from === 'button') {}

			var listData = {
				fuelType: this.orderInfo.fuelType,
				fuelDictId: this.orderInfo.fuelDictId,
				fuelGunId: this.orderInfo.fuelGunId,
				grouponNo: this.orderInfo.grouponNo,
				fuelName: encodeURIComponent(this.orderInfo.fuelName),
				stationId: this.orderInfo.stationId,
				opId: this.orderInfo.opId,
				fuelPrice: this.orderInfo.fuelPrice,
				fuelUnit: this.orderInfo.fuelUnit,
				fuelCouponPrice: this.orderInfo.fuelCouponPrice,
				fuelNum: this.orderInfo.fuelNum,
				fuelAmount: this.orderInfo.fuelAmount,
				fuelCouponNum: this.orderInfo.fuelCouponNum,
				couponAmount: this.orderInfo.couponAmount,
				oneOrderId: this.orderInfo.id,
				grouponUserType: 2,
				groupOnEndDt: this.orderInfo.groupOnEndDt
			};
			let a = JSON.stringify(listData);
			return {
				title: '您的好友邀请您参加拼团加油',
				path: 'pages/forward/group/group?data=' + JSON.stringify(listData),
				imageUrl: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_group.png",
				success: function(res) {
					uni.navigateBack({
						changed: true
					});
				}
			};
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;
			if (typeof this.getTabBar === 'function' && this.getTabBar()) {
				this.getTabBar().selected = 1;
			}

			if (uni.getStorageSync('token') == "") {
				uni.showModal({
					title: "当前为未登录状态，请登录后操作,跳转登录页",
					// content:"跳转登录页？",
					icon: 'none',

					success(res) {
						console.log(res);

						if (res.confirm) {
							uni.reLaunch({
								url: '/pages/login/login/loginSelect/loginSelect'
							});
						} else {
							uni.switchTab({
								url: '../../oilstation/oilstationIndex/oilstationIndex'
							});
						}
					}

				});
				return;
			}

			uni.getStorage({
				key: 'cardIndex',

				success(res) {
					console.log('res', res);

					if (!res.data) {
						setTimeout(() => {
							that.getCardList();
						}, 350);
					} else {
						console.log('err', "fgfdg");
						setTimeout(() => {
							that.getCardList();
						}, 350);
					}
				},

				fail(err) {
					setTimeout(() => {
						that.getCardList();
					}, 350);
				}

			});
			that.cloneOnload();
			
		},
		onBackPress(e) {
			if (e.from == "backbutton") {
				//说明如果点击的是物理返回键或导航栏的返回键返回货运中国
				this.goApp();
			}
			return true;
		},
		methods: {
			showBigBanner(item, img) {
				if(item.linkType == 'not'){
					uni.previewImage({
						urls: [item.advUrl],
						success: function(data) {
							console.log(data);
						},
						fail: function(err) {
							console.log(err);
						}
					});
				}else if(item.linkType == 'route'){
					uni.navigateTo({
						url: item.linkUrl
					})
				}else{
					getApp().globalData.promoteLinkUrl = item.linkUrl;
					uni.navigateTo({
						url: '../../advertisingH5/advertisingH5'
					})
				}
			},
			setActiveAdv(typeName){
				let that = this 
				let activeAdvObj = {}
				that.advList.some(item => {
					if(item.typeName == typeName){
						activeAdvObj.typeName = item.typeName
						activeAdvObj.key = item.key
						activeAdvObj.info = ['','']
						item.info.forEach(infoItem => {
							if(infoItem.advLocation.indexOf('SMALL') != -1){
								activeAdvObj.info[0] = JSON.parse(JSON.stringify(infoItem))
							}
							if(infoItem.advLocation.indexOf('BIG') != -1){
								activeAdvObj.info[1] = JSON.parse(JSON.stringify(infoItem))
							}
						})
						return true
					}
				})
				that.activeAdvObj = activeAdvObj
				console.log('当前显示的广告当前显示的广告当前显示的广告当前显示的广告当前显示的广告',that.activeAdvObj)
			},
			refresh2(){
				let categoryCur = "";
				// if(!this.requested) return
				if (this.type == 20) {
					categoryCur = this.currentCur1;
				} else {
					categoryCur = this.categoryCur;
				}
				console.log('下拉222222222222222被执行了！！！！')
				let pageData = this.getCurrentData(categoryCur);
				pageData.end = false;
				this.getList('refresh', pageStart);
				this.isRequest = true;
				// setTimeout(() => {
				// 	this.isRequest = false;
				// },1000)
			},
				// 刷新数据
			refresh() {
				let categoryCur = "";
				// if(!this.requested) return
				if (this.type == 20) {
					categoryCur = this.currentCur1;
				} else {
					categoryCur = this.categoryCur;
				}
				console.log('下拉被执行了！！！！')
				let pageData = this.getCurrentData(categoryCur);
				pageData.end = false;
				this.getList('refresh', pageStart);
			},
			scroll(e) {
			// 可以触发滚动表示超过一屏
				// this.overOnePage = true;
				// clearTimeout(this.timer);
				// this.timer = setTimeout(() => {
					this.scrollTop = e.detail.scrollTop;
				// }, 100)
			},
			goApp(){
				publicData.goDriverApp()
			},
			cloneOnload(){
				let that = this;
				
				
				
				
				
				that.duration = 300,
				// swiper-item 切换过渡时间
				that.categoryCur = 0,
				// 当前数据列索引
				that.categoryCur1 = 0,
				that.currentCur1 = "",
				that.categoryMenu = [],
				// 分类菜单数据, 字符串数组格式
				that.categoryMenu1 = [],
				that.categoryData = [],
				// 所有数据列
				that.categoryData1 = [],
				// 所有数据列
				that.currentid = 0,
				that.grouponNo = "",
				//拼团单号
				that.oneOrderId = "",
				that.orderInfo = "",
				that.type = 3,
				that.caseTime = "2020-10-23 19:38:21",
				that.grouponSearchType = "",
				//这里是银行卡
				that.showModal = false,
				that.showModal1 = false,
				that.bankClickIndex = -1,
				that.switch1Checked = true,
				that.defaultImage = 0,
				that.userId = "",
				that.orderList = [],
				that.showcard = [],
				that.year = '',
				that.month = '',
				that.currentPage = 1,
				that.show1 = false,
				that.show2 = false,
				that.xiaofeiNum = '',
				that.xiaofeiAmount = '',
				that.hasUserInfo = false,
				that.userInfo = {},
				that.recordsList = [],
				that.chongzhiNum = '',
				that.chongzhiAmount = '',
				that.fuelStatus = "",
				that.itemColor1 = "#E6ECF7",
				that.itemColor = "#F7F1DF",
				that.itemColor3 = " #C1D5E9",
				that.itemColor2 = "#D5EDEF",
				that.itemColor4 = "#81A1CB",
				that.textColor1 = "#90B1F0",
				that.textColor = "#F7A129",
				that.textColor2 = "#40BDCA",
				that.textColor3 = "#205B9A;",
				that.textColor4 = "#034284",
				that.image1 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_cy.png",
				that.image3 = 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_qy.png',
				that.image4 = 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_yq.png',
				that.image2 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_cd.png",
				that.itemImg1 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasolineCard.png",
				that.itemImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_dieselCard.png",
				that.itemImg2 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_gasCard.png",
				that.itemImg3 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_teamCard.png",
				that.itemImg4 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/platform.png",
				that.image5 = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/platfromCar.png",
				that.item1SelectedColor = "#6D9AED",
				that.item2SelectedColor = "#8D8D8D",
				that.item1SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png",
				that.item2SelectImg = "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png",
				that.emptyType = "",
				that.cardListArr = "",
				that.selected = 0,
				that.bindex = 0,
				
				
				
				
				
				
				
				uni.getStorage({
					key: 'driverInfo',
					success: function(res) {
						that.userId = res.data.userId;
					}
				});
				that.token = uni.getStorageSync('token')
				let userInfo = app.globalData.userInfo;
				this.userInfo = userInfo;
				
				if (userInfo == null) {
					// this.hasUserInfo = true;
					this.hasUserInfo = false;
				} else {
					this.hasUserInfo = false;
				}
				console.log('+++++++++++>', this.hasUserInfo);
				
				let categoryMenu = [];
				let categoryData = [];
				let menu = ["消费", "充值", "回收"]; //获取油卡号
				
				setTimeout(() => { // that.getCardList();
				}, 350);
				menu.forEach((item, index) => {
					categoryMenu.push(item);
					categoryData.push({
						categoryCur: index,
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: [],
						extraData: '',
						billData: ''
					});
				});
				let categoryMenu1 = [];
				let categoryData1 = [];
				let menu1 = ["待分享", "待支付", "已支付", "已加油"];
				menu1.forEach((item, index) => {
					categoryMenu1.push(item);
					categoryData1.push({
						categoryCur1: index,
						requesting: false,
						end: false,
						emptyShow: false,
						page: pageStart,
						listData: [],
						extraData: '',
						billData: ''
					});
				});
				this.categoryMenu = categoryMenu;
				this.categoryMenu1 = categoryMenu1;
				this.categoryData = categoryData;
				this.categoryData1 = categoryData1;
				var timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				var n = timestamp * 1000;
				var date = new Date(n); //年  
				
				var Y = date.getFullYear(); //月  
				
				var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
				this.year = Y;
				this.month = M;
			},
			getList(type, currentPage) {
				console.log(type, currentPage,'type, currentPage')
				var that = this;
				let currentCur = that.categoryCur;
				let currentCur1 = that.currentCur1;
				let payType = that.type;
				let pageData = that.getCurrentData(currentCur);
				if (pageData.end) return;
				pageData.requesting = true;
				that.setCurrentData(currentCur, pageData);
				var url = "";

				if (currentCur == 0) {
					url = api.getOrderList;
				} else if (currentCur == 1) {
					url = api.getRecordsList;
				} else if (currentCur == 2) {
					// url = api.getAllKaipiaoList;
					url = api.getRecordsList;
				} else if (currentCur == 3) {
					url = api.getAllDuizhangdanList;
				}
				// console.log(url,"hhhhhhhhhhhhhhh")

				if (this.type == 20) {
					if (currentCur1 == 0) {
						this.fuelStatus = 0;
						this.grouponSearchType = 1;
					} else if (currentCur1 == 1) {
						this.fuelStatus = 0;
						this.grouponSearchType = 2;
					} else if (currentCur1 == 2) {
						this.fuelStatus = 0;
						this.grouponSearchType = 3;
					} else if (currentCur1 == 3) {
						this.fuelStatus = 1;
						this.grouponSearchType = '';
					}
				}

				let isGroupon = 0;

				if (this.type == 20) {
					isGroupon = 1;
					payType = "", url = api.getOrderList;
				} else {
					this.fuelStatus = '';
					this.grouponSearchType = '';
				}

				var parm = {
					pageSize: 10,
					pageNum: currentPage,
					year: String(that.year),
					month: that.month,
					// year: 2020,
					// month: 12,
					cardId: payType == 2 ? that.showcard.id : '',
					payWay: payType,
					isGroupon: isGroupon,
					userId: that.userId,
					grouponSearchType: this.grouponSearchType,
					fuelStatus: this.fuelStatus
				};
				//currentCur == 1  1是充值 2是回收 tab
				if(currentCur == 1) {
					parm.rechargeTypeList = [1,2,3,5,10]
				}else if(currentCur == 2) {
					parm.rechargeType = '11'
				}
						
				console.log(parm);
				util.postRequest(url, parm).then( res =>{
					console.log(res,'resresres')
					uni.stopPullDownRefresh()
					pageData.requesting = false;
					if (res.retCode == '0000000') {
						let data = res.rspBody;
						console.log(data,'datadata')
						pageData.requesting = false;

						if (currentCur != 3 || currentCur1 != 4) {
							let listData = data.items;
							pageData.extraData = {
								total: res.rspBody.total,
								totalAmount: res.rspBody.totalAmount
							};
							if (type === 'refresh') {
								that.isRequest = false;
								pageData.listData = listData;
								pageData.end = false;
								pageData.page = currentPage + 1;
							} else {
								if (res.rspBody.items.length > 0) {
									pageData.listData = pageData.listData.concat(listData);
									pageData.end = false;
									pageData.page = currentPage + 1;
								} else {
									pageData.listData = pageData.listData.concat(listData);
									pageData.end = true;
									pageData.page = currentPage + 1;
								}
							}
						} else {
							if (type === 'refresh') {
								pageData.billData = data, pageData.end = false;
								pageData.page = currentPage + 1;
							}
						}

						if (that.type == 20) {
							that.setCurrentData(currentCur1, pageData);
						} else {
							that.setCurrentData(currentCur, pageData);
						}
					} else {
						that.emptyType = Empty.error;
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				})
				.catch(err =>{
					console.log(err,'err')
				})
			},

			// 更新页面数据
			setCurrentData(currentCur, pageData) {
				// console.log(pageData);
				let categoryData = this.categoryData;
				categoryData[currentCur] = pageData;
				let categoryData1 = this.categoryData1;
				categoryData1[currentCur] = pageData;
				this.categoryData = categoryData;
				this.categoryData1 = categoryData1;
			},

			// 获取当前激活页面的数据
			getCurrentData() {
				if (this.type == 20) {
					return this.categoryData1[this.categoryCur1];
				} else {
					return this.categoryData[this.categoryCur];
				}
			},

			closeDD(e) {
				console.log(e.target.dataset.item.grouponNo);
				let grouponNo = e.target.dataset.item.grouponNo;
				let oneOrderId = e.target.dataset.item.id;
				this.showModal = true;
				this.grouponNo = grouponNo;
				this.oneOrderId = oneOrderId;
			},

			invitation(e) {
				let orderInfo = e.target.dataset.item;
				this.showModal1 = true;
				this.orderInfo = orderInfo;
			},

			// 顶部tab切换事件
			toggleCategory(e) {
				console.log(e.detail.index);
				this.duration = 0;
				setTimeout(() => {
					this.categoryCur = e.detail.index;
					this.currentCur1 = e.detail.index;
					this.categoryCur1 = e.detail.index;
					this.getList('refresh', pageStart);
				}, 0);

				if (this.type == 20) {
					this.categoryCur = e.detail.index;
					this.currentCur1 = e.detail.index;
					this.categoryCur1 = e.detail.index;
					this.getList('refresh', pageStart);
				}
			},

			// 页面滑动切换事件
			// animationFinish(e) {
			//   this.duration = 300;
			//   console.log(e.detail.current);
			//   setTimeout(() => {
			//     this.categoryCur = e.detail.current;
			//       this.currentCur1 = e.detail.current;
			//       this.categoryCur1 = e.detail.current;
			//     let pageData = this.getCurrentData();
			//     console.log(pageData);
			//     this.getList('refresh', pageStart);
			//   }, 0);
			// },
			// 页面滑动切换事件
			animationFinish(e) {
				console.log(e.detail.current);
				setTimeout(() => {
					if (this.categoryCur == e.detail.current || this.currentCur1 == e.detail.current || this
						.categoryCur1 == e.detail.current) {
						return
					}
					console.log('=======>')
					this.duration = 300;
					this.categoryCur = e.detail.current;
					this.currentCur1 = e.detail.current;
					this.categoryCur1 = e.detail.current;
					let pageData = this.getCurrentData();
					this.getList('refresh', pageStart);
				}, 0);
			},

		

			// 加载更多
			more(requesting,end) {
				if(!requesting && !end){
					if (this.type == 20) {
						this.getList('more', this.getCurrentData(this.currentCur1).page);
					} else {
						this.getList('more', this.getCurrentData(this.categoryCur).page);
					}
				}
				
			},

			selectTap: function() {
				this.show1 = !this.show1;
				this.show2 = !this.show2;
				this.item1SelectImg =
					"https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_blue.png";
				this.item2SelectImg =
					"https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_oil_more_grey.png";
			},

			bindcancel() {},

			getCardList: function() {
				var that = this;
				util.postRequest(api.driverOilcardList, {}).then(function(res) {
					if (res.retCode == '0000000') {
						if (res.rspBody.length > 0) {
							console.log(res.rspBody);
							that.cardListArr = res.rspBody;
							that.showcard = res.rspBody[0];
						} else {
							that.type = 3;
							that.showcard = {
								userName: uni.getStorageSync('driverInfo').userName
							}
						}

						that.refresh();
						// this.getList('refresh', pageStart);
					} else {
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						});
					}
				});
			},

			// 去支付
			getPay(e) {
				let orderInfo = e.target.dataset.item;
				this.orderInfo = orderInfo;
				var listData = {
					fuelType: this.orderInfo.fuelType,
					fuelDictId: this.orderInfo.fuelDictId,
					fuelGunId: this.orderInfo.fuelGunId,
					grouponNo: this.orderInfo.grouponNo,
					cardId: this.orderInfo.cardId,
					fuelName: this.orderInfo.fuelName,
					stationId: this.orderInfo.stationId,
					opId: this.orderInfo.opId,
					fuelPrice: this.orderInfo.fuelPrice,
					stationId: this.orderInfo.stationId,
					fuelUnit: this.orderInfo.fuelUnit,
					fuelCouponPrice: this.orderInfo.fuelCouponPrice,
					fuelNum: this.orderInfo.fuelNum,
					fuelAmount: this.orderInfo.fuelAmount,
					fuelCouponNum: this.orderInfo.fuelCouponNum,
					couponAmount: this.orderInfo.couponAmount,
					id: this.orderInfo.id
				};
				uni.navigateTo({
					url: '../../oilstation/addOilPage/payOil/payOil?map=' + JSON.stringify(listData) + "&group=" +
						1
				});
			},

			confirm(e) {
				let that = this;
				let list = {
					grouponNo: this.grouponNo,
					oneOrderId: this.oneOrderId,
					cancelGrouponType: 1,
					cancelPersonType: 2
				};
				util.postRequest(api.cancelGrouponOrder, list).then(function(res) {
					if (res.retCode == '0000000') {
						that.showModal = false;
						that.showModal1 = false;
						uni.showModal({
							title: '提示',
							content: "已取消订单",
							showCancel: false,
							success: function() {
								that.refresh();
							}
						});
					} else {
						uni.showModal({
							title: '提示',
							content: "取消失败",
							showCancel: false
						});
					}
				}, function(err) {
					uni.showModal({
						title: '提示',
						content: "取消失败",
						showCancel: false
					});
					that.showModal = false;
					that.showModal1 = false;
				});
			},

			cancel() {
				this.showModal = false;
				this.showModal1 = false;
			},

			// 全部订单
			selectCardItem3: function(e) {
				var that = this;
				var type = e.currentTarget.dataset.type;
				that.show1 = !this.show1;
				that.showcard = type == 3 ? {
					userName: uni.getStorageSync('driverInfo').userName
				} : e.currentTarget.dataset.map;
				that.type = e.currentTarget.dataset.type

				e.currentTarget.dataset.type == 3 ? that.categoryCur = 0 : '';
				uni.setStorage({
					key: 'cardIndex',
					data: e.currentTarget.dataset.map,

					success(res) {}

				});
				that.refresh();
			},
			// 油卡
			selectCardItem: function(e) {
				var that = this;
				var type = e.currentTarget.dataset.type;
				that.show1 = !this.show1;
				that.showcard = type == 0 ? {
					userName: uni.getStorageSync('driverInfo').userName
				} : e.currentTarget.dataset.map;
				that.type = e.currentTarget.dataset.type;

				e.currentTarget.dataset.type == 0 ? that.categoryCur = 0 : '';
				uni.setStorage({
					key: 'cardIndex',
					data: e.currentTarget.dataset.map,

					success(res) {}

				});
				that.refresh();
			},
			// 拼团
			selectCardItem4: function(e) {
				var that = this;
				var type = e.currentTarget.dataset.type;
				that.show1 = !this.show1;
				that.showcard = type == 20 ? {
					userName: uni.getStorageSync('driverInfo').userName
				} : e.currentTarget.dataset.map;
				that.type = e.currentTarget.dataset.type;

				if (e.currentTarget.dataset.type == 20) {
					that.categoryCur1 = 0;
					that.grouponSearchType = 1;
				}
				uni.setStorage({
					key: 'cardIndex',
					data: e.currentTarget.dataset.map,

					success(res) {}

				});
				that.refresh();
			},
			// 微信
			selectCardItem1: function(e) {
				var that = this;
				var type = e.currentTarget.dataset.type;
				that.show1 = !this.show1;
				that.showcard = type == 1 ? {
						userName: uni.getStorageSync('driverInfo').userName
					} : e.currentTarget.dataset.map,
					that.type = e.currentTarget.dataset.type;
				if (e.currentTarget.dataset.type == 1) {
					that.categoryCur = 0;
				}

				uni.setStorage({
					key: 'cardIndex',
					data: e.currentTarget.dataset.map,

					success(res) {}

				});
				console.log(e.currentTarget.dataset.map);
				that.refresh();
			},
			// 线下
			selectCardItem2: function(e) {
				var that = this;
				var type = e.currentTarget.dataset.type;
				that.show1 = !this.show1;
				that.showcard = type == 0 ? {
					userName: uni.getStorageSync('driverInfo').userName
				} : e.currentTarget.dataset.map;
				that.type = e.currentTarget.dataset.type;
				if (e.currentTarget.dataset.type == 0) {
					that.categoryCur = 0;
				}

				uni.setStorage({
					key: 'cardIndex',
					data: e.currentTarget.dataset.map,

					success(res) {}

				});
				console.log(that.type, that.showcard);
				that.refresh();
			},
			bindDateChange: function(e) {
				// console.log(e.detail.value);
				var that = this;
				var timeArr = e.detail.value.split('-');
				that.year = timeArr[0];
				that.month = timeArr[1];
				that.refresh();
			},
			selectItem1: function(e) {
				const map = e.currentTarget.dataset.item;
				console.log(map);
				uni.navigateTo({
					url: '../orderDetail/orderDetail?map=' + JSON.stringify(map)
				});
			},
			selectItem2: function(e) {
				var map = e.currentTarget.dataset.item;
				console.log('map')
				uni.navigateTo({
					url: '../rechargeDetail/rechargeDetail?map=' + JSON.stringify(map)
				});
			},
			clickDisappear: function() {
				this.show1 = false;
				this.show2 = false;
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./orderIndex.css";
</style>
