import { SCOKET_URL } from '../index/config/index.js';
export default function recordObj(self,info){
	let globalEvent = uni.requireNativePlugin('globalEvent');
	globalEvent.addEventListener('socketConnectSuccess',(res)=>{
		console.log(res,'scoket连接成功');
		self.scoketconnect = true;
	});
	globalEvent.addEventListener('console',(res)=>{
		console.log(res,'----------------------------------打印输出------------------------------------');
	});
	globalEvent.addEventListener('socketConnectFailure',(res)=>{
		console.log(res,'scoket连接失败');
		self.scoketconnect = false;
		uni.showModal({
			title:'',
			content:"scoket连接失败",
			showCancel:!1
		});
	});
	globalEvent.addEventListener('weakNetworkTip',(res)=>{
		// uni.showToast({
		// 	title:'当前网络信号差',
		// 	icon::'none'
		// });
		uni.showToast({
			title:'当前网络信号差',
			icon:'none'
		})
	});
	//
	return new Promise((reslove)=>{
		uni.showLoading({
			title:'正在加载'
		});
		if(uni.getSystemInfoSync().platform == 'ios'){
			self.records = uni.requireNativePlugin('DJRTCOpusModule');
			console.log(self.records,'record',info);
		}else{
			self.records = uni.requireNativePlugin('DJUniRTCModule');
			console.log(self.records,'record',info);
		}
		self.records.initialize({userId:info.id,roomId:info.roomid,host:SCOKET_URL,port:'7777'},(res)=>{
			console.log(res,'<------');
			(Number(res.result) === 0)&&reslove();
			(Number(res.result) === 1)&&uni.showModal({
				title:'提示',
				content:"初始化失败",
				showCancel:!1
			});
		});
	})
}