import api from "../config/api";
import * as utils from "@/utils/ship.js";
import { SOCKET_HJ } from "@/utils/baseUrl";
export function send(sn) {
	var app = getApp();
  var message = {
    action: "remoteOperation",
    param: {
      sn: sn
    }
  };
  app.globalData.consignorSocketTask.send({
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
	var app = getApp();
	var that = this;
   
	// var longUrl = "ws://192.168.10.70:2235/ws-message02/"; // 测试环境
	var longUrl = SOCKET_HJ; //生产环境

	var userInfo = uni.getStorageSync("userInfo");
	if (!userInfo) return;
	var userRole = uni.getStorageSync("userRole");
	var userId;
	if (userRole == 1) {
		userId = JSON.parse(userInfo).userId
	} else {
		// userId = 3333;
		userId = JSON.parse(userInfo).userId;
	}
	// console.log(uni.getStorageSync("userInfo"), '用户信息');
	// console.log(longUrl + JSON.parse(userInfo).userId);
	
	app.globalData.consignorSocketTask = uni.connectSocket({
		url: longUrl + userId,
		header: {
		  'content-type': 'application/json'
		},
		protocols: [],
		method: 'GET',
		success: function (res) {
		  // console.log('WebSocket 连接成功', longUrl + userId);
		},
		fail: function (err) {
		  console.log(err);
		  longEvent(self, complete);
		}
	});
  
	app.globalData.consignorSocketTask.onClose(res => {
		console.log('监听交易 WebSocket 连接关闭事件', res);
		// app.globalData.consignorSocketTask.close();
		// longEvent(self, complete);
		// app.globalData.consignorSocketTask = null;
	});
	app.globalData.consignorSocketTask.onOpen(res => {
		console.log('监听 WebSocket 连接打开事件。', res);
		//收到事件信息
	});
	app.globalData.consignorSocketTask.onError(err => {
		// console.log('监听 WebSocket 连接错误事件', err);
		// setTimeout(() => {
		// 	longEvent(self, complete);
		// }, 30000);
	});
	app.globalData.consignorSocketTask.onMessage((res) => {
		// console.log("收到服务器内容111：" + res.data);
	});
}