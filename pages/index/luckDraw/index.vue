<template>
  <view class="container" :style="{height: containerHeight +'px'}">
    <view class="rule" @click="previewImage(luckDrawData.gameRule)">规则</view>
    <image class="bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/luckDarw/bg.png" mode=""></image>
    <view class="all_content">
      <view class="top_ad_container">
        <!-- <image class="top_ad" src="./prize.png" mode="" @click="previewImage('top')"></image> -->
      </view>
      <view class="win_prize_list_container">
        <view class="seamless_scroll">
          <view class="win_prize_item" v-for="(item,index) in swiperList" :key="index">
            <text>恭喜：{{item.lastname}}师傅，领取{{item.prizeName}}</text>
            <text class="time">{{item.minute}} 分钟前</text>
          </view>
        </view>
      </view>
      <view class="jackpot_container">
        <view class="top_bg">
          <view class="top_bg_2"></view>
        </view>
        <view class="jackpot">
          <view class="inner_bg">
            <view class="inner_bg2" v-if="showRecord">
              <template v-for="(item,index) in prizeList">
                <view v-if="index != 4" :class="[1, 4, 7].includes(index) ?'prize_item_center':'prize_item'">
                  <view class="inner_item" :class="avtiveKey == item.key ? 'inner_item_active': ''">
                    <view v-if="index != 4">
                      <image class="inner_image" :src="item.prizeDebrisImg" mode=""></image>
                      <view class="inner_text">{{item.prizeContent}}</view>
                    </view>
                  </view>
                </view>
                <view class="prize_btn" @click="goLuckDown" v-else>
                  <view class="prize_btn_inner">
                    <view>
                      <image class="btn_text" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/luckDarw/text.png"
                        mode=""></image>
                      <view class="btn_quantity">剩余{{drawNumber}}次</view>
                    </view>
                  </view>
                </view>
              </template>
            </view>
            <view v-if="!showRecord" class="inner_prize">
              <view class="prize_info">
                <view class="prize_info_item" v-for="(item,index) in realPrizeList" :key="index">
                  <view class="left_prize" :class="item.haveWinprize ? 'have_prize' : ''">
                    <image class="left_prize_image" :src="item.prizeImg" mode=""></image>
                    <view class="receive_btn" @click="receiveAward(item)" v-if="item.haveWinprize">领奖</view>
                    <view class="prize_num">{{item.haveFragmentNum}}/{{item.children.length}}</view>
                  </view>
                  <view class="right_prize">
                    <view class="right_prize_item" v-for="(itemTwo,index) in item.children"
                      :class="itemTwo.number === 0 ? 'no_have_prize' : ''">
                      <view class="right_prize_item_inner">
                        <image class="right_prize_item_image" :src="itemTwo.prizeDebrisImg" mode=""></image>
                        <view class="prize_num">{{itemTwo.number}}</view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="bottom_btn">
        <view :class="!showRecord ? 'rule_btn':'right_btn'" @click="changeLuckDown">立即抽奖</view>
        <view :class="showRecord ? 'rule_btn':'right_btn'" @click="changeWinPrize">抽奖记录</view>
        <!-- <view class="right_btn" v-if="showRecord" @click="changeWinPrize">抽奖记录</view>
        <view class="right_btn" v-else @click="changeLuckDown">立即抽奖</view> -->
      </view>
      <view class="received_container" v-if="!showRecord">
        <view class="received_image_container">
          <image class="received_image" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/luckDarw/re.png" mode="">
          </image>
          <view class="received_title">已中奖</view>
        </view>
        <scroll-view :scroll-y="true" lower-threshold="30"
          :style="{height: receivePrizeList.length > 3 ? '428rpx' : '214rpx'}" @scrolltolower="getReceivedList"
          class="received_list">
          <view class="received_content" v-for="(item,index) in receivePrizeList" :key="index">
            <view class="received_item">
              <view style="width:25%;text-align:left;">{{item.turntablePrizeName}}</view>
              <view style="color: #FF7700;width:25%;text-align:center;">{{item.status ? '已发货':'审核中'}}</view>
              <view style="width:50%;text-align:right;">{{item.drawTime}}</view>
            </view>
            <view class="task_id" v-if="item.status">运单号：{{item.orderNumber}}</view>
            <view class="received_line">
              <view></view>
            </view>
          </view>
          <view class="received_loading">{{realPrizeParams.hasNextPage ? '加载中' : '没有更多了'}}</view>
        </scroll-view>
      </view>
      <view class="received_container" v-if="!showRecord">
        <view class="received_image_container">
          <image class="received_image" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/luckDarw/re.png" mode="">
          </image>
          <view class="received_title">抽奖记录</view>
        </view>
        <scroll-view :scroll-y="true" lower-threshold="30" @scrolltolower="getPrizeFragment"
          :style="{height: prizeFragmentList.length > 3 ? '428rpx' : '214rpx'}" class="received_list">
          <view class="received_content" v-for="(item,index) in prizeFragmentList" :key="index">
            <view class="received_item">
              <view>{{item.turntablePrizeDebtisName}}*1</view>
              <view>{{item.drawTime}}</view>
            </view>
            <view class="received_line">
              <view></view>
            </view>
          </view>
          <view class="received_loading">{{prizeFragmentParams.hasNextPage ? '加载中' : '没有更多了'}}</view>
        </scroll-view>
      </view>
      <view class="bottom_ad_container" v-if="showRecord">
        <image class="bottom_ad" v-if="adList.length" @click="previewImage(adList[0].advUrl)" :src="adList[1].advUrl"
          mode=""></image>
      </view>
    </view>

    <view class="dialog" v-if="showLuckDraw">
      <image class="gif_image" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/luckDarw/yanhua.gif" mode=""></image>
      <view class="box">
        <view class="dialog_box" :class="showContent ? 'animation' : ''">
          <image class="dialog_image" :src="winPrizeInfo.prizeDebrisImg" mode=""></image>
          <view class="image_name">{{winPrizeInfo.prizeContent}} * 1</view>
          <view class="dialog_content">恭喜您抽中{{winPrizeInfo.prizeContent}}*1，请在抽奖记录中查看</view>
          <view class="btn" @click="showLuckDraw = false,showContent = false">确定</view>
        </view>
      </view>
    </view>
    <view class="dialog" v-if="showPrize">
      <image class="gif_image" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/luckDarw/yanhua.gif" mode=""></image>
      <view class="box">
        <view class="dialog_box" :class="showContent ? 'animation' : ''">
          <image class="dialog_image" :src="selectPrize.prizeImg" mode=""></image>
          <view class="image_name">{{selectPrize.prizeName}}</view>
          <view class="dialog_content">恭喜您拼成{{selectPrize.prizeName}}, 请等待后台审核发货</view>
          <view class="btn" @click="showPrize = false,showContent = false">确定</view>
        </view>
      </view>
    </view>
    <view class="dialog" v-if="!luckDrawData">
      <view class="box">
        <view class="dialog_box animation">
          <view class="dialog_content" style="padding: 70rpx 0;font-size: 40rpx">当前活动已失效</view>
          <view class="btn" style="padding: 24rpx 0;" @click="goBack">确定</view>
        </view>
      </view>
    </view>
    <view class="dialog" v-if="showAddress" @click="closeAddress">
      <view class="box">
        <view class="dialog_box animation">
          <view class="dialog_title">请选择收货地址</view>
          <view class="all">
            <view class="content-box" v-for="item in addressList" @click.stop="selectAddress(item)">
              <view class="">
                <view class="content-head">
                  <view class="user-name">{{item.cargoReceiver}}</view>
                  <view class="user-phone">{{setPhone(item.phone)}}</view>
                </view>
                <text class="address-box">
                  <text class="address-default" v-if="item.useDefault==1">默认</text>
                  <text
                    class="address-text">{{item.provinceName + ' ' + item.cityName + ' ' + item.areaName + ' ' + item.detailAddress}}</text>
                </text>
              </view>
            </view>
            <view style="height:160rpx;" v-if="addressList.length == 0">
              <view class="loading-more">
                <text class="loading-more-text">暂无收货地址</text>
              </view>
            </view>

          </view>
          <view class="add-address" @click.stop="goAddress">
            <view>去添加新地址</view>
          </view>
        </view>
      </view>
    </view>
  </view>

</template>
<script>
  import * as shipUtils from "../../../utils/ship";
  import * as utils from "@/utils/service.js";
  export default {
    data() {
      return {
        showContent: false, // 中奖详情弹窗
        showAddress: false, // 选择收货地址
        showLuckDraw: false, // 活动是否结束弹窗
        showPrize: false, // 
        showRecord: true,
        avtiveKey: 1,
        prizeList: [{
          key: 1,
          sort: 1
        }, {
          key: 2,
          sort: 2
        }, {
          key: 3,
          sort: 3
        }, {
          key: 8,
          sort: 4
        }, {
          key: null,
          sort: 5
        }, {
          key: 4,
          sort: 6
        }, {
          key: 7,
          sort: 7
        }, {
          key: 6,
          sort: 8
        }, {
          key: 5,
          sort: 9
        }],
        disableBtn: false, // 抽奖按钮禁用标识
        containerHeight: 1000,
        luckDrawData: {}, // 活动信息
        prizeFragmentList: [], // 奖品碎片列表
        realPrizeList: [], // 实物奖品列表
        receivePrizeList: [], // 领奖记录列表
        drawNumber: 0, // 抽奖次数
        winPrizeInfo: {}, // 中奖信息
        userInfo: {}, // 用户基本信息
        addressList: [], // 用户地址列表
        selectAddressItem: {}, // 选中的地址
        selectPrize: {}, // 选中的领取奖品
        adList: [], // 广告列表
        prizeFragmentParams: { // 碎片分页
          pageNum: 0,
          pageSize: 10,
          hasNextPage: true
        },
        realPrizeParams: { // 领取奖品分页
          pageNum: 0,
          pageSize: 10,
          hasNextPage: true
        },
        swiperList: [], // 轮播数据
      }
    },
    onLoad(options) {
      let that = this;
      // that.initData()
    },
    onShow() {
      let that = this
      that.initData()
    },
    methods: {
      // 关闭地址弹窗
      closeAddress() {
        let that = this
        that.showAddress = false
      },
      // 选择地址
      selectAddress(item) {
        let that = this;
        uni.showModal({
          title: '是否要选择此收货地址',
          content: item.provinceName + ' ' + item.cityName + ' ' + item.areaName + ' ' + item.detailAddress,
          success: function (res) {
            if (res.confirm) {
              that.selectAddressItem = item
              let data = {
                gameId: that.luckDrawData.sid,
                userId: that.userInfo.userId,
                prizeId: that.selectPrize.prizeId,
                mobile: item.phone,
                address: item.provinceName + ' ' + item.cityName + ' ' + item.areaName + ' ' + item
                  .detailAddress,
                userCode: that.userInfo.attrs.userCode,
                userName: that.userInfo.userName
              }
              console.log(data)
              shipUtils.newRegisterPostRequest('/cj/draw/acceptThePrize', data).then(res => {
                that.showAddress = false
                console.log(that.selectPrize)
                that.resetData()
                that.showPrize = true
                setTimeout(() => {
                  that.showContent = true
                }, 300)
                that.changeWinPrize()
              })

            }
          }
        });
      },
      // 跳转添加新地址
      goAddress() {
        let that = this
        that.showAddress = false
        uni.navigateTo({
          url: '../../my/settings/addressItems'
        })
      },
      // 手机号脱敏
      setPhone(tel) {
        if (!tel) {
          return;
        }
        tel = "" + tel;
        var ary = tel.split("");
        ary.splice(3, 4, "****");
        var tel1 = ary.join("");
        return tel1
      },
      // 领奖
      async receiveAward(item) {
        let that = this
        let userRole = uni.getStorageSync("userRole")
        if (userRole == 1) {
          let addressData = await utils.postRequest('/au/shipping/address/findVO', {})
          if (addressData.retCode == "0000000") {
            that.addressList = addressData.rspBody.items
            that.selectPrize = item
            that.showAddress = true
          }
        } else {
          let userBusinessId = that.userInfo.attrs.userBusinessId;
          console.log(userBusinessId, '用户userBusinessId')
          let addressData = await shipUtils.postRequest('/business/shipping/address/select?userBusinessId=' +
            userBusinessId, {
              userBusinessId: userBusinessId
            }, 'GET')
          if (addressData.retCode == "0000000") {
            that.addressList = addressData.rspBody
            that.selectPrize = item
            that.showAddress = true
          }
          console.log(addressData)
        }

      },
      // 关闭弹窗
      closeDialog() {
        let that = this
        that.showLuckDraw = false
      },
      // 活动结束回到上一页
      goBack() {
        let that = this
        uni.navigateBack({
          delta: 1
        });
      },
      // 初始化数据
      async initData() {
        let that = this;
        let userRole = uni.getStorageSync("userRole")
        if (userRole == 1) {
          let obj = JSON.parse(uni.getStorageSync("userInfo"))
          obj.userId = obj.userId
          that.userInfo = obj
          console.log(obj)
          console.log(that.userInfo)

        } else {
          that.userInfo = JSON.parse(uni.getStorageSync("userInfo"))
        }
        let adData = await shipUtils.postRequest("/ts/advertising/get_to_pc", {})
        if (adData.retCode == "0000000") {
          let userRole = uni.getStorageSync("userRole")
          let data = adData.rspBody
          let arr = []
          data.forEach(item => {
            if (item.advLocation == "LOTTERY_BIG" || item.advLocation == "LOTTERY_SMALL") {
              if (item.target == userRole) {
                arr.push(item)
              }
            }
          })
          that.adList = arr
          // console.log(that.adList)
        }
        let flagData = await shipUtils.newRegisterPostRequest("/cj/awards/selectStatus", {}) // 活动是否存在
        that.luckDrawData = flagData.rspBody ? flagData.rspBody : null
        if (!that.luckDrawData) {
          return
        }
        let swiperData = await shipUtils.newRegisterPostRequest('/cj/draw/getPossessPrize', { // 轮播领奖图片
          gameId: that.luckDrawData.sid,
          pageNum: 1,
          pageSize: 50
        })
        if (swiperData.retCode == "0000000") {
          console.log('活动领奖记录列表', swiperData)
          let mList = []
          let lastnameList = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王',
            '冯', '陈', '蒋', '沈', '韩', '杨',
            '朱', '秦', '尤', '许', '何', '吕', '施', '张',
            '孔', '曹', '严', '华', '金', '魏', '陶', '姜',
            '谢', '邹', '喻', '柏', '水', '章',
            '云', '苏', '潘', '葛', '奚', '范', '彭', '郎',
            '鲁', '韦', '昌', '马', '苗', '凤', '花', '方',
            '俞', '任', '袁', '柳', '鲍', '史', '唐',
            '费', '岑', '薛', '雷', '贺', '倪', '汤',
            '殷', '罗', '毕', '郝', '邬', '安', '常',
            '于', '时', '傅', '齐', '康',
            '伍', '余', '元', '卜', '顾', '孟', '平', '黄',
            '和', '穆', '萧', '尹', '姚', '邵', '汪',
            '祁', '毛', '禹', '狄', '米', '贝'
          ]
          let prizeData = await shipUtils.newRegisterPostRequest('/cj/awards/findGame', { // 轮播奖品
            sid: that.luckDrawData.sid
          })
          let prizeList = prizeData.rspBody.items[0].prizeSave.map(item => {
            return item.prizeName
          })
          let data = swiperData.rspBody.items.map(item => {
            return {
              minute: Math.floor(Math.random() * (5 - 1 + 1) + 1),
              lastname: lastnameList[Math.floor(Math.random() * (lastnameList.length))],
              prizeName: item.turntablePrizeName
            }
          })

          for (let i = 0; i < 50 - data.length; i++) {
            let obj = {
              minute: Math.floor(Math.random() * (5 - 1 + 1) + 1),
              lastname: lastnameList[Math.floor(Math.random() * (lastnameList.length))],
              prizeName: prizeList[Math.floor(Math.random() * (prizeList.length))]
            }
            mList.push(obj)
          }
          data.push(...mList)
          that.swiperList = data
          console.log(that.swiperList)
        }
        console.log("活动是否存在标识", that.luckDrawData)
        let prizeFragmentData = await shipUtils.newRegisterPostRequest("/cj/draw/prizeDebrisList", {
          gameId: that.luckDrawData.sid
        }) // 获取奖池碎片
        if (prizeFragmentData.retCode == "0000000") {
          let list = prizeFragmentData.rspBody
          let arr = []
          arr[0] = list[0]
          arr[0].key = 1
          arr[1] = list[1]
          arr[1].key = 2
          arr[2] = list[2]
          arr[2].key = 3
          arr[3] = list[7]
          arr[3].key = 8
          arr[4] = {}
          arr[5] = list[3]
          arr[5].key = 4
          arr[6] = list[6]
          arr[6].key = 7
          arr[7] = list[5]
          arr[7].key = 6
          arr[8] = list[4]
          arr[8].key = 5
          that.prizeList = arr
          console.log(that.prizeList)
        }
        let frequencyData = await shipUtils.newRegisterPostRequest("/cj/draw/drawNumber", {
          gameId: that.luckDrawData.sid,
          userId: that.userInfo.userId
        })
        if (frequencyData.retCode == "0000000") {
          that.drawNumber = frequencyData.rspBody
        }
        setTimeout(() => {
          that.getContainerHeight()
        }, 100)
      },
      // 查看广告大图
      previewImage(url) {
        let that = this
        var images = [url];
        uni.previewImage({
          urls: images,
          indicator: 'none',
          // longPressActions: {
          //   itemList: ['发送给朋友', '保存图片', '收藏'],
          //   success: function (data) {
          //     console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
          //   },
          //   fail: function (err) {
          //     console.log(err.errMsg);
          //   }
          // }
        });
      },
      // 获取容器高度
      getContainerHeight() {
        let that = this;
        uni.getSystemInfo({
          success: function (res) { // res - 各种参数
            let info = uni.createSelectorQuery().select(".all_content");
            info.boundingClientRect(function (data) { //data - 各种参数
              let height = data.height + 50
              if (res.screenHeight > height) {
                that.containerHeight = res.screenHeight
              } else {
                that.containerHeight = height
              }
            }).exec()
          }
        });
      },
      unique(arr1) {
        const res = new Map()
        return arr1.filter((item) => !res.has(item.prizeId) && res.set(item.prizeId, 1))
      },
      // 切换到抽奖记录
      async changeWinPrize() {
        let that = this
        that.showRecord = false
        console.log('切换到抽奖记录')
        let prizeFragmentData = await shipUtils.newRegisterPostRequest("/cj/draw/prizeDebrisRecordList", { // 获取奖品碎片
          userId: that.userInfo.userId,
          gameId: that.luckDrawData.sid
        })
        if (prizeFragmentData.retCode == "0000000") {
          let data = prizeFragmentData.rspBody
          console.log(data)
          let arr = that.unique(data)
          arr.forEach(item => {
            item.children = []
            data.forEach(items => {
              if (item.prizeId == items.prizeId) {
                item.children.push(items)
              }
            })
          })
          arr.forEach(item => {
            item.haveWinprize = true
            item.children.some(items => {
              if (!items.number) {
                item.haveWinprize = false
                return true
              }
            })
          })
          arr.forEach(item => {
            item.haveFragmentNum = 0
            item.children.forEach(items => {
              if (items.number) {
                item.haveFragmentNum++
              }
            })
          })
          that.realPrizeList = arr
          console.log(that.realPrizeList)
        }
        await that.getReceivedList()
        await that.getPrizeFragment()
        setTimeout(() => {
          that.getContainerHeight()
        }, 1000)
      },
      // 重置数据
      resetData() {
        let that = this
        that.prizeFragmentParams = { // 碎片分页
          pageNum: 0,
          pageSize: 10,
          hasNextPage: true
        }
        that.realPrizeParams = { // 领取奖品分页
          pageNum: 0,
          pageSize: 10,
          hasNextPage: true
        }
        that.prizeFragmentList = []
        that.receivePrizeList = []
      },
      // 切换到抽奖
      changeLuckDown() {
        let that = this
        that.resetData()
        that.showRecord = true
        setTimeout(() => {
          that.getContainerHeight()
        }, 100)
      },
      // 获取领奖记录
      async getReceivedList() {
        let that = this;
        if (!that.realPrizeParams.hasNextPage) {
          return
        }
        that.realPrizeParams.pageNum++
        let realListData = await shipUtils.newRegisterPostRequest("/cj/draw/getPossessPrize", { // 获取领奖记录奖品列表
          userId: that.userInfo.userId,
          gameId: that.luckDrawData.sid,
          pageNum: that.realPrizeParams.pageNum,
          pageSize: 10
        })
        if (realListData.retCode == "0000000") {
          that.receivePrizeList.push(...realListData.rspBody.items)
          if (!realListData.rspBody.items.length || realListData.rspBody.items.length < 10) {
            that.realPrizeParams.hasNextPage = false
          }
          return true
        } else {
          return false
        }

      },
      // 获取领取碎片记录
      async getPrizeFragment() {
        let that = this;
        if (!that.prizeFragmentParams.hasNextPage) {
          return
        }
        that.prizeFragmentParams.pageNum++
        let fragmentListData = await shipUtils.newRegisterPostRequest("/cj/draw/getPossessPrizeDebris", { // 获取抽奖记录奖品碎片列表
          userId: that.userInfo.userId,
          gameId: that.luckDrawData.sid,
          pageNum: that.prizeFragmentParams.pageNum,
          pageSize: 10
        })
        if (fragmentListData.retCode == "0000000") {
          that.prizeFragmentList.push(...fragmentListData.rspBody.items)
          if (!fragmentListData.rspBody.items.length || fragmentListData.rspBody.items.length < 10) {
            that.prizeFragmentParams.hasNextPage = false
          }
          return true
        } else {
          return false
        }
      },
      // 点击抽奖按钮
      async goLuckDown() {
        let that = this
        // console.log(that.luckDrawData.lotteryNumberType)
        // if (!that.luckDrawData.lotteryNumberType) {
        //   uni.showToast({
        //     icon: "none",
        //     title: '加载中。。。',
        //     duration: 3000
        //   })
        //   return
        // }
        if (that.drawNumber <= 0) {
          if (that.luckDrawData.lotteryNumberType == 1) {
            uni.showToast({
              icon: "none",
              title: '当前抽奖次数已用完，请明天再来！',
              duration: 3000
            })
          } else {
            uni.showToast({
              icon: "none",
              title: '本次抽奖次数已用完，感谢您的参与！',
              duration: 3000
            })
          }
          return
        }
        if (that.disableBtn) {
          return
        }
        that.disableBtn = true
        that.avtiveKey = 1
        let flagData = await shipUtils.newRegisterPostRequest("/cj/awards/selectStatus", {}) // 互动是否存在
        that.luckDrawData = flagData.rspBody ? flagData.rspBody : null
        if (!that.luckDrawData) {
          return
        }
        console.log(that.userInfo)
        let luckData = {
          gameId: that.luckDrawData.sid,
          userId: that.userInfo.userId,
          userName: that.userInfo.userName,
          userCode: that.userInfo.attrs.userCode
        }
        let res = await shipUtils.newRegisterPostRequest("/cj/draw/begin", luckData)
        console.log(luckData)
        console.log(res)
        let sid = ""
        let key = ""
        if (res.retCode == "0000000") {
          that.drawNumber--
          sid = res.rspBody.sid
          that.winPrizeInfo = res.rspBody
          console.log(res.rspBody)
        } else {
          uni.showToast({
            icon: "none",
            title: '活动火爆,请稍后再试',
            duration: 3000
          })
          that.disableBtn = false
          return false
        }
        that.prizeList.some(item => {
          if (item.sid == sid) {
            key = item.key
            return true
          }
        })
        for (let index = 0; index < 8; index++) {
          let m = index + 1
          await that.move(1, 200 - (m * 12.5))
        }
        await that.move(24, 100)
        for (let index = 0; index < 8; index++) {
          let m = index + 1
          await that.move(1, 100 + (m * 12.5))
        }
        if (key == that.avtiveKey) {
          // await that.move(8, 300)
        } else {
          await that.move(key - that.avtiveKey, 300)
        }
        setTimeout(() => {
          that.showLuckDraw = true
          setTimeout(() => {
            that.showContent = true
            that.disableBtn = false
          }, 200)
        }, 500)
      },
      // 转盘启动
      move(sum, speed) {
        let that = this
        let timer
        let num = 0
        return new Promise((resolve, reject) => {
          timer = setInterval(() => {
            num++
            if (that.avtiveKey > 7) {
              that.avtiveKey = 1
            } else {
              that.avtiveKey++
            }
            if (num == sum) {
              clearInterval(timer)
              timer = null
              resolve()
            }
          }, speed)
        })

      },
    },
  }
</script>
<style lang="scss" scoped>
  @keyframes mymove {
    from {
      top: 0;
    }

    to {
      top: -1800rpx;
    }
  }

  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    background: rgba(0, 0, 0, 0.7);


    .add-address {
      width: 100%;
      text-align: center;
      padding: 0 30rpx;
      box-sizing: border-box;

      view {
        color: #fff;
        line-height: 80rpx;
        border-radius: 40rpx;
        background-color: #FF7D4A;
      }
    }

    .all {
      padding-bottom: 150rpx;
      height: 400rpx;
      overflow-y: scroll;

      .content-box {
        background-color: #fff;
        margin-top: 10rpx;
        padding: 30rpx 40rpx;
        display: flex;
        align-items: center;

        .content-head {
          display: flex;
          align-items: center;

          .user-name {
            font-size: 32rpx;
            color: #333;
            margin-right: 40rpx;
          }

          .user-phone {
            color: #777;
            font-size: 28rpx;
          }
        }

        .address-box {
          margin-top: 12rpx;
          display: flex;
          align-items: center;
          width: 100%;
          line-height: 40rpx;

          .address-default {
            background-color: #FF7D4A;
            border-radius: 4rpx;
            color: #fff;
            font-size: 24rpx;
            padding: 3rpx 10rpx;
            margin-right: 2rpx;
          }

          .address-text {
            color: #777;
            font-size: 28rpx;
          }
        }

        .editor-box {
          width: 150rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .editor-img {
            width: 40rpx;
            height: 44rpx;
          }
        }
      }



      .loading-more {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px 0;
        text-align: center;
        flex-direction: row;

        .loading-more-text {
          font-size: 28upx;
          color: #999;
        }
      }
    }

    .gif_image {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      width: 100vw;
      height: 800rpx;
    }

    .box {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;

      .dialog_box {
        width: 500rpx;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border-radius: 20rpx;
        box-sizing: border-box;
        padding-top: 20rpx;
        padding-bottom: 40rpx;
        transform: scale(0);
        opacity: 0;
        transition: all 0.3s;

        .dialog_title {
          width: 100%;
          text-align: center;
          font-size: 36rpx;
          color: #000000;
        }

        .btn {
          width: 260rpx;
          height: 80rpx;
          margin: 0 auto;
          text-align: center;
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          background: #FDE101;
          color: #D5461A;
          line-height: 80rpx;
          border-radius: 25rpx;
        }

        .line {
          width: 100%;
          height: 2rpx;
          background: #F1F1F1;
        }

        .dialog_content {
          padding-top: 20rpx;
          line-height: 22px;
          padding: 0rpx 50rpx 28rpx 50rpx;
          margin-top: 36rpx;
          margin-bottom: 28rpx;
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
        }


        .dialog_image {
          margin-top: 30rpx;
          width: 200rpx;
          height: 200rpx;
        }

        .image_name {
          margin-top: 30rpx;
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #D05617;
        }
      }

      .animation {
        transform: scale(1);
        opacity: 1;
      }
    }

  }

  .container {
    position: relative;
    overflow: hidden;

    .rule {
      position: fixed;
      top: 108rpx;
      z-index: 10;
      right: 0;
      width: 114rpx;
      height: 64rpx;
      background: #FFFFFF;
      box-shadow: 0px 0px 6px 0px rgba(104, 8, 3, 0.75);
      border-top-left-radius: 34rpx;
      border-bottom-left-radius: 34rpx;
      text-align: center;
      line-height: 64rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #D91111;
    }

    .all_content {
      position: relative;



      .received_container {
        width: 100%;
        text-align: center;
        padding: 0 36rpx;
        box-sizing: border-box;

        .received_image_container {
          position: relative;

          .received_image {
            margin-top: 32rpx;
            width: 192rpx;
            height: 62rpx;
          }

          .received_title {
            margin-top: 12rpx;
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }



        .received_list {
          margin-top: -10rpx;
          width: 680rpx;
          background: #FFF9D3;
          box-shadow: 0 0 22rpx 0px rgba(170, 17, 17, 0.44);
          border-radius: 8rpx;
          border: 2rpx solid;
          border-image: linear-gradient(180deg, rgba(213, 70, 26, 1), rgba(252, 222, 99, 1)) 1 1;
          box-sizing: border-box;
          padding: 24rpx 24rpx 24rpx 24rpx;

          .received_loading {
            width: 100%;
            text-align: center;
            font-size: 26rpx;
          }

          .received_content {
            .received_item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 26rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            .task_id {
              width: 100%;
              text-align: right;
              margin-top: 16rpx;
              box-sizing: border-box;
              padding-right: 28rpx;
              font-size: 26rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            .received_line {
              padding: 0 20rpx;
              margin: 20rpx 0;
              box-sizing: border-box;

              view {
                width: 100%;
                height: 2rpx;
                border-bottom: 2rpx dashed #DACF8A;
              }
            }
          }

        }
      }

      .bottom_ad_container {
        width: 100vw;
        text-align: center;

        .bottom_ad {
          // box-shadow: 0 2px 5px 0;
          margin-top: 34rpx;
          width: 680rpx;
          height: 160rpx;
        }
      }

      .bottom_btn {
        display: flex;
        justify-content: space-between;
        padding: 0 80rpx;
        box-sizing: border-box;

        .rule_btn {
          width: 240rpx;
          height: 98rpx;
          border-radius: 16rpx;
          border: 6rpx solid #FDE101;
          box-sizing: border-box;
          color: #FDE101;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .right_btn {
          width: 240rpx;
          height: 98rpx;
          border-radius: 16rpx;
          background: #FDE101;
          color: #D5461A;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .jackpot_container {
        margin-top: 30rpx;
        width: 100%;
        padding: 0 16rpx;
        box-sizing: border-box;
        position: relative;
        height: 720rpx;

        .jackpot {
          position: absolute;
          top: 22rpx;
          left: 0;
          right: 0;
          margin: 0 auto;
          z-index: 1;
          width: 678rpx;
          height: 664rpx;
          background: #FD5F2F;
          box-shadow: 0px 8rpx 24rpx 0px rgba(113, 5, 5, 0.48);
          border-radius: 0px 0px 50rpx 50rpx;
          display: flex;
          justify-content: center;
          align-items: center;

          .inner_bg {
            width: 630rpx;
            height: 604rpx;
            background: #D72B01;
            border-radius: 32rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            .inner_prize {
              width: 591rpx;
              height: 558rpx;
              border-radius: 32rpx;
              padding-top: 16rpx;
              box-sizing: border-box;
              background: #F07C46;

              .prize_info {
                width: 100%;
                height: 100%;
                overflow-y: scroll;
                padding-top: 18rpx;
                padding-left: 34rpx;
                box-sizing: border-box;

                .prize_info_item {
                  margin-bottom: 24rpx;
                  display: flex;
                  align-items: center;

                  .have_prize {
                    background: #37CA7C !important;
                  }

                  .left_prize {
                    width: 190rpx;
                    height: 150rpx;
                    box-sizing: border-box;
                    background: #FFFFFF;
                    border-radius: 30rpx;
                    border: 4rpx solid #FDE101;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;

                    .receive_btn {
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      width: 148rpx;
                      height: 66rpx;
                      background: #FDE101;
                      border-radius: 34rpx;
                      border: 4rpx solid #F38E15;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    }

                    .left_prize_image {
                      width: 116rpx;
                      height: 84rpx;
                    }

                    .prize_num {
                      position: absolute;
                      right: 12rpx;
                      bottom: 6rpx;
                      font-size: 26rpx;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #333333;
                      line-height: 36rpx;
                      letter-spacing: 1px;
                    }
                  }

                  .right_prize {
                    height: 140rpx;
                    margin-left: 10rpx;
                    width: 360rpx;
                    display: flex;
                    justify-content: flex-start;
                    overflow-x: scroll;
                    align-items: center;

                    .no_have_prize {
                      filter: grayscale(100%);
                      filter: gray;
                    }

                    .right_prize_item {
                      width: 154rpx;
                      height: 140rpx;
                      margin-right: 20rpx;
                      position: relative;
                      background: #F0B6A7;
                      border-radius: 30rpx;



                      .right_prize_item_inner {
                        width: 154rpx;
                        height: 128rpx;
                        background: #FFF2ED;
                        border-radius: 30rpx;
                        position: relative;

                        .right_prize_item_image {
                          width: 100rpx;
                          height: 100rpx;
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                        }

                        .prize_num {
                          position: absolute;
                          right: 18rpx;
                          bottom: 16rpx;
                          font-size: 26rpx;
                          font-family: PingFangSC-Regular, PingFang SC;
                          font-weight: 400;
                          color: #333333;
                          line-height: 36rpx;
                          letter-spacing: 1px;
                        }
                      }
                    }
                  }
                }

              }
            }

            .inner_bg2 {
              width: 591rpx;
              height: 558rpx;
              border-radius: 32rpx;
              padding-top: 16rpx;
              box-sizing: border-box;
              background: #F07C46;
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;



              .prize_item {
                width: 190rpx;
                height: 164rpx;
                background: #F0B6A7;
                border-radius: 30rpx;
                overflow: hidden;
              }

              .prize_btn {
                width: 190rpx;
                height: 164rpx;
                margin-left: 11.5rpx;
                margin-right: 11.5rpx;
                background: #FFA200;
                border-radius: 30rpx;
                box-shadow: 0px 1px 11px 1px #FDE17D;

                .prize_btn_inner {
                  width: 190rpx;
                  height: 142rpx;
                  border-radius: 30rpx;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: #FDE101;
                  text-align: center;

                  .btn_text {
                    margin-top: 26rpx;
                    width: 160rpx;
                    height: 36rpx;
                  }

                  .btn_quantity {
                    margin-left: 4rpx;
                    text-align: center;
                    font-size: 28rpx;
                    width: 154rpx;
                    height: 48rpx;
                    background: #D5461A;
                    color: #FFFFFF;
                    border-radius: 30rpx;
                    margin-top: 12rpx;
                    line-height: 48rpx;
                  }
                }
              }

              .prize_item_center {
                margin-left: 11.5rpx;
                margin-right: 11.5rpx;
                width: 190rpx;
                height: 164rpx;
                background: #F0B6A7;
                border-radius: 30rpx;
                overflow: hidden;
              }

              .inner_item {
                width: 190rpx;
                height: 142rpx;
                border-radius: 30rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #FFF2ED;
                text-align: center;
                box-sizing: border-box;

                .inner_image {
                  width: 76rpx;
                  height: 76rpx;
                }

                .inner_text {
                  margin-top: 6rpx;
                  font-size: 28rpx;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #D05617;
                  line-height: 32rpx;
                }
              }

              .inner_item_active {
                background: #FFF800;
                border: 6rpx solid #ED3030;
              }
            }
          }
        }

        .top_bg {
          border-radius: 8rpx;
          width: 100%;
          height: 40rpx;
          background: #FFA889;
          padding: 12rpx 8rpx;
          box-sizing: border-box;

          .top_bg_2 {
            border-radius: 6rpx;
            width: 100%;
            height: 100%;
            background: #EB7E5D;
          }
        }

      }

      .win_prize_list_container {
        overflow: hidden;
        height: 144rpx;
        margin-top: 16rpx;

        .seamless_scroll {
          width: 614rpx;
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation: mymove 40s infinite linear;

          .win_prize_item {
            width: 100%;
            padding: 4rpx 70rpx;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            height: 36rpx;
            font-size: 26rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FDE101;
            line-height: 36rpx;

            .time {}
          }
        }
      }




      .top_ad_container {
        width: 100vw;
        text-align: center;
        padding-top: 244rpx;

        .top_ad {
          box-shadow: 0 2px 5px 0;
          width: 680rpx;
          height: 160rpx;
        }
      }
    }

    .bg {
      position: absolute;
      width: 100%;
      height: 3654rpx;
      z-index: -1;
    }

  }
</style>