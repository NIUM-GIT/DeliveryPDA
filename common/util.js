String.prototype.compare = function(str) {
	//不区分大小写
	if(this.toLowerCase() == str.toLowerCase()) {
		return true;
	} else {
		return false;
	}
}
export default {
	//获取安卓机的MAC值
	getDeviceMac(){  
		var deviceMac = '';
		var net = plus.android.importClass("java.net.NetworkInterface")  
		var wl0 = net.getByName('wlan0')  
		var macByte = wl0.getHardwareAddress()  
		deviceMac = ''  
		for (var i = 0; i < macByte.length; i++) {  
			var tmp = "";  
			var num = macByte[i];  
			if (num < 0) {  
				tmp = (255 + num + 1).toString(16);  
			} else {  
				tmp = num.toString(16);  
			}  
			if (tmp.length == 1) {  
				tmp = "0" + tmp;  
			}  
			deviceMac += tmp;  
		}  
		console.log(deviceMac) 
		return deviceMac;
	},
	
	/**
	 * 页面跳转
	 * @param {String} url  跳转的路径
	 * @param {Object} paramObj  跳转携带的参数
	 */
	jumpTo(url, paramObj) {
		if (!url) {
			uni.showToast({
				icon: 'error',
				title: '暂未开通'
			})
			return;
		}
		console.log("跳转到："+url);
		uni.$u.route(url, paramObj);
	},
	
	getWindowWidth(that) {
		//窗体改变大小触发事件
		uni.onWindowResize((res) => {
			that.windowWidth = res.size.windowWidth;
			console.log("页面狂赌：",that.windowWidth)
		})
		
		//打开获取屏幕大小
		uni.getSystemInfo({
			success(res) {
				console.log('设备信息：',res);
				that.windowWidth = res.windowWidth;
			}
		})
	},
	
	/**
	 * 获取缓存的selectedWoItem
	 * @param {Object} _this  vue实例
	 * @param {String} cacheObj  缓存数据对象 (在vue实例中也要有)
	 * @param {Array} paramObj  需要对vue实例赋值的对象 （如需要tableID、wo，则为['tableID', 'wo']）
	 */
	getStorage(_this, cacheObj, paramObj) {
		try {
			_this[cacheObj] = JSON.parse(uni.getStorageSync(cacheObj));
			console.log("获取到缓存：",_this[cacheObj]);
			let cacheObjKey = Object.keys(_this[cacheObj]);
			paramObj.map(pval => {
				cacheObjKey.map(cval => {
					if (cval.compare(pval)) {
						_this[pval] = _this[cacheObj][cval]
					}
				})
			});
		} catch (e) {
			console.log("tableID扫描信息获取缓存失败,具体原因：",e);
		}
	},
	
	/**
	 * 更新表格数据时的分页处理
	 * @param {Object} _this  vue实例（需要包含page、contents）
	 * @param {Object} tableData  table数据
	 */
	initTable(_this, tableData) {
		_this.page.total = tableData.length;
		console.log("表格数据行：",tableData);
		_this.contents = [];
		for(var i=0; i<10; i++){
			if (!tableData[i+_this.page.currentPage-1]) {
				break;
			}
			_this.contents.push(tableData[i+_this.page.currentPage-1])
		}
	},
	
	getObjectSum(objArr, param){
		let sum = 0;
		objArr.map(val => {
			sum += Number(val[param])?Number(val[param]):0
		})
		return sum;
	}
}