<template>
	<view class="n-page">
		<u-row customStyle="margin: 10px 0" justify="space-between" gutter="10">
			<u-col span="6">
				<u-button style="width: 120px;backgroundColor: #338dc0;" type="primary" size="small" text="查询齐套计划"
					@click="getPlan('unison')"></u-button>
			</u-col>
			<u-col span="6">
				<u-button style="width: 120px;backgroundColor: #338dc0;" type="primary" size="small" text="查询全部计划"
					@click="getPlan('all')"></u-button>
			</u-col>
		</u-row>

		<wyb-table v-if='tableHeight!=""' ref="table" class="table" width="auto" :headers="headers" :fontSize=[13]
			:contents="contents" :format-col="formatCol" :height='tableHeight' enable-check="single"
			@onCellClick="clickCell" @onCheck="checkRow" />
		<page-pagination class="pagePagination" :total="page.total" :pageSize="page.size" :forceEllipses="true"
			:numAround="true" color="#338dc0" :btnText="true" @change='change'></page-pagination>
		<u-modal :show="showModal" :title="modalTitle" showCancelButton cancelColor="#666" confirmColor="#338dc0"
			:content='modalContent' @cancel="()=>{showModal = false}"
			@confirm="jump('pages/Delivery/SubmitDelivery')"></u-modal>
		<u-button :disabled="showBtn" class="submit-style" type="primary" size="small" text="备货扫描"
			@click="submitScan"></u-button>
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
				windowWidth: '',
				tableHeight: 'auto',
				headers: [{
					label: '客户编码',
					key: 'CustomerID'
				}, {
					label: '产品编码',
					key: 'FGPN',
					width: '180px'
				}, {
					label: '计划量',
					key: 'ScheduleQty'
				}, {
					label: '齐套率',
					key: 'SetOfRates',
				}],
				contents: [],
				showBtn: true,
				checkRowData: {},
				page: {
					total: 0,
					pageSize: 10,
					currentPage: 1
				},
				inUnison: false,
				showModal: false, //模态框显示状态
				modalTitle: '提示', //模态框标题
				modalContent: '', //模态框内容
				formatCol: [{
					key: 'SetOfRates',
					template: '#SetOfRates#%'
				}]
			};
		},
		onLoad() {
			this.$util.getWindowWidth(this);
			this.getPlan();
		},
		onShow() {
			this.$util.getWindowWidth(this);
			this.getPlan();
		},
		methods: {
			getPlan(type) {
				if (type) {
					this.inUnison = type == 'unison';
				}
				this.contents = [];
				this.$api.getTodayPlan(this.page.currentPage, this.page.pageSize, this.inUnison)
					.then(res => {
						var res = res.data;
						console.log("请求到的数据:", res);
						if (res.code == 200 && res.data.data) { //登录成功
							this.contents = res.data.data;
							this.page.total = Number(res.data.total);
						} else {
							uni.showToast({
								icon: 'none',
								title: res.info
							})
						}
					})
			},
			change(currentPage, type) {
				this.page.currentPage = currentPage;
				this.getPlan();
			},
			clickCell(e) {
				console.log("点击的行：", e);
				this.$util.jumpTo("pages/Delivery/PackageInfo", e.lineData)
			},
			checkRow(e) {
				console.log("选择的行：", e);
				this.showBtn = e.data.length == 0;
				this.checkRowData = e.data.length != 0 ? e.data[0] : {};
			},
			jump(url) {
				this.showModal = false;
				this.$util.jumpTo(url, this.checkRowData.lineData)
			},
			submitScan() {
				let setRate = this.checkRowData.lineData.SetOfRates;
				setRate = Number(setRate);
				if (setRate == 0) {
					uni.showToast({
						title: '该计划行尚未包装，请选择已齐套计划！',
						icon: 'none'
					})
					return;
				}
				if (setRate != 100) {
					this.showModal = true;
					this.modalContent = '该计划行尚未齐套，是否确定出货扫描？';
					return;
				}
				this.jump('pages/Delivery/SubmitDelivery');
			}
		},
	};
</script>

<style lang="scss" scoped>
	.submit-style {
		margin-top: 20px;
		width: 400rpx;
		background-color: #338dc0;
	}

	.pagePagination {
		margin: 10px 0;
	}
</style>