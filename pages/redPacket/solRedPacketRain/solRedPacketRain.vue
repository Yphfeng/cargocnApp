<template>
    <!-- subpackages/pages/redPacket/solRedPackedRain/solRedPacketRain.wxml -->
    <!-- 红包雨 -->
    <view v-if="visible" class="red-envelope-popup">
        <view class="container flex-center">
            <block>
                <block v-if="showStatus === 2">
                    <view class="rain-wrapper flex-column">
                        <view class="time-info">
                            <!-- 倒计时 -->
                            <view style="dispaly: flex">
                                <view class="flex-row">
                                    <view class="tip">
                                        <image style="width: 80rpx; height: 80rpx; margin-left: 100rpx; margin-right: -20rpx;z-index:2" src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/clock_icon.png"/>
                                    </view>
                                    <view class="progress-wrapper">
                                        <view class="progress"  :animation="progressAni" ></view>
                                    </view>
                                    <!-- 红包金额 -->
                                    <view class="flex-row">
                                        <view class="total-score">
                                            <image
                                                style="width: 56rpx; height: 72rpx; vertical-align: middle; margin-left: 30rpx"
                                                src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/amount_icon.png"
                                            />
                                            ¥ {{ showScore }}
                                        </view>
                                    </view>
                                </view>
                                <image
                                    style="width: 100vw; height: 282rpx; position: absolute; bottom: 0; z-index: 9999"
                                    src="https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/redPacketRain_bottom.png"
                                />
                            </view>
                        </view>

                        <!-- 红包雨画布 -->
                        <view class="canvas-wrapper">
                            <view class="score-change" :animation="scoreAni">+{{ showChangeScore }}</view>
                            <canvas
                                disableScroll
                                @error="canvasIdErrorCallback"
                                @touchstart="handleClickRain"
                                canvasId="rain-canvas"
                                style="width: 100vw; height: 100vh; z-index: 9998"
                            ></canvas>
                        </view>
                    </view>
                </block>
                <view class="close-bg">
                    <block v-if="showStatus === 3">
                        <view class="result-wrapper flex-column-center">
                            <block v-if="randomImgNum == 0">
                                <view @click="handleClose" class="group-content flex-column-center" :style="'background-image: url(' + exhibitionArr[0] + ')'">
                                    <view class="result-title" style="margin-top: 20vw">恭喜您</view>
                                    <view class="ready-wrapper flex-column-center">
                                        <view
                                            style="
                                                font-size: 44rpx;
                                                font-weight: 500;
                                                background: linear-gradient(90deg, #ffd681 0%, #ffebb8 49%, #ffd681 100%);
                                                -webkit-background-clip: text;
                                                -webkit-text-fill-color: transparent;
                                                margin-top:30rpx
                                            "
                                        >
                                            接住了{{ times }}个红包
                                        </view>
                                    </view>
                                </view>
                            </block>

                            <block v-if="randomImgNum == 1">
                                <view @click="handleClose " class="group-content flex-column-center" :style="'background-image: url(' + exhibitionArr[1] + ')'">
                                    <view class="result-title" style="margin-top: 25vw">恭喜您</view>
                                    <view class="ready-wrapper flex-column-center">
                                        <view
                                            style="
                                                font-size: 44rpx;
                                                font-weight: 500;
                                                background: linear-gradient(90deg, #ffd681 0%, #ffebb8 49%, #ffd681 100%);
                                                -webkit-background-clip: text;
                                                -webkit-text-fill-color: transparent;
                                                margin-top:30rpx
                                            "
                                        >
                                            接住了{{ times }}个红包
                                        </view>
                                    </view>
                                </view>
                            </block>

                            <block v-if="randomImgNum == 2">
                                <view @click=" handleClose " class="group-content flex-column-center" :style="'background-image: url(' + exhibitionArr[2] + ')'">
                                    <view class="result-title" style="margin-top: 5vw">恭喜您</view>
                                    <view class="ready-wrapper flex-column-center">
                                        <view
                                            style="
                                                font-size: 44rpx;
                                                font-weight: 500;
                                                background: linear-gradient(90deg, #ffd681 0%, #ffebb8 49%, #ffd681 100%);
                                                -webkit-background-clip: text;
                                                -webkit-text-fill-color: transparent;
                                                margin-top:30rpx
                                            "
                                        >
                                            接住了{{ times }}个红包
                                        </view>
                                    </view>
                                </view>
                            </block>

                            <block v-if="randomImgNum == 3">
                                <view @click="handleClose " class="group-content flex-column-center" :style="'background-image: url(' + exhibitionArr[3] + ')'">
                                    <view style="height: 100rpx">
                                        <view class="result-title">恭喜您</view>
                                        <view class="flex-column-center">
                                            <view
                                                style="
                                                    font-size: 44rpx;
                                                    font-weight: 500;
                                                    background: linear-gradient(90deg, #ffd681 0%, #ffebb8 49%, #ffd681 100%);
                                                    -webkit-background-clip: text;
                                                    -webkit-text-fill-color: transparent;
                                                    margin-top:30rpx
                                                "
                                            >
                                                接住了{{ times }}个红包
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </block>
                    <view class="result-wrapper flex-column-center "  v-if="showStatus===4">
                        <view @click="handleClose" class="surprise_box group-content flex-column-center" style="background-image: url('https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/surprise_redPaclet.png')">
                            <view >      
                                <view class="result-title" style="margin-top: 20vw ;"></view>
                                <view class="ready-wrapper flex-column-center surprise" >             
                                    <view >{{surpriseScore}}</view>
                                </view>     
                            </view>          
                        </view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>

<script>
// subpackages/pages/redPacket/solRedPackedRain/solRedPacketRain.js
// import decimal from '../../../../utils/decimal';
import * as ship from "@/utils/ship"
const innerAudioContext = uni.createInnerAudioContext();
const app = getApp();
// const request = app.globalData.data.request;
let readyTimer = null; //开始红包雨倒计时的定时器
let rainTimer = null; //红包雨的定时器
let redEnvelopes = []; //红包数组
let redPacketArr = []; //从后端获取到的红包数量
let animation = null; //动画
const minWidth = 70; // 红包图片最小宽度
const maxWidth = 70; // 红包图片最大宽
let r = 0; //红包倍数
let doubleArr = []; //翻倍数组
let randomSpeed = Math.random();
let resetTime = null;
let index = 0;
//0 现金红包， 1.翻倍红包 2. 加速红包   3.空红包 openImg
const imgArr = [
    {
        openImg: '/static/images/click_redPacket.png',
        initImg:"/static/images/red_packet_rain_open.png"
    },
    {
        openImg: '/static/images/redDouble.png',
        initImg:"/static/images/red_packet_rain_open.png"
    },
    {
        openImg: '/static/images/redAccelerate.png',
        initImg:"/static/images/red_packet_rain_open.png"
    },
    {
        openImg: '/static/images/null_redPacket.png',
        initImg:"/static/images/red_packet_rain_open.png"
    }
];
export default {
    data() {
        return {
            index: 0,
            showRainTotalTime: 10,

            // 红包雨时间
            showStatus: 1,

            // 红包雨状态：1:准备倒计时，2:正在红包雨，3:红包雨结束
            rainResult: {},

            //
            showScore: 0,

            //分数
            showChangeScore: 0,

            times: 0,

            //记录点了几次
            doubleTimes: 0,

            //翻倍次数
            exhibitionArr: [
                //红包样式数组
                'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/redPacket_style1.png',
                'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/redPacket_style2.png',
                'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/redPacket_style3.png',
                'https://hyzg-app.oss-cn-beijing.aliyuncs.com/wechat-image/redPacketRain/redPacket_style4.png'
            ],

            redPacketIndex: '',

            //每一个红包的标识
            //每一个红包name字段的信息
            redPacketMes: '',

            readyTime: '',
            progressAni: '',
            randomImgNum: '',
            scoreAni: '',
            surpriseScore:'0.00',//惊喜红吧金额
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        // 是否开始展示游戏
        visible: {
            type: Boolean,
            default: false
        },
        // 游戏时间
        time: {
            type: Number,
            default: 10
        },
        //  速度
        createSpeed: {
            type: Number,
            default: 5
        },
        // 单个最小金额
        min: {
            type: Number,
            default: 0
        },
        // 单个最大金额
        max: {
            type: Number,
            default: 3
        },
        //正常红包雨速度
        normallyTimeNum: {
            type: Number,
            default: 10
        },
        //加速红包雨速度
        speedUpTimeNum: {
            type: Number,
            default: 15
        },
        serverRedArr: {
            type: Array,
            default: () => []
        },
        windowWidth: {
            type: Number,
            default: 375
        },
        windowHeight: {
            type: Number,
            default: 375
        },
        firstClickScore: {
            type: Number,
            default: 0
        }
    },
    created() {
        for (let obj of imgArr) {
			let image = new Image()
			image.src = obj.openImg
			console.log(url)
	    }
    },
    mounted() {
        //组件在视图层布局完成后执行
        let that = this;
        // 重置
        redEnvelopes = [];
        clearTimeout(readyTimer); //清除定时器
        clearTimeout(rainTimer); //清除定时器
        that.cancelCustomAnimationFrame(animation); //清除红包下落
        console.log('执行了mounted函数')
        that.showRain();
        this.$nextTick(()=>{
            that.ininProgress();
        })
        //拿到手机屏幕尺寸，修改屏幕高宽
        // console.log(this.data.windowWidth);
    },
    destroyed() {
        if (readyTimer) {
            clearInterval(readyTimer);
        }
        if (rainTimer) {
            clearInterval(rainTimer);
        }
        if (animation) {
            this.cancelCustomAnimationFrame(animation);
        }
    },
    // 获取红包数据
    methods: {
        // 开始准备倒计时
        cultdown() {
            let that = this; //拿到this
            let { readyTime } = this; // 倒计时单位秒
            //开始倒计时的定时器
            readyTimer = setInterval(function () {
                //一秒执行一次
                if (--readyTime <= 0) {
                    //如果倒计时的时间等于0，关闭定时器并且显示红包雨
                    clearInterval(readyTimer);
                    // 显示红包雨
                    that.showRain();
                }
                that.setData({
                    readyTime: readyTime //更新倒计时的值
                });
            }, 1000);
        },

        // 展示红包雨界面
        async showRain () {
            let that = this; //拿到this
            // 显示红包雨，改变状态
            this.showStatus=2
            // 初始化红包雨
            this.initRain();
            // 倒计时进度条
            // this.ininProgress();
            // 红包雨倒计时
            let showRainTotalTime = this.showRainTotalTime;
            rainTimer = setInterval(function () {
                if (--showRainTotalTime <= 0) {
                    clearInterval(rainTimer);
                    if (animation) {
                        // 结束
                        that.showRainResult();
                        that.cancelCustomAnimationFrame(animation);
                    }
                }
                that.showRainTotalTime=showRainTotalTime
            }, 1000);
        },

        // 倒计时进度条
        ininProgress() {
            console.log('生成进度条动画');
            const animation = uni.createAnimation({
                duration: this.showRainTotalTime * 1000
            });
            animation.translateX(-120).step();
            this.progressAni=animation.export()
        },

        //分数动画
        animationOfScore(x, y) {
            // const position = wx.createAnimation({
            //   duration: 0
            // })
            // position.left(x).top(y).step()
            // this.setData({
            //   scoreAni: position.export()
            // })
            // const animation = wx.createAnimation({
            //   duration: 100,
            //   timingFunction: 'step-end'
            // })
            // animation.opacity(1).step()
            // setTimeout(function () {
            //   animation.opacity(0).step()
            //   this.setData({
            //     scoreAni: animation.export()
            //   })
            // }.bind(this), 10)
        },

        // 关闭
        handleClose() {
            this.times = 0;
            r = 0;
            console.log('/触发finish事件')
            this.$emit('finish', {
                detail: this.showScore
            }); //触发finish事件
        },

        // 显示结果
        async showRainResult() {
            uni.showLoading({
                title:"加载中",
                mask:true
            })  
            let that = this;
            let userInfo={};
            if(uni.getStorageSync('userInfo')){
                userInfo = JSON.parse(uni.getStorageSync('userInfo'));
            }            
            let userGameInfo = JSON.parse(uni.getStorageSync('userGameInfo'));
            // 结束动画
            let data = {
                userId: userInfo.userId,
                userCode: userInfo.attrs.userCode,
                userMobile: userInfo.mobile,
                gameId: userGameInfo.sid,
                configId: userGameInfo.configSid,
                redpacketNumber: that.times,
                doubleRedpacketNumber: that.doubleTimes,
                redpacketAmount: that.showScore
            };
            if (this.firstClickScore != 0) {
                data.firstClick = 1;
            }
            let surpriseStatus=0;
            if(that.times!=0){
                let surpriseRes=await ship.postRequest('/hby/redPacketRecordAmount/getBigAmount',{
                    userId:userInfo.userId
                })
                console.log('surpriseRes',surpriseRes.rspBody);
                if(surpriseRes.retCode=='0000000' && surpriseRes.rspBody){
                    data.redpacketAmount=that.accAdd(data.redpacketAmount,surpriseRes.rspBody);
                    surpriseStatus=1;
                    that.showScore = data.redpacketAmount;
                    that.surpriseScore = surpriseRes.rspBody;
                }
            }
            this.showStatus = surpriseStatus==1 ? 4 : 3;
            this.cancelCustomAnimationFrame(animation); 
            this.getRandomImgNum(); 
                   
            console.log(data);
            
            let res = await ship.postRequest('/hby/redPacketRecordAmount/add', data);
            console.log('红包结果',res);           
            if (res.retCode == '0000000' && that.showScore != 0) {        
                ship.postRequest('/hby/redPacketRecordAmount/addAmount', {
                    redPacketSid: res.rspBody
                });
            }
            uni.hideLoading();
            this.index = 0;
            this.rainResult = {amount: 100}
            r = 0;
        },

        // 红包下落函数
        customRequestAnimationFrame(e) {
            let that = this;
            let timer = setTimeout(function () {
                e.call(that);
                clearTimeout(timer);
            }, 1000 / 60);
            return timer;
        },

        // 清除红包下落函数
        cancelCustomAnimationFrame (e) {
            if (e) {
                clearTimeout(e);
                animation = null;
            }
        },

        // 开始下落
        doDrawRain() {
            var context = this.context;
            var { windowWidth, windowHeight, createSpeed } = this;
            context.clearRect(0, 0, windowWidth, windowHeight);
            for (let n = 0; n < redEnvelopes.length; n += 1) {
                // console.log(redEnvelopes);
                var i = redEnvelopes[n]; // 红包
                var { x, y, vx, vy, width, height, open } = i;
                var img = open ? i.redImg : i.initImg; //更改红包封面
                var imgWidth = open ? width + 20 : width;
                var imgHeight = open ? height + 25 : height;
                context.drawImage(img, x, y, imgWidth, imgHeight);
                if (i.open && this.redPacketIndex == i.redPacketIndex) {
                    // context.setTextAlign('center')
                    // console.log(this.data.firstClickTest)
                    // if(this.data.firstClickTest=='firstClick'){
                    //   context.setFontSize(20)
                    //   context.setFillStyle('#FFD681');
                    //   context.fillText(this.data.redPacketMes, x, y)
                    //   redEnvelopes.splice(i.redPacketIndex,1);
                    //   console.log('redEnvelopes红包新数组', redEnvelopes);
                    //   this.setData({
                    //     firstClickTest:""
                    //   })
                    // }else{
                    //   console.log('正常画')
                    //   context.setFontSize(20)
                    //   context.setFillStyle('#FFD681');
                    //   context.fillText(this.data.redPacketMes, x, y)
                    // }

                    context.setFontSize(20);
                    context.setFillStyle('#FFD681');
                    context.fillText(this.redPacketMes, x, y);
                }

                //  i.x += vx
                i.y += vy + createSpeed;
                // if(i.y >= windowHeight) {
                //   if(i.speedUp) {
                //     redEnvelopes.splice(n, 1);
                //   }else {
                //     i.y = -(Math.floor(Math.random() *windowHeight)),
                //     i.x = parseInt(Math.random() * (windowWidth - minWidth)),
                //     i.open =false
                //   }
                // }
                if (i.y >= windowHeight) {
                    i.y = -Math.floor(Math.random() * windowHeight);
                    i.x = parseInt(Math.random() * (windowWidth - minWidth));
                    i.open = false;
                }
                if (i.x + width <= 0) {
                    i.x = windowWidth - width;
                    i.open = false;
                } // if (i.y > windowHeight) {
                //   delete redEnvelopes[n]
                // }
            }
            context.draw();
            // 下落函数
            animation = this.customRequestAnimationFrame(this.doDrawRain);
        },

        // 随机数
        randNum: function (min, max) {
            return Math.floor(min + Math.random() * (max - min));
        },

        // 准备红包雨下落
        initRainDrops () {
            console.log('准备红包下落')
            //屏幕宽度，屏幕高度，下落速度，单个金币最大额，单个金币最小额
            const { windowWidth, windowHeight, createSpeed, max, min, normallyTimeNum, serverRedArr } = this;
            // console.log('windowWidth', windowWidth);
            for (let n = 0; n < normallyTimeNum; n += 1) {
                var startX = parseInt(Math.random() * (windowWidth - minWidth));
                // 优化位置，防止红包越界现象，保证每个红包都在屏幕之内
                if (startX < 0) {
                    startX -= startX;
                }
                // console.log('startX', startX);
                // console.log(startX);
                const startY = -Math.floor(Math.random() * windowHeight);
                // 速度
                // const vy = 1 * randomSpeed + createSpeed
                const vy = 1 * randomSpeed;
                redEnvelopes.push({
                    x: startX,
                    y: startY,
                    redImg: imgArr[serverRedArr[index].type].openImg,
                    initImg: imgArr[serverRedArr[index].type].initImg,
                    type: serverRedArr[index].type,
                    name: serverRedArr[index].name,
                    vx: -1,
                    // x轴速度
                    vy: vy,
                    // y轴速度
                    score: serverRedArr[index].name,
                    // 红包金额
                    width: minWidth,
                    height: minWidth,
                    open: false,
                    redPacketIndex: n
                });
                console.log('redEnvelopes',redEnvelopes)
                if (index == serverRedArr.length - 1) {
                    index = 0;
                } else {
                    index++;
                }
            }
            // console.log(redEnvelopes.length);
            this.doDrawRain();
            // console.log('397',that.data.serverRedArr);
            // console.log('398',redEnvelopes);
        },

        // 点击红包事件
        handleClickRain(e) {
            let touch = e.touches[0];
            //  console.log(e.touches)
            let touchX = touch.x;
            let touchY = touch.y;
            let that = this;
            for (let o = 0; o < redEnvelopes.length; o += 1) {
                let i = redEnvelopes[o];
                let rainX = i.x;
                let rainY = i.y;
                let width = i.width;
                let height = i.height;
                let gapX = touchX - rainX;
                let gapY = touchY - rainY; // console.log('打印的红包',i);
                // console.log(that.data.serverRedArr);
                // that.setData({
                //   redPacketIndex:i.redPacketIndex
                // })
                //  console.log(gapX >= -10 && gapX <= width + 30 && gapY >= -10 && gapY <= height + 30)
                if (gapX >= -10 && gapX <= width + 30 && gapY >= -10 && gapY <= height + 30 && !i.open) {
                    let times = ++that.times;
                    let money = ''; //金钱
                    let mes = ''; //红包信息
                    let type = '';
                    // 新用户第一次点击红包金额变大
                    // console.log(i);
                    if (times == 1 && that.firstClickScore != 0) {
                        // console.log('第一次点击金额为',that.data.firstClickScore)
                        // console.log(that.data.serverRedArr);
                        // console.log(redEnvelopes);
                        money = i.score;
                        mes = i.name;
                        type = i.type;
                        console.log(money, mes, type);
                        i.name = that.firstClickScore;
                        i.score = that.firstClickScore;
                        i.type = 0;
                        // console.log(i.name,i.score,i.type);
                        // console.log(money,mes,type)
                        that.redPacketIndex = i.redPacketIndex;
                        that.redPacketMes = i.name;
                    } else {
                        that.redPacketIndex = i.redPacketIndex;
                        that.redPacketMes = i.name;
                    }

                    // that.animationOfScore(touchX,touchY,i.redPacketIndex,i.open);
                    innerAudioContext.play();
                    i.open = true;
                    let score;
                    switch (i.type) {
                        //0 现金红包， 1.翻倍红包 2. 加速红包   3.空红包
                        case 0:
                            let tmpDoubleNum = Math.floor(Math.random() * 2) + 2;
                            let doubleTotal = that.flotMul(i.score, tmpDoubleNum);
                            if (r) {
                                score = that.accAdd(that.showScore, doubleTotal);
                            } else {
                                score = that.accAdd(that.showScore, i.score);
                            }
                            that.showScore = score;
                            if (r) {
                                r = r - 1;
                            } else {
                                r = r;
                            }
                            break;
                        case 1:
                            let doubleTimes = ++this.doubleTimes;
                            that.doubleTimes=doubleTimes
                            r++;
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                    }
                    that.showChangeScore = i.name;
                    that.times = times;
                    if (mes) {
                        // console.log('money，mes，type，都存在',money,mes,type);
                        i.score = money;
                        i.name = mes;
                        i.type = type;
                        money = '';
                        mes = '';
                        type = '';
                        // console.log(i.name,i.score,i.type);
                        // console.log(money,mes,type)
                    }
                    // console.log(that.data.serverRedArr);
                    // console.log(redEnvelopes);
                    break;
                }
            }
        },

        //  浮点乘法计算
        flotMul(arg1, arg2) {
            var m = 0;
            var s1 = arg1.toString();
            var s2 = arg2.toString();
            try {
                m += s1.split('.')[1].length;
            } catch (e) {}
            try {
                m += s2.split('.')[1].length;
            } catch (e) {}
            return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
        },

        // 浮点加法计算
        accAdd(arg1, arg2) {
            var r1;
            var r2;
            var m;
            var c;
            try {
                r1 = arg1.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split('.')[1].length;
            } catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace('.', ''));
                    arg2 = Number(arg2.toString().replace('.', '')) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace('.', '')) * cm;
                    arg2 = Number(arg2.toString().replace('.', ''));
                }
            } else {
                arg1 = Number(arg1.toString().replace('.', ''));
                arg2 = Number(arg2.toString().replace('.', ''));
            }
            return (arg1 + arg2) / m;
        },

        toSlow() {
            this.resetRainAry();
            // let initNum=this.data.normallyTimeNum;
            // console.log(redEnvelopes.length == initNum, redEnvelopes.length, initNum);
            // if(redEnvelopes && redEnvelopes.length == initNum) {
            //   this.resetRainAry();
            // }
            // clearTimeout(resetTime)
            // resetTime = setTimeout(()=>{
            //   redEnvelopes.length = initNum;
            // },2000)
        },

        //  获取红包样式随机下标
        getRandomImgNum() {
            let tmpIndex = Math.floor(Math.random() * 4);
            this.randomImgNum = tmpIndex;

        },

        // 加速红包雨
        resetRainAry() {
            //屏幕宽度，屏幕高度，下落速度，单个金币最大额，单个金币最小额
            const { windowWidth, windowHeight, createSpeed, max, min, normallyTimeNum, serverRedArr } = this;
            for (let n = 0; n < normallyTimeNum; n += 1) {
                //normallyTimeNum做成全局变量，放在data里面。
                var startX = parseInt(Math.random() * (windowWidth - minWidth));
                // 优化位置，防止红包越界现象，保证每个红包都在屏幕之内
                if (startX < 0) {
                    startX -= startX;
                }
                const startY = -Math.floor(Math.random() * windowHeight);
                // 速度
                const vy = 1 * randomSpeed + createSpeed;
                redEnvelopes.push({
                    x: startX,
                    y: startY,
                    redImg: imgArr[serverRedArr[index].type].openImg,
                    initImg: imgArr[serverRedArr[index].type].initImg,
                    type: serverRedArr[index].type,
                    name: serverRedArr[index].name,
                    vx: -1,
                    // x轴速度
                    vy: vy,
                    // y轴速度
                    score: serverRedArr[index].name,
                    // 红包金额
                    width: minWidth,
                    height: minWidth,
                    open: false,
                    speedUp: true
                });
                if (index == serverRedArr.length - 1) {
                    index = 0;
                } else {
                    index++;
                }
            }
            // this.doDrawRain();
        },

        // 初始化 canvas
        initRain () {
            this.context = uni.createCanvasContext('rain-canvas', this); //创建画布组件实例
            ///定义一个全局的红包样式
            this.redEnvelopeImg = '/static/images/redPacket/red_packet_rain_open.png';
            // 初始化红包雨
            this.initRainDrops(); // 音效
            this.audioOfClick();
        },

        audioOfClick() {
            innerAudioContext.autoplay = false;
            innerAudioContext.src = 'https://www.sunniejs.cn/static/weapp/dianji.mp3';
            innerAudioContext.onPlay(() => {});
            innerAudioContext.onError((res) => {});
        },

        canvasIdErrorCallback() {
            console.log('占位：函数 canvasIdErrorCallback 未声明');
        }
    }
};
</script>
<style>
@import './solRedPacketRain.css';
</style>
