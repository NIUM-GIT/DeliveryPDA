<template>
	<view class="content"></view>
</template>

<script>
	var main, receiver, filter;
	var _codeQueryTag = false;
	export default {
		data() {
			return {
				scanCode: ''
			}
		},
		created: function(option) {
			this.initScan()
			this.startScan();
		},
		onHide: function() {
			this.stopScan();
		},
		destroyed: function() {
			this.stopScan();
		},
		methods: {
			initScan() {
				let _this = this;
				main = plus.android.runtimeMainActivity();
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				filter = new IntentFilter();
                //下面的addAction内改为自己的广播动作
				filter.addAction("android.intent.ACTION_DECODE_DATA");
				receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: function(context, intent) {
						plus.android.importClass(intent);
                        //下面的getStringExtra内改为自己的广播标签
						let code = intent.getStringExtra("barcode_string");
						_this.queryCode(code);
					}
				});
			},
			startScan() {
				main.registerReceiver(receiver, filter);
			},
			stopScan() {
				main.unregisterReceiver(receiver);
			},
			queryCode: function(code) {
				if (_codeQueryTag) return false;
				_codeQueryTag = true;
				setTimeout(function() {
					_codeQueryTag = false;
				}, 150);
				var id = code
				console.log('id:', id)
				uni.$emit('scan', {
					code: id
				})
			}
		}
	}
</script>
