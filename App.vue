<script>
	export default {
		globalData: {
			version: "1.0.5"
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			try {
				var loginUser = JSON.parse(uni.getStorageSync('userInfo'));
				console.log("乌拉拉乌拉拉：", loginUser, loginUser != null)
				if (loginUser != null) {
					uni.reLaunch({
						url: '/pages/Delivery/SelectPlan'
					})
				}
			} catch (e) {
				console.log("登录用户信息获取缓存失败,具体原因：", e);
				uni.reLaunch({
					url: '/pages//login/login'
				})
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	@import "@/common/commonCss.scss";

	.n-page {
		padding: 10rpx 30rpx 50px;
	}

	.n-page-h5 {
		padding: 10rpx 30rpx 50px;
		width: 400px;
		margin: 0 auto;
	}
</style>