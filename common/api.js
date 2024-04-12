import {
	request
} from './request.js';
import util from './util.js';

var _self = this;
var requestInfo = {
	request_success_msg: '响应成功'
}

export default {
	requestInfo,
	//登录
	login(username, password) {
		return request({
			url: 'User/Login?username=' + username + '&pwd=' + password,
			method: 'GET'
		})
	},
	//获取当日发货计划信息
	getTodayPlan(pageIndex, pageSize, inUnison) {
		return request({
			url: 'Shipment/GetTodayPlan?pageIndex=' + pageIndex + "&pageSize=" + pageSize + "&inUnison=" +
				inUnison,
			method: 'GET'
		})
	},
	//获取计划包装详情
	async getPlanPackage(deliveryNo, productPn) {
		const respone = await request({
			url: 'Shipment/GetPlanPackage?deliveryNo=' + (deliveryNo ?? "") +
				"&productPn=" + (productPn ?? ""),
			method: 'GET'
		})

		let res = respone.data;
		if (res.code == 200) {
			return res.data
		} else {
			uni.showToast({
				icon: 'none',
				title: res.info
			})
			return false
		}
	},
	//获取快递信息
	async getExpressInfo(pageIndex, pageSize, express) {
		const respone = await request({
			url: 'Shipment/GetExpressInfo?pageIndex=' + pageIndex + "&pageSize=" + pageSize +
				"&express=" + express + "&isUse=true",
			method: 'GET'
		})

		let res = respone.data;
		if (res.code == 200) {
			return res.data
		} else {
			uni.showToast({
				icon: 'none',
				title: res.info
			})
			return false
		}
	},
	//扫描后获取包装信息
	async getPackageInfo(deliveryNo, boxId) {
		const respone = await request({
			url: 'Shipment/GetPackageInfo?deliveryNo=' + deliveryNo + "&boxId=" + boxId,
			method: 'GET'
		})
		return respone.data
	},
	//获取客户产品可排量是否充足
	async isBalanceQtyEnough(deliveryId, gap) {
		const respone = await request({
			url: 'Shipment/IsBalanceQtyEnough?deliveryId=' + deliveryId + "&gap=" + gap,
			method: 'GET'
		})

		let res = respone.data;
		if (res.code == 200) {
			return res.data
		} else {
			uni.showToast({
				icon: 'none',
				title: res.info
			})
			return false
		}
	},
	//获取客户产品其他计划的在排量
	async haveInPlanQty(deliveryId) {
		const respone = await request({
			url: 'Shipment/HaveInPlanQty?deliveryId=' + deliveryId,
			method: 'GET'
		})

		let res = respone.data;
		if (res.code == 200) {
			return res.data
		} else {
			uni.showToast({
				icon: 'none',
				title: res.info
			})
			return false
		}
	},
	//发货
	shipment(param) {
		return request({
			url: 'Shipment/Shipping',
			method: 'POST',
			data: param
		})
	},
	//获取可拆解的计划包装箱信息
	async getCouldSplitBox(deliveryNo, productPn) {
		const respone = await request({
			url: 'Shipment/GetCouldSplitBox?deliveryNo=' + (deliveryNo ?? "") +
				"&productPn=" + (productPn ?? ""),
			method: 'GET'
		})

		let res = respone.data;
		if (res.code == 200) {
			return res.data
		} else {
			uni.showToast({
				icon: 'none',
				title: res.info
			})
			return false
		}
	},
	//获取可拆解的无计划包装箱信息
	async getCouldSplitBoxWithNoPlan(productPn) {
		const respone = await request({
			url: 'Shipment/GetCouldSplitBoxWithNoPlan?productPn=' + (productPn ?? ""),
			method: 'GET'
		})

		let res = respone.data;
		if (res.code == 200) {
			return res.data
		} else {
			uni.showToast({
				icon: 'none',
				title: res.info
			})
			return false
		}
	},
	//拆解计划包装箱
	async splitBoxNum(formData) {
		let formDataStr = '';
		formData.forEach((value, key) => {
			if (formDataStr !== '') {
				formDataStr += '&';
			}
			formDataStr += encodeURIComponent(key) + '=' + encodeURIComponent(value);
		});
		const respone = await request({
			url: 'Shipment/SplitBoxNum',
			data: formDataStr,
			method: 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
		})

		let res = respone.data;
		if (res.code == 200) {
			return res.info
		} else {
			uni.showToast({
				icon: 'none',
				title: res.info
			})
			return false
		}
	},
}