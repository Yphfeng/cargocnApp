import callCheckVersion from './call-check-version'

// 推荐再App.vue中使用
const PACKAGE_INFO_KEY = '__package_info__'

export default function(callback) {
	// #ifdef APP-PLUS
	callCheckVersion().then(async (e) => {
		if (!e.result) return;
		const {
			code,
			message,
			is_silently, // 是否静默更新
			url, // 安装包下载地址
			platform, // 安装包平台
			type // 安装包类型
		} = e.result;

		// 此处逻辑仅为实例，可自行编写
		if (code > 0) {
			// 腾讯云和阿里云下载链接不同，需要处理一下，阿里云会原样返回
			const {
				fileList
			} = await uniCloud.getTempFileURL({
				fileList: [url]
			});
			e.result.url = fileList[0].tempFileURL

			// 静默更新，只有wgt有
			if (is_silently) {
				uni.downloadFile({
					url: e.result.url,
					success: res => {
						if (res.statusCode == 200) {
							// 下载好直接安装，下次启动生效
							plus.runtime.install(res.tempFilePath, {
								force: false
							});
						}
					}
				});
				return;
			}

			/**
			 * 提示升级一
			 * 使用 uni.showModal
			 */
			// return updateUseModal(e.result)

			/**
			 * 提示升级二
			 * 官方适配的升级弹窗，可自行替换资源适配UI风格
			 */
			uni.setStorageSync(PACKAGE_INFO_KEY, e.result)
			uni.navigateTo({
				url: `/uni_modules/uni-upgrade-center-app/pages/upgrade-popup?local_storage_key=${PACKAGE_INFO_KEY}`,
				success: res =>{
					callback(1)
				},
				fail: (err) => {
					console.error('更新弹框跳转失败', err)
					uni.removeStorageSync(PACKAGE_INFO_KEY)
					callback(0)
				}
			})
		} else if (code < 0) {
			// TODO 云函数报错处理
			console.error(message)
			callback(0)
		} else{
			callback(0)
		}
	}).catch(err => {
		// TODO 云函数报错处理
		console.error(err.message)
		callback(0)
	})
	// #endif
}

/**
 * 使用 uni.showModal 升级
 */
function updateUseModal(packageInfo) {
	const {
		title, // 标题
		contents, // 升级内容
		is_mandatory, // 是否强制更新
		url, // 安装包下载地址
		platform, // 安装包平台
		type // 安装包类型
	} = packageInfo;

	let isWGT = type === 'wgt'
	let isiOS = !isWGT ? platform.includes('iOS') : false;
	let confirmText = isiOS ? '立即跳转更新' : '立即下载更新'

	return uni.showModal({
		title,
		content: contents,
		showCancel: !is_mandatory,
		confirmText,
		success: res => {
			if (res.cancel) return;

			// 安装包下载
			if (isiOS) {
				plus.runtime.openURL(url);
				return;
			}

			uni.showToast({
				title: '后台下载中……',
				duration: 1000
			});

			// wgt 和 安卓下载更新
			downloadTask = uni.downloadFile({
				url,
				success: res => {
					if (res.statusCode !== 200) {
						console.error('下载安装包失败', err);
						return;
					}
					// 下载好直接安装，下次启动生效
					plus.runtime.install(res.tempFilePath, {
						force: false
					}, () => {
						if (is_mandatory) {
							//更新完重启app
							plus.runtime.restart();
							return;
						}
						uni.showModal({
							title: '安装成功是否重启？',
							success: res => {
								if (res.confirm) {
									//更新完重启app
									plus.runtime.restart();
								}
							}
						});
					}, err => {
						uni.showModal({
							title: '更新失败',
							content: err
								.message,
							showCancel: false
						});
					});
				}
			});
		}
	});
}
