import configUrl from './config.js';

export const request = (options)=>{
	var BASE_URL = configUrl.ApiUrl;
	console.log("请求的URL:",BASE_URL + options.url);
	// uni.showLoading({
	//   mask: true
	// })
	return new Promise((resolve,reject)=>{
		uni.request({
			url:BASE_URL + options.url,
			method:options.method || 'GET',
			data:options.data || {},
			sslVerify: false,
			success:(res)=>{
				if (res.statusCode !== 200) {
					return uni.showModal({
						showCancel: false,
						confirmColor: "#338dc0",
						content: options.url.split("/")[options.url.split("/").length-1] + ' 获取数据失败[statusCode:'+ res.statusCode +']'
					})
				}
				resolve(res)
			},
			fail:(err)=>{
				console.log("请求失败的原因：",err)
				uni.showToast({
					icon: 'error',
					title:'请求失败'
				})
				reject(err)
			}
			// complete() {
			// 	uni.hideLoading();
			// }
		})
	})
}