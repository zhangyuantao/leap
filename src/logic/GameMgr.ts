module leap {
	export class GameMgr {		
		private static instance:GameMgr;
		public static getInstance() {
			if(!GameMgr.instance)
				GameMgr.instance = new GameMgr();
			return GameMgr.instance;
		}

		public timer:MyTimer;
		public gameOver:boolean = false;
		public scoreRecord:number;	// 记录旧的周记录
		public score:number = 0;		// 得分
		public multiNum:number = 1; 	// 倍数
		public level:number = 1;		// 关卡
		public guideCompleted:boolean;
		public hasRevived:boolean;	// 标记该局是否分享过

		private constructor(){
			let self = this;
			utils.EventDispatcher.getInstance().addEventListener("newRound", self.onNewRound, self);
		}

		public get isPaused(){
			return utils.ObjectPool.getInstance().pause;
		}

		public gameBegin(){
			let self = this;
			self.hasRevived = false;
			let record = egret.localStorage.getItem("scoreRecord");
			if(record && record != "")
				self.scoreRecord = parseInt(record);
			else
				self.scoreRecord = 0;

			utils.EventDispatcher.getInstance().dispatchEvent("startGame");
		}

		/**
		 * 开始一个计时器
		 */
		public startTimer(timeout:number, cb:Function, thisObj:any){
			let self = this;
			if(!self.timer)
				self.timer = utils.ObjectPool.getInstance().createObject(MyTimer);
			self.timer.startTimer(timeout, cb, thisObj);
		}

		private onNewRound(rounds){
			let self = this;			
			self.multiNum = rounds;
		}

		public addScore(score:number){
			let self = this;
			if(!score || score <= 0) return;
			let addValue = score * self.multiNum;
			self.score += addValue;

			// 判断升级
			let needScore;
			let nextLv = self.level + 1;
			if(nextLv < 8){
				let lvCfg = GameCfg.getLevelCfg(nextLv)
				needScore = lvCfg.score;		
			}
			else{ // >=8级后的规则
				let lvCfg = GameCfg.getLevelCfg(8);
				needScore = lvCfg.score[0] + lvCfg.score[1] * Math.pow((nextLv - 7), 2) + lvCfg.score[2] * (nextLv - 7);
			}

			if(self.score >= needScore){
				self.level++;
				utils.EventDispatcher.getInstance().dispatchEvent("levelUp", self.level);
			}

			utils.EventDispatcher.getInstance().dispatchEvent("updateScore", self.score);
			
			return addValue;
		}

		// 死亡
		public dead(){
			let self = this;
			self.gameOver = true;
			self.pause(true);

			// 存储新纪录
			if(self.score > self.scoreRecord){				
				egret.localStorage.setItem("scoreRecord", self.score.toString());
				self.scoreRecord = self.score;
				platform.setUserCloudStorage([{key:'score', value:`${self.score}`}], res => { 
					console.log("分数设置成功:", res);
				});
			}
			
			utils.EventDispatcher.getInstance().dispatchEvent("gameOver");		
		}

		// 复活
		public revive(){
			let self = this;
			if(self.hasRevived)
				return;			
			self.hasRevived = true;

			self.gameOver = false;
			
			utils.EventDispatcher.getInstance().dispatchEvent("gameRevive");

			utils.EventDispatcher.getInstance().once("gameResume", () => {
				utils.EventDispatcher.getInstance().dispatchEvent("gameReviveOk");
			}, self);
		}

		public pause(paused:boolean){
			let self = this;
			if(self.isPaused == paused)
				return;
			utils.ObjectPool.getInstance().pause = paused;			
			
			if(!paused)
				utils.Singleton.get(utils.SoundMgr).resumeBgm();
				
			utils.EventDispatcher.getInstance().dispatchEvent(paused ? "gamePause": "gameResume");
		}

		/**
		 * 分享
		 */
		public share(title:string, shareImgId:number){
			let self = this;
			if(!platform.isRunInWX())
				return;
			
			let urlId = self.getShareImgUrlId(shareImgId);;

			// 分享
			wx.shareAppMessage({
				"title":title,
				"imageUrl":`resource/assets/share${shareImgId}.png`,
				"imageUrlId":urlId,
				"query":"",					
			});
		}

		/**
		 * 获取分享图编号
		 */
		public getShareImgUrlId(shareImgId:number){
			let urlId = shareImgId == 1 ? "k972XN06TNGPgKaQaMw4WQ" : "sLuHd8JpTQCDOtEHCBUpog";
			return urlId;
		}

		/**
		 * 看广告，失败转分享
		 */
		public watchVideoAd(adKey:string, cb:Function){
			let self = this;
			if(!platform.isRunInWX()){
				return cb();
			}

			// 获取双倍奖励
			utils.Singleton.get(AdMgr).watchVideoAd(adKey, (isEnded) => {
				if(isEnded){ // 观看广告完成
					cb();
				}
			}, () => {
				// 广告拉取失败改成分享
				self.share("你的好友请你帮他复活上分！拜托！", 1);
				cb();
			});				
		}


		public dispose(){
			let self = this;
			self.level = 1;
			self.score = 0;
			utils.EventDispatcher.getInstance().removeEventListener("newRound", self.onNewRound, self);
			if(self.timer){
				utils.ObjectPool.getInstance().destroyObject(self.timer);
				self.timer = null;
			}
			
			GameMgr.instance = null;		
		}
	}
}