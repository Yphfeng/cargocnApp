<template>
  <view class="cardHolder" v-if="fleetInfo">
    <view class="fleet-img-box">
      <view class="fleetHeadBox" :style="fleetHeadBoxStyle">
        <view></view>
        <view class="headRight">
          <view class="settingWhole" @click="jumpToFleetSetting">
            <image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/setting.png" class="setting"></image>
          </view>
        </view>
      </view>
      <image class="fleet-img" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/appImgs/fleetimg.png"></image>
    </view>
    <view class="fleet-info-box">
      <view class="info-head">
        <view class="info-img-box">
          <image class="info-img"
            :src="userInfo.attrs.avatar ? userInfo.attrs.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/goodsDelivery/fleet-head.png'">
          </image>
        </view>
        <view class="fans-box">
          <view class="cardName">{{userInfo.attrs.nickName}}的名片夹</view>
          <view class="addBtn" @click="toInvitation">邀请</view>
        </view>
      </view>
      <view class="cardMsgBox">
        <view class="listNum">成员{{fleetInfo.memberNum}}人</view>
        <view class="mapBtn" @click="goFleetMap">
          <image class="btnIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/mapIcon.png" />
          <view class="btnMsg">定位地图</view>
        </view>
      </view>
      <view class="showSelectList">
        <view class="selectBtn" @click="showSelectPopup(1)">
          <view class="msg" :style="selectCityParams.name ? 'color:#4A83EF;' : 'color:#333;'">
            {{selectCityParams.name ? showSettingAddress(selectCityParams.name, 6) : '地区'}}
          </view>
          <image class="icon"
            :src="selectCityParams.name ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/checkDown.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/defaultDown.png'">
          </image>
        </view>
        <view class="selectBtn" @click="showSelectPopup(3)">
          <view class="msg" :style="searchData.startAddress ? 'color:#4A83EF;' : 'color:#333;'">
            {{searchData.startAddress ? searchData.startAddress : '常跑始发'}}
          </view>
          <image class="icon"
            :src="searchData.startAddress ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/checkDown.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/defaultDown.png'">
          </image>
        </view>
        <view class="selectBtn" @click="showSelectPopup(4)">
          <view class="msg" :style="searchData.endAddress ? 'color:#4A83EF;' : 'color:#333;'">
            {{searchData.endAddress ? searchData.endAddress : '常跑目的'}}
          </view>
          <image class="icon"
            :src="searchData.endAddress ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/checkDown.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/defaultDown.png'">
          </image>
        </view>
      </view>
      <view class="cardListBox" v-for="(item,index) in cardUserList" :key="index">
        <view class="cardContent">
          <image class="cardHolderListBc"
            :src="item.styleImg ? item.styleImg : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/cardHolderListBc.png'" />
          <view class="contentMsgBox">
            <view class="leftContent">
              <view class="username">{{item.nickname ? item.nickname : item.userName}}</view>
              <view class="mainMsg" v-if="item.carSourceObj">开<text
                  class="lightMsg">{{item.carSourceObj.carLength}}米{{item.carSourceObj.carModel}}</text></view>
              <view class="mainMsg" v-else><text class="lightMsg"></text></view>
              <view class="mainMsg" v-if="item.carSourceObj">找<text
                  class="lightMsg">{{item.carSourceObj.sender}}-{{item.carSourceObj.receiver}}</text>长期货源</view>
              <view class="mainMsg" v-else><text class="lightMsg"></text></view>
              <view class="subMsg ">{{item.motto}}</view>
              <view class="subMsg" style="width: 440rpx">
                <image class="locationIcon"
                  src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/locationIcon.png" />
                <text class="msg text_overflow"
                  v-if="item.provinceName">{{item.provinceName + ' ' + item.cityName + ' ' + item.areaName}}</text>
                <text class="msg text_overflow" v-else>暂无</text>
                <text class="msg" style="width: 110rpx">{{item.dataSrc}}分钟前</text>
              </view>
            </view>
            <view class="rightContent">
              <view class="avatarBox">
                <view class="userAvatarBox">
                  <image class="userAvatar"
                    :src="item.avatar ? item.avatar : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png'" />
                </view>
                <image class="vipIcon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/vipIcon.png" />
              </view>
              <view class="detailsBtn" @click="goUserDetails(item)">
                <view class="msg">详情</view>
                <image class="icon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/arrowIcon.png" />
              </view>
            </view>
          </view>
        </view>
        <view class="carBtnGroup">
          <view class="btnBox" @click="toTrackSimple(item)">
            <image class="icon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/trajectoryIcon.png" />
            <view class="msg">轨迹</view>
          </view>
          <view class="btnBox" @click="makePhoneCall(item)">
            <image class="icon" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/callIcon.png" />
            <view class="msg">电话</view>
          </view>
        </view>
      </view>
      <view class="no_nextPage">没有更多了</view>
    </view>
    <uni-popup ref="selectPop" type="top">
      <view class="sourceSelectBox" style="popupPaddingTop">
        <view class="selectHead">
          <view class="selectBox" @click="showPopupDetails(1)">
            <view class="msg" :style="popupDetails == 1 ? 'color: #3489E9;width: 110rpx' : 'color: #333;width: 110rpx'">
              {{popupCityParams.name ? popupCityParams.name : '地区'}}
            </view>
            <image :class="popupDetails == 1 ? 'selectIcon toRolate' : 'selectIcon'"
              :src="popupDetails == 1 ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/checkDown.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/defaultDown.png'">
            </image>
          </view>
          <view class="selectBox" @click="showPopupDetails(3)">
            <view class="msg" :style="popupDetails == 3 ? 'color:#4A83EF;' : 'color:#333;'">
              {{searchData.startAddress ? searchData.startAddress : '常跑始发'}}
            </view>
            <image :class="popupDetails == 3 ? 'selectIcon toRolate' : 'selectIcon'"
              :src="popupDetails == 3 ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/checkDown.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/defaultDown.png'">
            </image>
          </view>
          <view class="selectBox" @click="showPopupDetails(4)">
            <view class="msg" :style="popupDetails == 4 ? 'color:#4A83EF;' : 'color:#333;'">
              {{searchData.endAddress ? searchData.endAddress : '常跑目的'}}
            </view>
            <image :class="popupDetails == 4 ? 'selectIcon toRolate' : 'selectIcon'"
              :src="popupDetails == 4 ? 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/checkDown.png' : 'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/newIndex/defaultDown.png'">
            </image>
          </view>
        </view>
        <view class="selectBody" v-if="popupDetails == 1">
          <view class="selectTitleItem">
            <view class="title">省份</view>
            <view class="title">城市</view>
          </view>
          <view class="selectAddressBox">
            <scroll-view class="province-item" style="flex: 0 0 260rpx;" :scroll-y="true" :show-scrollbar="false">
              <view class="selectMsg" v-for="(item,index) in provinceArr" :key="index"
                @click="switchProIndex(item,index)">
                <image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
                  v-if="selectedProvinceIndex == index"></image>
                <text class="msg" :style="selectedProvinceIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">
                  {{replaceProvince(item.name)}}
                </text>
              </view>
            </scroll-view>
            <scroll-view class="province-item" :scroll-y="true" :show-scrollbar="false">
              <view class="selectMsg" v-for="(item,index) in cityArr" :key="index" @click="switchCityIndex(item,index)">
                <image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
                  v-if="selectedCityIndex == index"></image>
                <text class="msg" :style="selectedCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">
                  {{item.showName ? item.showName : item.name}}
                </text>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="selectBody" v-if="popupDetails == 3">
          <view class="selectTitleItem">
            <view class="title">省份</view>
            <view class="title">城市</view>
          </view>
          <view class="selectAddressBox">
            <scroll-view class="province-item" style="flex: 0 0 260rpx;" :scroll-y="true" :show-scrollbar="false">
              <view class="selectMsg" v-for="(item,index) in provinceArr" :key="index"
                @click="switchStartProIndex(index)">
                <image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
                  v-if="selectedStartProIndex == index"></image>
                <text class="msg" :style="selectedStartProIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">
                  {{replaceProvince(item.name)}}
                </text>
              </view>
            </scroll-view>
            <scroll-view class="province-item" :scroll-y="true" :show-scrollbar="false">
              <view class="selectMsg" v-for="(item,index) in cityArr" :key="index" @click="switchStartCityIndex">
                <image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
                  v-if="selectedStartCityIndex == index"></image>
                <text class="msg" :style="selectedStartCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">
                  {{item.showName ? item.showName : item.name}}
                </text>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="selectBody" v-if="popupDetails == 4">
          <view class="selectTitleItem">
            <view class="title">省份</view>
            <view class="title">城市</view>
          </view>
          <view class="selectAddressBox">
            <scroll-view class="province-item" style="flex: 0 0 260rpx;" :scroll-y="true" :show-scrollbar="false">
              <view class="selectMsg" v-for="(item,index) in provinceArr" @click="switchEndProIndex(index)">
                <image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
                  v-if="selectedEndProIndex == index"></image>
                <text class="msg" :style="selectedEndProIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">
                  {{replaceProvince(item.name)}}
                </text>
              </view>
            </scroll-view>
            <scroll-view class="province-item" :scroll-y="true" :show-scrollbar="false">
              <view class="selectMsg" v-for="(item,index) in cityArr" @click="switchEndCityIndex(index)">
                <image class="check" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/ship/car_source_check.png"
                  v-if="selectedEndCityIndex == index"></image>
                <text class="msg" :style="selectedEndCityIndex == index ? 'color: #2B72F0;' : 'color: #333333;'">
                  {{item.showName ? item.showName : item.name}}
                </text>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="pop-btn">
          <view class="pop-btn-item reset" @click="toResetSelectData">重置</view>
          <view class="pop-btn-item look" @click="toSelectSouce">查看</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
  import * as utils from "@/utils/ship.js";
  export default {
    data() {
      return {
        popupPaddingTop: '',
        fleetHeadBoxStyle: '',
        userInfo: {},
        searchData: {
          startAddress: '',
          endAddress: ''
        },
        isNextPage: true,
        provinceArr: [],
        cityArr: [],
        selectedProvinceIndex: 0,
        selectedCityIndex: -1,
        selectedStatusIndex: '',
        popupDetails: 1,
        popupCityParams: {},
        selectCityParams: {},
        selectedStartProIndex: 0,
        selectedStartCityIndex: -1,
        startCodeParams: {},
        selectedEndProIndex: 0,
        selectedEndCityIndex: -1,
        endCodeParams: {},
        fleetInfo: null,
        searchParams: {},
        cardUserList: [],
        pageNum: 1,
        pageSize: 10,
        userListTotal: 0
      }
    },
    async onLoad() {
      let that = this
      var userInfo = uni.getStorageSync("userInfo");
      that.popupPaddingTop = 'padding-top:100px'
      that.fleetHeadBoxStyle = 'top: 100px; height: 100px;widht: 100px'
      that.userInfo = JSON.parse(userInfo)
      that.getProvince();
      let params = {
        currentUserCode: that.userInfo.attrs.userCode,
        isMyFleet: 1,
        isCardFleet: 1,
        isOwner: 1,
        pageNum: 1,
        pageSize: that.pageSize
      }
      let fleetList = await utils.postRequest('/cd/fleet/list', params)
      if (fleetList.rspBody.items.length) {
        that.fleetInfo = fleetList.rspBody.items[0]
      }
      this.getList()
    },
    async onShow() {
      // let that = this
      // if (getApp().globalData.refreshMethods.MPJList_getMyMPJList) {
      //   getApp().globalData.refreshMethods.MPJList_getMyMPJList = 0
      // let params = {
      //   currentUserCode: that.userInfo.attrs.userCode,
      //   isMyFleet: 1,
      //   isCardFleet: 1,
      //   isOwner: 1,
      //   pageNum: 1,
      //   pageSize: that.pageSize
      // }
      // let fleetList = await utils.postRequest('/cd/fleet/list', params)
      // if (fleetList.rspBody.items.length) {
      //   that.fleetInfo = fleetList.rspBody.items[0]
      // }
      // that.toResetSelectData()
      // that.toSelectSouce()
      // }
    },
    async onPullDownRefresh() {
      let that = this
      let params = {
        currentUserCode: that.userInfo.attrs.userCode,
        isMyFleet: 1,
        isCardFleet: 1,
        isOwner: 1,
        pageNum: 1,
        pageSize: that.pageSize
      }
      let fleetList = await utils.postRequest('/cd/fleet/list', params)
      if (fleetList.rspBody.items.length) {
        that.fleetInfo = fleetList.rspBody.items[0]
      }
      that.toResetSelectData()
      that.toSelectSouce()
    },
    methods: {
      showSettingAddress(str, stbstrNum) {
        var msg = str ? str.substring(0, stbstrNum) : '';
        return msg;
      },
      showSelectPopup(val) {
        let flag = val;
        this.popupDetails = flag
        this.$refs.selectPop.open()
      },
      async getProvince() { // 从本地缓存获取省市区数据，本地缓存没有则从接口获取，再存入缓存
        let that = this;
        // try {
        var res = await utils.postRequest("/ts/nationDict/getBasicData", {}, 'POST', false)
        if (res.retCode == "0000000") {
          that.provinceArr = res.rspBody
          console.log(this.provinceArr)
          that.pushDiyCityItem(that.provinceArr[0].code, that.provinceArr[0].name, 0);
          uni.setStorage({
            key: 'regionData',
            data: res.rspBody,
            success: function (saveRes) {},
            fail: function (saveErr) {}
          });
        }
      },
      pushDiyCityItem(provinceCode, provinceName, index) { // 根据传入的省或市code判断塞入 全市/全省
        var cities = this.provinceArr[index].cities;
        if (provinceCode == '310000' || provinceCode == '110000' || provinceCode == '500000' || provinceCode ==
          '120000') {
          let isHaveProvinceName = false
          cities.some(item => {
            if (item.showName == '全市') {
              isHaveProvinceName = true
              return true
            }
          })
          if (!isHaveProvinceName) {
            cities.unshift({
              name: provinceName,
              showName: '全市',
              code: provinceCode
            });
          }
        } else {
          let isHaveProvinceName = false
          cities.some(item => {
            if (item.showName == '全省') {
              isHaveProvinceName = true
              return true
            }
          })
          if (!isHaveProvinceName) {
            cities.unshift({
              name: provinceName,
              showName: '全省',
              code: provinceCode
            });
          }
        }
        this.cityArr = cities
      },
      // 选择开始地区
      switchStartProIndex(val) {
        let that = this
        let index = val;
        var provinceCode = this.provinceArr[index].code;
        var provinceName = this.provinceArr[index].name;
        that.selectedStartProIndex = index
        that.selectedStartCityIndex = -1
        this.pushDiyCityItem(provinceCode, provinceName, index);
      },
      // 选择开始市
      switchStartCityIndex(val) {
        let that = this
        let index = val;
        let startCodeParams = {
          code: this.cityArr[index].code,
          name: this.cityArr[index].name,
        }
        this.selectedStartCityIndex = index
        this.startCodeParams = startCodeParams
        this.searchData.startAddress = startCodeParams.name
      },
      // 选择结束地区
      switchEndProIndex(val) {
        let that = this
        let index = val;
        var provinceCode = this.provinceArr[index].code;
        var provinceName = this.provinceArr[index].name;
        that.selectedEndProIndex = index
        that.selectedEndCityIndex = -1
        this.pushDiyCityItem(provinceCode, provinceName, index);
      },
      // 选择结束市
      switchEndCityIndex(val) {
        let that = this
        let index = val;
        let endCodeParams = {
          code: this.cityArr[index].code,
          name: this.cityArr[index].name,
        }
        this.selectedEndCityIndex = index
        this.endCodeParams = endCodeParams
        this.searchData.endAddress = endCodeParams.name
      },
      switchProIndex(val,index) { // 选择省
        // let index = val;
        if (index == this.selectedProvinceIndex) return;
        this.selectedProvinceIndex = index
        this.selectedCityIndex = -1
        //切换城市
        var provinceCode = this.provinceArr[index].code;
        var provinceName = this.provinceArr[index].name;
        this.pushDiyCityItem(provinceCode, provinceName, index);
      },
      switchCityIndex(val,index) { // 选择市
        // let index = val;
        this.popupCityParams = {
          code: this.cityArr[index].code,
          name: this.cityArr[index].name,
        }
        this.selectedCityIndex = index
        // this.popupCityParams = this.popupCityParams
        // this.setData({
        //   selectedCityIndex: index,
        //   popupCityParams: this.data.popupCityParams
        // })
      },
      switchStatus(val) { // 选择接单状态
        let flag = val;
        this.selectedStatusIndex = flag
      },
      closeSourceSelectPopup() {
        this.$refs.selectPop.close()
      },
      toResetSelectData() { // 重置选择的省市区
        this.isNextPage = true
        if (this.selectedCityIndex != -1) { // 选择过市才重置
          this.selectedProvinceIndex = 0;
          this.selectedCityIndex = -1;
          this.pushDiyCityItem(this.provinceArr[0].code, this.provinceArr[0].name, 0);
          this.popupCityParams = {};
        }
        this.selectedStatusIndex = ''
        this.selectedStartProIndex = 0
        this.selectedStartCityIndex = -1
        this.startCodeParams = {}
        this.selectedEndProIndex = 0
        this.selectedEndCityIndex = -1
        this.endCodeParams = {}
        this.searchData = {
          startAddress: '',
          endAddress: ''
        }
        // this.selectedProvinceIndex = this.data.selectedProvinceIndex 
        // this.setData({
        // selectedStatusIndex: '',
        // selectedProvinceIndex: this.data.selectedProvinceIndex,
        // selectedCityIndex: this.data.selectedCityIndex,
        // popupCityParams: this.data.popupCityParams,
        // selectedStartProIndex: 0,
        // selectedStartCityIndex: -1,
        // startCodeParams: {},
        // selectedEndProIndex: 0,
        // selectedEndCityIndex: -1,
        // endCodeParams: {},
        // searchData: {
        // startAddress: '',
        // endAddress: ''
        // },
        // })
      },
      toSelectSouce() { // 保存省市区数据
        this.isNextPage = true
        this.pageNum = 1
        this.cardUserList = []
        if (this.selectedCityIndex == -1) {
          this.selectCityParams = {}
        } else {
          let code = this.cityArr[this.selectedCityIndex].code;
          let name = '';
          switch (code) {
            case '310000':
              name = '上海市';
              break;
            case '110000':
              name = '北京市';
              break;
            case '500000':
              name = '重庆市';
              break;
            case '120000':
              name = '天津市';
              break;
            default:
              name = this.cityArr[this.selectedCityIndex].name;
              break;
          }
          this.selectCityParams = {
            code: this.cityArr[this.selectedCityIndex].code,
            name: name,
          }
        }
        // this.setData({
        //   selectCityParams: this.data.selectCityParams,
        // })
        this.$refs.selectPop.close()
        this.getList('pullType')
      },
      replaceProvince(name) { // 去除省的，省、市、自治区、维吾尔、壮族、回族
        let returnName = name.replace('省', '');
        returnName = returnName.replace('市', '');
        returnName = returnName.replace('自治区', '');
        returnName = returnName.replace('维吾尔', '');
        returnName = returnName.replace('壮族', '');
        returnName = returnName.replace('回族', '');
        return returnName;
      },
      showPopupDetails(val) { // 切换popup展示
        let flag = val;
        this.popupDetails = flag;
      },
      toInvitation() {
        let that = this
        uni.navigateTo({
          url: '/pages/goodsDelivery/fleet/fleetDetails/memberInvitation/memberInvitation?info=' + JSON.stringify(
            this.fleetInfo),
        })
      },
      getNextPage() {
        let that = this
        if (that.isNextPage) {
          let num = that.pageNum + 1
          that.pageNum = num
          that.getList()
        }
      },
      async getList(type) {
        let that = this
        let data = {
          fleetId: that.fleetInfo.id,
          pageNum: that.pageNum,
          pageSize: 10,
          source: 1,
          status: 1,
          // "userIdList": this.selectUserIdInfo && this.selectUserIdInfo.length > 0 ? this.selectUserIdInfo : undefined,
          // "provinceName": this.selectedCityIndex == 0 && this.selectCityParams.name ? this.selectCityParams.name : undefined,
          // "cityName": this.selectedCityIndex > 0 && this.selectCityParams.name ? this.selectCityParams.name : undefined,
        }
        let userIdList = []
        if (that.startCodeParams.code || that.endCodeParams.code) {
          let params = {
            receiver: that.endCodeParams.name,
            receiverCode: that.endCodeParams.code,
            sender: that.startCodeParams.name,
            fleetId: that.fleetInfo.id,
            senderCode: that.startCodeParams.code,
            source: 2,
            pageNum: 1,
            pageSize: 1
          }
          let idListRes = await utils.postRequest('/olnanas/recommend/getCarSourceBySender', params)
          if (idListRes.rspBody.carSourceVOS) {
            userIdList = idListRes.rspBody.carSourceVOS.map(item => {
              return item.userId
            })
            data.userIdList = userIdList
          }
        }
        if (that.selectCityParams.code) {
          data.provinceName = that.provinceArr[that.selectedProvinceIndex].name
          data.cityName = that.selectCityParams.name
        }
        let res = await utils.postRequest('/cd/fleetWithUser/list', data)
        let memberList = res.rspBody.items
        let sidList = []
        memberList.forEach(item => {
          if (item.carsourceSid) {
            sidList.push(item.carsourceSid)
          }
        })
        let carSource = await utils.postRequest('/olnanas/businessCarSource/getBusinessCarSourceBySid', {
          carSourceSids: sidList
        })
        let carSourceList = []
        if (carSource.rspBody.carSourceVOS) {
          carSourceList = carSource.rspBody.carSourceVOS
        }
        carSourceList.forEach(item => {
          memberList.some(items => {
            if (items.carsourceSid == item.sid) {
              items.carSourceObj = item
              return true
            }
          })
        })
        if (memberList.length < 10) {
          // that.setData({
          //   isNextPage: false
          // })
          that.isNextPage = false
        }
        let allList = that.cardUserList.concat(memberList)
        that.cardUserList = allList
        that.userListTotal = res.rspBody.total
        console.log(allList)
        if (type == 'pullType') {
          uni.stopPullDownRefresh()
        }
      },
      goUserDetails(item) {
        let that = this
        let userId = item.userId
        uni.navigateTo({
          url: '/pages/cardShow/businessCardShow?type=details&userId=' + userId
        })
      },
      jumpToFleetSetting() {
        uni.navigateTo({
          url: '/pages/goodsDelivery/fleet/fleetDetails/fleetSetting/fleetSetting?info=' + JSON.stringify(this.data
            .fleetInfo) + '&isMPJ=1'
        })
      },
      goFleetMap() {
        var fleetId = this.fleetInfo.id;
        var name = this.fleetInfo.name;
        uni.navigateTo({
          url: '/pages/goodsDelivery/fleet/fleetMap/fleetMap?fleetId=' + fleetId + '&name=' + name,
        })
      },
      makePhoneCall(item) {
        // var item = e.currentTarget.dataset.item;
        uni.makePhoneCall({
          phoneNumber: item.displayMobile ? item.displayMobile : item.mobile //仅为示例
        });
        utils.publicData.addBuried("超级车队拨打电话")
      },
      toTrackSimple(e) {
        var item = e
        if (!utils.btnRepeat()) return;
        var obj = this.getPickerArr();
        var dateTimeArray = obj.dateTimeArray;
        var endTimeArray = obj.dateTimeArray;
        var dateTime = obj.dateTime;
        var startTime = [dateTime[0], dateTime[1], dateTime[2], 0, 0];
        var endTime = [dateTime[0], dateTime[1], dateTime[2], 23, 59];
        //获取当前日期

        var dateTime = this.createTimeStr(dateTimeArray, startTime);
        var endTime = this.createTimeStr(endTimeArray, endTime);
        uni.navigateTo({
          url: '/pages/goodsDelivery/fleet/fleetTrack/fleetTrack?index=0&dateTime=' + dateTime + '&endTime=' +
            endTime + '&selectedMapItem=' + JSON.stringify(item)
        })
      },
      createTimeStr(dateTimeArray, dateTime) {
        let timeStr = dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[1][dateTime[1]] + '-' + dateTimeArray[2][
          dateTime[2]
        ] + ' ' + dateTimeArray[3][dateTime[3]] + ":" + dateTimeArray[4][dateTime[4]];
        console.log(timeStr)
        return timeStr
      },
      //获取日期的picker显示
      getPickerArr(date) {
        // 获取完整的年月日 时分秒，以及默认显示的数组
        let datenow = new Date();
        let endYear = datenow.getFullYear();
        let obj = utils.dateTimePicker(this.startYear, endYear, date);
        // 精确到分的处理，将数组的秒去掉
        let lastArray = obj.dateTimeArray.pop();
        let lastTime = obj.dateTime.pop();
        return obj
      },
    },
  }
</script>
<style lang="scss">
  .cardHolder {
    min-height: 100vh;
    background-color: #FFF;
    padding-bottom: 166rpx;

    .fleet-img-box {
      position: relative;

      .fleetHeadBox {
        position: absolute;
        padding-left: 32rpx;
        padding-right: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 99;
        box-sizing: border-box;
      }

      .headRight {
        display: flex;
        align-items: center;
      }

      .settingWhole {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 62rpx;
        height: 62rpx;
      }

      .setting {
        width: 36rpx;
        height: 36rpx;
      }

      .fleet-img {
        width: 750rpx;
        height: 350rpx;
      }
    }

    .fleet-info-box {
      margin-top: -32rpx;
      position: relative;
      z-index: 100;
      padding: 0 34rpx 32rpx 34rpx;
      background-color: #fff;
      border-top-left-radius: 16rpx;
      border-top-right-radius: 16rpx;

      .info-head {
        display: flex;
        justify-content: space-between;

        .info-img-box {
          width: 124rpx;
          height: 124rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -44rpx;
          background-color: #fff;
          position: relative;
          z-index: 99;
          border-radius: 20rpx;
          flex-shrink: 0;

          .info-img {
            width: 120rpx;
            height: 120rpx;
            border-radius: 20rpx;
          }
        }

        .fans-box {
          flex: 1;
          margin-left: 40rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .cardName {
            font-size: 36rpx;
            font-weight: 500;
            color: #333333;
            line-height: 36rpx;
          }

          .addBtn {
            width: 120rpx;
            height: 52rpx;
            background-color: #FC3A3A;
            font-size: 28rpx;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 52rpx;
            text-align: center;
          }
        }
      }

      .cardMsgBox {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .listNum {
          padding: 24rpx 0 32rpx 0;
          font-size: 44rpx;
          font-weight: 500;
          color: #000000;
          line-height: 40rpx;
        }

        .mapBtn {
          display: flex;
          align-items: center;

          .btnMsg {
            font-size: 28rpx;
            color: #333333;
            line-height: 36rpx;
            padding-left: 2rpx;
          }

          .btnIcon {
            width: 40rpx;
            height: 40rpx;
          }
        }
      }

      .showSelectList {
        margin: 0 0 32rpx 0;
        display: flex;
        align-items: center;

        .selectBtn+.selectBtn {
          margin-left: 48rpx;
        }

        .selectBtn {
          display: flex;
          align-items: center;

          .msg {
            font-size: 28rpx;
            font-weight: 500;
            line-height: 33rpx;
            margin-right: 8rpx;
          }

          .icon {
            width: 27rpx;
            height: 15rpx;
          }
        }
      }

      .cardListBox+.cardListBox {
        margin-top: 24rpx;
      }

      .cardListBox {
        width: 678rpx;
        margin-left: auto;
        margin-right: auto;
        border-radius: 24rpx;
        overflow: hidden;
        box-shadow: 0px 0px 16rpx 2rpx rgba(223, 223, 223, 1);

        .cardContent {
          width: 678rpx;
          height: 360rpx;

          .cardHolderListBc {
            width: 678rpx;
            height: 360rpx;
            position: absolute;
            z-index: 49;
          }

          .contentMsgBox {
            width: 678rpx;
            height: 360rpx;
            position: absolute;
            z-index: 50;
            box-sizing: border-box;
            padding: 40rpx 30rpx 38rpx 26rpx;
            display: flex;
            justify-content: space-between;

            .leftContent {
              flex: 1;

              .username {
                font-size: 28rpx;
                color: #FFFFFF;
                line-height: 28rpx;
              }

              .mainMsg {
                margin-top: 24rpx;
                font-size: 32rpx;
                color: #D7D7D7;
                line-height: 40rpx;

                .lightMsg {
                  font-size: 40rpx;
                  font-weight: 500;
                  color: #FFFFFF;
                  padding: 0 6rpx;
                }
              }

              .subMsg {
                margin-top: 32rpx;
                font-size: 26rpx;
                color: #D7D7D7;
                line-height: 32rpx;
                display: flex;
                align-items: center;

                .msg {
                  margin-left: 10rpx;
                }

                .text_overflow {
                  width: 320rpx;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .locationIcon {
                  width: 32rpx;
                  height: 32rpx;
                }
              }
            }

            .rightContent {
              flex-shrink: 0;
              flex: 0 0 122rpx;
              padding-left: 60rpx;

              .avatarBox {
                width: 122rpx;
                height: 122rpx;

                .userAvatarBox {
                  border: 3rpx solid #FFF;
                  border-radius: 100%;
                  overflow: hidden;
                  width: 116rpx;
                  height: 116rpx;
                  position: absolute;
                  z-index: 51;

                  .userAvatar {
                    width: 116rpx;
                    height: 116rpx;
                    border-radius: 100%;
                    display: block;
                  }
                }

                .vipIcon {
                  margin: 78rpx 0 0 78rpx;
                  width: 46rpx;
                  height: 46rpx;
                  position: absolute;
                  z-index: 52;
                }

              }

              .detailsBtn {
                margin-top: 62rpx;
                width: 122rpx;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .msg {
                  font-size: 32rpx;
                  color: #FFFFFF;
                  line-height: 40rpx;
                  margin-right: 18rpx;
                }

                .icon {
                  width: 16rpx;
                  height: 28rpx;
                }
              }
            }
          }
        }

        .carBtnGroup {
          padding: 0 50rpx;
          height: 90rpx;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .btnBox+.btnBox {
            margin-left: 120rpx;
          }

          .btnBox {
            display: flex;
            align-items: center;

            .icon {
              width: 48rpx;
              height: 48rpx;
            }

            .msg {
              font-size: 28rpx;
              color: #000000;
              line-height: 33rpx;
            }
          }
        }
      }

      .no_nextPage {
        // margin: 0 auto;
        text-align: center;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        padding: 16rpx 0 20rpx 0;
      }
    }
  }

  .sourceSelectBox {
    width: 750rpx;
    background-color: #FFF;
    padding: 0 0 66rpx 0;
    border-bottom-left-radius: 24rpx;
    border-bottom-right-radius: 24rpx;

    .selectHead {
      padding: 36rpx 32rpx;
      border-bottom: 2rpx solid #EAEAEA;
      border-top: 2rpx solid #EAEAEA;
      display: flex;
      align-items: center;

      .selectBox+.selectBox {
        margin-left: 48rpx;
      }

      .selectBox {
        display: flex;
        align-items: center;

        .msg {
          font-size: 28rpx;
          font-weight: 500;
          line-height: 33rpx;
          margin-right: 8rpx;
          overflow: hidden; //溢出隐藏
          white-space: nowrap; //不换行
          text-overflow: ellipsis
        }

        .selectIcon {
          width: 27rpx;
          height: 15rpx;
        }
      }

    }

    .selectBody {
      padding: 32rpx 34rpx 20rpx 34rpx;

      .selectTitleItem {
        display: flex;

        .title {
          width: 260rpx;
          font-size: 36rpx;
          font-weight: 500;
          color: #333333;
          line-height: 42rpx;
        }
      }

      .selectAddressBox {
        display: flex;
        padding: 50rpx 0;

        // 
        .province-item {
          height: 570rpx;

          .selectMsg+.selectMsg {
            display: flex;
            align-items: center;

            image {
              // margin-top: 40rpx;
            }

            margin-top: 26rpx;
          }
        }
      }
    }

    .selectBody,
    .checkedStatusGroup {
      .selectMsg {
        display: flex;
        align-items: center;
        line-height: 38rpx;

        image {
          // margin-top: 40rpx;
        }

        .check {
          width: 30rpx;
          height: 22rpx;
          margin-right: 10rpx;
        }

        .msg {
          font-size: 32rpx;
        }
      }
    }

    .checkedStatusGroup {
      padding: 32rpx 34rpx 80rpx 34rpx;
      display: flex;

      .selectMsg {
        width: 190rpx;
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
      margin: 0 auto;

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

  .selected-content {

    // position: relative;
    .top_header_box {
      width: 100vh;
      // position: absolute;
      background: #FAFAFA
    }

    .selected-title {
      background-color: #FAFAFA;
      box-sizing: border-box;
      padding: 0 34rpx;
      // position        : absolute;
      // top             : 0;
      // left            : 0;
      height: 88rpx;
      width: 100vw;
      z-index: 9;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;

      &.isVerse {
        flex-direction: row-reverse;
      }

      .selected-item {
        display: flex;
        flex-direction: row;
        align-items: center;

        .icon_down {
          width: 24rpx;
          height: 12rpx;
          margin-left: 12rpx;
        }

        .icon_toggle {
          transform: rotate(180deg);
        }

        .selected-title-text {
          max-width: 150rpx;
          color: rgba(51, 51, 51, 1);
          font-size: 28rpx;
          font-weight: 500;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;

          &.active {
            color: rgba(52, 137, 233, 1);
          }
        }
      }
    }

    .selected-pop {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 0;
      opacity: 0;
      overflow: hidden;
      background-color: rgba(84, 84, 84, 0.71);
      z-index: 9999;

      &.active {
        opacity: 1;
        height: 100%;
      }

      .pop-content {
        padding-top: 88rpx;
        background-color: #FFFFFF;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        .status-item {
          height: 80rpx;
          color: rgba(51, 51, 51, 1);
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
</style>