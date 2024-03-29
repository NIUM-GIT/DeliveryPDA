<template>
	<view class="n-page">
		<u-form labelPosition="left" :model="shipmentRecord" :rules="rules" ref="form1">
			<u-form-item label="计划行号:" prop="DeliveryID" borderBottom labelWidth="80">
				<u-input v-model="shipmentRecord.DeliveryID" border="none" readonly></u-input>
			</u-form-item>

			<u-input id="sacnInput" :focus="scanFocus" type="text" placeholder="请扫描箱号" clearable v-model="scanBoxNo"
				@confirm="checkBoxNoInfo"></u-input>

			<wyb-table v-if='tableHeight!=""' ref="table" class="table" width="auto" :headers="headers" :fontSize=[13]
				:contents="contents" :height='tableHeight' @onCellClick="clickCell" />

			<u-form-item label="承运:" prop="DeliveryCompany" borderBottom labelWidth="60">
				<template>
					<picker @change="bindPickerChange" :value="index" :range="expressList" range-key="DeliveryCompany">
						<u-input v-model="shipmentRecord.DeliveryCompany" border="none" :readonly="true"></u-input>
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
				productPn: '',
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
				}],
				contents: [],
				code: '',
				scanTime: 0,
				index: 0,
				expressList: [],
				shipmentRecord: {
					DeliveryID: '', //计划行号
					DeliveryCompany: '', //快递名称
					DeliveryNo: '', //快递单号
					SDNo: '' //SD单号
				},
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
			console.log("登录人信息：", loginUser);
			this.shipmentRecord.CreatedBy = loginUser.Account;
			console.log("选中的行：", params)
			// this.shipmentRecord = JSON.parse(JSON.stringify(params));
			this.shipmentRecord.ID = params.ID;
			this.shipmentRecord.DeliveryID = params.DeliveryID;
			this.shipmentRecord.CustomerID = params.CustomerID;
			this.shipmentRecord.ProductPN = params.ProductPN;
			this.shipmentRecord.Boxes = params.Boxes;
			this.shipmentRecord.ScheduleQty = params.ScheduleQty;
			this.shipmentRecord.ShippedQty = params.ShippedQty;
			this.shipmentRecord.Gap = params.Gap;
			this.productPn = params.ProductPN;

			this.deliveryRow = JSON.parse(JSON.stringify(params))

			this.$util.getWindowWidth(this);
			this.getPlanPackage();
			this.getExpressInfo();
		},
		mounted() {
			this.scanFocus = true
		},
		watch: {
			'scanRecord': 'scrollToBottom'
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('confirm', e);
				this.index = e.detail.value;
				let chooseRow = this.expressList[this.index];
				// this.shipmentRecord = JSON.parse(JSON.stringify(chooseRow));
				this.shipmentRecord.DelivererID = chooseRow.DelivererID;
				this.shipmentRecord.DeliveryCompany = chooseRow.DeliveryCompany;
				this.shipmentRecord.DeliverType = chooseRow.DeliverType;
				this.shipmentRecord.UM = chooseRow.UM;
				this.shipmentRecord.Price = chooseRow.Price;
				this.shipmentRecord.PriceType = chooseRow.PriceType;
				this.shipmentRecord.Deliverer = chooseRow.Deliverer;
				this.shipmentRecord.ContactNo = chooseRow.ContactNo;
			},

			clickCell(e) {
				console.log("点击的行：", e);
			},
			// scanBlur() {
			// 	this.scanFocus = false;
			// 	console.log("是否扫描完成：", this.scanOver)
			// 	//扫描完毕
			// 	if (this.scanOver) {
			// 		// #ifdef APP
			// 		uni.hideKeyboard();
			// 		// #endif
			// 		this.isFocus = true
			// 	} else {
			// 		setTimeout(() => {
			// 			this.scanFocus = !this.scanFocus
			// 		}, 200)
			// 	}
			// },
			//保持滚动条一直在底部
			scrollToBottom() {
				this.$nextTick(() => {
					var container = document.getElementById('container');
					container.scrollTop = container.scrollHeight;
				});
			},
			//查询扫描箱号的信息
			async checkBoxNoInfo(e) {
				console.log("1233：", e);
				this.scanRecord += "<p>扫描内容：" + e + "</p>";
				let infoArr = e.split(";");
				if (infoArr.length != 6) {
					uni.showToast({
						icon: 'none',
						title: '扫描条码的格式不正确'
					})
					this.scanRecord += "<p>扫描结果：扫描条码的格式不正确，请重新扫描！</p>";
					that.scanBoxNo = ""
					return;
				}
				await this.getPackageInfo(infoArr[0]);
			},
			getExpressInfo() {
				this.$api.getExpressInfo(1, 1000, "")
					.then(res => {
						var res = res.data;
						console.log("请求到的数据:", res);
						if (res.code == 200) { //登录成功
							this.expressList = res.data.data;
							let chooseRow = this.expressList[this.index];
							// this.shipmentRecord = JSON.parse(JSON.stringify(chooseRow));
							this.shipmentRecord.DelivererID = chooseRow.DelivererID;
							this.shipmentRecord.DeliveryCompany = chooseRow.DeliveryCompany;
							this.shipmentRecord.DeliverType = chooseRow.DeliverType;
							this.shipmentRecord.UM = chooseRow.UM;
							this.shipmentRecord.Price = chooseRow.Price;
							this.shipmentRecord.PriceType = chooseRow.PriceType;
							this.shipmentRecord.Deliverer = chooseRow.Deliverer;
							this.shipmentRecord.ContactNo = chooseRow.ContactNo;
							console.log("请求的快递信息：", this.expressList);
						} else {
							uni.showToast({
								icon: 'none',
								title: res.info
							})
						}
					})
			},
			getPlanPackage() {
				this.$api.getPlanPackage(this.shipmentRecord.DeliveryID, this.productPn)
					.then(res => {
						var res = res.data;
						console.log("请求到的数据:", res);
						if (res.code == 200) { //登录成功
							this.contents = res.data.map((val, index) => {
								val.index = index + 1;
								val.Qty = null;
								val.DeliveryID = this.shipmentRecord.DeliveryID;
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
			async getPackageInfo(boxId) {
				let that = this;
				this.$api.getPackageInfo(this.shipmentRecord.DeliveryID, boxId)
					.then(res => {
						var res = res.data;
						console.log("请求到的数据:", res);
						if (res.code == 200) { //登录成功
							if (res.data.length == 0) {
								uni.showToast({
									icon: 'none',
									title: "没有查到箱号是" + boxId + "的相关数据"
								})
								that.scanRecord += "<p>扫描结果：没有查到箱号是：" + boxId + "的相关数据</p>";
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
										//val.QtyperBox = valson.qtyperBox
									}
								})
								if (val.BoxID == boxId) {
									val.CustBoxID = boxId;
									console.log("次数：", that.contents.filter(val => val.CustBoxID))
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
					})
			},
			async submit() {
				let that = this;
				console.log("提交的数据：", this.shipmentRecord)
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
				if (this.contents.filter(val => val.Weight == null).length != 0) {
					this.showModal = true;
					this.modalContent = "箱号没有扫描齐全！";
					return;
				}
				this.shipmentRecord.ShippedQty = this.$util.getObjectSum(this.contents, "Qty");
				this.shipmentRecord.Weight = this.$util.getObjectSum(this.contents, "Weight");
				this.shipmentRecord.Gap = this.shipmentRecord.ShippedQty - this.shipmentRecord.ScheduleQty;
				this.shipmentRecord.detail = this.contents;

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

				// 查询客户产品的在排量
				let haveQtyInPlan = await this.$api.haveInPlanQty(this.shipmentRecord.DeliveryID)
				console.log("?????", haveQtyInPlan)
				//await haveInPlanQtyFun(this.shipmentRecord.DeliveryID);

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
				this.$api.shipment(saveData)
					.then(res => {
						var res = res.data;
						console.log("请求到的数据:", res);
						if (res.code == 200) { //登录成功
							uni.showToast({
								icon: 'none',
								title: '成功发货！'
							})
							setTimeout(function() {
								uni.navigateBack()
							}, 1000)
						} else {
							uni.showToast({
								icon: 'none',
								title: res.info
							})
						}
					})
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

	#sacnInput {
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