<template>
	<view class="n-page">
		<wyb-table v-if='tableHeight!=""' ref="table" class="table" width="auto" :headers="headers" :fontSize=[13]
			:contents="contents" :height='tableHeight' :computed-col="needComputed" />
		<bottomInfoBox></bottomInfoBox>
	</view>
</template>

<script>
	import demoData from '../index/demoData.js'
	import wybTable from '@/components/wyb-table/wyb-table.vue'
	import bottomInfoBox from "@/components/bottom-info-box.vue"
	export default {
		mixins: [demoData],
		components: {
			wybTable,
			bottomInfoBox
		},
		data() {
			return {
				version: getApp().globalData.version,
				windowWidth: '',
				tableHeight: 'auto',
				headers: [{
					label: '序号',
					key: 'index',
					width: '50px'
				}, {
					label: '箱号',
					key: 'BoxID',
					width: '140px'
				}, {
					label: '数量',
					key: 'Qty'
				}, {
					label: '状态',
					key: 'State'
				}],
				contents: [],
				needComputed: ['Qty'],
				form: {}
			};
		},
		onLoad(params) {
			this.form = params;
			// this.contents = demoData.tableData1;	
			this.$util.getWindowWidth(this);
			this.getPlanPackage();
		},
		methods: {
			getPlanPackage() {
				this.$api.getPlanPackage(this.form.DeliveryID, this.form.ProductPN)
					.then(res => {
						var res = res.data;
						console.log("请求到的数据:", res);
						if (res.code == 200) { //登录成功
							this.contents = res.data.map((val, index) => {
								val.index = index + 1;
								return val;
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res.info
							})
						}
					})
			},
			clickCell(e) {
				console.log("点击的行：", e);
				_self.$util.jumpTo("PackageInfo", e.lineData)
			},
			checkRow(e) {
				console.log("选择的行：", e);
			}
		},
	};
</script>

<style lang="scss" scoped>
</style>