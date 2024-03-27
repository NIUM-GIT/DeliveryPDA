var URL_WX = "http://192.168.20.8:8060/api/"; //无锡
var URL_HZ = "http://192.168.30.8:8060/api/"; //惠州
var URL_SZ = "http://192.168.10.8:8060/api/"; //深圳
var URL_CS = "http://localhost:64672/api/"; //测试

let plants = [{
		value: "WPWX",
		label: "无锡",
		url: URL_WX
	},
	{
		value: "WPHZ",
		label: "惠州",
		url: URL_HZ
	},
	{
		value: "WPSZ",
		label: "深圳",
		url: URL_SZ
	}
	// {
	// 	value: "WPTS",
	// 	label: "测试",
	// 	url: URL_CS
	// }
]

let plant = window.localStorage.getItem("plant") ?
	window.localStorage.getItem("plant") :
	"";

if (plant == "") {
	if (window.location.href.match("20.8")) {
		console.log("执行WPWX");
		plant = "WPWX";
	} else if (window.location.href.match("30.8")) {
		console.log("执行WPHZ");
		plant = "WPHZ";
	} else if (window.location.href.match("10.8")) {
		console.log("执行WPSZ");
		plant = "WPSZ";
	} else {
		console.log("执行WPTS");
		plant = "WPTS";
	}
}

// 设置当前工厂的访问地址
var ApiUrl = plants.filter(val => val.value == plant)[0].url;

export default {
	ApiUrl: ApiUrl,
	plant: plant,
	plants: plants,
	changePlant: function(plant) {
		this.plant = plant;
		this.ApiUrl = this.plants.filter(val => val.value == plant)[0].url;
	}
}