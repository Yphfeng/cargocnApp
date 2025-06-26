import makeData from '../index/https/index.js';
import { SERVER_URL } from '../index/config/index.js'
const preload =  function(option,self){
	let options = JSON.parse(JSON.stringify(option));
	let sys = uni.getSystemInfoSync();
	// options.mobile = '18267832592';
	// options.openId = sys.deviceId;
	// options.name = '大奖'+sys.model + sys.deviceId;
	return new Promise((reslove,reject)=>{
		console.log('---->发起请求',SERVER_URL+'/sdk/beforeJoin',options);
		let pass = true;
		for(let x in option){
			(x!='avatar')&&(x!='name')&&!option[x]&&(pass = false);
		}
		if(!pass){
			uni.showModal({
				title:'参数不存在，请检查',
				showCancel:!1,
				content:JSON.stringify(options),
				success() {
					uni.navigateBack({});
				}
			});
			return
		};
		uni.request({
			url:SERVER_URL+'/app-info/check',
			method:'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
			},
			timeout:60000,
			sslVerify:false,
			data:makeData({appId:options.appId}),
			success(res) {
				if(res.data.result === 1){
					uni.showModal({
						title:'提示',
						content:res.data.msg,
						showCancel:!1
					});
					return;
				}
				if(res.data.result == -2){
					self.webshow = true;
					return
				}
				if(res.data.result == -3){
					uni.showModal({
						title:'提示',
						content:res.data.msg
					})
					return
				}
				console.log(res,'<--------token');
				uni.setStorageSync('appId',options.appId);
				delete options.appId;
				let bdata = makeData({...options});
				console.log(bdata,'bdata');
				uni.request({
					url:SERVER_URL+'/sdk/beforeJoin',
					method:'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					timeout:6000,
					sslVerify:false,
					data:bdata,
					success(res) {
						console.log(res);
						if(res.data.result === 1){
							uni.showModal({
								title:'提示',
								content:res.data.msg,
								showCancel:!1
							});
							return;
						}
						reslove(res.data.data);
					},
					fail(err) {
						console.log(err);
					}
				})
			},
			fail(err) {
				console.log(err);
			}
		})
		
	});
}
export { preload }