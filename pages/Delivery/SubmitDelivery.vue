<template>
	<view class="n-page">
		<u-form labelPosition="left" :model="shipmentRecord" :rules="rules" ref="form1">
			<u-form-item label="计划行号:" prop="DeliveryID" borderBottom labelWidth="80">
				<u-input v-model="shipmentRecord.DeliveryID" border="none" readonly></u-input>
			</u-form-item>

			<u-row gutter="20" class="scanRow">
				<u-col :span="10">
					<u-input :focus="scanFocus" type="text" placeholder="请扫描箱号" clearable v-model="scanBoxNo"
						@confirm="checkBoxNoInfo"></u-input>
				</u-col>
				<u-col :span="2">
					<u-button @click="openSplitPage">拆挪</u-button>
				</u-col>
			</u-row>

			<wyb-table v-if='tableHeight!=""' ref="table" class="table" width="auto" :headers="headers" :fontSize=[13]
				:contents="contents" :height='tableHeight' :computed-col="needComputed" />

			<u-form-item label="承运:" prop="DeliveryCompany" borderBottom labelWidth="60">
				<template>
					<picker @change="bindPickerChange" :value="index" :range="expressList" range-key="DeliveryCompany">
						<view>{{shipmentRecord.DeliveryCompany}}</view>
					</picker>
				</template>
			</u-form-item>
			<u-form-item label="单号:" prop="DeliveryNo" borderBottom labelWidth="60">
				<u-input v-model="shipmentRecord.DeliveryNo" :focus="isFocus" border="none" autocomplete="off"
					@confirm="() => {isFocus1 = true}" clearable></u-input>
			</u-form-item>
			<u-form-item label="SD单号:" prop="SDNo" borderBottom labelWidth="60">
				<u-input v-model="shipmentRecord.SDNo" :focus="isFocus1" border="none" autocomplete="off"
					clearable></u-input>
			</u-form-item>
		</u-form>
		<u-button class="submit-style" type="primary" size="small" text="提交" @click="submit"></u-button>

		<u-input class="u-content" v-if="!scanRecord" placeholder="这里显示扫描记录..." readonly></u-input>
		<view v-else id="container" class="u-content">
			<u-parse :content="scanRecord"></u-parse>
		</view>

		<u-modal :show="showModal" :title="modalTitle" confirmColor="#338dc0" :content='modalContent'
			@confirm="()=>{showModal = false}"></u-modal>
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
				windowWidth: '',
				rules: {
					'DeliveryID': {
						type: 'string',
						required: true,
						message: '请填写计划号',
						trigger: ['blur', 'change']
					}
				},
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
						label: '重量',
						key: 'Weight'
					}, {
						label: '客户箱号',
						key: 'CustBoxID'
					}, {
						label: '产品',
						key: 'ItemCode',
						width: '160px'
					},
					// {
					// 	label: '客户',
					// 	key: 'CustCode'
					// }, 
					{
						label: '包装日期',
						key: 'PackedDate',
						width: '140px'
					},
					// {
					// 	label: '发货日期',
					// 	key: 'ShipDate',
					// 	width: '140px'
					// },
				],
				contents: [],
				needComputed: ['Qty'],
				code: '',
				scanTime: 0,
				index: -1,
				expressList: [],
				shipmentRecord: {}, //需要保存的所有数据
				showModal: false, //模态框显示状态
				modalTitle: '提示', //模态框标题
				modalContent: '', //模态框内容
				isFocus: false,
				isFocus1: false,
				deliveryRow: {}, //计划行的信息
				scanBoxNo: "",
				scanRecord: "",
				scanFocus: false,
				scanOver: false,
			};
		},
		onLoad(params) {
			var loginUser = JSON.parse(uni.getStorageSync('userInfo'));
			this.shipmentRecord.CreatedBy = loginUser.Account;
			console.log("选中的行：", params)
			//将选中的计划详情参数备份，方便条件性字段的获取
			this.deliveryRow = {
				...params
			}

			//将params中需要的字段值解构出来
			let {
				ID,
				DeliveryID,
				CustomerID,
				FGPN,
				Boxes,
				ScheduleQty,
				ShippedQty,
				Gap
			} = params

			this.shipmentRecord = {
				...this.shipmentRecord,
				ID,
				DeliveryID,
				CustomerID,
				ProductPN: FGPN,
				Boxes,
				ScheduleQty,
				ShippedQty,
				Gap
			}

			this.getPlanPackage();
			this.getExpressInfo();
		},
		onShow() {
			this.getPlanPackage();
		},
		mounted() {
			this.scanFocus = true
		},
		watch: {
			'scanRecord': 'scrollToBottom',
			'index': 'valueShipmentRecordExpressInfo'
		},
		methods: {
			/** 点击拆挪事件 */
			openSplitPage() {
				console.log("！！！", this.shipmentRecord.DeliveryID)
				this.$util.jumpTo('pages/Delivery/SplitBoxNum', {
					deliveryID: this.shipmentRecord.DeliveryID,
					ProductPN: this.shipmentRecord.ProductPN
				})
			},
			bindPickerChange(e) {
				this.index = e.detail.value;
			},
			/** 对要保存的快递信息进行赋值 */
			valueShipmentRecordExpressInfo() {
				let {
					DelivererID,
					DeliveryCompany,
					DeliverType,
					UM,
					Price,
					PriceType,
					Deliverer,
					ContactNo
				} = this.expressList[this.index];

				this.shipmentRecord = {
					...this.shipmentRecord,
					DelivererID,
					DeliveryCompany,
					DeliverType,
					UM,
					Price,
					PriceType,
					Deliverer,
					ContactNo
				}
			},
			//保持扫描结果框的滚动条一直在底部
			scrollToBottom() {
				this.$nextTick(() => {
					var container = document.getElementById('container');
					container.scrollTop = container.scrollHeight;
				});
			},
			//查询扫描箱号的信息
			checkBoxNoInfo(e) {
				this.scanRecord += "<p>扫描内容：" + e + "</p>";
				//为了方便测试，这里支持两种扫描格式-> 1、单独的箱号；2、箱号条码格式（6个字段且以分号隔开的字符串）
				let isScanRight = false;
				let boxId = "";
				if (e.indexOf(";") != -1) {
					let infoArr = e.split(";");
					isScanRight = infoArr.length == 6
					boxId = isScanRight ? infoArr[0] : ""
				} else {
					let letterPatt = /^[A-Za-z]+$/
					isScanRight = e.length > 13 && letterPatt.test(e[0]) && !isNaN(Number(e.substring(1)))
					boxId = isScanRight ? e : ""
				}

				if (!isScanRight) {
					uni.showToast({
						icon: 'none',
						title: '扫描条码的格式不正确'
					})
					this.scanRecord += "<p>扫描结果：扫描条码的格式不正确，请重新扫描！</p>";
					this.scanBoxNo = ""
					return;
				}
				this.getPackageInfo(boxId);
			},
			//请求快递列表信息
			async getExpressInfo() {
				const res = await this.$api.getExpressInfo(1, 1000, "")
				this.expressList = res.data
				this.index = 0;
			},
			//请求计划号下的所有包装信息
			async getPlanPackage() {
				const res = await this.$api.getPlanPackage(this.shipmentRecord.DeliveryID,
					this.shipmentRecord.ProductPN)
				this.contents = res.map((val, index) => {
					val.index = index + 1;
					//方便看出没扫描的行
					val.Qty = null;
					val.Weight = null;
					return val;
				});
			},
			/** 获取扫描箱号的信息
			 * @param {Object} boxId 箱号ID
			 */
			async getPackageInfo(boxId) {
				let that = this;
				const res = await this.$api.getPackageInfo(this.shipmentRecord.DeliveryID, boxId)
				if (res.code == 200) { //登录成功
					if (res.data.length == 0) {
						uni.showToast({
							icon: 'none',
							title: "没有查到对应计划号下箱号" + boxId + "的相关数据"
						})
						that.scanRecord += "<p>扫描结果：没有查到对应计划号下箱号" + boxId + "的相关数据</p>";
						return;
					}
					that.contents = that.contents.map(val => {
						res.data.map(valson => {
							if (val.BoxID == valson.boxID && val.CustBoxID == valson
								.custBoxId) {
								val.DeliveryID = that.shipmentRecord.DeliveryID;
								val.Weight = valson.weight;
								val.Qty = valson.qty;
								val.CustBoxID = valson.custBoxId;
							}
						})
						if (val.BoxID == boxId) {
							val.CustBoxID = boxId;
							if (that.contents.filter(val => val.CustBoxID).length == that.contents
								.length) {
								uni.showToast({
									icon: 'none',
									title: '已扫描完毕'
								})
								that.scanRecord += "<p>已扫描完毕！</p>";
								that.scanOver = true
								setTimeout(() => {
									that.isFocus = true
								}, 200)
							}
						}
						return val;
					})
					this.$nextTick();
				} else {
					uni.showToast({
						icon: 'none',
						title: res.info
					})
					that.scanRecord += "<p>扫描结果：" + res.info + "</p>";
				}
				that.scanBoxNo = ""
			},
			async submit() {
				let that = this;
				if (!this.shipmentRecord.DeliveryCompany) {
					this.showModal = true;
					this.modalContent = "承运不能为空！";
					return;
				}
				if (!this.shipmentRecord.DeliveryNo) {
					this.showModal = true;
					this.modalContent = "快递单号不能为空！";
					return;
				}
				if (this.contents.filter(val => val.Qty != null).length == 0) {
					this.showModal = true;
					this.modalContent = "没有扫描箱号！";
					return;
				}
				this.shipmentRecord.ShippedQty = this.$util.getObjectSum(this.contents, "Qty");
				this.shipmentRecord.Weight = this.$util.getObjectSum(this.contents, "Weight");
				this.shipmentRecord.Gap = this.shipmentRecord.ShippedQty - this.shipmentRecord.ScheduleQty;
				this.shipmentRecord.detail = this.contents.filter(val => val.Qty > 0);

				if (this.shipmentRecord.Gap > 0 && this.deliveryRow.IsOverShip == "N") {
					this.showModal = true;
					this.modalContent = "该计划不允许超发！";
					return;
				}

				that.shipmentRecord.CarryType = 1 // CarryType=1:放进结余;=2:减少在排量
				console.log("提交的数据：", this.shipmentRecord)

				if (this.shipmentRecord.Gap == 0) {
					that.saveShip(that.shipmentRecord)
					return
				}

				// 查询客户产品是否有其他计划的在排量
				const haveQtyInPlan = await this.$api.haveInPlanQty(this.shipmentRecord.DeliveryID)
				console.log("客户产品是否有其他计划的在排量?", haveQtyInPlan)

				if (this.shipmentRecord.Gap > 0) { // 允许情况下的多发
					try {
						// 查询涉及到的订单可排量是否充足
						let isEnough = await this.$api.isBalanceQtyEnough(this.shipmentRecord.DeliveryID,
							this.shipmentRecord.Gap)
						if (isEnough) {
							this.saveShip(this.shipmentRecord)
							return
						}
						if (!haveQtyInPlan) {
							uni.showModal({
								title: '错误',
								content: '计划超发：客户产品涉及的订单可排量不足，也没有其他计划在排量可减，无法发货！',
								success: function(res) {}
							})
							return
						}
						uni.showModal({
							title: '提示',
							content: '计划超发：客户产品涉及的订单可排量不足，是否要减少当前在排量？',
							success: function(res) {
								if (res.confirm) {
									that.shipmentRecord.CarryType = 2
									that.saveShip(that.shipmentRecord)
								} else {
									uni.showModal({
										title: '错误',
										content: '计划超发：客户产品涉及的订单可排量不足，无法发货！',
										success: function(res) {}
									});
								}

							}
						});
					} catch (e) {
						uni.showToast({
							title: e.message,
							icon: "none"
						})
						return
					}
				} else { // 欠发
					try {
						if (!haveQtyInPlan) {
							that.saveShip(that.shipmentRecord)
							return
						}
						uni.showModal({
							title: '提示',
							content: '计划欠发：客户产品有排其他计划，是否要追加到在排量？',
							success: function(res) {
								if (res.confirm) {
									that.shipmentRecord.CarryType = 2
								}
								that.saveShip(that.shipmentRecord)
							}
						});
					} catch (e) {
						uni.showToast({
							title: e.message,
							icon: "none"
						})
						return
					}
				}
			},
			// async isBalanceQtyEnough() {
			// 	let res = await this.$api.isBalanceQtyEnough();
			// 	res = res.data
			// 	if (res.code == 200) {
			// 		return res.data;
			// 	} else {
			// 		throw res.info
			// 	}
			// },
			// async haveInPlanQtyFun(deliveryId) {
			// 	console.log("?????", deliveryId)
			// 	// let res = await this.$api.haveInPlanQty(deliveryId);
			// 	// res = res.data
			// 	// console.log("咋回事呢??", res)
			// 	// if (res.code == 200) {
			// 	// 	return res.data;
			// 	// } else {
			// 	// 	throw res.info
			// 	// }
			// },
			saveShip(saveData) {
				console.log(saveData);
				// this.$api.shipment(saveData)
				// 	.then(res => {
				// 		var res = res.data;
				// 		console.log("请求到的数据:", res);
				// 		if (res.code == 200) { //登录成功
				// 			uni.showToast({
				// 				icon: 'none',
				// 				title: '成功发货！'
				// 			})
				// 			setTimeout(function() {
				// 				uni.navigateBack()
				// 			}, 1000)
				// 		} else {
				// 			uni.showToast({
				// 				icon: 'none',
				// 				title: res.info
				// 			})
				// 		}
				// 	})
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

	.table {
		margin-top: 10px;
		margin-bottom: 20px;
	}

	.scanRow {
		margin-top: 20px
	}

	.u-content {
		margin-top: 20px;
		padding: 6px 9px;
		border-radius: 4px;
		border-width: 0.5px !important;
		border-color: #dadbde !important;
		border-style: solid;
		max-height: 200px;
		overflow: scroll;
	}
</style>