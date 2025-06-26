export default function() {
	// #ifdef APP-PLUS
	return new Promise((resolve, reject) => {
		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			// console.log('__UNI__EBABD02', plus.runtime.appid);
			uniCloud.callFunction({
				name: 'check-version',
				data: {
					// appid: plus.runtime.appid,
					// appVersion: plus.runtime.version,
					// wgtVersion: widgetInfo.version,
					appid: '__UNI__EBABD02',
					appVersion: '2.0.7',
					wgtVersion: '1.0.0'
				},
				success: (e) => {
					console.log(e, '热更新错误11111111111')
					resolve(e)
					
				},
				fail: (error) => {
					reject(error)
					console.log(error, '热更新错误11111111111')
				}
			})
		})
	})
	// #endif
	// #ifndef APP-PLUS
	return new Promise((resolve, reject) => {
		reject({
			message: '请在App中使用'
		})
	})
	// #endif
}
