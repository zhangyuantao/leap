module planetJump {
	export class ReadyPanel extends fairygui.GComponent{
		private startBtn:fairygui.GButton;
		private rankBtn:fairygui.GButton;
		private shareBtn:fairygui.GButton;
		private scopeCtrl:fairygui.Controller;
		private platCtrl:fairygui.Controller;

		public constructFromResource(){
            super.constructFromResource();
			let self = this;
			self.startBtn = self.getChild("startBtn").asButton;
			self.startBtn.addClickListener(self.onStartBtn, self);
			self.rankBtn = self.getChild("rankBtn").asButton;
			self.rankBtn.addClickListener(self.onRankBtn, self);
			self.shareBtn = self.getChild("shareBtn").asButton;
			self.shareBtn.addClickListener(self.onShareBtn, self);
			self.scopeCtrl = self.getController("scopeCtrl");
			self.platCtrl = self.getController("platCtrl");
			self.initState();
		}

		private onStartBtn(e){
			let self = this;
			MainWindow.instance.createGame();
			self.hide();
			utils.StageUtils.addEventListener("leaveGame", self.onLeaveGame, self);
		}

		private initState(){
			let self = this;
			self.scopeCtrl.setSelectedPage("tt");
			self.scopeCtrl.setSelectedIndex(1);
			if(!Main.isScopeUserInfo && platform.isRunInTT()){
				self.scopeCtrl.setSelectedIndex(0);				
			}  
		}

		public show(){
			let self = this;
			self.initState();
			self.visible = true;
			egret.Tween.get(self).to({alpha:1}, 300, egret.Ease.sineInOut);
		}

		private hide(){
			let self = this;
			egret.Tween.get(self).to({alpha:0}, 300, egret.Ease.sineInOut).call(() => {			
				self.visible = false;
			});			
		}

		private onLeaveGame(e){
			let self = this;
			self.visible = true;
			self.startBtn.getTransition("t0").play();
			egret.Tween.get(self).to({alpha:1}, 300, egret.Ease.sineInOut);
		}

		private onRankBtn(e){
			let self = this;
			MainWindow.instance.showRankWnd();
		}

		private onShareBtn(e){
			let self = this;
			GameMgr.getInstance().share();
		}
		
		public dispose(){
			super.dispose();
			let self = this;
			self.startBtn.removeClickListener(self.onStartBtn, self);			
			self.rankBtn.removeClickListener(self.onRankBtn, self);
			self.shareBtn.removeClickListener(self.onShareBtn, self);
			utils.StageUtils.removeEventListener("leaveGame", self.onLeaveGame, self);
		}
	}
}