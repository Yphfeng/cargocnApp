<template>
  <view class="container">
    <image class="bg_image" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/537d7b6753dfd7cfee5f27eb4ae2b79.png">
    </image>
    <view class="text" v-if="status === '-500'">人脸识别认证启动中</view>
    <view class="text" v-if="status === 1">人脸识别认证成功</view>
    <view class="text" v-if="status === 0">人脸识别认证失败</view>
    <view class="loading" v-if="status === '-500'">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </view>
  </view>
</template>

<script>
  import * as utils from "@/utils/ship.js";
  const permissionUtils = require('./permission.js')
  const bdFaceLive = uni.requireNativePlugin('liyahong-BDFace-v4')
  var resultBackEnable = true

  export default {
    data() {
      return {
        result: '',
        faceResult: '',
        status: '-500',
        actionArray: [
          'Eye', 'Mouth','HeadLeft', 'HeadRight', 'HeadUp', 'HeadDown'
        ]
      };
    },
    onLoad() {
      let that = this;
      that.scan();
    },
    methods: {

      createActions(){
        let that = this;
        let arr = []
        let arrIndex = Math.floor((Math.random() * that.actionArray.length));
        arr.push(that.actionArray[arrIndex])

        function handel(){
          let index = Math.floor((Math.random() * that.actionArray.length));
          let key = that.actionArray[index]
          if(arr.includes(key)){
            handel()
          }else{
            arr.push(key)
          }
        }
        handel()
        return arr

      },

      scan() {
        let that = this;
        let licenseID = plus.os.name == 'Android' ? 'hyzgapp-face-android' : 'hyzgapp-face-ios'
        let actionsList = that.createActions()

        // 调用插件开始采集人脸
        bdFaceLive.liveFace({
            licenseID: licenseID, // 必填项，与百度资料上的License ID保持一致
            /**
             * Eye： 眨眨眼
             * Mouth： 张张嘴
             * HeadLeft： 向左缓慢转头
             * HeadRight：向右缓慢转头
             * HeadUp：缓慢抬头
             * HeadDown：缓慢低头
             * 
             * 默认无动作，如果填写了会按照指定动作执行
             * 注意：这里跟老版的不一样，更符合用户需求
             */
            // liveArray: ['Eye', 'Mouth', 'HeadLeft', 'HeadRight'], // 选填【活体动作】
            liveArray: actionsList, // 选填【活体动作】
            liveRandom: true, // 选填【动作是否随机】，默认有序，false：有序|true：随机
            sound: 0, // 选填【是否有声】，默认有声，0：有声|1：无声
            camera: 0, // 选填【前置|后置摄像头】，默认前置，0：前置|1：后置
            openMask: true, // 选填【是否开启戴口罩采集】，默认false不开启
            hintTextColor: '#333333', // 选填【提示文字颜色】，默认#333333
            backgroundColor: '#FFFFFF', // 选填【页面背景颜色】，默认#FFFFFF
            roundColor: '#CCCCCC', // 选填【人脸采集框颜色】，默认#666666
            roundSelectColor: '#FF0000', // 选填【识别成功时采集框的颜色】，默认#FF0000
            copyright: '货运中国人脸识别', // 选填【底部版权文字内容】，默认''
            copyrightColor: '#0094FF', // 选填【底部版权文字颜色】，默认#CCCCCC
            showBottomImage: false, // 选填【是否显示底部背景图片】，默认false
            otherImage: true, // 选填【是否返回动作人像信息】，默认false，true：返回base64ImageResult + otherBase64Image，false：只返回base64ImageResult
            originalImage: true, // 选填【是否返回原图照片信息】，默认false，true：返回base64ImageResult + originalBase64Image，false：只返回base64ImageResult
            /**
             * 0：正常、1：宽松、2：严格
             * 可以通过quality_config.json配置相关质量属性，具体属性介绍参考文档
             */
            qualityLevel: 0, // 选填【质量等级】，默认0
            detectTimeOut: 15, // 选填【采集超时时间】，默认15，单位(秒)
            /**
             * 如果设置为true，页面右上方会多一个相机切换功能入口
             * 您如果想自定义图片，可以参考文档中的自定义图片说明
             */
            switchCameraEnable: false, // 选填【是否开启相机切换功能】，默认false
            /**
             * 如果你希望采集完成之后，需要前端处理完成之后再返回的话，可以将此属性设置为false
             * 需注意：设置为false之后插件将不会调用关闭页面方法，需要前端手动调用插件的closeLive()方法完成关闭识别页面操作
             */
            resultBackEnable: resultBackEnable, // 选填【采集完成之后是否返回】，默认true
            tipsModel: {}, // 选填【自定义提示文字内容】，取值可参考文档，不填则使用插件默认提示
            /**
             * width 和 height属性是用来设置人脸采集预览画面的宽高的
             * 
             * 1、如果您仅用于手机端采集的话，插件内部已经对所有手机端进行了适配，此属性无需理会，直接设置0即可
             * 2、如果您将插件用于平板设备、厂商定制机设备、快递员扫码设备可能会出现预览框人脸被拉伸的情况，
             * 	  此时您可以来设置width 和 height属性来进行特定的适配，一般设置为width:1080，height:1920即可，
             * 	  具体根据设备分辨率来设置
             */
            width: 0, // 选填【自定义预览画面宽度】，默认值0
            height: 0, // 选填【自定义预览画面高度】，默认值0
            soundEnable: true // 选填【是否显示声音图片】默认值：true
          },
          result => {
            /**
             * code=1时会返回base64ImageResult
             * 	 + 如果otherImage=true，otherBase64Image也会返回
             * 	 + 如果originalImage=true，originalBase64Image也会返回
             * 如果使用百度人脸比对的话建议使用base64ImageResult，这个返回的是最佳人像照片，
             * 做百度人脸比对是完全没有问题的，也是百度官方推荐的
             * 
             * otherBase64Image：经过百度抠图过的人脸照片
             * originalBase64Image：人脸采集过程中的原图照片
             */
            let pages = getCurrentPages();
            let nowPage = pages[pages.length - 1]; //当前页页面实例
            let prevPage = pages[pages.length - 2]; //上一页页面实例 
            switch (result.code) {
              case 1: // 人脸采集成功
                // 调用插件方法进行图片压缩，压缩后的图片在150KB以下
                bdFaceLive.compressBase64Image({
                  base64: result.base64ImageResult, // 必填【base64数据】，直接使用插件返回的base64数据即可，不要带前缀
                  compressSize: 150 // 选填【期望压缩大小】，默认值150，单位KB
                }, compressResult => {
                  if (compressResult.code === 1) { // 压缩成功
                    let userInfo = JSON.parse(uni.getStorageSync("userInfo"));
                    let userCode = userInfo.attrs.userCode
                    let data = {
                      frontImage: compressResult.result.base64,
                      userCode: userCode,
                      sideImage: ''
                    }
                    /*
                      faceAuthStatus状态对应值
                      0: 认证失败
                      1: 认证成功
                      -1: 其他错误
                      -2: 活体检测超时
                      -3: 没有提取到人脸信息
                      -4: 用户主动关闭
                      -5: 权限申请被拒绝
                    */
                    bdFaceLive.compressBase64Image({
                      base64: result.otherBase64Image["1"], // 必填【base64数据】，直接使用插件返回的base64数据即可，不要带前缀
                      compressSize: 150 // 选填【期望压缩大小】，默认值150，单位KB
                    }, otherRes => {
                      if (otherRes.code === 1) {
                        data.sideImage = otherRes.result.base64
                        utils.postRequest('/yh/person/doing/face/verify/by/baidu', data).then(faceRes => {
                          if (faceRes.retCode == "0000000") {
                            console.log(faceRes, "认证成功")
                            // prevPage.$vm.faceAuthStatus = 1;;
                            prevPage.$vm.getFaceResult(1);

                            uni.navigateBack({
                              delta: 1
                            });

                            that.status = 1
                            setTimeout(() => {
                              uni.navigateBack({
                                delta: 1
                              });
                            }, 1000)
                          } else {
                            console.log(faceRes, "认证失败")
                            // prevPage.$vm.faceAuthStatus = 0;
                            that.status = 0
                            prevPage.$vm.getFaceResult(0, faceRes.retDesc)
                            setTimeout(() => {
                              uni.navigateBack({
                                delta: 1
                              });
                            }, 1000)
                          }
                        })
                      }
                    })
                  }
                })
                return
              case -1: // 其他错误，如：licenseID没有配置等
                prevPage.$vm.identifyStatus = 0; // 其他错误
                uni.navigateBack({
                  delta: 1
                });
                break
              case -2: // 活体检测超时
                prevPage.$vm.identifyStatus = 0; // 活体检测超时
                uni.navigateBack({
                  delta: 1
                });
                break
              case -3: // 没有提取到人脸信息
                prevPage.$vm.identifyStatus = 0; // 没有提取到人脸信息
                uni.navigateBack({
                  delta: 1
                });
                break
              case -4: // 用户主动关闭
                prevPage.$vm.identifyStatus = 0; // 用户主动关闭
                uni.navigateBack({
                  delta: 1
                });
                break
              case -5: // 权限申请被拒绝，仅Android端支持
                prevPage.$vm.identifyStatus = 0; // 用户权限被拒绝
                if (result.never) { // 是否被永远拒绝，如果被永远拒绝需要跳转设置页让用户手动开启
                  this.showModal({
                    title: '权限受限',
                    msg: '您拒绝了一些权限，可能导致该服务无法正常使用，请前往设置！',
                    confirmText: '前往设置',
                  }).then(() => {
                    permissionUtils.gotoAppPermissionSetting()
                  })
                } else { // 没有永远拒绝就弹窗给予提示然后再次调用插件
                  this.showModal({
                    title: '权限受限',
                    msg: '您拒绝了一些权限，可能导致该服务无法正常使用，请授予！'
                  }).then(() => {
                    this.scan()
                  })
                }
                break
              case 100001: // 开始初始化SDK，此处如果用户网络不佳会比较耗时，为了更好的用户体验，建议设置弹窗
                // uni.showLoading({
                //   title: '初始化SDK...',
                //   mask: true
                // })
                break
              case 100002: // SDK初始化完成，如果在100001开启了弹窗，可以在这里关闭
                uni.hideLoading()
                break
            }
          }
        )
      },
      logResult(result) {
        // 最佳人像信息
        console.log('base64', result.base64ImageResult)
        // 百度抠图的人像信息
        const otherBase64 = result.otherBase64Image
        if (otherBase64) {
          for (const key in otherBase64) {
            console.log(key, otherBase64[key])
          }
        }
        // 原图人像信息
        const originalBase64 = result.originalBase64Image
        if (originalBase64) {
          for (const key in originalBase64) {
            console.log(key, originalBase64[key])
          }
        }
      },
      /**
       * 显示弹窗提示
       */
      showModal({
        title,
        msg,
        confirmText
      }) {
        return new Promise((resolve, reject) => {
          uni.showModal({
            title,
            content: msg,
            showCancel: true,
            confirmText: confirmText || '确认',
            success(res) {
              if (res.confirm) {
                resolve()
              } else {
                reject()
              }
            },
            fail() {
              reject()
            }
          })
        })
      }
    }
  };
</script>

<style>
  .container {
    position: relative;
    height: 100vh;
    width: 100vw;
  }

  .bg_image {
    position: absolute;
    top: -650rpx;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    /* padding: 100rpx; */
  }

  .text {
    position: absolute;
    /* top: 180rpx; */
    left: 0;
    right: 0;
    bottom: 300rpx;
    margin: auto;
    width: 150px;
    height: 15px;
    text-align: center;
  }

  .loading {
    position: absolute;
    /* top: 800rpx; */
    left: 0;
    right: 0;
    bottom: 200rpx;
    margin: auto;
    width: 150px;
    height: 15px;
    text-align: center;
  }

  .loading span {
    display: inline-block;
    width: 15rpx;
    height: 15rpx;
    margin-right: 30rpx;
    background: #333333;
    -webkit-animation: load 1.04s ease infinite;
    border-radius: 50%;
  }

  .loading span:last-child {
    margin-right: 0px;
  }

  @-webkit-keyframes load {
    0% {
      opacity: 1;
      /* -webkit-transform: scale(1.2); */
    }

    100% {
      /* opacity: .2; */
      opacity: 0;
      /* -webkit-transform: scale(.2); */
    }
  }

  .loading span:nth-child(1) {
    -webkit-animation-delay: 0.13s;
  }

  .loading span:nth-child(2) {
    -webkit-animation-delay: 0.26s;
  }

  .loading span:nth-child(3) {
    -webkit-animation-delay: 0.39s;
  }

  .loading span:nth-child(4) {
    -webkit-animation-delay: 0.52s;
  }

  .loading span:nth-child(5) {
    -webkit-animation-delay: 0.65s;
  }

  .loading span:nth-child(6) {
    -webkit-animation-delay: 0.78s;
  }

  .loading span:nth-child(7) {
    -webkit-animation-delay: 0.91s;
  }

  /* .loading span:nth-child(8) {
    -webkit-animation-delay: 1.04s;
  } */
</style>