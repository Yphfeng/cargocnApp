import { BASEURL_OIL } from "@/utils/baseUrl";
const ApiRootUrl = BASEURL_OIL;
// const ApiRootUrl = 'https://local-oilsir.cargocn.com';
// const ApiRootUrl = 'http://3419w32r88.qicp.vip';
// const ApiRootUrl = 'http://172.16.10.91:10183';
//wss://test-smn.oilsir.cn/12c65ed107762047bd558d76ce1a92ea?
// 正式环境appid  wx57ddc5d61b799b9b
// 测试环境appid  wx6ff40e2f41b24a1d

/*
  司机登录接口 "mobile": "18435161485",
  "password": "222222",
  13601725420/123456
*/
// var proKey = "EXDBZ-LL436-BRDSW-EUJA2-XD46Z-4EF54";   //腾讯地图key  正式环境
// var proKey = "JEIBZ-KLA62-FLOUC-CF6K4-NDRU5-WVFA4"    //腾讯地图key 測試环境

var proKey = "";

if (ApiRootUrl.indexOf('www') > -1) {
  proKey = "JEIBZ-KLA62-FLOUC-CF6K4-NDRU5-WVFA4";
} else {
  proKey = "EXDBZ-LL436-BRDSW-EUJA2-XD46Z-4EF54";
}

module.exports = {
  tentCentMapKey: proKey,
  basePath: ApiRootUrl,

  /***************登录相关*********/
  serviceContract: ApiRootUrl + '/bs/agreement/own',
  // 服务协议
  privacyPolicy: ApiRootUrl + '/bs/agreement/regist',
  // 上海银行对客

  /* 
    获取验证码 
    mobile
    userType
    verifyMode
  */
  getCode: ApiRootUrl + "/verification/mobile",

  /*
  校验用户输入的验证码
  */
  checkCode: ApiRootUrl + "/verification/mobile/verify",

  /*
  注册前调用验证此手机号是否可注册
  */
  checkMobile: ApiRootUrl + "/au/user/checkmobile",

  /*
  注册前调用验证此用户名是否可注册
  */
  checkUser: ApiRootUrl + "/au/user/checkloginid",

  /*
  注册
  */
  registerUser: ApiRootUrl + "/au/user/register",

  /* 
    司机登录接口 
  */
  login: ApiRootUrl + "/au/login",

  /* 
  绑定微信 
  */
  wxbind: ApiRootUrl + "/au/user/wx/bind",

  /* 
    解绑微信 
  */
  unwxbind: ApiRootUrl + "/au/user/wx/unbind",

  /*
  修改密码
  */
  changePwd: ApiRootUrl + "/au/user/password",

  /****************首页油站*****************/

  /* 
  油品列表 
  */
  fuelitem: ApiRootUrl + "/om/fuelitem/list",
  //修改支付状态
  modifyPayStatus: ApiRootUrl + '/om/order/modifyPayStatus',

  /* 
    油站列表 
  */
  oilstationList: ApiRootUrl + "/au/station/findpage",

  /*
    范围内油站/au/station/list
  */
  oilstationMapList: ApiRootUrl + "/au/station/list",

  /*
  油站详情
  */
  oilstationDetail: ApiRootUrl + "/au/station/detail",

  /*
    司机油卡列表
  */
  driverOilcardList: ApiRootUrl + "/fm/fuelcard/list",

  /*
  获取油卡的secret用来生成二维码
  */
  getCardSecret: ApiRootUrl + "/fm/fuelcard/secret",

  /*
  通过油站二维码获取油站信息
  */
  getoilstationInfoByQrcode: ApiRootUrl + "/au/station/secret/get",

  /*
  司机支付加油订单
  */
  payForOil: ApiRootUrl + "/om/order/pay",

  /*
    司机混合支付银行卡列表
  */
  mixPayBankList: ApiRootUrl + "/md/user/bank/cash/list",

  /*
  获取订单列表
  */
  getOrderList: ApiRootUrl + "/om/order/driver/findpage",

  /*
  获取充值记录列表
  */
  getRecordsList: ApiRootUrl + "/fm/fuelcard/recharge/findpage",

  /*
    银行卡列表
  */
  bankList: ApiRootUrl + "/md/user/bank/list",

  /*
  设置默认银行卡
  */
  setBankDefault: ApiRootUrl + "/md/user/bank/set/default",

  /*
  删除银行卡
  */
  deleteBank: ApiRootUrl + "/md/user/bank/delete",

  /*
  添加银行卡/md/user/bank/save
  */
  saveBank: ApiRootUrl + "/md/user/bank/save",

  /*
  绑定电子银行卡
  */
  bindBank: ApiRootUrl + "/md/user/bank/change/bind",

  /*
    获取司机信息
  */
  getDriverInfo: ApiRootUrl + "/au/user/detail",

  /*
    获取车辆列表
  */
  getCarList: ApiRootUrl + "/md/vehicle/list",

  /*
  添加车辆
  */
  saveCarInfo: ApiRootUrl + "/au/user/vehicleAC",

  /*
  行驶证OCR识别/file/ocr/driving
  */
  drivingCardOcr: ApiRootUrl + "/file/ocr/driving",

  /*
  身份证OCR识别
  */
  idCardOcr: ApiRootUrl + "/file/ocr/idCard",

  /*
  驾驶证证OCR识别/file/upload
  */
  driverCardOcr: ApiRootUrl + "/file/ocr/drivinglicense",

  /*
  保存图片
  */
  saveImage: ApiRootUrl + "/file/upload",

  /*
  保存图片
  */
  driverVerify: ApiRootUrl + "/au/user/driverAC",

  /*
  设置支付密码
  */
  setPayPwd: ApiRootUrl + "/au/user/pay/password/init",

  /*
  重置支付密码
  */
  resetPayPwd: ApiRootUrl + "/au/user/pay/password",

  /*
  检测支付密码
  */
  checkPayPwd: ApiRootUrl + "/au/user/pay/password/check",

  /*
    获取银行卡code
  */
  getBankCode: ApiRootUrl + "/md/sh/bank/bankcode/list",

  /*
    绑定卡往联名卡转账
  */
  transferByBindcard: ApiRootUrl + "/md/sh/bank/pay/transfer",
  //转入
  rechargeByBindcard: ApiRootUrl + "/fm/driver/withdraw/bank/withdraw",
  //转出

  /*
    银行账户信息查询
  */
  getBankInfo: ApiRootUrl + "/au/user/sh/account/info",

  /*
    油卡自助充值
  */
  oilcardTransfer: ApiRootUrl + "/fm/fuelcard/self/recharge",

  /*
  司机银联转账流水
  */
  billTransferList: ApiRootUrl + "/fm/driver/transfer/findpage",

  /*
  司机银联支付流水
  */
  billWithdrawList: ApiRootUrl + "/fm/driver/withdraw/findpage",
  // 获取二维码
  bankGetQrno: ApiRootUrl + "/md/user/bank/getQrno",
  //获取银联消费流水
  consumeFindpage: ApiRootUrl + "/fm/driver/consume/findpage",
  //积分商品
  pointsGoods: ApiRootUrl + "/au/points/goods/get",
  //积分记录
  pointsDetailList: ApiRootUrl + "/au/points/record/get",
  //添加推广
  addPromotionSite: ApiRootUrl + "/au/promotion/add",
  //获取推广
  getPromotionSite: ApiRootUrl + "/au/promotion/get",
  //获取油站所有数据
  getSiteInfo: ApiRootUrl + "/md/dict/findAll",
  getInfo: ApiRootUrl + "/md/dict/find",
  //司机加油获取油品列表
  getOilList: ApiRootUrl + "/om/fuels/driver/list",
  //司机加油获取加油枪
  getOilGun: ApiRootUrl + "/om/fuelgun/list",
  //获取抽奖
  getLottery: ApiRootUrl + "/au/lottery/get",
  //券市场列表
  getCouponList: ApiRootUrl + "/au/coupon/market/get",
  //领取优惠券
  getCoupon: ApiRootUrl + "/au/coupon/market/receive",
  //点击抽奖
  clickLottery: ApiRootUrl + "/au/lottery/lottery",
  //获取中奖信息
  clickLotteryInfo: ApiRootUrl + "/au/lottery/record",
  //订单金额可/不使用优惠券列表
  findUseCoupon: ApiRootUrl + "/au/coupon/findUseCoupon",
  //订单计算
  calCouponPrice: ApiRootUrl + "/om/order/calCouponPrice",
  //兑换商品
  pointsGoodsExchange: ApiRootUrl + "/au/points/goods/exchange",
  addVip: ApiRootUrl + "/fm/fuelcard/station/add",
  getCouponInfoList: ApiRootUrl + "/au/coupon/getSelective",
  getPoints: ApiRootUrl + "/au/points/get",
  //优惠券使用规则
  getCouponInfor: ApiRootUrl + "/au/coupon/getCouponById",
  // 转发优惠券
  forwardCoupon: ApiRootUrl + "/au/coupon/forward/send",
  // 转发优惠券领取
  receiveCoupon: ApiRootUrl + "/au/coupon/forward/receive",
  // 司机获取奖励
  count: ApiRootUrl + "/au/award/count",
  // 拼团获取详情
  getById: ApiRootUrl + "/au/station/detail/getById",
  // 发起拼团订单
  launchAgroup: ApiRootUrl + "/au/company/groupon/launchAgroup",
  // 取消拼团订单
  cancelGrouponOrder: ApiRootUrl + "/om/order/cancelGrouponOrder",
  // 获取paytoken
  getPayToken: ApiRootUrl + "/au/station/getPayToken",
  // 展示加油类型
  showGroupOnOrderInfo: ApiRootUrl + "/au/company/groupon/showGroupOnOrderInfo",
  // 根据拼团单号获取信息
  getGroupon: ApiRootUrl + "/om/order/getOrderInfoByGrouponNo",
  fallDownPrice: ApiRootUrl + "/api/ty/fallPrice",
  //查询团油支付时的直降金额
  returnPrice: ApiRootUrl + "/om/order/refundApply",
  //申请退款
  cardCount: ApiRootUrl + "/fm/fuelcard/cardCount",
  //车队卡数量
  submitActivity: ApiRootUrl + "/au/activityEvents/lantern/add",
  //提交参加活动信息
  getActivityItems: ApiRootUrl + "/au/activityEvents/lantern/getStatus",
  //活动状态查询
  getWxBindPhoneNum: ApiRootUrl + "/au/user/wx/getWxBindPhoneNum",
  //获取微信绑定的手机号
  personAC: ApiRootUrl + "/au/user/personAC",
  //判断是否实名认证
  getUserInfo: ApiRootUrl + "/au/user/getInitSession_UserInfo",
  //获取用户信息
  getRefuelInfo: ApiRootUrl + "/au/wjyStation/getRefuelInfo",
  //获取加油凭证
  getRefuelPayInfo: ApiRootUrl + "/au/wjyStation/getRefuelPayInfo",
  //获取支付凭证
  getNationDict: ApiRootUrl + '/au/station/getNationDict' ,//省市区获取
  getSqUrl: ApiRootUrl + '/api/ty/getSqUrl',    //获取上汽数据

};