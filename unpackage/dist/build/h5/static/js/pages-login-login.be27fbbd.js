(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-login"],{"0369":function(e,n,t){"use strict";t.d(n,"b",(function(){return r})),t.d(n,"c",(function(){return i})),t.d(n,"a",(function(){}));var r=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("uvImage",{attrs:{src:e.src,mode:e.mode,width:e.width,height:e.height,shape:e.shape,radius:e.radius,lazyLoad:e.lazyLoad,showMenuByLongpress:e.showMenuByLongpress,loadingIcon:e.loadingIcon,errorIcon:e.errorIcon,showLoading:e.showLoading,showError:e.showError,fade:e.fade,webp:e.webp,duration:e.duration,bgColor:e.bgColor,customStyle:e.customStyle},on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.$emit("click")},error:function(n){arguments[0]=n=e.$handleEvent(n),e.$emit("error")},load:function(n){arguments[0]=n=e.$handleEvent(n),e.$emit("load")}},scopedSlots:e._u([{key:"loading",fn:function(){return[e._t("loading")]},proxy:!0},{key:"error",fn:function(){return[e._t("error")]},proxy:!0}],null,!0)})},i=[]},"040f":function(e,n,t){t("4d63"),t("c607"),t("ac1f"),t("2c3e"),t("25f0"),t("00b4"),t("a9e3"),t("c975"),e.exports={error:"",check:function(e,n){for(var t=0;t<n.length;t++){if(!n[t].checkType)return!0;if(!n[t].name)return!0;if(!n[t].errorMsg)return!0;if(!e[n[t].name])return this.error=n[t].errorMsg,!1;switch(n[t].checkType){case"string":var r=new RegExp("^.{"+n[t].checkRule+"}$");if(!r.test(e[n[t].name]))return this.error=n[t].errorMsg,!1;break;case"int":r=new RegExp("^(-[1-9]|[1-9])[0-9]{"+n[t].checkRule+"}$");if(!r.test(e[n[t].name]))return this.error=n[t].errorMsg,!1;break;case"between":if(!this.isNumber(e[n[t].name]))return this.error=n[t].errorMsg,!1;var i=n[t].checkRule.split(",");if(i[0]=Number(i[0]),i[1]=Number(i[1]),e[n[t].name]>i[1]||e[n[t].name]<i[0])return this.error=n[t].errorMsg,!1;break;case"betweenD":r=/^-?[1-9][0-9]?$/;if(!r.test(e[n[t].name]))return this.error=n[t].errorMsg,!1;i=n[t].checkRule.split(",");if(i[0]=Number(i[0]),i[1]=Number(i[1]),e[n[t].name]>i[1]||e[n[t].name]<i[0])return this.error=n[t].errorMsg,!1;break;case"betweenF":r=/^-?[0-9][0-9]?.+[0-9]+$/;if(!r.test(e[n[t].name]))return this.error=n[t].errorMsg,!1;i=n[t].checkRule.split(",");if(i[0]=Number(i[0]),i[1]=Number(i[1]),e[n[t].name]>i[1]||e[n[t].name]<i[0])return this.error=n[t].errorMsg,!1;break;case"same":if(e[n[t].name]!=n[t].checkRule)return this.error=n[t].errorMsg,!1;break;case"notsame":if(e[n[t].name]==n[t].checkRule)return this.error=n[t].errorMsg,!1;break;case"email":r=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;if(!r.test(e[n[t].name]))return this.error=n[t].errorMsg,!1;break;case"phoneno":r=/^1[0-9]{10,10}$/;if(!r.test(e[n[t].name]))return this.error=n[t].errorMsg,!1;break;case"zipcode":r=/^[0-9]{6}$/;if(!r.test(e[n[t].name]))return this.error=n[t].errorMsg,!1;break;case"reg":r=new RegExp(n[t].checkRule);if(!r.test(e[n[t].name]))return this.error=n[t].errorMsg,!1;break;case"in":if(-1==n[t].checkRule.indexOf(e[n[t].name]))return this.error=n[t].errorMsg,!1;break;case"notnull":if(null==e[n[t].name]||e[n[t].name].length<1)return this.error=n[t].errorMsg,!1;break}}return!0},isNumber:function(e){return/^-?[1-9][0-9]?.?[0-9]*$/.test(e)}}},"1b8d":function(e,n,t){"use strict";var r=t("9c80"),i=t.n(r);i.a},"1c61":function(e,n,t){var r=t("24fb");n=r(!1),n.push([e.i,".constrain[data-v-3751a0dd]{width:92%;margin:0 4%;display:flex;flex-direction:column;justify-content:center;align-items:center}.showPwd[data-v-3751a0dd]{position:absolute;right:10px;top:8px}.logo[data-v-3751a0dd]{width:170px;height:60px;margin-top:15px;margin-bottom:5px}",""]),e.exports=n},"259e":function(e,n,t){"use strict";t.d(n,"b",(function(){return r})),t.d(n,"c",(function(){return i})),t.d(n,"a",(function(){}));var r=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("uvInput",{attrs:{value:e.value,type:e.type,fixed:e.fixed,disabled:e.disabled,disabledColor:e.disabledColor,clearable:e.clearable,password:e.password,maxlength:e.maxlength,placeholder:e.placeholder,placeholderClass:e.placeholderClass,placeholderStyle:e.placeholderStyle,showWordLimit:e.showWordLimit,confirmType:e.confirmType,confirmHold:e.confirmHold,holdKeyboard:e.holdKeyboard,focus:e.focus,autoBlur:e.autoBlur,disableDefaultPadding:e.disableDefaultPadding,cursor:e.cursor,cursorSpacing:e.cursorSpacing,selectionStart:e.selectionStart,selectionEnd:e.selectionEnd,adjustPosition:e.adjustPosition,inputAlign:e.inputAlign,fontSize:e.fontSize,color:e.color,prefixIcon:e.prefixIcon,suffixIcon:e.suffixIcon,suffixIconStyle:e.suffixIconStyle,prefixIconStyle:e.prefixIconStyle,border:e.border,readonly:e.readonly,shape:e.shape,customStyle:e.customStyle,formatter:e.formatter},on:{focus:function(n){arguments[0]=n=e.$handleEvent(n),e.$emit("focus")},blur:function(n){arguments[0]=n=e.$handleEvent(n),e.$emit("blur")},keyboardheightchange:function(n){arguments[0]=n=e.$handleEvent(n),e.$emit("keyboardheightchange")},change:function(n){arguments[0]=n=e.$handleEvent(n),function(n){return e.$emit("change",n)}.apply(void 0,arguments)},input:function(n){arguments[0]=n=e.$handleEvent(n),function(n){return e.$emit("input",n)}.apply(void 0,arguments)},confirm:function(n){arguments[0]=n=e.$handleEvent(n),function(n){return e.$emit("confirm",n)}.apply(void 0,arguments)},clear:function(n){arguments[0]=n=e.$handleEvent(n),e.$emit("clear")},click:function(n){arguments[0]=n=e.$handleEvent(n),e.$emit("click")}}},[e._t("prefix",null,{slot:"prefix"}),e._t("suffix",null,{slot:"suffix"})],2)},i=[]},"37fd":function(e,n,t){"use strict";t.r(n);var r=t("259e"),i=t("ca89");for(var o in i)["default"].indexOf(o)<0&&function(e){t.d(n,e,(function(){return i[e]}))}(o);var a=t("f0c5"),u=Object(a["a"])(i["default"],r["b"],r["c"],!1,null,null,null,!1,r["a"],void 0);n["default"]=u.exports},"3fb8":function(e,n,t){"use strict";t("7a82"),Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0,t("a9e3");var r={props:{src:{type:String,default:uni.$u.props.image.src},mode:{type:String,default:uni.$u.props.image.mode},width:{type:[String,Number],default:uni.$u.props.image.width},height:{type:[String,Number],default:uni.$u.props.image.height},shape:{type:String,default:uni.$u.props.image.shape},radius:{type:[String,Number],default:uni.$u.props.image.radius},lazyLoad:{type:Boolean,default:uni.$u.props.image.lazyLoad},showMenuByLongpress:{type:Boolean,default:uni.$u.props.image.showMenuByLongpress},loadingIcon:{type:String,default:uni.$u.props.image.loadingIcon},errorIcon:{type:String,default:uni.$u.props.image.errorIcon},showLoading:{type:Boolean,default:uni.$u.props.image.showLoading},showError:{type:Boolean,default:uni.$u.props.image.showError},fade:{type:Boolean,default:uni.$u.props.image.fade},webp:{type:Boolean,default:uni.$u.props.image.webp},duration:{type:[String,Number],default:uni.$u.props.image.duration},bgColor:{type:String,default:uni.$u.props.image.bgColor}}};n.default=r},"437d":function(e,n,t){"use strict";t.r(n);var r=t("fc5c"),i=t.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){t.d(n,e,(function(){return r[e]}))}(o);n["default"]=i.a},"50f4":function(e,n,t){"use strict";t.r(n);var r=t("83b1"),i=t.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){t.d(n,e,(function(){return r[e]}))}(o);n["default"]=i.a},"54db":function(e,n,t){"use strict";t.r(n);var r=t("ffad"),i=t("437d");for(var o in i)["default"].indexOf(o)<0&&function(e){t.d(n,e,(function(){return i[e]}))}(o);t("b0e1");var a=t("f0c5"),u=Object(a["a"])(i["default"],r["b"],r["c"],!1,null,"e46cb606",null,!1,r["a"],void 0);n["default"]=u.exports},"5e46":function(e,n,t){"use strict";t.r(n);var r=t("633b"),i=t("7a69");for(var o in i)["default"].indexOf(o)<0&&function(e){t.d(n,e,(function(){return i[e]}))}(o);t("1b8d");var a=t("f0c5"),u=Object(a["a"])(i["default"],r["b"],r["c"],!1,null,"3751a0dd",null,!1,r["a"],void 0);n["default"]=u.exports},"633b":function(e,n,t){"use strict";t.d(n,"b",(function(){return i})),t.d(n,"c",(function(){return o})),t.d(n,"a",(function(){return r}));var r={"u-Image":t("8802").default,"u-Input":t("37fd").default,uIcon:t("b698").default},i=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("v-uni-view",{staticClass:"constrain"},[t("div",{staticClass:"logo"},[t("u--image",{attrs:{src:"/static/logo.png",mode:"aspectFit",width:"170px",height:"60px"}})],1),t("v-uni-view",{staticClass:"loginInputBox"},[t("u--input",{attrs:{placeholder:"请输入用户名",prefixIcon:"account-fill",prefixIconStyle:"font-size: 22px;color: #b8b8b8"},model:{value:e.username,callback:function(n){e.username=n},expression:"username"}})],1),t("v-uni-view",{staticClass:"loginInputBox"},[t("u--input",{attrs:{placeholder:"请输入密码",prefixIcon:"lock-fill",password:e.isShowPwd,prefixIconStyle:"font-size: 22px;color: #b8b8b8"},model:{value:e.password,callback:function(n){e.password=n},expression:"password"}}),t("u-icon",{staticClass:"showPwd",attrs:{name:e.isShowPwd?"eye-off":"eye",color:"#b8b8b8",size:"22"},on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.seePwd.apply(void 0,arguments)}}})],1),t("v-uni-button",{staticClass:"loginBtn",attrs:{loading:e.isLogining},on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.login.apply(void 0,arguments)}}},[e._v("登录")])],1)},o=[]},"71bb":function(e,n,t){var r=t("cbea");r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var i=t("4f06").default;i("0bbfd3e6",r,!0,{sourceMap:!1,shadowMode:!1})},"73df":function(e,n,t){"use strict";t("7a82");var r=t("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=r(t("1b16")),o=r(t("fff1")),a={name:"u--input",mixins:[uni.$u.mpMixin,o.default,uni.$u.mixin],components:{uvInput:i.default}};n.default=a},"7a69":function(e,n,t){"use strict";t.r(n);var r=t("7adb"),i=t.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){t.d(n,e,(function(){return r[e]}))}(o);n["default"]=i.a},"7adb":function(e,n,t){"use strict";(function(e){t("7a82");var r=t("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0,t("e9c4");var i,o=r(t("040f")),a={data:function(){return{username:"",password:"",isShowPwd:!0,isLogining:!1}},onLoad:function(){i=this;try{var n=JSON.parse(uni.getStorageSync("loginUser"));e("log","获取到缓存：",n," at pages/login/login.vue:37"),i.username=n.username,i.password=n.password}catch(t){e("log","登录用户信息获取缓存失败,具体原因：",t," at pages/login/login.vue:41")}},methods:{login:function(){var n=this,t={username:i.username,password:i.password},r=o.default.check(t,[{name:"username",checkType:"notnull",checkRule:"",errorMsg:"请输入用户名"},{name:"password",checkType:"notnull",checkRule:"",errorMsg:"请输入密码"}]);r?(this.isLogining=!0,i.$api.login(i.username,i.$md5(i.password)).then((function(t){t=t.data,n.isLogining=!1,200==t.code&&t.data.IsLogin?(e("log",t.data," at pages/login/login.vue:72"),i.$store.commit("setLoginUser",t.data),uni.setStorageSync("userInfo",JSON.stringify(t.data)),uni.setStorageSync("deliveryIsLogin",!0),uni.setStorageSync("loginUser",JSON.stringify({username:i.username,password:i.password})),uni.reLaunch({url:"/pages/Delivery/SelectPlan"})):uni.showToast({icon:"none",title:200==t.code?t.data.LoginError:t.info})})).catch((function(e){n.isLogining=!1,uni.showToast({icon:"none",title:e})}))):uni.showToast({icon:"none",title:o.default.error})},seePwd:function(){i.isShowPwd=!i.isShowPwd,this.$forceUpdate(),i.isShowPwd||setTimeout((function(){i.isShowPwd=!0}),3e3)}}};n.default=a}).call(this,t("0de9")["log"])},"83b1":function(e,n,t){"use strict";t("7a82");var r=t("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=r(t("54db")),o=r(t("3fb8")),a={name:"u--image",mixins:[uni.$u.mpMixin,o.default,uni.$u.mixin],components:{uvImage:i.default}};n.default=a},8802:function(e,n,t){"use strict";t.r(n);var r=t("0369"),i=t("50f4");for(var o in i)["default"].indexOf(o)<0&&function(e){t.d(n,e,(function(){return i[e]}))}(o);var a=t("f0c5"),u=Object(a["a"])(i["default"],r["b"],r["c"],!1,null,null,null,!1,r["a"],void 0);n["default"]=u.exports},"9c80":function(e,n,t){var r=t("1c61");r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var i=t("4f06").default;i("159d5aff",r,!0,{sourceMap:!1,shadowMode:!1})},b0e1:function(e,n,t){"use strict";var r=t("71bb"),i=t.n(r);i.a},ca89:function(e,n,t){"use strict";t.r(n);var r=t("73df"),i=t.n(r);for(var o in r)["default"].indexOf(o)<0&&function(e){t.d(n,e,(function(){return r[e]}))}(o);n["default"]=i.a},cbea:function(e,n,t){var r=t("24fb");n=r(!1),n.push([e.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */uni-view[data-v-e46cb606], uni-scroll-view[data-v-e46cb606], uni-swiper-item[data-v-e46cb606]{display:flex;flex-direction:column;flex-shrink:0;flex-grow:0;flex-basis:auto;align-items:stretch;align-content:flex-start}.u-image[data-v-e46cb606]{position:relative;transition:opacity .5s ease-in-out}.u-image__image[data-v-e46cb606]{width:100%;height:100%}.u-image__loading[data-v-e46cb606], .u-image__error[data-v-e46cb606]{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:row;align-items:center;justify-content:center;background-color:#f3f4f6;color:#909193;font-size:%?46?%}',""]),e.exports=n},fc5c:function(e,n,t){"use strict";t("7a82");var r=t("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=r(t("3fb8")),o={name:"u-image",mixins:[uni.$u.mpMixin,uni.$u.mixin,i.default],data:function(){return{isError:!1,loading:!0,opacity:1,durationTime:this.duration,backgroundStyle:{},show:!1}},watch:{src:{immediate:!0,handler:function(e){e?(this.isError=!1,this.loading=!0):this.isError=!0}}},computed:{wrapStyle:function(){var e={};return e.width=this.$u.addUnit(this.width),e.height=this.$u.addUnit(this.height),e.borderRadius="circle"==this.shape?"10000px":uni.$u.addUnit(this.radius),e.overflow=this.borderRadius>0?"hidden":"visible",uni.$u.deepMerge(e,uni.$u.addStyle(this.customStyle))}},mounted:function(){this.show=!0},methods:{onClick:function(){this.$emit("click")},onErrorHandler:function(e){this.loading=!1,this.isError=!0,this.$emit("error",e)},onLoadHandler:function(){this.loading=!1,this.isError=!1,this.$emit("load"),this.removeBgColor()},removeBgColor:function(){this.backgroundStyle={backgroundColor:"transparent"}}}};n.default=o},ffad:function(e,n,t){"use strict";t.d(n,"b",(function(){return i})),t.d(n,"c",(function(){return o})),t.d(n,"a",(function(){return r}));var r={uTransition:t("883b").default,uIcon:t("b698").default},i=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("u-transition",{attrs:{mode:"fade",show:e.show,duration:e.fade?1e3:0}},[t("v-uni-view",{staticClass:"u-image",style:[e.wrapStyle,e.backgroundStyle],on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.onClick.apply(void 0,arguments)}}},[e.isError?e._e():t("v-uni-image",{staticClass:"u-image__image",style:{borderRadius:"circle"==e.shape?"10000px":e.$u.addUnit(e.radius),width:e.$u.addUnit(e.width),height:e.$u.addUnit(e.height)},attrs:{src:e.src,mode:e.mode,"show-menu-by-longpress":e.showMenuByLongpress,"lazy-load":e.lazyLoad},on:{error:function(n){arguments[0]=n=e.$handleEvent(n),e.onErrorHandler.apply(void 0,arguments)},load:function(n){arguments[0]=n=e.$handleEvent(n),e.onLoadHandler.apply(void 0,arguments)}}}),e.showLoading&&e.loading?t("v-uni-view",{staticClass:"u-image__loading",style:{borderRadius:"circle"==e.shape?"50%":e.$u.addUnit(e.radius),backgroundColor:this.bgColor,width:e.$u.addUnit(e.width),height:e.$u.addUnit(e.height)}},[e._t("loading",[t("u-icon",{attrs:{name:e.loadingIcon,width:e.width,height:e.height}})])],2):e._e(),e.showError&&e.isError&&!e.loading?t("v-uni-view",{staticClass:"u-image__error",style:{borderRadius:"circle"==e.shape?"50%":e.$u.addUnit(e.radius),width:e.$u.addUnit(e.width),height:e.$u.addUnit(e.height)}},[e._t("error",[t("u-icon",{attrs:{name:e.errorIcon,width:e.width,height:e.height}})])],2):e._e()],1)],1)},o=[]}}]);