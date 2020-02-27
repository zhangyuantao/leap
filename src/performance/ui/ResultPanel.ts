module planetJump {
	export class ResultPanel extends fairygui.GComponent {
		private restartBtn: fairygui.GButton;
		private homeBtn: fairygui.GButton;
		private reviveBtn: fairygui.GButton;
		private shareBtn: fairygui.GButton;
		private txtScore: fairygui.GTextField;
		private txtScoreBest: fairygui.GTextField;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.restartBtn = self.getChild("restartBtn").asButton;
			self.restartBtn.addClickListener(self.onReStartBtn, self);
			self.homeBtn = self.getChild("homeBtn").asButton;
			self.homeBtn.addClickListener(self.onHomeBtn, self);
			self.reviveBtn = self.getChild("reviveBtn").asButton;
			self.reviveBtn.addClickListener(self.onReviveBtn, self);
			self.shareBtn = self.getChild("shareBtn").asButton;
			self.shareBtn.addClickListener(self.onShareBtn, self);
			self.txtScore = self.getChild("txtScore").asTextField;
			self.txtScoreBest = self.getChild("txtScoreBest").asTextField;
			self.alpha = 0;

			utils.StageUtils.addEventListener("createGame", self.onCreateGame, self);
		}

		private onCreateGame() {
			let self = this;
			utils.EventDispatcher.getInstance().addEventListener("gameOver", self.onGameOver, self);
		}

		private onGameOver() {
			let self = this;
			self.show();
		}

		private show() {
			let self = this;
			self.txtScore.text = GameMgr.getInstance().score + "";
			self.txtScoreBest.text = GameMgr.getInstance().scoreRecord + "";
			self.reviveBtn.visible = !GameMgr.getInstance().hasRevived;
			self.visible = true;
			egret.Tween.get(self).to({ alpha: 1 }, 500, egret.Ease.sineInOut);

			// 显示横板排行榜
			MainWindow.instance.showRankWnd("horizontal", 0, false, false);

			utils.Singleton.get(AdMgr).showBannerAd("结算界面banner");

			// 停止录屏
			MainWindow.instance.forceStopVideo();
		}

		private onReStartBtn(e) {
			let self = this;
			MainWindow.instance.restartGame();
			self.hide();
		}

		private onHomeBtn(e) {
			let self = this;
			self.hide();
			MainWindow.instance.backToReadyWindow();
		}

		private onReviveBtn(e) {
			let self = this;
			if (GameMgr.getInstance().hasRevived)
				return;

			self.touchable = false;
			GameMgr.getInstance().watchVideoAd("复活广告", (success: boolean) => {
				self.touchable = true;
				if (success) {
					GameMgr.getInstance().revive();
					self.hide();
				}
			});
		}

		private onShareBtn(e) {
			let self = this;
			if (MainWindow.instance.recordVideoPath) {
				GameMgr.getInstance().shareVideo(null, null, null, () => {
					GameMgr.getInstance().shareFromCanvas();					
				});
			}
			else {
				GameMgr.getInstance().shareFromCanvas();
			}
		}

		private hide() {
			let self = this;
			self.touchable = false;
			MainWindow.instance.hideRankWnd();
			egret.Tween.get(self).to({ alpha: 0 }, 500, egret.Ease.sineInOut).call(() => {
				self.visible = false;
				self.touchable = true;
			});
			utils.Singleton.get(AdMgr).hideBanner();
		}

		public dispose() {
			super.dispose();
			let self = this;
			self.restartBtn.removeClickListener(self.onReStartBtn, self);
			self.homeBtn.removeClickListener(self.onHomeBtn, self);
			self.reviveBtn.removeClickListener(self.onReviveBtn, self);
			self.shareBtn.removeClickListener(self.onShareBtn, self);
			utils.StageUtils.removeEventListener("createGame", self.onCreateGame, self);
			utils.EventDispatcher.getInstance().removeEventListener("gameOver", self.onGameOver, self)
		}
	}
}