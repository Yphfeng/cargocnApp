<template>
  <view>
    <template v-if="isIOS">
      <view id="success"
        :class="['success', (successShow ? 'success--show' : ''), (successTran ? 'success--tran' : '')]"
        :style="'top: ' + topSize + 'rpx;color: ' + color">
        <view class="info">刷新成功</view>
      </view>
      <movable-area class="movable-area">
        <movable-view class="scroll" :style="'height: calc(100vh - 50rpx + 40rpx + ' + refreshSize + 'rpx)'"
          @change="change" @touchend="touchend" direction="vertical" :disabled="refreshStatus >= 3" :y="move"
          ref="movable_view">>
          <scroll-view class="scroll__view"
            :style="'padding-bottom: ' + bottomSize + 'rpx;padding-top: ' + topSize + 'rpx;'"
            :scroll-y="refreshStatus == 1" @scroll="scroll" :scroll-top="scrollTop"
            :enable-back-to-top="enableBackToTop" :lower-threshold="80 + 'rpx'" @scrolltolower="more">
            <!-- :style="'height: ' + refreshSize + 'rpx;padding: 20rpx 0;'" 小程序迁移过来的这段代码会引起兼容性问题 -->
            <view id="refresh" :class="['scroll__refresh', (successShow ? 'scroll__refresh--hidden' : '')]"
              :style="'height: ' + refreshSize + 'rpx;padding: 20rpx 0;'">
              <view class="scroll__loading">
                <view v-if="refreshStatus == 1 || refreshStatus == 2"
                  :class="[(refreshStatus == 2 ? 'rotate' : ''), 'arrow']"></view>
                <view v-if="refreshStatus == 3" class="loading">
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                </view>
                <view class="text" v-if="refreshStatus == 1">下拉刷新</view>
                <view class="text" v-else-if="refreshStatus == 2">松开更新</view>
                <view class="text" v-else-if="refreshStatus == 3">加载中...</view>
              </view>
            </view>
            <slot></slot>
            <view v-if="listCount === 0 && emptyShow" class="empty">
              <image class="empty__image" :src="emptyUrl"></image>
              <view class="empty__text">{{emptyText}}</view>
            </view>
            <view v-if="listCount !== 0 && overOnePage" :class="isOrder ? 'scroll__bottom_order' : 'scroll__bottom'">
              <view class="scroll__loading" :style="{'top': isOrder ? '30%' : '50%'}" v-if="end">
                已全部加载
              </view>
              <view class="scroll__loading" :style="{'top': isOrder ? '30%' : '50%'}" v-else>
                <view class="loading">
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                  <view class="loading__item"></view>
                </view>
                <view class="text">加载中...</view>
              </view>
            </view>
          </scroll-view>
        </movable-view>
      </movable-area>
    </template>
    <template v-else>
      <!-- @refresherrefresh="refresh"
        :refresher-triggered="requesting" -->
      <scroll-view
        :refresher-enabled="true"
        @refresherrefresh="refresh"
        :refresher-triggered="requesting"
        :style="'height: calc(100vh - 50rpx + 40rpx + ' + refreshSize + 'rpx)'+'margin-bottom: ' + bottomSize + 'rpx;margin-top: ' + topSize + 'rpx;'" :scroll-y="true"
        @scrolltolower="more">
        <slot></slot>
        <view v-if="listCount === 0 && emptyShow" class="empty">
          <image class="empty__image" :src="emptyUrl"></image>
          <view class="empty__text">{{emptyText}}</view>
        </view>
        <view v-if="listCount !== 0 && overOnePage" :class="isOrder ? 'scroll__bottom_order' : 'scroll__bottom'">
          <view class="scroll__loading" :style="{'top': isOrder ? '30%' : '50%'}" v-if="end">
            已全部加载
          </view>
          <view class="scroll__loading" :style="{'top': isOrder ? '30%' : '50%'}" v-else>
            <view class="loading">
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
              <view class="loading__item"></view>
            </view>
            <view class="text">加载中...</view>
          </view>
        </view>
      </scroll-view>
    </template>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        isIOS: false,
        /* 未渲染数据 */
        mode: 'refresh',
        // refresh 和 more 两种模式
        successShow: false,
        // 显示success
        successTran: false,
        // 过度success
        refreshStatus: 1,
        // 1: 下拉刷新, 2: 松开更新, 3: 加载中, 4: 加载完成
        move: -45,
        // movable-view 偏移量
        scrollHeight1: 0,
        // refresh view 高度负值
        scrollHeight2: 0,
        // refresh view - success view 高度负值
        timer: null,

        /* 渲染数据 */
        scrollTop: 0,
        overOnePage: false
      };
    },

    components: {},
    props: {
      // 处理加油订单底部提示显示隐藏问题
      isOrder: {
        type: Boolean,
        default: false
      },
      // 加载中
      requesting: {
        type: Boolean,
        default: false
      },
      // 加载完毕
      end: {
        type: Boolean,
        default: false
      },
      // 控制空状态的显示
      emptyShow: {
        type: Boolean,
        default: false
      },
      // 当前列表长度
      listCount: {
        type: Number,
        default: 0
      },
      // 空状态的图片
      emptyUrl: {
        type: String,
        default: "/static/assets/image/empty/empty.png"
      },
      // 空状态的文字提示
      emptyText: {
        type: String,
        default: "暂无相关数据"
      },
      // 是否有header
      hasTop: {
        type: Boolean,
        default: false
      },
      // 下拉刷新的高度
      refreshSize: {
        type: Number,
        default: 90
      },
      // 顶部高度
      topSize: {
        type: Number,
        default: 0
      },
      scrollHeight: {
        type: Number,
        default: 0
      },
      // 底部高度
      bottomSize: {
        type: Number,
        default: 0
      },
      // 颜色
      color: {
        type: String,
        default: ""
      },
      // iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向
      enableBackToTop: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      requesting: {
        handler: 'requestingEnd',
        immediate: true
      },
      refreshSize: {
        handler: 'refreshChange',
        immediate: true
      }
    },
    mounted() {
      let that = this;
      if (uni.getSystemInfoSync().platform == 'ios') {
        that.isIOS = true;
      } else {
        that.isIOS = false;
      }
      this.init();
      console.log(this.isOrder)
    },

    methods: {
      // 下拉刷新
      refresh() {
        let that = this;
        that.refreshStatus = 2;
        let refreshStatus = that.refreshStatus; // console.log(111,refreshStatus)

        if (refreshStatus >= 3) return;
        if (refreshStatus === 2) {
          uni.vibrateShort();
          this.refreshStatus = 3;
          this.move = 0;
          this.mode = 'refresh';
          this.$emit('refresh'); // console.log("refresh");
        } else if (refreshStatus === 1) {
          console.log('下拉刷新4')
          this.move = this.scrollHeight1;
        }
      },
      /**
       * 处理 bindscrolltolower 失效情况
       */
      scroll(e) {
        // 可以触发滚动表示超过一屏
        this.overOnePage = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.scrollTop = e.detail.scrollTop;
        }, 100)
      },

      /**
       * movable-view 滚动监听
       */
      change(e) {
        let refreshStatus = this.refreshStatus,
          diff = e.detail.y;
        if (refreshStatus >= 3) return;

        if (diff > -10) {
          this.refreshStatus = 2;
        } else {
          this.refreshStatus = 1;
        }
      },

      /**
       * movable-view 触摸结束事件
       */
      touchend() {
        let refreshStatus = this.refreshStatus; // console.log(111,refreshStatus)
        console.log(this.scrollHeight2)
        console.log(this.scrollHeight1)
        if (refreshStatus >= 3) return;

        if (refreshStatus === 2) {
          uni.vibrateShort();
          this.refreshStatus = 3;
          this.move = 0;
          this.mode = 'refresh';
          this.$emit('refresh'); // console.log("refresh");
        } else if (refreshStatus === 1) {
          this.move = this.scrollHeight1;
        }
      },

      /**
       * 加载更多
       */
      more() {
        if (!this.end) {
          this.mode = 'more';
          this.$emit('more');
        }
      },

      /**
       * 监听 requesting 字段变化, 来处理下拉刷新对应的状态变化
       */
      requestingEnd(newVal, oldVal) {
        if (this.mode === 'more') return;

        if (oldVal === true && newVal === false) {
          setTimeout(() => {
            this.successShow = true;
            this.refreshStatus = 4;
            this.move = this.scrollHeight2;
            setTimeout(() => {
              this.successTran = true;
              this.move = this.scrollHeight1;
              setTimeout(() => {
                this.refreshStatus = 1;
                this.successShow = false;
                this.successTran = false;
                this.move = this.scrollHeight1;
              }, 350);
            }, 1500);
          }, 600);
        } else {
          if (this.refreshStatus !== 3) {
            this.refreshStatus = 3;
            this.move = 0;
          }
        }
      },

      /**
       * 监听下拉刷新高度变化, 如果改变重新初始化参数, 最小高度80rpx
       */
      refreshChange(newVal, oldVal) {
        if (newVal <= 80) {
          this.refreshSize = 80;
        } // console.log(this.data.refreshSize)
        // 异步加载数据时候, 延迟执行 init 方法, 防止基础库 2.7.1 版本及以下无法正确获取 dom 信息


        setTimeout(() => this.init(), 10);
      },

      /**
       * 初始化scroll组件参数, 动态获取 下拉刷新区域 和 success 的高度
       */
      init() {
        let {
          windowWidth
        } = uni.getSystemInfoSync();
        let successHeight = (windowWidth || 375) / 750 * 70;
        // this.createSelectorQuery().select("#refresh").boundingClientRect(res => {
        //   this.setData({
        //     scrollHeight1: -res.height,
        //     scrollHeight2: successHeight - res.height
        //   }); // console.log(-res.height);
        // }).exec();
        const query = uni.createSelectorQuery().in(this);
        query.select('#refresh').boundingClientRect(data => {
          this.scrollHeight1 = -data.height;
          this.scrollHeight2 = successHeight - data.height;
        }).exec();
      }

    }
  };
</script>
<style>
  @import "./index.css";
</style>