import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let state = { //要设置的全局访问的state对象
	loginUser: {
		token: '',
		Account: '',
		// userId: "",
		// enCode: "",
		// password: null,
		// secretkey: null,
		// realName: "",
		// nickName: "",
		// headIcon: "",
		// gender: 1,
		// mobile: "",
		// telephone: "",
		// email: "",
		// oICQ: "",
		// weChat: "",
		// companyId: "",
		// departmentId: "",
		// openId: 0,
		// roleIds: "",
		// postIds: "",
		// isSystem: false,
		// appId: "",
		// logTime: "",
		// iPAddress: "",
		// browser: "",
		// loginMark: ""
	},
	tableMsg: {
		TableCode: '',//贴片机table台的编码
		Request: 0,//table上应扫的个数
		Loaded: 0,//table上实扫的个数
		FinishStatus: Boolean,
		ScanStatus: Boolean,//连扫状态——可能是 装料连扫, 也有可能是 转机连扫
		TableLoaded: Boolean//装料状态——true是已装满，false是未装满
	}
};
let getters = { //实时监听state值的变化(最新状态)
	islogin(state) { //承载变化的showFooter的值
		return state.loginUser.token
	},
};
let mutations = {
	login(state, provider) { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
		state.loginUser.token = provider.token;
		state.loginUser.account = provider.account;
	},
	logout(state) {
		state.loginUser.token = '';
		state.loginUser.account = '';
	},
	setLoginUser(state, item) {
		state.loginUser = item;
	},
	
	setTableMsg(state, item){
		state.tableMsg = item;
		if (item.hasOwnProperty("Loaded") && item.hasOwnProperty("Request")) {
			state.tableMsg.TableLoaded = item.Request == item.Loaded
		}
	}
};
let actions = {
	// setSysLognb(context){
	// 	context.commit(setSysLogn);
	// }
};
let store = new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
	modules: {}
})

export default store
