<template>
<view>
<!--<import src="../empty/template/EmptyTemplate.wxml"></import>-->

<view class="empty-root-layout">

  <!-- 错误 -->
  <block data-type="template" data-is="empty-template" data-attr="...errorLayoutData" v-if="emptyType == error">
  <view class="empty-layout">

    <image :src="src" mode="aspectFit" class="empty-img"></image>

    <text class="empty-text">{{prompt}}</text>

    <button class="empty-btn" @tap="emptyCallback" :data-type="emptyType" v-if="btnPrompt != null">{{btnPrompt}}</button>

  </view>
</block>

  <!-- 空布局 -->
  <block data-type="template" data-is="empty-template" data-attr="...emptyLayoutData" v-if="emptyType == empty">
  <view class="empty-layout">

    <image :src="src" mode="aspectFit" class="empty-img"></image>

    <text class="empty-text">{{prompt}}</text>

    <button class="empty-btn" @tap="emptyCallback" :data-type="emptyType" v-if="btnPrompt != null">{{btnPrompt}}</button>

  </view>
</block>

  <!-- 正在加载 -->
  <block data-type="template" data-is="empty-template" data-attr="...loadingLayoutData" v-if="emptyType == loading">
  <view class="empty-layout">

    <image :src="src" mode="aspectFit" class="empty-img"></image>

    <text class="empty-text">{{prompt}}</text>

    <button class="empty-btn" @tap="emptyCallback" :data-type="emptyType" v-if="btnPrompt != null">{{btnPrompt}}</button>

  </view>
</block>

  <!-- 显示主布局 -->
  <block v-if="emptyType == loading || emptyType == content">

    <view class="empty-content-layout" v-if="loadingTransparent || emptyType == content">
      <slot></slot>
    </view>

  </block>


</view>
</view>
</template>

<script>
var EmptyConstant = require("./constant/EmptyConstant.js");

export default {
  data() {
    return {
      error: EmptyConstant.error,
      empty: EmptyConstant.empty,
      loading: EmptyConstant.loading,
      content: EmptyConstant.content,
      errorLayoutData: {
        emptyType: EmptyConstant.error,
        src: "/static/components/empty/res/image/cargo_error.png",
        prompt: "网络错误，请重试！",
        btnPrompt: "重新加载"
      },
      emptyLayoutData: {
        emptyType: EmptyConstant.empty,
        src: "/static/components/empty/res/image/cargo_empty.png",
        prompt: "暂无数据",
        btnPrompt: null
      },
      loadingLayoutData: {
        emptyType: EmptyConstant.loading,
        src: "/static/components/empty/res/image/cargo_loading.gif",
        prompt: "拼命加载中...",
        btnPrompt: null
      }
    };
  },

  components: {},
  props: {
    emptyType: {
      type: Number,
      default: EmptyConstant.content
    },
    loadingTransparent: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 空布局中点击回调， 如点击重新加载按钮
    emptyCallback: function (event) {
      var emptyType = event.currentTarget.dataset.type;
      var emptyEventDetail = {
        emptyType: emptyType
      };
      var emptyEventOption = {};
      this.$emit("emptyevent", {
        detail: emptyEventDetail
      }, emptyEventOption);
    }
  }
};
</script>
<style>
@import "./empty.css";
</style>