<template>
<view>
<!-- <canvas :style="'width:' + canvasWidth + 'px;height:' + canvasHeight + 'px ;position:absolute;top: -1000px;'" canvas-id="myCanvas"></canvas> -->
<view class="jym-container">
	<!-- <view class="searchHead">
		<view style="width: 64rpx; flex-direction: row; align-items: center;">
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/back.png" style="width: 22rpx;" mode="widthFix"></image>
		</view>
		<text class="" style="font-size: 36rpx; color: #333; flex: 1; text-align: center;">我的优惠券</text>
		<view style="width: 64rpx; flex-direction: row; align-items: center;" @click="goMarket()">
			<image src="/static/images/jym/market.png" style="width: 40rpx;" mode="widthFix"></image>
		</view>
	</view> -->
	<view class="advs" v-if="activeAdvObj && activeAdvObj.info[0].advUrl">
			<image :src="activeAdvObj.info[0].advUrl" mode="aspectFill" @click="showBigBanner(activeAdvObj.info[1], activeAdvObj.info[1].advUrl)" class="mainBanner"image>
			<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adverties.gif"  class="advertiesGif"></image>
	</view>
	<view style="height: 160rpx;" v-if="activeAdvObj && activeAdvObj.info[0].advUrl"></view>
	<view class="top-wrap" :style="{top: activeAdvObj && activeAdvObj.info[0].advUrl? '160rpx' :''} ">
		<tab id="category" :tab-data="tabTitles" :tab-cur="Number(tabCurrent)" :size="80" :scroll="false" @change="toggleCategory">
		</tab>
	</view>
	<!-- <swiper :current="tabCurrent" @animationfinish="animationFinish" class="scrollView" :style="'height:' + swipeHeight +'rpx'"> -->
		<!-- <swiper-item :item-id="0"> -->
			<!-- <scroll :requesting="requesting1" :empty-show="emptyShow1" style="height: 95vh;" :refresh-size="80" @refresh="refresh1"> -->
        <view v-show="tabCurrent == 0" style="margin-top: 90rpx;width:100%">
          <view v-for="(item, index) in listData1" :key="index" style="position: relative;" :data-map="item">
            <view class="listItemView" @tap="item.forward==1?onShare:onShare1" :data-item="item" :style="'background:url(' + (item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2) + ');' + 'background-size: 100% 196rpx'">
              <image class="listItemView_img" v-if="item.couponName=='转发奖励'?true:false" src="/static/images/jym/prize.png"></image>

              <view class="listItemViewLine1">
                <view class="listItemViewLine1Left">
                  <view v-if="item.couponType==110" style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
                    <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                      <text class="sell">￥</text>
                      {{item.couponItemVOList[0].reduceAmount}}
                      <text class="unit" selectable="false" space="false" decode="false">
                        /L
                      </text>
                    </label>
                    <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                      <text class="sell">￥</text>
                      {{item.couponMaxAmount}}
                      <text class="unit" selectable="false" space="false" decode="false">
                        /L
                      </text>
                    </label>
                    <label style="font-size:22rpx;font-weight:bold">
                      {{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
                    </label>
                  </view>
                  <view v-else-if="item.couponType==111" style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
                    <label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                      <text class="sell">￥</text>
                      {{item.couponItemVOList[0].reduceAmount}}
                    </label>
                    <label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                      <text class="sell">￥</text>
                      {{item.couponMaxAmount}}
                    </label>
                    <label style="font-size:22rpx;font-weight:bold">
                      {{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
                    </label>
                  </view>
                  
                  <!-- 折扣券 -->
                  <view v-else-if="item.couponType==114" style="flex-direction: column;height: 100%;"
                    class="flex flex-center row-center align-center carNoView2 cor">
                    <label v-if="item.couponItemVOList.length==1"
                      style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                      <!-- <text class="sell">￥</text> -->
                      {{item.couponItemVOList[0].discount}}
                    </label>
                    <label style="font-size:22rpx;font-weight:bold">
                      {{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
                    </label>
                  </view>

                  
                  <view v-else style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
                    <label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
                      <text class="sell">￥</text>
                      {{item.couponItemVOList[0].amount}}
                    </label>
                    <label style="font-size:22rpx;font-weight:bold">
                      {{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
                    </label>
                  </view>
                </view>
                <view class="listItemViewLine1Right">
                  <view class="listItemViewLine1Right_Head">
                    <view class="listItemViewLine1Right_Name">
                      <!-- {{item.compSecondName}} -->
					  {{item.couponName}}
                    </view>
                    <view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
                      <!-- {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}} -->
                      {{item.fuelTypeName ? item.fuelTypeName  : item.fuelNoName}}
                    </view>
                  </view>
                  <view class="amountView">
					  <view class="stand-type" :style="'color:' + (item.fuelType==1?'#F7A129':'#6AC5D0')" v-if="item.scope && item.couponTypeName != '现金'">{{item.scope}}</view>
					  <view class="stand-type" v-if="item.couponTypeName == '现金'">全站通用券</view>
                    <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-if="item.vaildStartDate">
                      {{item.vaildStartDate}}~{{item.vaildEndDate||'长期'}}
                    </view>
                    <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else-if="item.vaildEndDate">
                      至{{item.vaildEndDate||'长期'}}
                    </view>
                    <view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else>
                      长期有效
                    </view>
                    <image class="listItemView_img1" v-if="item.forward==1?true:false" :src="item.fuelType==1?couponForward:item.fuelType==2?couponForward1:couponForward2">
                    </image>
                  </view>
                  <text class="couponDetails" v-if="item.couponTypeName != '现金'">{{item.couponDetails}}</text>
				  <text class="couponDetails" v-else>可与其他券组合使用</text>
                  <view v-if="item.couponTypeName == '红包' || item.couponTypeName == '折扣'" class="rules-use" @tap.stop="showDialogBtn" :data-id="item.id">使用规则 >
                    <!-- <image src="../../../../images/icon_right.png" /> -->
                  </view>


                  <view class="listItemViewRight" :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-if="item.couponType != 113" @tap.stop="clickUse" :data-item="item">
                    立即使用
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
			<!-- </scroll> -->
		<!-- </swiper-item> -->
		<!-- <swiper-item :item-id="1"> -->
			<!-- <scroll :requesting="requesting2" :empty-show="emptyShow2" style="height: 95vh;" :refresh-size="80" @refresh="refresh2"> -->
        <view v-show="tabCurrent == 1" style="margin-top: 90rpx;width:100%">
				<view v-for="(item, index) in listData2" :key="index" :data-map="item">
					<view class="listItemView" :data-item="item" :style="'opacity: 0.5;' + 'background:url( ' + (item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2) + ');' + 'background-size: 100% 196rpx;'">
						<image class="listItemView_img" v-if="item.couponName=='转发奖励'?true:false" src="/static/images/jym/prize.png"></image>
						<view class="listItemViewLine1">
							<view class="listItemViewLine1Left">
								
								<view v-if="item.couponType==110" style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
									<label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponItemVOList[0].reduceAmount}}
										<text class="unit" selectable="false" space="false" decode="false">
											/L
										</text>
									</label>
									<label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponMaxAmount}}
										<text class="unit" selectable="false" space="false" decode="false">
											/L
										</text>
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>
								<view v-else-if="item.couponType==111" style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
									<label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponItemVOList[0].reduceAmount}}
									</label>
									<label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponMaxAmount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>
								
								<!-- 折扣券 -->
								<view v-else-if="item.couponType==114" style="flex-direction: column;height: 100%;"
									class="flex flex-center row-center align-center carNoView2 cor">
									<label v-if="item.couponItemVOList.length==1"
										style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<!-- <text class="sell">￥</text> -->
										{{item.couponItemVOList[0].discount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>

								<view v-else style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
									<label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponItemVOList[0].amount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>
							</view>
							<view class="listItemViewLine1Right">
								<view class="listItemViewLine1Right_Head">
									<view class="listItemViewLine1Right_Name">
										<!-- {{item.compSecondName}} -->
										{{item.couponName}}
									</view>
									<view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
										<!-- {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}} -->

										{{item.fuelTypeName ? item.fuelTypeName  : item.fuelNoName}}
									</view>
								</view>
								<view class="amountView">
									<view class="stand-type" :style="'color:' + (item.fuelType==1?'#F7A129':'#6AC5D0')" v-if="item.scope && item.couponTypeName != '现金'">{{item.scope}}</view>
									<view class="stand-type" v-if="item.couponTypeName == '现金'">全站通用券</view>
									<view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-if="item.vaildStartDate">
										{{item.vaildStartDate}}~{{item.vaildEndDate||'长期'}}
									</view>
									<view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else-if="item.vaildEndDate">
										至{{item.vaildEndDate||'长期'}}
									</view>
									<view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else>
										长期有效
									</view>
								</view>
								<text class="couponDetails" v-if="item.couponTypeName != '现金'">{{item.couponDetails}}</text>
								<text class="couponDetails" v-else>可与其他券组合使用</text>
							</view>
							<view class="typeImage">
								<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/coupon_use.png"></image>
							</view>
						</view>
					</view>

				</view>
        </view>
			<!-- </scroll> -->
		<!-- </swiper-item> -->
		<!-- <swiper-item :item-id="2"> -->
			<!-- <scroll :requesting="requesting3" :empty-show="emptyShow3" style="height: 95vh;" :refresh-size="80" @refresh="refresh3"> -->
        <view v-show="tabCurrent == 2" :style="'margin-top: 90rpx;width:100%'">
				<view v-for="(item, index) in listData3" :key="index" :data-map="item">
					<view class="listItemView" :data-item="item" :style="'opacity: 0.5;' + 'background:url(' + (item.fuelType==1?couponImg:item.fuelType==2?couponImg1:couponImg2) + ');' + 'background-size: 100% 196rpx;'">
						<image class="listItemView_img" v-if="item.couponName=='转发奖励'?true:false" src="/static/images/jym/prize.png"></image>
						<view class="listItemViewLine1">
							<view class="listItemViewLine1Left">
								<view v-if="item.couponType==110" style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
									<label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponItemVOList[0].reduceAmount}}
										<text class="unit" selectable="false" space="false" decode="false">
											/L
										</text>
									</label>
									<label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponMaxAmount}}
										<text class="unit" selectable="false" space="false" decode="false">
											/L
										</text>
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>
								<view v-else-if="item.couponType==111" style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
									<label v-if="item.couponItemVOList.length==1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponItemVOList[0].reduceAmount}}
									</label>
									<label v-if="item.couponItemVOList.length>1" style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponMaxAmount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>
								
								<!-- 折扣券 -->
								<view v-else-if="item.couponType == 114" style="flex-direction: column;height: 100%;"
									class="flex row-center align-center carNoView2 cor">
									<label v-if="item.couponItemVOList.length==1"
										style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<!-- <text class="sell">￥</text> -->
										{{item.couponItemVOList[0].discount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>

								<view v-else style="flex-direction: column;height: 100%;" class="flex flex-center row-center align-center carNoView2 cor">
									<label style="font-weight:bold;font-size:63rpx;height:88rpx; line-height: 88rpx;">
										<text class="sell">￥</text>
										{{item.couponItemVOList[0].amount}}
									</label>
									<label style="font-size:22rpx;font-weight:bold">
										{{item.couponTypeName}}券{{item.couponTypeName=="折扣"?'%':''}}
									</label>
								</view>
							</view>
							<view class="listItemViewLine1Right">
								<view class="listItemViewLine1Right_Head">
									<view class="listItemViewLine1Right_Name">
										<!-- {{item.compSecondName}} -->
										{{item.couponName}}
									</view>
									<view class="typeName" :style="'background:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)">
										<!-- {{item.fuelNoName=='通用'?'':item.fuelNoName}}{{item.fuelTypeName}} -->
										{{item.fuelTypeName ? item.fuelTypeName  : item.fuelNoName}}
									</view>
								</view>
								<view class="amountView">
									<view class="stand-type" :style="'color:' + (item.fuelType==1?'#F7A129':'#6AC5D0')" v-if="item.scope && item.couponTypeName != '现金'">{{item.scope}}</view>
									<view class="stand-type" v-if="item.couponTypeName == '现金'">全站通用券</view>
									<view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-if="item.vaildStartDate">
										{{item.vaildStartDate}}~{{item.vaildEndDate||'长期'}}
									</view>
									<view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else-if="item.vaildEndDate">
										至{{item.vaildEndDate||'长期'}}
									</view>
									<view :style="'color:' + (item.fuelType==1?couponColor:item.fuelType==2?couponColor1:couponColor2)" v-else>
										长期有效
									</view>
								</view>
								
								<text class="couponDetails" v-if="item.couponTypeName != '现金'">{{item.couponDetails}}</text>
								<text class="couponDetails" v-else>可与其他券组合使用</text>
							</view>
							<view class="typeImage">
								<image src="https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/coupon_expire.png"></image>
							</view>
						</view>
					</view>
				</view>
        </view>
			<!-- </scroll> -->
		<!-- </swiper-item> -->
	<!-- </swiper> -->
</view>
<view class="mask" catchtouchmove="preventTouchMove" v-if="showModal"></view>
<!-- 弹出层 -->
<view class="modalDlg" v-if="showModal">
	<view class="modal_top1">
		使用规则
	</view>

	<scroll-view scroll-y="true" style="height: 330px;overflow: hidden;">
		<!-- <view class="modal_top modal_con">{{rule}}</view> -->
		<view class="modal_top modal_con">
			<view class="modal-text">使用条件：</view>
			<view class="modal-text-right">{{ruleObj.rule1}}</view>
		</view>
		<view class="modal_top modal_con">
			<view class="modal-text">加油类型：</view>
			<view class="modal-text-right">{{ruleObj.fuelTypeName}}</view>
		</view>
		<view class="modal_top modal_con">
			<view class="modal-text">使用范围：</view>
			<view class="modal-text-right" v-if="!ruleObj.useStationList && !ruleObj.excludeStationList">全站通用券</view>
			<text class="modal-text-scope" v-else>
				<text v-if="ruleObj.useStationList" v-for="(item, index) in ruleObj.useStationList">{{item.compSecondName}}{{index!=ruleObj.useStationList.length-1?',':''}}</text>
				<text v-if="ruleObj.excludeStationList">除</text>
				<text style="color: red;" v-if="ruleObj.excludeStationList" v-for="(item, index) in ruleObj.excludeStationList">{{item.compSecondName}}{{index!=ruleObj.excludeStationList.length-1?',':''}}</text>
				<text v-if="ruleObj.excludeStationList">全站通用</text>
			</text>
		</view>
		<view class="modal_top modal_con">
			<view class="modal-text">时间范围：</view>
			<view class="modal-text-right" v-if="ruleObj.vaildStartDate && ruleObj.vaildEndDate">
				{{ruleObj.vaildStartDate + '~' + ruleObj.vaildEndDate}}</view>
			<view class="modal-text-right" v-else-if="ruleObj.vaildEndDate && !ruleObj.vaildEndDate">
				{{ruleObj.vaildStartDate + '~长期'}}</view>
			<view class="modal-text-right" v-if="!ruleObj.vaildStartDate && !ruleObj.vaildEndDate">长期有效</view>
		</view>
		<view class="modal_top modal_con">
			<view class="modal-text">注意事项：</view>
			<view class="modal-text-right" style="padding-bottom: 30rpx;">每笔订单限用一张优惠券；成功下单后优惠券即作废，申请退款后无法退券；</view>
		</view>
	</scroll-view>

	<view class="modal_btm">
		<!-- <view catchtap="cancel">取消</view> -->
		<!-- <button catchtap="confirm" open-type="share" data-item="{{item}}">确认</button> -->
		<view class="btnLeftContainer" @tap.stop="cancel">
			<text>我知道了</text>
		</view>
	</view>
</view>
<!-- <view class="market-box" v-if="hideMarket" @click="marketEvent">
	<image src="/static/images/jym/hideMarket.png" style="width: 320rpx;" mode="widthFix"></image>
</view> -->
<!-- <view class="show-market-box" :style="'left:' + left + 'px;top:' + top + 'px;'" @touchmove="viewTouchMove"  @click="goMarket()">
	<image src="/static/images/jym/showMarket.png" style="width: 200rpx;" mode="widthFix"></image>
</view> -->
<view style="position: fixed; bottom: 80rpx; right: 10rpx; z-index: 9999;" @click="goApp()">
	<image style="width: 80px; height: 80px;" src="/static/images/jym/community.png"></image>
</view>

<view class="no-data-box" v-if="noData">
	<image class="noData"  src="/static/images/noData.png" mode="widthFix"></image>
	<view class="">没有优惠券？</view>
	<!-- <view class="" style="color: #999; font-size: 23rpx; margin: 20rpx 0;">去券市场看一看吧</view>
	<view class="" style="border: 1rpx solid #666; padding: 10rpx 30rpx; border-radius: 5rpx;" @click="goMarket()">去看看</view> -->
</view>
</view>
</template>

<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>

<script>
const app = getApp(); // pages/motorcade/motorcadeIndex/motorcadeIndex.js
// pages/motorcade/motorcadeIndex/motorcadeIndex.js
var api = require("@/config/api.js");
var util = require("@/utils/jym-utils/util.js");
var ctx = ""; // 用于获取canvas
// 用于获取canvas
var leftMargin = ""; //文字距离左边边距
//文字距离左边边距
var topMargin = ""; //文字距离右边边距
//文字距离右边边距
let pageStart = 1;
import tab from "@/components/jym-components/tab/index";
import scroll from "@/components/jym-components/scroll/index";
import * as publicData from "@/utils/publicData";
export default {
  data() {
    return {
      showModal: false,
      inputValue: null,
      tabTitles: ["未使用", "已使用", "已过期"],
      tabCurrent: 0,
      //当前选中的标签类型
      duration: 300,
      // swiper-item 切换过渡时间
      currentTab: 0,
      // 当前数据列索引
      categoryMenu: [],
      // 分类菜单数据, 字符串数组格式
      userId: 0,
      requesting1: false,
      forwardList: [],
      listData1: [],
      emptyShow1: false,
      requesting2: false,
      listData2: [],
      emptyShow2: false,
      requesting3: false,
      listData3: [],
      emptyShow3: false,
      onShare: "onShare",
	  onShare1: "onShare1",
      imageUrl1: "https://cargocn.oss-cn-beijing.aliyuncs.com/6f576887869949f4a993ddc070044a2a.png",
      imageUrl2: "https://cargocn.oss-cn-beijing.aliyuncs.com/20200905213558.png",
      forwardId: 0,
      showModal: false,
      canvasWidth: '',
      // canvas宽度
      canvasHeight: '',
      // canvas高度
      imagePath: '',
      // 分享的图片路径
      couponImg: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/coupon_cy.png",
      couponImg1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/coupon_qy.png",
      couponImg2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/coupon_yg.png",
      couponForward: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_my_coupon_yellow.png",
      couponForward1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_my_coupon.png",
      couponForward2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/icon/icon_my_coupon_green.png",
      couponColor: '#F7A129',
      couponColor1: '#6D9AED',
      couponColor2: '#6ac5d0',
      rule: '' //使用规则
      ,
	  ruleObj: {},
      storageData: [],
      swipeHeight: 0,
	  noData: false,
	  hideMarket: false,
	  isScroll: true,
	  left: '',
	  top: '',
	  activeAdvObj: null,
	  advList: [
	  	{typeName: '加油么优惠券', key: 'JYYHQ', info: []}
	  ],
    };
  },

  components: {
    tab,
    scroll
  },
  props: {},
  onPageScroll(res) {
	  this.isScroll = false;
	  if (this.timeout) clearTimeout(this.timeout);
	  this.timeout = setTimeout(()=>{
		this.hideMarket = false;  
		this.isScroll = true
	  }, 800)
  },
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {}

    var listData = {
      comId: this.forwardList.id,
      fromUserId: this.userId,
      id: this.forwardId,
      list: {
        compSecondName: this.forwardList.compSecondName,
        couponMaxAmount: this.forwardList.couponMaxAmount
      }
    };
    console.log(listData);
    let imagePath = this.imagePath;
    let amount = this.forwardList.couponMaxAmount;
    console.log(this.imagePath);
    return {
      title: '您的好友送您' + amount + '元优惠券',
      path: 'pages/forward/coupon/coupon?data=' + JSON.stringify(listData),
      // imageUrl: this.data.imagePath,
      imageUrl: "/static/images/jym/youhui2.png",
      success: function (res) {
        console.log(imagePath, "111");
        uni.navigateBack({
          changed: true
        });
      }
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
	that.$store.dispatch('getJymYHQAdv').then(fleetAdvRes => {
		console.log(fleetAdvRes)
		that.advList.forEach((itemOne) => {
			fleetAdvRes.forEach(itemTwo =>{
				if(itemTwo.advLocation.indexOf(itemOne.key) != -1){
					itemOne.info.push(itemTwo)
				}
			})
		})
		that.setActiveAdv('加油么优惠券')
	})
    uni.setNavigationBarTitle({
        title: '优惠奖券'
    });
    uni.getStorage({
      key: 'driverInfo',
      success: function (res) {
        that.userId = res.data.userId;
        that.requestList(1);
      }
    });

    // if (options.flag == 1) {
    //   uni.removeStorage({
    //     key: 'getCoupons',
    //     success: function (res) {
    //       that.storageData = [];
    //     }
    //   });
    // }

    var sysInfo = uni.getSystemInfo({
      success: function (res) {
		  //设置宽高为屏幕宽，高为屏幕高的80%，因为文档比例为5:4
        that.canvasWidth = res.windowWidth;
          that.canvasHeight = res.windowWidth * 0.8;
        console.log(that.canvasWidth);
        leftMargin = res.windowWidth;
        topMargin = res.windowWidth * 0.8;
      }
    });
  },
  onPullDownRefresh: function(){
    // this.refresh()
    console.log(this.tabCurrent)
    switch (this.tabCurrent) {
      case 0:
        this.requestList(1);
        break;
      case 1:
          this.requestList(2);
          break;
      case 2:
        this.requestList(3);
        break;
    }
  },
  
  onBackPress(e) {
  	if (e.from == "backbutton") {
  		//说明如果点击的是物理返回键或导航栏的返回键返回货运中国
  		this.goApp();
  	}
  	return true;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onHide(){
	   let that = this; 
	  // that.listData1 = []
	  // that.listData2 = []
	  // that.listData3 = []
	  this.hideMarket = false;  
  },
  onShow: function () {
	  let that = this;
	  var screenHeight = uni.getSystemInfoSync().windowHeight;
	  var screenWidth = uni.getSystemInfoSync().windowWidth; // console.log(screenHeight);
	  // console.log(screenWidth);
	  
	  this.top = screenHeight - 270;
	  this.left = screenWidth - 100;
    uni.setNavigationBarTitle({
        title: '优惠奖券'
    });
	  // that.listData1 = []
	  // that.listData2 = []
	  // that.listData3 = []
    // const pages = getCurrentPages();
    // const currPage = pages[pages.length - 1]; // 当前页

    // console.log(currPage.data.recharge);

    // if (currPage.data.recharge != null) {
      // this.requestList(that.tabCurrent);
	  // that.tabCurrent = 0;
	  // that.cloneOnload();
    // }
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
	  viewTouchMove: function (e) {
	    var screenWidth = uni.getSystemInfoSync().windowWidth;
	    var screenHeight = uni.getSystemInfoSync().windowHeight;
	  
	    if (e.touches[0].clientX > 0 && e.touches[0].clientY > 0 && e.touches[0].clientX < screenWidth - 100 && e
	      .touches[0].clientY < screenHeight - 270) {
	      this.left = e.touches[0].clientX;
	      this.top = e.touches[0].clientY;
	    }
	  },
	  marketEvent(){
		  this.hideMarket = !this.hideMarket
		  if(this.hideMarket){
			  this.isScroll = true;
		  } else {
			  this.isScroll = false;
		  }
	  },
	  goMarket(){
		  setTimeout(()=>{
			  this.hideMarket = false;
			  uni.navigateTo({
			  	url: 'market/market'
			  }) 
		  }, 400)
	  },
	  cloneOnload(){
		  let that = this;
		  uni.getStorage({
		    key: 'driverInfo',
		    success: function (res) {
		      that.userId = res.data.userId;
		      that.requestList(1);
		    }
		  });
		  
		  // if (options.flag == 1) {
		  //   uni.removeStorage({
		  //     key: 'getCoupons',
		  //     success: function (res) {
		  //       that.storageData = [];
		  //     }
		  //   });
		  // }
		  
		  var sysInfo = uni.getSystemInfo({
		    success: function (res) {
		  	  //设置宽高为屏幕宽，高为屏幕高的80%，因为文档比例为5:4
		      that.canvasWidth = res.windowWidth;
		        that.canvasHeight = res.windowWidth * 0.8;
		      console.log(that.canvasWidth);
		      leftMargin = res.windowWidth;
		      topMargin = res.windowWidth * 0.8;
		    }
		  });
	  },
	  goApp(){
		  console.log('121212')
	  	publicData.goDriverApp()
	  },
    clickUse(e) {
      const item = e.currentTarget.dataset.item;
      console.log(item);
      const comId = item.comId;
      const id = item.id; //110立减 111充返 112红包 113自定义

      if (item.couponType == 111) {
        // wx.navigateTo({
        //     url: '../recharge/rechargeIndex/rechargeIndex?couponMap=' + JSON.stringify(item),
        // })
        uni.switchTab({
          url: '/pages/jymPages/oilstation/oilstationIndex/oilstationIndex'
        });
      } else {
        // wx.navigateTo({
        //     url: '../../oilstation/oilstationDetail/oilstationDetail?id=' + comId + '&stationType=' + item.stationType,
        // })
        uni.switchTab({
          url: '/pages/jymPages/oilstation/oilstationIndex/oilstationIndex'
        });
      }
    },

    onShareFun(e) {
      const item = e.currentTarget.dataset.item;
      var that = this;
      this.forwardList = item;
        this.showModal = true;
      console.log(this.forwardList);
      var parma = {
        couponId: item.id,
        fromUserId: this.userId
      };
      util.postRequest(api.forwardCoupon, parma).then(function (res) {
        if (res.retCode == '0000000') {
          console.log(res.rspBody);
          that.forwardId = res.rspBody;
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
      ctx = uni.createCanvasContext('myCanvas');
      this.tempFilePath();
    },

    addImage: function () {
      var context = uni.createContext();
      var that = this;
      var path = "/static/images/jym/getCoupons.png"; //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
      //不知道是什么原因，手机环境能正常显示

      ctx.drawImage(path, 0, 0, this.canvasWidth, this.canvasHeight);
      this.addTitle();
      this.addRtype();
      ctx.draw();
    },
    tempFilePath: function () {
      let that = this;
      uni.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function success(res) {
          uni.saveFile({
            tempFilePath: res.tempFilePath,
            success: function success(res) {
              that.imagePath = res.savedFilePath;
              that.addImage();
            }
          });
        }
      });
    },
    //画金额
    addTitle: function () {
      let amount = this.forwardList.couponMaxAmount;
      var str = '￥' + amount;
      let rpx = 1;
      uni.getSystemInfo({
        success(res) {
          rpx = res.windowWidth / 375;
        }

      });
      ctx.font = 'normal bold 40rpx sans-serif';
      ctx.setTextAlign('center'); // 文字居中

      ctx.setFillStyle("#ff4200");
      ctx.fillText(str, this.canvasWidth / 2 * rpx, 100 * rpx);
    },
    // 画恭喜获得
    addRtype: function () {
      let amount = this.forwardList.couponMaxAmount;
      var str = '恭喜获得' + amount + '元优惠券';
      let rpx = 1;
      uni.getSystemInfo({
        success(res) {
          rpx = res.windowWidth / 375;
        }

      });
      ctx.setFontSize(16);
      ctx.setTextAlign('center'); // 文字居中

      ctx.setFillStyle("#fff");
      ctx.fillText(str, 192 * rpx, topMargin * 0.6);
    },

    cancel() {
      this.showModal = false;
    },

    confirm() {
      this.showModal = false;
    },

    // 顶部tab切换事件
    toggleCategory(e) {
      console.log(e);
      var value = e.detail.index;
      var tabCurrent = this.tabCurrent;
	  setTimeout(()=>{
	  		this.hideMarket = false;  
	  }, 400)
		this.noData = false;
      if (tabCurrent != value) {
        if (value == 0) {
          this.requestList(1);
        } else if (value == 1) {
          this.requestList(2);
        } else if (value == 2) {
          this.requestList(3);
        }

        this.tabCurrent = value;
      }
    },

    // 页面滑动切换事件
    animationFinish(e) {
      var value = e.detail.current;
      var tabCurrent = this.tabCurrent;

      if (tabCurrent != value) {
        if (value == 0) {
          this.requestList(1);
        } else if (value == 1) {
          this.requestList(2);
        } else if (value == 2) {
          this.requestList(3);
        }

        this.tabCurrent = value;
      }
    },

    refresh1() {
		console.log('123dfdfdfgdfgsdfbsdfbvsdfbvsdfv')
      this.requestList(1);
    },

    refresh2() {
      this.requestList(2);
    },

    refresh3() {
      this.requestList(3);
    },

    requestList(status) {
      const parma = {
        userStatus: status,
        //,--userStatus:1未使用，2已使用，3已过期
        userId: this.userId
      };
      const that = this;
      that.changeRequestStatus(status);
      util.postRequest(api.getCouponInfoList, parma).then(function (res) {
        uni.stopPullDownRefresh()
        that.changeResponseStatus();

        if (res.retCode == '0000000') {
          const list = res.rspBody.items;
		  console.log(list);
          that.swipeHeight = (list.length+2) * 196
          that.$forceUpdate()
          that.changeEmpty(status, list);
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      });
    },

    changeRequestStatus(status) {
      var that = this;

      if (status == 1) {
        that.requesting1 = true;
      } else if (status == 2) {
        that.requesting2 = true;
      } else {
        that.requesting3 = true;
      }
    },

    changeResponseStatus() {
      this.requesting1 = false;
        this.requesting2 = false;
        this.requesting3 = false;
    },

    changeEmpty(status, list) {
      if (status == 1) {
        if (list.length > 0) {
          this.emptyShow1 = false;
		  this.listData1 = []
		  setTimeout(()=>{
			 this.listData1 = list; 
			 this.noData = false;
		  },200)
            
        } else {
          this.emptyShow1 = true;
            this.listData1 = [];
			this.noData = true;
        }
      } else if (status == 2) {
        if (list.length > 0) {
          this.emptyShow2 = false;
            this.listData2 = []
            setTimeout(()=>{
				this.listData2 = list; 
				this.noData = false;
            },100)
        } else {
          this.emptyShow2 = true;
            this.listData2 = [];
			this.noData = true;
        }
      } else {
        if (list.length > 0) {
          this.emptyShow3 = false;
		  this.listData2 = []
		  setTimeout(()=>{
		  	this.listData3 = list; 
			this.noData = false;
		  },100)
        } else {
          this.emptyShow3 = true;
            this.listData3 = [];
			this.noData = true;
        }
      }
	  this.$forceUpdate();
    },

    /**
     * 弹窗
     */
    showDialogBtn: function (e) {
      console.log(e);
      let params = {
        id: e.currentTarget.dataset.id
      };
      util.postRequest(api.getCouponInfor, params).then(res => {
		  console.log(res)
        if (res.retCode == '0000000') {
          this.rule = res.rspBody.rule;
		  this.ruleObj = res.rspBody;
            this.showModal = true;
        } else {
          uni.showToast({
            title: res.retDesc,
            icon: 'none'
          });
        }
      }); // this.setData({
      //     showModal: true
      // })
    },

    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
      return;
    },

    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.showModal = false;
    },

    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      this.hideModal();
    },

    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
      this.hideModal();
    },

    /**
     * 获取输入框中输入的值
     */
    inputChange: function (option) {
      /* 把文本框输入的内容方到 data 里面 */
      this.inputValue = option.detail.value;
    },
    preventTouchMove: function () {
      return;
    }
  }
};
</script>
<style>
@import "./coupon.css";
</style>