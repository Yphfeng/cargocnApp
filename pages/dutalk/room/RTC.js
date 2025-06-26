export default function(self){
	let globalEvent = uni.requireNativePlugin('globalEvent');
	globalEvent.addEventListener('uniLoading',(res)=>{
		console.log(res,'调用loading');
		let action = Number(res);
		action&&uni.showLoading({});
		!action&&uni.hideLoading();
	});
	globalEvent.addEventListener('sendPermissionEvent',(res)=>{
		uni.setStorageSync('mic',res);
	});
	globalEvent.addEventListener('unitoast',(res)=>{
		uni.showModal({
			title:'app调试log',
			content:res
		});
	});
	return new Promise((reslove)=>{
		uni.showLoading({
			title:'正在加载'
		});
		if(uni.getSystemInfoSync().platform == 'ios'){
			self.RTC = uni.requireNativePlugin('DJRTCModule');
		}else{
			self.RTC = uni.requireNativePlugin('DJUniRTCModule')
		}
		console.log(self.RTC,'rtc--------------->');
		self.RTC.initialize((res)=>{
			console.log(res);
			if(uni.getSystemInfoSync().platform == 'ios'){
				if(res.data.microphone){
					uni.setStorageSync('mic',true);
				}else{ uni.setStorageSync('mic',false); }//是否用户点击确认麦克风
			}
			self.RTC.speakerOn(()=>{console.log('--打开公放--');});
			reslove();
		});
		return;
	});
}
