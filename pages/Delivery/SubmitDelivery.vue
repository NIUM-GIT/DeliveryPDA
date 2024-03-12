<template>
	<view class="n-page">
		<u-form labelPosition="left" :model="shipmentRecord" :rules="rules" ref="form1">
			<u-form-item label="计划行号:" prop="DeliveryID" borderBottom ref="item1" labelWidth="80">
				<u-input v-model="shipmentRecord.DeliveryID" border="none" readonly></u-input>
			</u-form-item>
			<scan></scan>
			<view style="position: relative;">
				<u-button style="width: 130px;marginTop: 10px;backgroundColor: #338dc0;" :loading="isScanBox"
					loadingText="扫描箱号监听中" type="primary" size="small" text="开始监听扫描箱号"
					@click="changeScanFlag"></u-button>
				<u-button style="position: absolute;top:0;right:0;width:50px;backgroundColor: #338dc0;" v-if="isScanBox"
					size="small" text="取消" @click="changeScanFlag"></u-button>
			</view>
			<!-- <u-button style="marginTop:10px" size="small" text="获取箱信息" @click="getPackageInfo()"></u-button> -->
			<wyb-table v-if='tableHeight!=""' ref="table" class="table" width="auto" :headers="headers" :fontSize=[13]
				:contents="contents" :height='tableHeight' @onCellClick="clickCell" />

			<u-form-item label="承运:" prop="DeliveryCompany" borderBottom ref="item1" labelWidth="60">
				<template>
					<picker @change="bindPickerChange" :value="index" :range="expressList" range-key="DeliveryCompany">
						<u-input v-model="shipmentRecord.DeliveryCompany" border="none" :readonly="true"></u-input>
					</picker>
				</template>
			</u-form-item>
			<u-form-item label="单号:" prop="DeliveryNo" borderBottom ref="item1" labelWidth="60">
				<u-input v-model="shipmentRecord.DeliveryNo" border="none" autocomplete="off" @focus="changeFocus"
					@blur="changeBlur" :auto-blur="false" clearable></u-input>
			</u-form-item>
		</u-form>
		<u-modal :show="showModal" :title="modalTitle" confirmColor="#338dc0" :content='modalContent'
			@confirm="()=>{showModal = false}"></u-modal>
		<u-button class="submit-style" type="primary" size="small" text="提交" @click="submit"></u-button>
		<bottomInfoBox></bottomInfoBox>
	</view>
</template>

<script>
	import wybTable from '@/components/wyb-table/wyb-table.vue'
	import scan from "@/components/scan/scan.vue";
	import bottomInfoBox from "@/components/bottom-info-box.vue"
	export default {
		components: {
			wybTable,
			scan,
			bottomInfoBox
		},
		data() {
			return {
				version: getApp().globalData.version,
				windowWidth: '',
				isScanBox: false,
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
				},
				showModal: false, //模态框显示状态
				modalTitle: '提示', //模态框标题
				modalContent: '', //模态框内容
				isFocus: false,
				deliveryRow: {} //计划行的信息
			};
		},
		onLoad(params) {
			var loginUser = JSON.parse(uni.getStorageSync('userInfo'));
			console.log("登录人信息：", loginUser);
			this.shipmentRecord.CreateBy = loginUser.Account;
			console.log("选中的行：", params)
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
			plus.key.addEventListener('keydown', event => {
				console.log("按键：", event);
				uni.$on('scan', function(data) {
					//扫码成功后的回调，你可以写自己的逻辑代码在这里
					console.log('扫码结果：', data.code);
				})
			});
		},
		onShow() {
			let that = this;
			uni.$off('scan') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scan', function(data) {
				console.log('扫码结果：', that.isScanBox, data.code);
				//扫码成功后的回调，你可以写自己的逻辑代码在这里
				if (that.isFocus) {
					return;
				}
				if (!that.isScanBox || data.code == '') {
					uni.showToast({
						icon: 'none',
						title: "没有开启监听扫描或者没有扫描内容"
					})
					return;
				};
				console.log('扫码结果1：', data.code);
				that.getPackageInfo(data.code);
				that.contents = that.contents.map(val => {
					if (val.BoxID == data.code) {
						val.CustBoxID = JSON.parse(data.code).CustBoxID;
						console.log("次数：", that.contents.filter(val => val.CustBoxID))
						if (that.contents.filter(val => val.CustBoxID).length == that.contents.length) {
							uni.showToast({
								icon: 'none',
								title: '已扫描完毕'
							})
							that.isScanBox = !that.isScanBox;
						}
					}
					return val;
				})
			})
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('confirm', e);
				this.index = e.detail.value;
				let chooseRow = this.expressList[this.index];
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
			changeScanFlag() {
				this.isScanBox = !this.isScanBox;
			},
			changeFocus() {
				// #ifdef APP
				uni.hideKeyboard();
				// #endif
				this.isScanBox = false;
				this.isFocus = true;
			},
			changeBlur() {
				this.isFocus = false;
			},
			getExpressInfo() {
				this.$api.getExpressInfo(1, 1000, "")
					.then(res => {
						var res = res.data;
						console.log("请求到的数据:", res);
						if (res.code == 200) { //登录成功
							this.expressList = res.data.data;
							let chooseRow = this.expressList[this.index];
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
			getPackageInfo(boxId) {
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
										val.QtyperBox = valson.qtyperBox
									}
								})
								return val;
							})
							this.$nextTick();
						} else {
							uni.showToast({
								icon: 'none',
								title: res.info
							})
						}
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
				let haveQtyInPlan = await haveInPlanQty(this.shipmentRecord.DeliveryID);

				if (this.shipmentRecord.Gap > 0) { // 允许情况下的多发
					try {
						// 查询涉及到的订单可排量是否充足
						let isEnough = await isBalanceQtyEnough(this.shipmentRecord.DeliveryID,
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
			async isBalanceQtyEnough() {
				let res = await this.$api.isBalanceQtyEnough();
				res = res.data
				if (res.code == 200) {
					return res.data;
				} else {
					throw res.info
				}
			},
			async haveInPlanQty() {
				let res = await this.$api.haveInPlanQty();
				res = res.data
				if (res.code == 200) {
					return res.data;
				} else {
					throw res.info
				}
			},
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
</style>