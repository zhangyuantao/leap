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
		public oldScoreRecord:number;	// 记录旧的月记录
		public score:number = 0;		// 得分
		public multiNum:number = 1; 	// 倍数
		public level:number = 1;		// 关卡
		public guideCompleted:boolean;
		public hasResurgenced:boolean;	// 标记该局是否分享过

		private constructor(){
			let self = this;
			utils.EventDispatcher.getInstance().addEventListener("newRound", self.onNewRound, self);
		}

		public get isPaused(){
			return utils.ObjectPool.getInstance().pause;
		}

		public gameBegin(){
			let self = this;
			self.hasResurgenced = false;
			//self.oldScoreRecord = GameAPI.gameData.singleGameInfo.score || 0; // 记录旧记录
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

			// 服务端加分
			
			return addValue;
		}

		// 死亡
		public dead(){
			let self = this;
			self.gameOver = true;
			self.pause(true);
			utils.EventDispatcher.getInstance().dispatchEvent("gameOver");
			//			gameOver(new CallBackVo(), self.score);
		}

		// 复活
		public resurgence(){
			let self = this;
			self.hasResurgenced = true;
			self.gameOver = false;
			self.pause(false);
			utils.EventDispatcher.getInstance().once("gameResume", () => {
				utils.EventDispatcher.getInstance().dispatchEvent("gameResurgence");
				utils.Singleton.get(utils.SoundMgr).playSound("back_music_mp3");
			}, self);			
		}

		public pause(paused:boolean){
			let self = this;
			if(self.isPaused == paused)
				return;
			utils.ObjectPool.getInstance().pause = paused;
			
			utils.EventDispatcher.getInstance().dispatchEvent(paused ? "gamePause": "gameResume");
		}

		public dispose(){
			let self = this;
			self.level = 1;
			self.score = 0;
			utils.EventDispatcher.getInstance().removeEventListener("newRound", self.onNewRound, self);
			if(self.timer)
				utils.ObjectPool.getInstance().destroyObject(self.timer);
			
			GameMgr.instance = null;		
		}
	}
}