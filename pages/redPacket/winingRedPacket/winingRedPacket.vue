<template>
	<view class="container">
		<image class="all_bg" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/openRedpaket_bg.png" mode="cover" />
		<view class="top_header" :style="{top: statusBarHeight+'px'}">
			<image class="all_bg" @click="goBack" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/golden_btn.png" mode="cover" />
		</view>
		<view class="box">
			<view class="avatar"> 
				<image style="width:124rpx;height:124rpx;border-radius:50%" :src="avatar" v-if="avatar"/>
				<image style="width:124rpx;height:124rpx;border-radius:50%" v-else src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png"/>
			</view>
		<view class="title_box">
				<view >{{userName}}的红包</view>
				<view >红包雨来袭，快戳！</view>
			</view>
			<view class="moeny_box">
				<view class="moeny_title">
					<view >{{score}}</view>
					<view >
						<text >元</text>
					</view>
				</view>
				<view class="ti_xian"  @click="goWallet">已存入钱包，可直接提现 ></view>
			</view>
		</view>
		<view class="btn_box">
				<view class="btn" @click="goWallet">
					<view >去提现</view>
				</view> 
				<view @click="palyAgain" class="btn">
					<view >再玩一次</view>
				</view>
			</view>
	</view>
</template>

<script>
	import * as ship from "@/utils/ship"
	export default {
		data() {
			return {
				score:0.00,  //金额
				userName:"", //用户昵称
				surplusNum:{}, //剩余玩的次数
				vantNoneShow:false,  //无次数弹出框
				statusBarHeight:"", //屏幕尺寸
				avatar:"",
				userInfo:{},
			}
		},
		async onLoad(options) {
			let {score}=options
			let avatar="";
			let userInfo={};
			if(uni.getStorageSync('userInfo')){
				userInfo=JSON.parse(uni.getStorageSync('userInfo'));	
			}
			this.userInfo=userInfo
			if(userInfo){
				avatar=userInfo.attrs.avatar;
			}
			console.log(userInfo);
			let userGameInfo=JSON.parse(uni.getStorageSync('userGameInfo'))
			let userRole=uni.getStorageSync('userRole')
			userRole=userRole==1?10:20;
			let res = uni.getSystemInfoSync() ///微信api方法
			let H = res.statusBarHeight + 7
			// 处理金额显示
			if(score.charAt(0)==0 && score.length==3){
				score=score+'0';
			}else if(score.charAt(0)>1 && score.length==3){
				score=score+'0'
			}else if(score==0){
				score='0.00'
			}
			// 获取剩余次数
			let surplusNum=await ship.postRequest('/hby/redPacket/getNumber',{ 
				userId:userInfo.userId,  //用户id
				businessType:userRole,  //用户类型
				gameSid:userGameInfo.sid,  //游戏id
				gameConfigSid:userGameInfo.configSid  //游戏动态配置id
			});
			this.score = score;
			this.surplusNum = surplusNum.rspBody;
			this.statusBarHeight = H;
			this.avatar = avatar;

		},
		 onShow() {
			let userInfo = wx.getStorageSync('userInfo');
			if(userInfo) {
				userInfo = JSON.parse(userInfo);
				let tmpUserName="";
				if(userInfo.userName){
					tmpUserName=userInfo.userName;
				}else if(userInfo.attrs.nickname ){
					tmpUserName=userInfo.attrs.nickname;
				}else if(userInfo.mobile){
					let  reg = /^(\d{3})\d{4}(\d{4})$/;  
					tmpUserName=userInfo.mobile.replace(reg, "$1****$2");
				}else {
					tmpUserName = '用户' + userInfo.userId;
				}
				this.userName = tmpUserName;

			}
		},
		methods: {
			// 点击再玩一次
			palyAgain(){
				let that=this;
				let userInfo=JSON.parse(uni.getStorageSync('userInfo')); //获取用户信息
				// surplusNum.type  1可以玩 2次数不足请分享  3 参与次数超过最大限制次数
				if(that.surplusNum.type==3){
					uni.redirectTo({
						url: '../shareAssist/shareAssist'
					})
				}else if(that.surplusNum.type==1){
					uni.redirectTo({
						url: '../redPacketRain/redPacketRain'
					})
				}else if(that.surplusNum.type==2){
					uni.redirectTo({
						url: '../shareAssist/shareAssist'
					})
				}

				
			
			},
			// 返回主页
			goBack(){
				uni.redirectTo({
					url:"../index/index"
				})
			},
			 // 提现防护
			goWallet(){
				let that = this
				var userRole = uni.getStorageSync('userRole');
				var userInfo = uni.getStorageSync("userInfo");
				if (!userInfo) {
					uni.showModal({
					title: '请登录后操作',
					confirmText: '去登录',
					success: function (res) {
						uni.reLaunch({
							url: '/pages/login/selectRole/selectRole'
						})
					}
					})
					return
				}
				if (userRole == 1) {
					var identityVerify = JSON.parse(userInfo).attrs.identityVerify;
					var driverVerify = JSON.parse(userInfo).attrs.driverVerify;
					var vehicleVerify = JSON.parse(userInfo).attrs.vehicleVerify;
					if (identityVerify !== 1 || driverVerify !== 1 || vehicleVerify !== 1 ) {
						uni.showModal({
							title: '请认证行驶证、驾驶证和身份证',
							content: '未完成认证，请认证后操作。',
							confirmText: '去认证',
							cancelText: '再看看',
							success: function (res) {
								if (res.confirm) {
									if (identityVerify !== 1 ) {
										uni.navigateTo({
											url: '/pages/goodsDelivery/userCenter/identifyingUsers/identifyingUsers'
										})
									} else if (driverVerify !== 1) {
										uni.navigateTo({
											url: '/pages/my/driverVerify/newDriverVerify?pageName=redPacket'
										})
									} else if (vehicleVerify !== 1) {
										uni.navigateTo({
											url: '/pages/my/carVerify/newCarVerify'
										})
									}
								}
							}
						})
						return
					}
					uni.navigateTo({
						url: '/pages/goodsDelivery/userCenter/userWallet/userWallet'
					})
				} 
				
			},
		}
	}
</script>

<style lang="less">
.container {
    width   : 100vw;
    height  : 100vh;
	// height: 1624rpx;
    position: relative;


    .all_bg {
        width : 100vw;
        height  : 100vh;
    }
    
    .top_header {
        position       : fixed;
        width          : 100vw;
        left           : 0;
        z-index        : 10;
        display        : flex;
        align-items    : center;
    
        image {
          width : 48rpx;
          height: 48rpx;
          padding-left: 32rpx;
          padding-right: 32rpx;
          display: block;
        }
    }

    .box{
      position: absolute;
      top:250rpx;
      width: 100vw;
      height: 800rpx;
      .avatar{
        text-align: center;
      }

      .title_box{
        text-align: center;
        

        view:first-of-type{
          font-size: 44rpx;
          font-weight: 500;
          background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        view:last-of-type{
          padding: 26rpx 0;
          font-size: 28rpx;
          font-weight: 400;
          line-height: 28rpx;
          background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }


      .moeny_box{
        text-align: center;
        margin-top: 120rpx;
        .moeny_title{
          display: flex;
          justify-content: center;
          view:first-of-type{
            font-size: 104rpx;
            font-weight: 600;
            background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          view:last-of-type{
            width: 48rpx;
            height: 48rpx;
            border-radius: 50%;
            background: linear-gradient(180deg, #F76C5B 0%, #E2200E 100%);
            margin-top: 55rpx;
            margin-left: 22rpx;
            text{
              font-size: 28rpx;
              background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
         
        }

        .ti_xian{
          margin-top: 64rpx;
          font-size: 28rpx;
          font-weight: 400;
          color: #2793F6;
        }
      }


     
    }

    .btn_box{
      width: 100vw;
      text-align: center;
      position: absolute;
      top:925rpx;
    //   top:1050rpx;
      .btn{
        margin: 33rpx auto;
        width: 400rpx;
        height: 80rpx;
        background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
        border-radius: 16rpx;
        border: 2rpx solid;
        border-image: linear-gradient(90deg, rgba(255, 214, 129, 1), rgba(255, 235, 184, 1), rgba(255, 214, 129, 1)) 2 2;

        view{
          font-size: 32rpx;
          font-weight: 500;
          line-height: 44rpx;
          background: linear-gradient(90deg, #FFD681 0%, #FFEBB8 49%, #FFD681 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 80rpx;
        }
      }
    }


    .numNone_box{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 101;
      width: 100vw;
      // height    : 100vh;
      background: rgba(0, 0, 0, 0.8);
      .numNone_item{
          position     : absolute;
          top          : 50%;
          left         : 50%;
          transform    : translate(-50%, -50%);
          width: 582rpx;
          height: 330rpx;
          background   : #FFFFFF;
          border-radius: 36rpx;
          box-sizing   : border-box;

          .numNone_bg{
              width: 582rpx;
              height: 330rpx;
          }
          .numNone_title{
              position: absolute;
              top: 50%;
              left : 50%;
              transform : translate(-50%, -50%);
              z-index: 100;
              width: 454rpx;
              // height: 186rpx;
          }
          .title{
              width: 465rpx;
              // height: 186rpx;
              text-align: center;
              font-size: 40rpx;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              line-height: 62rpx;
              letter-spacing: 6rpx;
              background: linear-gradient(180deg, #F66527 0%, #F5250E 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
          }
          
      }
  }
} 
</style>
