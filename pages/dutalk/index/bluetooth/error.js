import blueth from "./main.js";
export default class errors {
	constructor(arg) {
		let error_info = null;
		const app = getApp();
	    switch (arg.type){
	    	case 'blueth':
				switch (Number(arg.code)){
					case 0:
						error_info = true;
						break;
					case 1000:
						error_info = '未初始化蓝牙适配器,请确保手机蓝牙已打开';
						uni.closeBluetoothAdapter({success(){
							app.globalData.blueth = new blueth(app);
						}});
						uni.navigateBack();
						break;
					case 10001:
						error_info = '当前蓝牙适配器不可用,请确保手机蓝牙已打开';
						uni.closeBluetoothAdapter({success(){
							app.globalData.blueth = new blueth(app);
						}});
						uni.navigateBack();
						break;
					case 10002:
						error_info = '没有找到指定设备';
						break;
					case 10003:
						error_info = '连接失败';
						break;
					case 10004:
						error_info = '没有找到指定服务';
						break;
					case 10005:
						error_info = '没有找到指定特征值';
						break;
					case 10006:
						error_info = '当前连接已断开';
						break;
					case 10007:
						error_info = '当前特征值不支持此操作';
						break;
					case 10008:
						error_info = '其余所有系统上报的异常';
						break;
					case 10009:
						error_info = '安卓系统版本低于 4.3 不支持 BLE';
						break;
					case 10012:
						error_info = '连接超时';
						break;
					case 10013:
						error_info = '连接 deviceId 为空或者是格式不正确';
						break;
					default:
						error_info = true;
						break;
				}
	    		break;
	    	default:
	    		break;
	    }
		this.errmsg = error_info;
	}
}