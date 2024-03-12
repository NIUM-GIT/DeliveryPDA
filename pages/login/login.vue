
<template>
	<view class="constrain">
		<div class="logo">
			<u--image src="/static/logo.png" mode="aspectFit" width="170px" height="60px"></u--image>
		</div>
		<view class="loginInputBox">
			<u--input placeholder="请输入用户名" v-model="username">
				<template #prefix>
					<u-icon name="account-fill" size="22" color="#b8b8b8"></u-icon>
				</template>
			</u--input>
		</view>
		<view class="loginInputBox">
			<u--input placeholder="请输入密码" v-model="password" :password="isShowPwd">
				<template #prefix>
					<u-icon name="lock-fill" size="22" color="#b8b8b8"></u-icon>
				</template>
				<template #suffix>
					<u-icon class="showPwd" :name="!isShowPwd?'eye':'eye-off'" color="#b8b8b8" size="22"
						@click="seePwd"></u-icon>
				</template>
			</u--input>
		</view>
		<view class="loginInputBox" @click.stop="showPlant= true">
			<u--input placeholder="请选择工厂" style="cursor: pointer;" v-model="plant" disabled>
				<template #prefix>
					<u-icon name="home-fill" size="22" color="#b8b8b8"></u-icon>
				</template>
				<template #suffix>
					<u-icon name="arrow-down" size="22" color="#b8b8b8"></u-icon>
				</template>
			</u--input>
		</view>

		<button class="loginBtn" @click="login" :loading="isLogining">登录</button>
		<u-picker :show="showPlant" :columns="plantList" keyName="label" @confirm="changePlant"
			@cancel="showPlant = false"></u-picker>
	</view>
</template>

<script>
	var _self;
	import graceChecker from '@/common/graceChecker.js'
	import config from '@/common/config.js'
	export default {
		data() {
			return {
				username: '',
				password: '',
				plant: '',
				showPlant: false,
				plantList: [
					config.plants
				],
				isShowPwd: true,
				isLogining: false
			}
		},
		onLoad() {
			_self = this;
			try {
				var loginUser = JSON.parse(uni.getStorageSync('loginUser'));
				console.log("获取到缓存：", loginUser);
				_self.username = loginUser.username;
				_self.password = loginUser.password;
			} catch (e) {
				console.log("登录用户信息获取缓存失败,具体原因：", e);
			}
		},
		methods: {
			changePlant({
				value
			}) {
				this.plant = value[0].label
				config.changePlant(value[0].value)
				this.showPlant = false
			},
			login() {
				let formData = {
					'username': _self.username,
					'password': _self.password
				}
				var rule = [{
						name: 'username',
						checkType: 'notnull',
						checkRule: '',
						errorMsg: '请输入用户名'
					},
					{
						name: 'password',
						checkType: 'notnull',
						checkRule: '',
						errorMsg: '请输入密码'
					}
				];

				let checkResult = graceChecker.check(formData, rule);
				if (checkResult) {
					this.isLogining = true;
					_self.$api.login(_self.username, _self.$md5(_self.password))
						.then(res => {
							res = res.data;
							this.isLogining = false;
							if (res.code == 200 && res.data.IsLogin) { //登录成功
								console.log(res.data);
								window.localStorage.setItem("plant", config.plant)
								_self.$store.commit('setLoginUser', res.data);
								uni.setStorageSync("userInfo", JSON.stringify(res.data));
								uni.setStorageSync("deliveryIsLogin", true);
								uni.setStorageSync("loginUser", JSON.stringify({
									username: _self.username,
									password: _self.password
								}))
								uni.reLaunch({
									url: '/pages/Delivery/SelectPlan'
								})
							} else {
								uni.showToast({
									icon: 'none',
									title: res.code == 200 ? res.data.LoginError : res.info
								})
							}
						}).catch(err => {
							this.isLogining = false;
							uni.showToast({
								icon: 'none',
								title: err
							})
						})
				} else {
					uni.showToast({
						icon: 'none',
						title: graceChecker.error
					})
				}

			},
			seePwd() {
				_self.isShowPwd = !_self.isShowPwd;
				this.$forceUpdate();
				if (!_self.isShowPwd) {
					setTimeout(function() {
						_self.isShowPwd = true;
					}, 3000);
				}
			}
		}
	}
</script>

<style>
	.constrain {
		width: 92%;
		margin: 0 4%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.showPwd {
		position: absolute;
		right: 10px;
		top: 8px;
	}

	.logo {
		width: 170px;
		height: 60px;
		margin-top: 15px;
		margin-bottom: 5px;
	}
</style>