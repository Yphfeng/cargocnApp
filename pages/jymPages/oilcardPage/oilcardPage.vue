<template>
  <view class="jym-container">
	  <view class="advs" v-if="activeAdvObj && activeAdvObj.info[0].advUrl">
		<image :src="activeAdvObj.info[0].advUrl" mode="aspectFill" @click="showBigBanner(activeAdvObj.info[1], activeAdvObj.info[1].advUrl)" class="mainBanner"image>
		<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/adverties.gif"  class="advertiesGif"></image>
	  </view>
	  <view style="height: 160rpx;" v-if="activeAdvObj && activeAdvObj.info[0].advUrl"></view>
    <view class="cardTitle">
      <!-- <rich-text class="bankTitle">
      我的卡
      <text>共{{cardListArr.length}}张</text>
    </rich-text> -->
      <view class="bankTitle-view">
        <label>我的卡</label>
        <label> 共{{cardListArr.length}}张</label>
      </view>
    </view>
    <scroll-view class="cardListView" scroll-y="false">
      <block v-for="(item, bindex) in cardListArr" :key="bindex">
        <view class="cardView"
          :style="'color: ' + (item.cardType==3?textColor3:item.fuelType==1?textColor3:item.fuelType==2?textColor2:textColor2) + ';'">
          <!-- :style="background: url({item.cardType==3?image5:item.fuelType==1?image2:item.fuelType==2?image3:image4});background-size: cover" -->
          <view class="cardView1"
            :style="'background: url(' + (item.cardType==3?image5:filter.checkCardFlagIsSite(item.cardFlag)==false?image2:item.fuelType==1?image1:item.fuelType==2?image3:image4) + ');' + 'background-size: cover'">

            <view class="cardContainer">
              <view class="card">
                <view class="headImageView" v-if="hasUserInfo" hover-class="none" hover-stop-propagation="false">
                  <open-data class="headImageView1" type="userAvatarUrl"></open-data>
                </view>
                <view class="headImageView" v-else hover-class="none" hover-stop-propagation="false">
                  <image class="headImageView" src="https://cargocn.oss-cn-beijing.aliyuncs.com/20200904170819.png">
                  </image>
                </view>
                <view class="user">
                  <view>{{item.userName}}</view>
                  <!-- <view wx:if="{{!filter.checkCardFlagIsSite(item.cardFlag)}}">{{item.plateNo}}</view> -->
                  <view v-if="item.cardFlag != ''">{{item.plateNo}}</view>
                </view>
                <view class="cardType1">
                  <view style="font-size: 33rpx" v-if="type==0">
                    {{filter.checkCardFlagName(item.cardFlag)}}
                  </view>
                  <view style="font-size: 33rpx" v-if="type==1">
                    {{filter.checkCardFlagName(item.cardFlag)}}
                  </view>
                  <view style="font-size: 18rpx">卡号：{{item.cardNo}}</view>
                </view>
              </view>
            </view>

            <view v-if="type==0" class="cardCenter">
              <view>余额（元）</view>
              <view class="amount">
                <view style="font-size: 36rpx;padding-top:21rpx;">￥</view>
                <view>
                  {{filter.Amount(item.amount)[0]}}
                </view>
                <view style="font-size: 22rpx;padding-top:30rpx;margin-left:6rpx">
                  .{{filter.Amount(item.amount)[1]}}
                </view>
              </view>
            </view>
            <view v-if="type==1" class="cardCenter">
              <text>积分：{{item.points}}</text>
            </view>
            <view class="cardBottom">
              <view class="cardType2">
                <text style="font-size: 22rpx">{{item.cardType!=3?item.compSecondName:''}}</text>
              </view>
              <!-- <text>{{item.mobile}}</text> -->
              <!-- <view v-if="type==0&&item.cardType!=3" :style="'color: ' + (item.cardType==3?textColor3:'')" class="cardAccountViewButton" @tap="clickToRecharge" :data-map="item">
              自助充值
            </view> -->
              <view v-if="type==1&&item.cardType!=3" :style="'color: ' + (item.cardType==3?textColor3:'')"
                class="cardAccountViewButton" @tap="clickToExchange" :data-map="item">
                积分兑换
              </view>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
    <view style="position: fixed; bottom: 80rpx; right: 10rpx;" @click="goApp">
      <image style="width: 80px; height: 80px;" src="/static/images/jym/community.png"></image>
    </view>
  </view>
</template>

<script module="filter" lang="wxs" src="@/utils/jym-utils/normal.wxs"></script>

<script>
  // pages/my/oilcardPage/oilcardPage.js
  var api = require("@/config/api.js");
  var util = require("@/utils/jym-utils/util.js");
  import * as publicData from "@/utils/publicData"
  const app = getApp();

  export default {
    data() {
      return {
        type: 0,
        cardListArr: [],
        hasUserInfo: false,
        userInfo: { // avatarUrl: "", //用户头像
          // nickName: "", //用户昵称
        },
        textColor1: "#90B1F0",
        textColor: "#F7A129",
        textColor2: "#40BDCA",
        textColor3: '#004284',
        testColor4: '#ffffff',
        image1: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_cy.png",
        image3: 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_qy.png',
        image4: 'https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_yq.png',
        image2: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/others/oil_my_cards_cd.png",
        image5: "https://cargocnwebimage.oss-cn-beijing.aliyuncs.com/jym/driver/platfromCar.png",
		activeAdvObj: null,
		advList: [
			{typeName: '加油么油卡', key: 'JYYK', info: []}
		],
      };
    },

    components: {},
    props: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that = this
	  let userInfo = app.globalData.userInfo;
	  that.$store.dispatch('getJymYKAdv').then(fleetAdvRes => {
	  	console.log(fleetAdvRes)
	  	that.advList.forEach((itemOne) => {
	  		fleetAdvRes.forEach(itemTwo =>{
	  			if(itemTwo.advLocation.indexOf(itemOne.key) != -1){
	  				itemOne.info.push(itemTwo)
	  			}
	  		})
	  	})
	  	that.setActiveAdv('加油么油卡')
	  })
      this.userInfo = userInfo;

      // if (userInfo == null) {
      //   this.hasUserInfo = true;
      // } else {
      //   this.hasUserInfo = false;
      // }

      // this.type = options.type;

      uni.setNavigationBarTitle({
        title: '加油卡'
      });
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
    onShow: function () {
      uni.setNavigationBarTitle({
        title: '加油卡'
      });
      this.getCardList();
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
      goApp() {
        publicData.goDriverApp()
      },
      // 这里是加油卡
      getCardList: function () {
        var that = this;
        util.postRequest(api.driverOilcardList, {}).then(function (res) {
          console.log(res);
          that.cardListArr = [];
          if (res.retCode == '0000000') {
            setTimeout(() => {
              that.cardListArr = res.rspBody;
              console.log(123)
            }, 500)
          } else {
            uni.showToast({
              title: res.retDesc,
              icon: 'none'
            });
          }
        });
      },
      clickToRecharge: function (e) {
        const map = e.currentTarget.dataset.map; // console.log(111)

        console.log(map);
        uni.navigateTo({
          url: '/pages/jymPages/oilcardPage/recharge/rechargeIndex/rechargeIndex?map=' + JSON.stringify(map)
        });
      },

      clickToExchange(e) {
        const item = e.currentTarget.dataset.map;
        uni.navigateTo({
          url: '../creditsExchange/creditsExchange?stationId=' + item.compId + "&siteName=" + item.compName +
            "&points=" + item.points + "&cardId=" + item.id
        });
      }

    }
  };
</script>
<style>
  @import "./oilcardPage.css";
</style>