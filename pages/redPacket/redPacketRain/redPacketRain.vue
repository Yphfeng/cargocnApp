<template>
	<view class="container">
		<cover-view class="top_header" v-if="statusBarHeight" :style="{top: statusBarHeight+'px'}" @click="goBack">
			<!-- <cover-image class="all_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/golden_btn.png" /> -->
		</cover-view>
		<view class="title" v-if="!showTitle">
			<view >拼手气抢红包</view>
		</view>
		<view  v-if="ready" class="countdown_box">
			<block v-if="showTime">
				<view v-if="readyTime != 0" class="show_countdown">
					<view class="show_box">
					<view class="num_contatiner">
						<view style="text-align: center;width:100vw;">
						<view class="num_box">
							<view class="show_num">
								{{readyTime}}
							</view>
						</view>
						</view>
					</view>
					</view>
					<view v-if="showTime" class="show_tounch">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/start_redPacket.png" mode="cover"/>
						<view class="reday_title">准备好！点击红包</view>
					</view>
					
				</view>
			</block>
			<block v-else>
				<view  v-if="readyTime != 0" class="show_countdown">
					<view class="show_box">
					<view class="num_contatiner">
						<view class="num_box">
						<view class="num_xxx">
							<view class="show_num">
								{{readyTime}}
							</view>
						</view>
						</view>
					
					</view> 
					</view>
					<view v-if="!showTime" class="show_tounch">
						<image src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/redPacket_start.png" mode="cover"/>
						<view class="reday_title">准备好！点击红包</view>
					</view>
				</view>
			</block>
		</view>
		<block v-if="readyTime == 0">
			<solRedPacketRain
			:windowWidth="windowWidth"
			:windowHeight="windowHeight"
			:visible="visible"
			:serverRedArr="serverRedArr"
			:normallyTimeNum="normallyTimeNum"
			:speedUpTimeNum="speedUpTimeNum"
			:createSpeed="createSpeed"
			:time="time"
			:min="min"
			:max="max"
			:firstClickScore="firstClickScore"
			@finish="success"
			></solRedPacketRain>
		</block>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	import solRedPacketRain from "../solRedPacketRain/solRedPacketRain.vue"
	let readyTimer = null
	export default {
		components:{
			solRedPacketRain
		},
		data() {
			return {
				visible: false,  //是否开始展示红包雨游戏
				userName:"",  //用户名字
				score:"", //金额
				readyTime: 3, //倒计时时间
				showTime: true, //是否展示倒计时
				ready: true,  //是否展示
				height:"700",
				statusBarHeight:"", //屏幕高度
				showTitle:false, //是否展示文字
				windowWidth: '',  //屏幕宽度
				windowHeight: '',  //屏幕宽度
				firstClickScore:0,  //首次玩的金额
				view:null,
			}
		},
		async onLoad(options) {
			let res = uni.getSystemInfoSync() ///微信api方法
			this.statusBarHeight = res.statusBarHeight + 7;
			this.view = new plus.nativeObj.View('test',{top:res.statusBarHeight + 7+'px',left:"10px",height:"24px",width:"24px"});
			this.view.drawBitmap('/static/images/golden_btn.png',{top:'0px',left:'0px',width:'100%',height:'100%'}, {top:'auto',left:'auto',width:'100%',height:'100%'});
			this.view.show();
			this.view.addEventListener("click", this.goBack, false);
			// 红包雨配置
			let {rspBody}=await ship.postRequest("/hby/game/getHbyGameConfig",{});
			console.log('红包雨配置', rspBody);
			// 获取红包数组
			let serverRedArr=await this.getRedPacket();
			// console.log('红包数组',serverRedArr)
			for(let i=0;i<serverRedArr.length;i++){
				let tmpObj=serverRedArr[i];
				let itemArr = Object.keys(tmpObj);
				for (let k = 0; k < itemArr.length; k++) {
					let key = itemArr[k];
					if (key == "firstClick") {
					// console.log('用户首次玩的金额',tmpObj)
					this.firstClickScore = tmpObj['name'];
					// console.log('删除前的红包数组',serverRedArr)
					serverRedArr.splice(i,1);
					// console.log('删除后的红包数组',serverRedArr)
					}
				}
			}
			this.showTitle = false;
			this.ready = true;
			this.showTime = true;
			this.readyTime = 3;
			this.normallyTimeNum = rspBody[0].normallyTimeNum;
			this.speedUpTimeNum = rspBody[0].speedUpTimeNum;
			this.serverRedArr = serverRedArr;			
			this.windowWidth = res.windowWidth;
			this.windowHeight = res.windowHeight,		
			this.participateIn();
		},
		onUnload(){
			this.view.close();
		},
		methods: {
			async getRedPacket(){
				//每进来一次请求后端，减一次红包可玩次数
				let userInfo={};
				if(uni.getStorageSync('userInfo')){
					userInfo=JSON.parse(uni.getStorageSync('userInfo'));
				}				 
				let userRole=uni.getStorageSync('userRole');
				userRole=userRole==1?10:20;
				let userGameInfo=JSON.parse(uni.getStorageSync('userGameInfo'));
				let redPacketRes=await ship.postRequest("/hby/redPacket/begin",{
					userId:userInfo.userId,
					userCode:userInfo.attrs.userCode,
					businessType:userRole,
					mobile:userInfo.mobile,
					gameSid:userGameInfo.sid,
					gameConfigSid:userGameInfo.configSid,
				})
				console.log(redPacketRes);
				return redPacketRes.rspBody.content;
			},
			// 游戏结束
			success(e) {
				const score=e.detail;
				this.visible = false; //  隐藏界面
				console.log('游戏结束');
				uni.redirectTo({
					url: '../winingRedPacket/winingRedPacket?score='+score
				})
			},
			// 开始准备倒计时
			cultdown() {
				let that = this
				let readyTime = that.readyTime
				readyTimer = setInterval(()=> {
					if (--readyTime == 0) {
						clearInterval(readyTimer)
						console.log('倒计时中',readyTime)
						// 显示红包雨
						that.run();
					}
					that.readyTime = readyTime;
				}, 1000)
			},
			// 开始
			start() {
				this.cultdown();
			},
			// 显示红包雨
			async run() {
				this.visible = true;
				this.createSpeed =5; // 速度
				this.time = 10; // 游戏时间
				this.min = 0; // 金币最小是0
				this.max = 1; // 金币最大是10
				this.showTitle =true;
				clearInterval(this.readyTimer);
			},
			// 立即参与
			participateIn() {
				this.ready = true;
				this.start();
			},
			goBack(){
				console.log('点击了返回按钮')
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less">
page {
    position: relative;
}
.container{

  width   : 100vw;
  height  : 100vh;
  position: relative;
  background: linear-gradient(180deg, #170A40 0%, #3C1637 100%);

  .top_header {
    position       : absolute;
    left           : 0;
    width : 48rpx;
    height: 48rpx;
    padding-left: 32rpx;
    padding-right: 32rpx;
    z-index        : 9999999;
    align-items    : center;
    // background-color: #FFF;

    image {
      width : 48rpx;
      height: 48rpx;
      display: block;
	  z-index        : 9999999;
    }

    .title {
      font-size  : 40rpx;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color      : #FFFFFF;
      margin-left: 30vw;
    }
  }
  
  .title{
    position: fixed;
    width: 100vw;
    text-align: center;
    margin-top: 204rpx;
    font-size: 52rpx;
    font-weight: 500;
    line-height: 52rpx;
    background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }



  .countdown_box{
    width: 100vw;
    height: 1200rpx;
    text-align: center;
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;

    .show_countdown{

      .show_box{
        width: 100vw;
        height: 550rpx;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        .num_contatiner{
          .num_box{
            margin-left: 100rpx;
            height: 530rpx;
            width: 530rpx;
            border-radius: 50%;
            background-image: radial-gradient(circle,rgba(246,213,142,0)40%, rgba(217,217,217,0) 10%,rgba(246,213,142,0.3)55%,rgba(217,217,217,0) 10%,rgba(246,213,142,0.1)50%);
  
  
            .show_num{
              width: 100%;
              font-size: 240rpx;
              line-height: 500rpx;
              background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
  
         
         
        }
      }

      .show_tounch{
        // margin-top: 600rpx;
        height: 10rpx;
        position: absolute;
        top: 600rpx;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        image{
          width: 264rpx;
          height: 294rpx;
        }
  
        .reday_title{
          font-size: 44rpx;
          font-weight: 500;
          background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    
  
    
  }

}
</style>
