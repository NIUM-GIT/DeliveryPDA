<template>
	<view class="n-page">
		<u-form-item label="产品编码:" borderBottom labelWidth="80">
			<u-input v-model="productPN" border="none" readonly></u-input>
		</u-form-item>
		<div class="tableLabel">同产品计划号:</div>
		<wyb-table v-if='tableHeight!=""' class="table" width="auto" :headers="headers" :fontSize=[13]
			:contents="contents" :height='tableHeight' @onCellClick="clickCell" />

		<div v-if="contents.length > 0" class="tableLabel">
			<p>计划号：{{ chosenDeliveryId }} 下的箱号信息:</p>
			<u-icon :class="loadingDefault?'rotateClass':''" name="reload" size="22" color="#b8b8b8"
				@click="returnDefault"></u-icon>
		</div>
		<wyb-table v-if='tableHeight!="" && contents.length > 0' class="table" width="auto" :headers="boxHeaders"
			:fontSize=[13] :contents="boxContents" :height='tableHeight' enable-check="single" @onCheck="checkRow" />


		<u-form class="formClass" v-if="showBtn">
			<u-form-item label="拆挪数量:" borderBottom labelWidth="80">
				<u-input v-model="splitNum" border="none" type="number"></u-input>
			</u-form-item>
			<u-button class="btnClass" @click="splitFuc">拆挪</u-button>
		</u-form>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				deliveryId: '',
				productPN: '',
				tableHeight: 'auto',
				headers: [{
					label: '出货计划号',
					key: 'DeliveryID',
					width: '200px'
				}, {
					label: '客户',
					key: 'CustomerID'
				}, {
					label: '发货日期',
					key: 'DeliveryDateStr',
					width: '140px'
				}, {
					label: '计划量',
					key: 'ScheduleQty'
				}, {
					label: '已包装量',
					key: 'PackedQty'
				}, {
					label: '状态',
					key: 'Status'
				}],
				contents: [],
				boxHeaders: [{
					label: '序号',
					key: 'index',
					width: '50px'
				}, {
					label: '箱号',
					key: 'BoxNo',
					width: '140px'
				}, {
					label: '数量',
					key: 'PackedQty'
				}, {
					label: '重量',
					key: 'BoxFullWeight'
				}, {
					label: '客户箱号',
					key: 'CusBoxNo'
				}, {
					label: '状态',
					key: 'BoxStatus'
				}],
				boxContents: [],
				chosenDeliveryId: '00000',
				chosenDeliveryIdRow: {},
				chosenBoxRow: {},
				showBtn: false,
				splitNum: "",
				loginUser: "",
				loadingDefault: false
			}
		},
		onLoad(option) {
			var loginUser = JSON.parse(uni.getStorageSync('userInfo'))
			this.loginUser = loginUser.Account

			this.deliveryId = option.deliveryID
			this.productPN = option.ProductPN

			this.getCouldSplitBox()
			this.getCouldSplitBoxWithNoPlan()
		},
		watch: {
			"chosenDeliveryIdRow": 'changeBoxInfo',
			"chosenBoxRow": function() {
				this.showBtn = Object.keys(this.chosenBoxRow).length > 0
				this.splitNum = ""
			}
		},
		methods: {
			async getCouldSplitBox() {
				this.contents = await this.$api.getCouldSplitBox(this.deliveryId, this.productPN)
			},
			async getCouldSplitBoxWithNoPlan() {
				let that = this
				const res = await this.$api.getCouldSplitBoxWithNoPlan(this.productPN)
				this.addIndexForBoxInfo(res)
				setTimeout(() => {
					that.loadingDefault = false
				}, 1000)
			},
			returnDefault() {
				this.loadingDefault = true
				this.chosenDeliveryIdRow = {}
				//先将选中的行取消checked，再将其置为{}
				this.chosenBoxRow.checked = false
				this.chosenBoxRow = {}
			},
			changeBoxInfo() {
				this.chosenDeliveryId = Object.keys(this.chosenDeliveryIdRow).length > 0 ?
					this.chosenDeliveryIdRow.DeliveryID : "00000"

				if (this.chosenDeliveryId == "00000") {
					this.getCouldSplitBoxWithNoPlan()
				} else {
					this.addIndexForBoxInfo(this.chosenDeliveryIdRow.PackBoxInfos)
				}
			},
			//给箱号列表添加索引值
			addIndexForBoxInfo(source) {
				this.boxContents = source.map((val, index) => {
					val.index = index + 1
					return val
				})
			},
			clickCell(e) {
				this.chosenDeliveryIdRow = e.lineData
			},
			checkRow(e) {
				this.chosenBoxRow = e.data.length != 0 ? e.data[0].lineData : {};
			},
			async splitFuc() {
				let that = this
				if (this.splitNum == '') {
					uni.showModal({
						confirmText: '知道了',
						content: "请填写拆挪数量",
						title: '提示',
						showCancel: false
					})
					return
				}
				if (this.splitNum <= 0 || this.splitNum > this.chosenBoxRow.PackedQty) {
					uni.showModal({
						confirmText: '知道了',
						content: "拆挪的数量超出合法范围",
						title: '提示',
						showCancel: false
					})
					return
				}

				this.chosenBoxRow.UpdateUser = this.loginUser

				const formData = new FormData();
				formData.append("packBoxInfo", JSON.stringify(this.chosenBoxRow))
				formData.append("splitNum", this.splitNum)
				formData.append("deliveryId", this.deliveryId)

				console.log("需要提交的数据：", formData)

				const res = await this.$api.splitBoxNum(formData)
				console.log("返回的数据：", res)

				// setTimeout(function() {
				uni.showModal({
					confirmText: '知道了',
					content: res,
					title: '提示',
					showCancel: false,
					success: async function(modalRes) {
						if (modalRes.confirm) {
							that.chosenBoxRow.checked = false
							that.chosenBoxRow = {}
							if (that.chosenDeliveryId == "00000") {
								that.getCouldSplitBoxWithNoPlan()
							} else {
								await that.getCouldSplitBox();
								//更新选择计划行的包装列表
								let chosenRow = that.contents.filter(val =>
									val.DeliveryID == that.chosenDeliveryIdRow.DeliveryID)
								that.chosenDeliveryIdRow = chosenRow[0]
							}
						}
					}
				})
				// }, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tableLabel {
		margin-top: 15px;
		display: flex;
		justify-content: space-between;

		.u-icon {
			cursor: pointer;
		}
	}

	.table {
		margin-top: 10px;
	}

	.formClass {
		margin-top: 30px;
	}

	.btnClass {
		margin-top: 20px;
	}

	.rotateClass {
		animation: rotate 1s linear infinite;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>