<template>
	<view>
		<div class="versionBox">
			<span>版本：{{version}}</span>
			<div class="userBox">
				<span>用户：{{username}}</span>
				<image src="/static/out.png" class="outIcon" @click="loginOut"></image>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		name:"bottom-info-box",
		data() {
			return {
				version: getApp().globalData.version,
				username: '',
			};
		},
		created() {
			try {
				var loginUser = JSON.parse(uni.getStorageSync('userInfo'));
				console.log("登录人信息：",loginUser);
				this.username = loginUser.Account;
			} catch (e) {
				console.log("登录用户信息获取缓存失败,具体原因：",e);
			}
		},
		methods: {
			loginOut(){
				let userName = this.username;
				uni.setStorageSync("deliveryIsLogin", false);
				uni.setStorageSync('userInfo',"");
				setTimeout(function(){
					uni.showToast({
						title: '成功退出用户：'+userName,
						icon: 'none'
					})
				},500);
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style>

</style>