<template>
	<view class="n-page">
		<wyb-table v-if='tableHeight!=""' ref="table" class="table" width="auto" :headers="headers" :fontSize=[13]
			:contents="contents" :height='tableHeight' :computed-col="needComputed" />
		<bottomInfoBox></bottomInfoBox>
	</view>
</template>

<script>
	import wybTable from '@/components/wyb-table/wyb-table.vue'
	import bottomInfoBox from "@/components/bottom-info-box.vue"
	export default {
		components: {
			wybTable,
			bottomInfoBox
		},
		data() {
			return {
				version: getApp().globalData.version,
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
			this.getPlanPackage();
		},
		methods: {
			/** 获取计划的所有包装信息 */
			async getPlanPackage() {
				const res = await this.$api.getPlanPackage(this.form.DeliveryID, this.form.ProductPN)
				console.log("请求到的数据:", res);
				this.contents = res.map((val, index) => {
					val.index = index + 1;
					return val;
				});
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