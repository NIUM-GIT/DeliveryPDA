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
	getPlanPackage(deliveryNo, productPn) {
		return request({
			url: 'Shipment/GetPlanPackage?deliveryNo=' + deliveryNo + "&productPn=" + productPn,
			method: 'GET'
		})
	},
	//获取快递信息
	getExpressInfo(pageIndex, pageSize, express) {
		return request({
			url: 'Shipment/GetExpressInfo?pageIndex=' + pageIndex + "&pageSize=" + pageSize +
				"&express=" + express + "&isUse=true",
			method: 'GET'
		})
	},
	//扫描后获取包装信息
	getPackageInfo(deliveryNo, boxId) {
		return request({
			url: 'Shipment/GetPackageInfo?deliveryNo=' + deliveryNo + "&boxId=" + boxId,
			method: 'GET'
		})
	},
	//获取客户产品可排量是否充足
	async isBalanceQtyEnough(deliveryId, gap) {
		return await request({
			url: 'Shipment/IsBalanceQtyEnough?deliveryId=' + deliveryId + "&gap=" + gap,
			method: 'GET'
		})
	},
	//获取客户产品在排量
	async haveInPlanQty(deliveryId) {
		return await request({
			url: 'Shipment/HaveInPlanQty?deliveryId=' + deliveryId,
			method: 'GET'
		})
	},
	//发货
	shipment(param) {
		return request({
			url: 'Shipment/Shipping',
			method: 'POST',
			data: param
		})
	}
}