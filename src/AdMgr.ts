module planetJump {
	export class AdMgr implements utils.ISingleton{
		private adCfg = {
			"结算界面banner":'adunit-af30ea26be5ee8f3',
			"暂停界面banner":'adunit-4e928e7d53b5e701',
			"帮助界面banner":'adunit-71d035b44b8adf6b',
			"复活广告":'adunit-054e13726a11ffa3'
		};

		private onWatchVideoOk:Function;
		private onWatchVideoFail:Function;
		private videoAdComp:any;
		private bannerComp:any;

		private sysInfo:any;
		private screenWidth:number;
		private screenHeight:number;

		//private totayWatchVideoCount:number = 0;
		//private dayWatchVideoMaxCount:number = 5;
		
		//public videoEnabled:boolean = true;

		onCreate(){
			let self = this;
			if(!platform.isRunInTT())
				return;

			let res = tt.getSystemInfoSync();
			self.sysInfo = res;
			self.screenWidth = res.screenWidth;
			self.screenHeight = res.screenHeight;
		}

        onDestroy(){
		}

		// 展示banner广告
		public showBannerAd(adName:string, left?:number, top?:number, width?:number){
			let self = this;
			if(!platform.isRunInTT())
				return;	

			// SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API		
			if(self.compareVersion(self.sysInfo.SDKVersion, "2.0.4") < 0)
				return;

			let adId = self.adCfg[adName]	
			if(!adId)	
				return;

			let info = {
				adUnitId: adId,
    			style: {
					left: (self.screenWidth - 300) * 0.5,
					top: top || 0,
					width: 300
				}
			};

			if(self.bannerComp)
				self.bannerComp.destroy();
			self.bannerComp = platform.createBannerAd(info);	
			self.bannerComp.show();
			self.bannerComp.onError(e => console.log(e));
			self.bannerComp.onResize(res => {
				self.bannerComp.style.top = self.screenHeight - res.height;
			});
		}

		public hideBanner(){
			let self = this;
			if(self.bannerComp)
				self.bannerComp.hide();
		}

		// 观看视频广告
		public watchVideoAd(adName:string, watchOk:Function, watchFail:Function){
			let self = this;	
			let adId = self.adCfg[adName]	
			if(!adId){
				watchFail();
				return;
			}
			self.videoAdComp = platform.createVideoAd(adId);	
			self.videoAdComp.load()
			.then(() => self.videoAdComp.show())
			.catch(err => {
				console.log(err.errMsg);
				watchFail();
				return;
			});

			self.onWatchVideoOk = watchOk;
			self.onWatchVideoFail = watchFail;
			self.videoAdComp.onError(res => {self.onVideoError(res)});
			self.videoAdComp.onClose(res => {self.onVideoClosed(res)});
		}

		private onVideoError(res){
			let self = this;
			self.videoAdComp.offError();
			console.log("视频观看错误：", res);
			if(self.onWatchVideoFail)
				self.onWatchVideoFail();

			//if(self.totayWatchVideoCount >= self.dayWatchVideoMaxCount){
			//	self.videoEnabled = false;
			//}
		}

		private onVideoClosed(res){
			let self = this;
			self.videoAdComp.offClose();

			if(res && res.isEnded || res === undefined){
				// 观看完成
				self.onWatchVideoOk(true);

				//self.totayWatchVideoCount ++;
			}
			else{
				// 观看未完成
				self.onWatchVideoOk(false);
			}
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
