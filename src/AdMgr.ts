module planetJump {
	export class AdMgr implements utils.ISingleton {
		private adCfg = {
			"结算界面banner": 'cnsg3amqimd5s0mmv1',
			"暂停界面banner": '7u2ld3cvld71bnd459',
			"帮助界面banner": 'fhi16oeh73f374acoc',
			"设置界面banner": 'aj6kika1id4im8frpn',
			"复活广告": '3n38ru34bohlac9ga6'
		};

		private videoAdComp: any;
		private bannerComp: any;

		private sysInfo: any;
		private screenWidth: number;
		private screenHeight: number;

		public static watchVideoEnd: Function;
		public static watchVideoFail: Function;

		onCreate() {
			let self = this;
			if (!platform.isRunInTT())
				return;

			let res = tt.getSystemInfoSync();
			self.sysInfo = res;
			self.screenWidth = res.screenWidth;
			self.screenHeight = res.screenHeight;
		}

		onDestroy() {
			let self = this;
		}

		// 展示banner广告
		public showBannerAd(adName: string, left?: number, top?: number, width?: number) {
			let self = this;
			if (!platform.isRunInTT())
				return;

			let adId = self.adCfg[adName]
			if (!adId)
				return;

			let info = {
				adUnitId: adId,
				style: {
					left: (self.screenWidth - 300) * 0.5,
					top: top || 0,
					width: 300
				}
			};

			if (self.bannerComp)
				self.bannerComp.destroy();
			self.bannerComp = platform.createBannerAd(info);
			self.bannerComp.onLoad(() => {
				self.bannerComp.show();
			});
			self.bannerComp.onError(e => console.log(e));
			self.bannerComp.onResize(res => {
				self.bannerComp.style.top = self.screenHeight - res.height;
			});
		}

		public hideBanner() {
			let self = this;
			if (self.bannerComp)
				self.bannerComp.hide();
		}

		// 观看视频广告
		public watchVideoAd(adName: string, end: Function, fail: Function) {
			let self = this;
			AdMgr.watchVideoEnd = end;
			AdMgr.watchVideoFail = fail;

			let adId = self.adCfg[adName]
			if (!adId) {
				return fail();
			}

			if (self.videoAdComp) {
				self.videoAdComp.offError(self.onVideoError);
				self.videoAdComp.offClose(self.onVideoClosed);
			}

			self.videoAdComp = platform.createVideoAd(adId);
			self.videoAdComp.load()
				.then(() => self.videoAdComp.show())
				.catch(err => {
					console.log(err.errMsg);
					fail();
				});

			self.videoAdComp.onError(self.onVideoError);
			self.videoAdComp.onClose(self.onVideoClosed);
		}

		private onVideoError(res) {
			let self = this;
			console.log("视频观看错误：", res);
			if (AdMgr.watchVideoFail)
				AdMgr.watchVideoFail();
		}

		private onVideoClosed(res) {
			let self = this;
			console.log("视频观看结束：", res);
			if (res && res.isEnded || res === undefined) {
				if (AdMgr.watchVideoEnd)
					AdMgr.watchVideoEnd(true);
			}
			else {
				if (AdMgr.watchVideoEnd)
					AdMgr.watchVideoEnd(false);
			}

			AdMgr.watchVideoEnd = null;
		}

		/**
		 * 比较版本号
		 * compareVersion('1.11.0', '1.9.9') // => 1 // 1表示 1.11.0比1.9.9要新
		 * compareVersion('1.11.0', '1.11.0') // => 0 // 0表示1.11.0和1.9.9是同一个版本
		 * compareVersion('1.11.0', '1.99.0') // => -1 // -1表示1.11.0比 1.99.0要老
		 */
		public compareVersion(v1, v2) {
			v1 = v1.split('.')
			v2 = v2.split('.')
			var len = Math.max(v1.length, v2.length)

			while (v1.length < len) {
				v1.push('0')
			}
			while (v2.length < len) {
				v2.push('0')
			}

			for (var i = 0; i < len; i++) {
				var num1 = parseInt(v1[i])
				var num2 = parseInt(v2[i])

				if (num1 > num2) {
					return 1
				} else if (num1 < num2) {
					return -1
				}
			}
			return 0
		}
	}
}
