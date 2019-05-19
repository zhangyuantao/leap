module planetJump {
	export class ReadyPanel extends fairygui.GComponent{
		private startBtn:fairygui.GButton;
		private rankBtn:fairygui.GButton;
		private shareBtn:fairygui.GButton;
		private scopeCtrl:fairygui.Controller;

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
			// 游戏圈按钮
			if(platform.isRunInWX()){
				if(!Main.gameClubBtn){
					let size = Main.systemInfo.windowWidth / utils.StageUtils.stageWidth * 96;
					let left = Main.systemInfo.windowWidth / utils.StageUtils.stageWidth * 74;
					let top = Main.systemInfo.windowWidth / utils.StageUtils.stageWidth * (utils.StageUtils.stageHeight - 129);
					Main.gameClubBtn = wx.createGameClubButton({
						icon: 'white',
						style: {
							left: left,
							top: top,
							width: size,
							height: size
						}
					});
				}	
				else
					Main.gameClubBtn.show();	
			}	

			self.scopeCtrl.setSelectedIndex(1);
			if(!Main.isScopeUserInfo && platform.isRunInWX()){
				self.scopeCtrl.setSelectedIndex(0);
				Main.gameClubBtn.hide();

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

		public show(){
			let self = this;
			self.initState();
			self.visible = true;
			egret.Tween.get(self).to({alpha:1}, 300, egret.Ease.sineInOut);
		}

		private hide(){
			let self = this;
			Main.gameClubBtn && Main.gameClubBtn.hide();
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