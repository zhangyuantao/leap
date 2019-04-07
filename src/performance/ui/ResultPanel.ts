module leap {
	export class ResultPanel extends fairygui.GComponent{
		private restartBtn:fairygui.GButton;
		private quiteBtn:fairygui.GButton;
		private reviveBtn:fairygui.GButton;
		private txtScore:fairygui.GTextField;
		private txtScoreBest:fairygui.GTextField;

		public constructFromResource(){
            super.constructFromResource();
			let self = this;
			self.restartBtn = self.getChild("restartBtn").asButton;
			self.restartBtn.addClickListener(self.onReStartBtn, self);
			self.quiteBtn = self.getChild("quiteBtn").asButton;
			self.quiteBtn.addClickListener(self.onQuiteBtn, self);
			self.reviveBtn = self.getChild("reviveBtn").asButton;
			self.reviveBtn.addClickListener(self.onReviveBtn, self);
			self.txtScore = self.getChild("txtScore").asTextField;
			self.txtScoreBest = self.getChild("txtScoreBest").asTextField;
			self.alpha = 0;	

			utils.StageUtils.addEventListener("createGame", self.onCreateGame, self);
		}

		private onCreateGame(){
			let self = this;
			utils.EventDispatcher.getInstance().addEventListener("gameOver", self.onGameOver, self);
		}

		private onGameOver(){
			let self = this;
			self.show();
		}

		private show(){
			let self = this;
			self.txtScore.text = GameMgr.getInstance().score + "";
			self.txtScoreBest.text = GameMgr.getInstance().scoreRecord + "";
			self.reviveBtn.visible = !GameMgr.getInstance().hasRevived;
			self.visible = true;
			egret.Tween.get(self).to({alpha:1}, 500, egret.Ease.sineInOut);	
		}

		private onReStartBtn(e){
			let self = this;		
			MainWindow.instance.restartGame();
			self.hide();
		}

		private onQuiteBtn(e){
			let self = this;		
			self.hide();
			MainWindow.instance.backToReadyWindow();
		}

		private onReviveBtn(e){
			let self = this;
			if(GameMgr.getInstance().hasRevived)
				return;
			GameMgr.getInstance().watchVideoAd("复活Vedio", () => {
				GameMgr.getInstance().revive();
				self.hide();
			})	
		}

		private hide(){
			let self = this;
			egret.Tween.get(self).to({alpha:0}, 500, egret.Ease.sineInOut).call(() => {			
				self.visible = false;
			});			
		}

		public dispose(){
			super.dispose();
			let self = this;
			self.restartBtn.removeClickListener(self.onReStartBtn, self);
			self.quiteBtn.removeClickListener(self.onQuiteBtn, self);
			self.reviveBtn.removeClickListener(self.onReviveBtn, self);
			utils.StageUtils.removeEventListener("createGame", self.onCreateGame, self);
			utils.EventDispatcher.getInstance().removeEventListener("gameOver", self.onGameOver, self)	
		}
	}
}