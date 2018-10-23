module leap {
	export class ReadyPanel extends fairygui.GComponent{
		private startBtn:fairygui.GButton;
		private rankBtn:fairygui.GButton;

		public constructFromResource(){
            super.constructFromResource();
			let self = this;
			self.startBtn = self.getChild("startBtn").asButton;
			self.startBtn.addClickListener(self.onStartBtn, self);
			self.rankBtn = self.getChild("rankBtn").asButton;
			self.rankBtn.addClickListener(self.onRankBtn, self);		
		}

		private onStartBtn(e){
			let self = this;
			GameMgr.getInstance().gameBegin();
			self.hide();
			utils.StageUtils.addEventListener("leaveGame", self.onLeaveGame, self);
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
			//let arg = {flag: MainNotes.NOR_RANK_MODULE,dataArg:{weekRankName:"leapWeekRank",monthRankName:"leapMonthRank"}};
			//FWFacade.instance.sendNotification(MainNotes.LOAD_MODULE, arg);
		}

		public dispose(){
			super.dispose();
			let self = this;
			self.startBtn.removeClickListener(self.onStartBtn, self);			
			self.rankBtn.removeClickListener(self.onRankBtn, self);
			utils.StageUtils.removeEventListener("leaveGame", self.onLeaveGame, self);
		}
	}
}