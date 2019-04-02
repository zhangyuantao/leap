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
			let isRunWeb = (platform instanceof DebugPlatform) ? true : false;

			if(!Main.isScopeUserInfo && platform.isRunInWX()){
				self.startBtn.visible = false;
				self.rankBtn.visible = false;

				let btnWidth = Main.systemInfo.windowWidth / utils.StageUtils.stageWidth * 160;
				let btnHeight = Main.systemInfo.windowHeight / utils.StageUtils.stageHeight * 160;
				Main.userInfoBtn = wx.createUserInfoButton({
						type: 'image',
						image: 'resource/assets/startBtn.png',
						style: {
							left: Main.systemInfo.windowWidth * 0.5 - btnWidth * 0.5,
							top:  Main.systemInfo.windowHeight * 0.55,
							width: btnWidth,
							height: btnHeight,
						}
					});

				Main.userInfoBtn.onTap((res) => {
					if(res.errMsg == "getUserInfo:ok"){           
						Main.myAvatarUrl = res.userInfo.avatarUrl;
						Main.isScopeUserInfo = true;
						Main.userInfoBtn.hide();   
						self.onStartBtn(null);
					}
				});      
			}  	
		}

		private onStartBtn(e){
			let self = this;
			MainWindow.instance.createGame();
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
			//self.rankBtn.visible = false;
			MainWindow.instance.showRankWnd();
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