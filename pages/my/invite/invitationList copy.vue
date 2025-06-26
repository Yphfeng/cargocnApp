<template>
  <view class="invitation_container">
    <view>您的邀请总人数为：{{ total }}</view>
    <view class="invitation_list">
      <view class="item_header">
        <view>手机号</view>
        <view>用户名</view>
        <view>卡友号</view>
      </view>
      <view
        v-for="(item, index) in dataList"
        :key="index"
        class="invitation_item"
      >
        <view>{{
          "*******" + item.mobile.substring(item.mobile.length - 4)
        }}</view>
        <view>{{ item.userName.replace(item.userName.charAt(0), "*") }}</view>
        <view>{{ item.userCode }}</view>
      </view>
    </view>
  </view>
</template>
<script>
import * as utils from "@/utils/service.js";
export default {
  data() {
    return {
      dataList: [],
      total: 0,
    };
  },
  onLoad() {
    let that = this;
    that.initData();
  },
  methods: {
    initData() {
      let that = this;
      utils
        .postRequest("/au/user/findMyInvitedUsers", {
          pageSize: 10,
          pageNum: 1,
        })
        .then((res) => {
          if (res.retCode == "0000000") {
            that.dataList = res.rspBody.items;
            that.total = res.rspBody.total;
          }
        });
    },
  },
};
</script>
<style lang="scss">
.invitation_container {
  .invitation_list {
    .item_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      view {
        width: 33.33%;
        text-align: center;
      }
    }
    .invitation_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      view {
        width: 33.33%;
        text-align: center;
      }
    }
  }
}
</style>