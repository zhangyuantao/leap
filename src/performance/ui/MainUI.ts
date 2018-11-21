module leap {
	export class MainUI extends fairygui.GComponent{
		private scoreTxt:ScoreText;
		private multTxt:fairygui.GComponent;
		private levelTxt:fairygui.GComponent;
		private pauseBtn:fairygui.GButton;
		private musicBtn:fairygui.GButton;	
		private pausePanel:fairygui.GComponent;
		private continueBtn:fairygui.GButton;
		private newRecord:fairygui.GComponent;

		private soundOn:boolean = true;
		private hasShowNewRecord:boolean = false;
		private alertWnd:any;

		public constructor(){
			super();
			let self = this;
			utils.StageUtils.addEventListener("createGame", self.onCreateGame, self);
		}

		private onCreateGame(){
			let self = this;
			self.registerListener();
			self.scoreTxt.setText("");
			self.multTxt.text = "x" + GameMgr.getInstance().multiNum;
			self.hasShowNewRecord = false;

			self.soundOn = !utils.Singleton.get(utils.SoundMgr).isMuteSound;
			self.setSound();
		}

		private registerListener(){
			let self = this;
			utils.EventDispatcher.getInstance().addEventListener("updateScore", self.updateScore, self);
			utils.EventDispatcher.getInstance().addEventListener("onAppPause", self.onAppPause, self);
			utils.EventDispatcher.getInstance().addEventListener("newRound", self.onNewRound, self);
			utils.EventDispatcher.getInstance().addEventListener("levelUp", self.onLevelUp, self);
			utils.EventDispatcher.getInstance().addEventListener("settlement", self.onSettlement, self);
		}

		public constructFromResource(){
            super.constructFromResource();
            let self = this;
			self.pauseBtn = self.getChild("pauseBtn").asButton;   
			self.pauseBtn.addClickListener(self.onPauseBtn, self);
			self.musicBtn = self.getChild("musicBtn").asButton; 
			self.musicBtn.addClickListener(self.onMusicBtn, self);		
			self.pausePanel = self.getChild("pausePanel").asCom;
			self.pausePanel.visible = false;
			self.continueBtn = self.pausePanel.getChild("continueBtn").asButton;
			self.continueBtn.addClickListener(self.onContinueBtn, self);

			self.scoreTxt = self.getChild("scoreTxt") as ScoreText;
			self.multTxt = self.getChild("multTxt").asCom;
			self.multTxt.alpha = 0;
			self.levelTxt = self.getChild("levelTxt").asCom;
			self.levelTxt.alpha = 0;
			self.newRecord = self.getChild("newRecord").asCom;
			self.newRecord.alpha = 0;
        }

		private onPauseBtn(e){
			let self = this;
			self.pause();
		}

		private onAppPause(){
			let self = this;
			if(GameMgr.getInstance().isPaused || GameMgr.getInstance().gameOver)
				return;
				
			self.pause();
		}

		private pause(){
			let self = this;
			GameMgr.getInstance().pause(true);
			self.showPausePanel();
		}

		private showPausePanel(){
			let self = this;
			self.pausePanel.visible = true;
			egret.Tween.removeTweens(self.pausePanel);
			egret.Tween.get(self.pausePanel).to({alpha:1}, 300, egret.Ease.sineInOut);
		}

		private closePausePanel(){
			let self = this;
			egret.Tween.removeTweens(self.pausePanel);
			egret.Tween.get(self.pausePanel).to({alpha:0}, 300, egret.Ease.sineInOut).call(() => {
				self.pausePanel.visible = false;
			});
		}

		private onMusicBtn(e){		
			let self = this;
			self.soundOn = !self.soundOn;
			self.setSound();
		}

		private setSound(){
			let self = this;			
			utils.Singleton.get(utils.SoundMgr).setSoundMute(!self.soundOn);
			utils.Singleton.get(utils.SoundMgr).setBgmMute(!self.soundOn);
			
			self.musicBtn.getController("button").setSelectedIndex(self.soundOn ? 0 : 1);
		}

		private onContinueBtn(e){
			let self = this;
			GameMgr.getInstance().pause(false);
			self.closePausePanel();
		}

		private onNewRound(rounds){
			let self = this;
			if(rounds <= 1) 
				return;
			
			egret.Tween.get(self.scoreTxt).to({alpha:0}, 200);

			// 显示倍数动画	
			self.multTxt.visible = true;		
			self.multTxt.getChild("txt").asTextField.text = "x" + rounds;
			egret.Tween.removeTweens(self.multTxt);
			egret.Tween.get(self.multTxt).set({scaleX:0, scaleY:0, alpha:0})
			.to({scaleX:1.5, scaleY:1.5, alpha:1, rotation:20}, 250, egret.Ease.sineInOut)
			.to({rotation:-20}, 300, egret.Ease.sineInOut)
			.to({scaleX:1, scaleY:1, rotation:0}, 500, egret.Ease.sineInOut).call(() => {
				egret.Tween.get(self.scoreTxt).to({alpha:1}, 300);
			})
			.to({scaleX:0, scaleY:0, alpha:0}, 500, egret.Ease.sineInOut);
		}

		private onLevelUp(lv:number){
			let self = this;
			self.levelTxt.getChild("txt").asTextField.text = "" + lv;
			egret.Tween.get(self.levelTxt).set({alpha:0}).to({alpha:1, scaleX:1.5, scaleY:1.5}, 500, egret.Ease.sineInOut).wait(500).to({alpha:0, scaleX:1, scaleY:1}, 500, egret.Ease.sineInOut);
		}

		private onSettlement(){
			let self = this;
			if(self.alertWnd){
				egret.Tween.removeTweens(self.alertWnd);
				self.alertWnd.dispose();
			}
		}

		private updateScore(score:number){
			let self = this;			
			self.scoreTxt.setScore(score);

			// 破记录提示
			if(!self.hasShowNewRecord && score > GameMgr.getInstance().scoreRecord){
				self.newRecord.alpha = 1;
				self.newRecord.getTransition("t0").play(() => {
					egret.Tween.get(self.newRecord).wait(1000).to({alpha: 0}, 1000, egret.Ease.sineInOut);
				}, self);
				self.hasShowNewRecord = true;
				utils.Singleton.get(utils.SoundMgr).playSound("newHighScore_mp3");;	
			}
		}

		public dispose(){
			super.dispose();
			let self = this;
			self.pauseBtn.removeClickListener(self.onPauseBtn, self);
			self.musicBtn.removeClickListener(self.onMusicBtn, self);		
			self.continueBtn.removeClickListener(self.onContinueBtn, self);

			utils.StageUtils.removeEventListener("createGame", self.onCreateGame, self);
			utils.EventDispatcher.getInstance().removeEventListener("updateScore", self.updateScore, self);
			utils.EventDispatcher.getInstance().removeEventListener("onPause", self.onAppPause, self);
			utils.EventDispatcher.getInstance().removeEventListener("newRound", self.onNewRound, self);
			utils.EventDispatcher.getInstance().removeEventListener("levelUp", self.onLevelUp, self);
			utils.EventDispatcher.getInstance().removeEventListener("settlement", self.onSettlement, self);
		}
	}
}