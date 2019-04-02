module leap {
	export class AdMgr implements utils.ISingleton{
		private adCfg = {
			"Banner首页":'adunit-254c6894d7445ced',
			"Banner答题":'adunit-ffc20a240f2df634',
			"Banner结算":'adunit-9bbb5f2e0e1a0deb',
			"Banner排行榜":'adunit-519a1a4eecd6cbfa',
			"Banner关卡":'adunit-5f71b2babc6d5531',
			"Banner转盘":'adunit-aa345621a1364836',
			"Banner礼物界面":'adunit-0be54d96516555f7',
			"Banner答题次数用完":'adunit-b01bca0c77d3e43b',
			"Video抽奖":'adunit-eb825b11659445af',
			"Video解锁提示":'adunit-8cf5566718dd3b8a',
			"Video双倍奖励":'adunit-f015846fe6b66acb',
			"Video解锁答题次数":'adunit-31773b2f5e36ae0a',
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
			let res = wx.getSystemInfoSync();
			self.sysInfo = res;
			self.screenWidth = res.screenWidth;
			self.screenHeight = res.screenHeight;
		}

        onDestroy(){
		}

		// 展示banner广告
		public showBannerAd(adName:string, left?:number, top?:number, width?:number){
			let self = this;	

			// SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API		
			if(self.compareVersion(self.sysInfo.SDKVersion, "2.0.4") < 0)
				return;

			let adId = self.adCfg[adName]	
			if(!adId)	
				return;

			let info = {
				adUnitId: 'adunit-aa345621a1364836',
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

		//public canWatchVideo(){
		//	return this.videoEnabled;
		//}

		// 观看视频广告
		public watchVideoAd(adName:string, watchOk:Function, watchFail:Function){
			let self = this;	
			let adId = self.adCfg[adName]	
			if(!adId)	
				return;
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
