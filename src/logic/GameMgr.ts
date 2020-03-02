module planetJump {
	export class GameMgr {
		private static instance: GameMgr;
		public static getInstance() {
			if (!GameMgr.instance)
				GameMgr.instance = new GameMgr();
			return GameMgr.instance;
		}

		public timer: MyTimer;
		public gameOver: boolean = false;
		public scoreRecord: number;	// 记录旧的周记录
		public score: number = 0;		// 得分
		public multiNum: number = 1; 	// 倍数
		public level: number = 1;		// 关卡
		public guideCompleted: boolean;
		public hasRevived: boolean;	// 标记该局是否分享过

		/**录屏相关 */
		public openAutoRecordFlag: boolean; // 开启自动录屏，以及结束时分享录屏
		public isRecording: boolean;
		public recordVideoPath: string;
		public recordTime: number;

		private constructor() {
			let self = this;
			/**录屏相关 */
			if (platform.isRunInTT()) {
				let flag = egret.localStorage.getItem("openAutoRecord");
				if (!flag || flag == "" || flag == "open" || flag == "1")  // == 1 兼容旧数据
					self.openAutoRecordFlag = true;
				else
					self.openAutoRecordFlag = false;

				let recorder = platform.getGameRecorderManager();
				recorder.onStop(res => {
					self.recordVideoPath = res.videoPath;
				});
			}

			utils.EventDispatcher.getInstance().addEventListener("newRound", self.onNewRound, self);
		}

		public dispose() {
			let self = this;
			self.level = 1;
			self.score = 0;
			utils.EventDispatcher.getInstance().removeEventListener("newRound", self.onNewRound, self);
			if (self.timer) {
				utils.ObjectPool.getInstance().destroyObject(self.timer);
				self.timer = null;
			}

			GameMgr.instance = null;
		}

		public get isPaused() {
			return utils.ObjectPool.getInstance().pause;
		}

		public gameBegin() {
			let self = this;
			self.hasRevived = false;
			let record = egret.localStorage.getItem("scoreRecord");
			if (record && record != "") {
				// 周一重重
				let recordTime = parseInt(egret.localStorage.getItem("recordTime"));
				if (!self.isSameWeek(recordTime)) {
					self.scoreRecord = 0;
					egret.localStorage.setItem("scoreRecord", "0");
				}
				else
					self.scoreRecord = parseInt(record);
			}
			else
				self.scoreRecord = 0;

			// 自动录屏
			if (self.openAutoRecordFlag)
				self.recordOrStopVideo();

			utils.EventDispatcher.getInstance().dispatchEvent("startGame");
		}

		private isSameWeek(oldTime) {
			oldTime = parseInt(oldTime);
			let newTime = new Date().getTime();
			let oneDayTime = 60 * 60 * 24 * 1000;
			// console.log("now:" + newTime + " old:" + oldTime + " off:" + (newTime - oldTime) + " one:" + (oneDayTime * 7))
			let oldDate = new Date(oldTime);
			let newDate = new Date(newTime);

			let oldDay = oldDate.getDay();
			let newDay = newDate.getDay();
			if (newDay == 0) {
				newDay = 7;
			}
			if (oldDay == 0) {
				oldDay = 7;
			}
			let isSame = false;

			if (oldDay < newDay) {
				if ((newTime - oldTime) < oneDayTime * 7) {  // 时间相差小于7
					isSame = true;
				}
			}
			else if (oldDay == newDay) {
				if ((newTime - oldTime) < oneDayTime) {
					isSame = true;
				}
			}
			return isSame;
		}


		/**
		 * 开始一个计时器
		 */
		public startTimer(timeout: number, cb: Function, thisObj: any) {
			let self = this;
			if (!self.timer)
				self.timer = utils.ObjectPool.getInstance().createObject(MyTimer);
			self.timer.startTimer(timeout, cb, thisObj);
		}

		private onNewRound(rounds) {
			let self = this;
			self.multiNum = rounds;
		}

		public addScore(score: number) {
			let self = this;
			if (!score || score <= 0) return;
			let addValue = score * self.multiNum;
			self.score += addValue;

			// 判断升级
			let needScore;
			let nextLv = self.level + 1;
			if (nextLv < 8) {
				let lvCfg = GameCfg.getLevelCfg(nextLv)
				needScore = lvCfg.score;
			}
			else { // >=8级后的规则
				let lvCfg = GameCfg.getLevelCfg(8);
				needScore = lvCfg.score[0] + lvCfg.score[1] * Math.pow((nextLv - 7), 2) + lvCfg.score[2] * (nextLv - 7);
			}

			if (self.score >= needScore) {
				self.level++;
				utils.EventDispatcher.getInstance().dispatchEvent("levelUp", self.level);
			}

			utils.EventDispatcher.getInstance().dispatchEvent("updateScore", self.score);

			return addValue;
		}

		// 死亡
		public dead() {
			let self = this;
			self.gameOver = true;

			// 存储新纪录
			if (self.score > self.scoreRecord) {
				let now = Date.now();
				egret.localStorage.setItem("scoreRecord", self.score.toString());
				egret.localStorage.setItem("recordTime", now.toString());
				self.scoreRecord = self.score;
				let v = {
					"ttgame": {
						"score": self.score,
						"update_time": Math.floor(now / 1000)
					},
					"recordTime": now.toString()
				};
				let info = {
					"key": "rank",
					"value": JSON.stringify(v)
				};

				if (Main.isScopeUserInfo()) {
					platform.setUserCloudStorage([info], res => {
						console.log("排行榜分数设置:", res);
					});
				}
			}

			self.setPause(true);

			self.recordOrStopVideo(true); // 停止录屏

			utils.Singleton.get(utils.SoundMgr).pauseBgm();

			utils.EventDispatcher.getInstance().dispatchEvent("gameOver");
		}

		// 复活
		public revive() {
			let self = this;
			if (self.hasRevived)
				return;
			self.hasRevived = true;
			self.gameOver = false;
			utils.EventDispatcher.getInstance().dispatchEvent("gameRevive");
			utils.EventDispatcher.getInstance().once("gameResume", () => {
				utils.EventDispatcher.getInstance().dispatchEvent("gameReviveOk");
				self.recordOrStopVideo();

				utils.Singleton.get(utils.SoundMgr).resumeBgm();
			}, self);
		}

		public setPause(paused: boolean, pauseBgm: boolean = true) {
			let self = this;
			if (self.isPaused == paused)
				return;
			utils.ObjectPool.getInstance().pause = paused;

			utils.EventDispatcher.getInstance().dispatchEvent(paused ? "gamePause" : "gameResume");
		}

		/**
		 * 使用指定图片分享
		 */
		public share(title?: string, shareImgId: number = -1) {
			let self = this;
			if (!platform.isRunInTT())
				return;

			//if (!title) title = self.getShareTittle();
			let info = self.getShareImgUrlId(shareImgId);

			// 分享
			tt.shareAppMessage({
				templateId: info[0],
				success() {
					console.log("分享成功");
				},
				fail(e) {
					console.log("分享失败");
				}
			});
		}

		// 使用 Canvas 内容作为转发图片（5:4比例）
		public shareFromCanvas(title?: string, x: number = 0, y: number = 200, width: number = 720, height: number = 576, destWidth: number = 425, destHeight: number = 340) {
			let self = this;
			if (!platform.isRunInTT())
				return;

			if (!title) title = self.getShareTittle();
			let tmpFilePath = canvas.toTempFilePathSync({
				x: x,
				y: y,
				width: width,
				height: height,
				destWidth: destWidth,
				destHeight: destHeight
			});

			tt.shareAppMessage({
				title: title,
				imageUrl: tmpFilePath,
				success() {
					console.log("分享成功");
				},
				fail(e) {
					console.log("分享失败");
				}
			});
		}

		public shareVideo(title: string, desc: string, ok: Function, fail: Function) {
			let self = this;
			if (!self.recordVideoPath)
				return;

			tt.shareAppMessage({
				channel: "video",
				title: title || "这个feel倍爽！",
				desc: desc || "这音乐节奏根本停不下来啊！",
				extra: {
					videoPath: self.recordVideoPath,
					videoTopics: ["飞跃吧"]
				},
				success() {
					console.log("分享视频成功");
					ok && ok();
					self.recordVideoPath = null;
				},
				fail(e) {
					console.log("分享视频失败");
					fail && fail();
					self.recordVideoPath = null;
				}
			});
		}

		/**
		 * 获取审核过的分享图信息
		 */
		public getShareImgUrlId(shareImgId: number = -1): string[] {
			let arr = [
				["2a7l46ei8ll1579ldl", "https://sf1-ttcdn-tos.pstatp.com/img/developer/app/tt75250398ea0f6cbe/si7189869~noop.image"],
				["1k41r8ua0fx5efjmgj", "https://sf1-ttcdn-tos.pstatp.com/img/developer/app/tt75250398ea0f6cbe/si655571e~noop.image"],
				["g176e69ajj1ddj3qir", "https://sf1-ttcdn-tos.pstatp.com/img/developer/app/tt75250398ea0f6cbe/sic070d8c~noop.image"],
				["p3c22o8o8k32mb85jg", "https://sf1-ttcdn-tos.pstatp.com/img/developer/app/tt75250398ea0f6cbe/sib51cc18~noop.image"],
			];

			if (shareImgId == -1) {
				let idx = Math.floor(1 + Math.random() * (arr.length - 1));
				return arr[idx];
			}
			else
				return arr[shareImgId];
		}

		/**
		 * 获取分享标题
		 */
		public getShareTittle() {
			let arr = [
				"这可能是最另类的跳一跳了~",
				"为了逃离黑洞，你不得不跳！",
				"这游戏火了就你不知道？好友圈都在玩！",
				"这游戏要是能上3000分就证明你有点东西~",
				"你永远不知道下一个背景是什么颜色。",
				"首次发现黑洞，地球命运掌握在你的手里！",
				"听说有点难？这分数不服来战！",
				"太好玩了！破纪录就靠你了，快来帮我复活。",
				"这音乐节奏根本停不下来啊！",
				"旋转，跳跃，但是我不能闭着眼！因为..."
			];
			let idx = Math.round(Math.random() * (arr.length - 1));
			return arr[idx];
		}

		/**
		 * 看广告，失败转分享
		 */
		public watchVideoAd(adKey: string, cb: Function) {
			let self = this;
			if (!platform.isRunInTT()) {
				return cb(true);
			}

			// 获取双倍奖励
			utils.Singleton.get(AdMgr).watchVideoAd(adKey, (isEnded) => {
				cb(isEnded);
			}, () => {
				// 广告拉取失败改成分享
				self.shareFromCanvas()
				cb(true);
			});
		}

		/**
		 * 开启或停止录屏
		 */
		public recordOrStopVideo(forceStop?: boolean) {
			let self = this;
			if (!platform.isRunInTT())
				return;

			if (forceStop)
				return self.stopRecord();

			if (!self.isRecording) {
				self.isRecording = true;
				let recorder = platform.getGameRecorderManager();
				recorder.start({ duration: 30 });
				self.recordTime = Date.now();
			}
			else {
				let dt = Date.now() - self.recordTime;
				if (dt > 3000) {
					self.stopRecord();
				}
				else {
					console.warn("录屏时长需大于3秒~");
				}
			}
		}

		private stopRecord() {
			let self = this;
			let recorder = platform.getGameRecorderManager();
			recorder.stop();
			self.isRecording = false;
			self.recordTime = 0;
		}

		/**
		 * 设置游戏开局自动录屏以及结束后的分享按钮行为为分享录屏
		 */
		public setAutoRecord(open: boolean) {
			let self = this;
			self.openAutoRecordFlag = open;
			egret.localStorage.setItem("openAutoRecord", open ? "open" : "close");
		}
	}
}