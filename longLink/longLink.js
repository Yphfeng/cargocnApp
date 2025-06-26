import api from "../config/api";
import { SOCKET_OIL } from "@/utils/baseUrl";
var app = getApp();




//心跳检测
var heartCheck = {
  timeout: 3000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function(){
	console.log('start');
	var self = this;
	this.timeoutObj && clearTimeout(this.timeoutObj);
	this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
	var userId = uni.getStorageSync('driverInfo').userId;
	this.timeoutObj = setTimeout(function(){
	  //这里发送一个心跳，后端收到后，返回一个心跳消息，
		console.log('55555');
		var data = {"type":"personal","userId": userId,"data": {type: 'heartCheck'}}
		// console.log(data,'撒手1');
		
		app.globalData.socketTask.send({
		  data: JSON.stringify(data),
		});
		self.serverTimeoutObj = setTimeout(function() {
			console.log(111);
			// uni.closeSocket();
			app.globalData.socketTask.close();
	  }, self.timeout);

	}, this.timeout)
  }
}


export function send(sn) {
  var message = {
    action: "remoteOperation",
    param: {
      sn: sn
    }
  };
  app.globalData.socketTask.send({
    data: JSON.stringify(message),
    success: function (res) {
      console.log(res);
    },
    fail: function (err) {
      console.log(err);
    }
  });
}
export function longEvent(self, complete) {
  var that = this;
  var longUrl = '';

 //  if (api.basePath.indexOf('8446') != -1) {
 //    // longUrl = "ws://yxs-test.oilsir.cn:48400/12c65ed107762047bd558d76ce1a92ea?";
	//  longUrl = "wss://test-smn.oilsir.cn:8451/12c65ed107762047bd558d76ce1a92ea?"
 //  } else {
 //    // longUrl = "wss://smn.oilsir.cn/12c65ed107762047bd558d76ce1a92ea?";
	// longUrl = "ws://123.56.243.146:48400/12c65ed107762047bd558d76ce1a92ea?"
 //  }
 longUrl = SOCKET_OIL;
 

  console.log(longUrl + "authorization=" + uni.getStorageSync('token') + "&userId=" + uni.getStorageSync('driverInfo').userId, "油的webwsocket");
  app.globalData.socketTask = uni.connectSocket({
    url: longUrl + "authorization=" + uni.getStorageSync('token') + "&userId=" + uni.getStorageSync('driverInfo').userId,
    header: {
      'content-type': 'application/json'
    },
    protocols: [],
    method: 'GET',
    success: function (res) {
      console.log('WebSocket 连接成功', res);
    },
    fail: function (err) {
      console.log(err);
      longEvent(self, complete);
    }
  });
  app.globalData.socketTask.onClose(res => {
    console.log('监听 WebSocket 连接关闭事件', res);
    app.globalData.socketTask.close();
	app.globalData.socketTask = null;
	// var longLink = uni.getStorageSync("longLink");
	// console.log(longLink, 'qqq')
	// if (longLink) {
	// 	longEvent(self, complete);
	// }
  });
  
  
  app.globalData.socketTask.onOpen(res => {
    console.log('监听 WebSocket 连接打开事件。', res);
	heartCheck.start();
	
  });
  
  app.globalData.socketTask.onMessage((res) => {
  	
	heartCheck.start();
	
	var content = JSON.parse(res.data);
	// console.log("收到服务器内容：", content);
	var contentObj = JSON.parse(content.data);
	var orderInfo = contentObj.orderInfo;
	var couponInfo = contentObj.couponInfo;
	var pages = getCurrentPages();
	var currPage = pages[pages.length - 1];
	
	if (currPage.route == "pages/jymPages/oilstation/oilstationDetail/oilstationDetail") {
	  var stationInfo = contentObj.stationInfo; //如果是在当前油站信息页面就不需要重新打开油站信息页面
		console.log("哈哈哈哈哈哈哈哈")
	//   if (stationInfo.id == currPage.data.stationId) {
	//     // orderInfo.stationId = stationInfo.id;
	//     // orderInfo.stationType = 5;
	//     // currPage.$vm.showPay = true;
	//     //   currPage.$vm.showStation = false;
	//     //   currPage.$vm.popUpOrderInfo = orderInfo;
	//     //   currPage.$vm.couponInfor = couponInfo;
		// var data = orderInfo;
		// data.stationType = 5;
		// data.stationId = stationInfo.id;
		// uni.redirectTo({
		//   url: '/pages/jymPages/oilstation/oilstationDetail/oilstationDetail?push=1&pushInfo=' + JSON.stringify(data) + '&stationInfo=' + JSON.stringify(stationInfo) + '&couponInfo=' + JSON.stringify(couponInfo)
		// });
	//   } else {
	    var data = orderInfo;
	    data.stationType = 5;
	    data.stationId = stationInfo.id;
	    uni.redirectTo({
	      url: '/pages/jymPages/oilstation/oilstationDetail/oilstationDetail?push=1&pushInfo=' + JSON.stringify(data) + '&stationInfo=' + JSON.stringify(stationInfo) + '&couponInfo=' + JSON.stringify(couponInfo)
	    });
	  // }
	} else {
	  var data = orderInfo;
	  console.log("嘻嘻嘻嘻嘻")
	  data.stationType = 5;
	  var stationInfo = contentObj.stationInfo;
	  data.stationId = stationInfo.id;
	  uni.navigateTo({
	    url: '/pages/jymPages/oilstation/oilstationDetail/oilstationDetail?push=1&pushInfo=' + JSON.stringify(data) + '&stationInfo=' + JSON.stringify(stationInfo) + '&couponInfo=' + JSON.stringify(couponInfo)
	  });
	}
  });
 //  uni.onSocketMessage(function (res) {
 //    // clearTimeout(longTimer);
	// heartCheck.start();
 //    console.log(res);
 //    var content = JSON.parse(res.data);
 //    console.log("收到服务器内容：", content);
 //    var contentObj = JSON.parse(content.data);
 //    console.log(contentObj);
 //    var orderInfo = contentObj.orderInfo;
 //    var couponInfo = contentObj.couponInfo;
 //    var pages = getCurrentPages();
 //    var currPage = pages[pages.length - 1];

 //    if (currPage.route == "pages/jymPages/oilstation/oilstationDetail/oilstationDetail") {
 //      var stationInfo = contentObj.stationInfo; //如果是在当前油站信息页面就不需要重新打开油站信息页面
	// 	console.log("哈哈哈哈哈哈哈哈")
 //    //   if (stationInfo.id == currPage.data.stationId) {
 //    //     // orderInfo.stationId = stationInfo.id;
 //    //     // orderInfo.stationType = 5;
 //    //     // currPage.$vm.showPay = true;
 //    //     //   currPage.$vm.showStation = false;
 //    //     //   currPage.$vm.popUpOrderInfo = orderInfo;
 //    //     //   currPage.$vm.couponInfor = couponInfo;
	// 	// var data = orderInfo;
	// 	// data.stationType = 5;
	// 	// data.stationId = stationInfo.id;
	// 	// uni.redirectTo({
	// 	//   url: '/pages/jymPages/oilstation/oilstationDetail/oilstationDetail?push=1&pushInfo=' + JSON.stringify(data) + '&stationInfo=' + JSON.stringify(stationInfo) + '&couponInfo=' + JSON.stringify(couponInfo)
	// 	// });
 //    //   } else {
 //        var data = orderInfo;
 //        data.stationType = 5;
 //        data.stationId = stationInfo.id;
 //        uni.redirectTo({
 //          url: '/pages/jymPages/oilstation/oilstationDetail/oilstationDetail?push=1&pushInfo=' + JSON.stringify(data) + '&stationInfo=' + JSON.stringify(stationInfo) + '&couponInfo=' + JSON.stringify(couponInfo)
 //        });
 //      // }
 //    } else {
 //      var data = orderInfo;
	//   console.log("嘻嘻嘻嘻嘻")
 //      data.stationType = 5;
 //      var stationInfo = contentObj.stationInfo;
 //      data.stationId = stationInfo.id;
 //      uni.navigateTo({
 //        url: '/pages/jymPages/oilstation/oilstationDetail/oilstationDetail?push=1&pushInfo=' + JSON.stringify(data) + '&stationInfo=' + JSON.stringify(stationInfo) + '&couponInfo=' + JSON.stringify(couponInfo)
 //      });
 //    }
 //  });
}
