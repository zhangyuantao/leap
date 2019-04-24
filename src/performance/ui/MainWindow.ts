/**
 * 主游戏入口
 */
module leap {
	export class MainWindow extends BaseWindow {
		public static instance:MainWindow;
		public textureBg:TextureBackground;
		
		private readyPanel:ReadyPanel;
		private btnCloseRank:fairygui.GButton;

		private isShowRank:boolean = false;
		private rankingListMask:egret.Shape;
		private rankBitmap:egret.Bitmap;

    	private myAvatarUrl:string = "";
		private curRankType:string;
		private lastRankType:string;

		private worldContainer:egret.DisplayObjectContainer;

		public constructor(pkgName:string = "leap", windowName?:string, playPopSound?:boolean) {
			super(pkgName, windowName, playPopSound);		
			let self = this;		
			MainWindow.instance = self;

			if(platform.isRunInWX()){
				// 启用显示转发分享菜单
				wx.showShareMenu({withShareTicket:true});

				// 用户点击了“转发”按钮
				wx.onShareAppMessage(() => {
					let info = GameMgr.getInstance().getShareImgUrlId(0);
					return {
						title:"黑洞，人类首次看见它！",
						imageUrlId:info[0],
						imageUrl:info[1],
						query:"",		
					}
				});
			}        
		}	

		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;			
			self.removeEventListeners();
			egret.Tween.removeAllTweens();
			self.destroyGame();		
			utils.Singleton.destroy(utils.SoundMgr);
			self.btnCloseRank.removeClickListener(self.onCloseRank, self);	
			//console.log("game dispose");
		}

		protected addEventListeners(){
			let self = this;
			//utils.EventDispatcher.getInstance().addEventListener("startGame", self.createGame, self);
		}

		protected removeEventListeners(){
			let self = this;
			//utils.EventDispatcher.getInstance().removeEventListener("startGame", self.createGame, self);
		}

		/**
		 * 注册组件的拓展类
		 */
		protected registerComponents(){
			let self = this;
			self.registerComponent("ReadyPanel", ReadyPanel);
			self.registerComponent("MainUI", MainUI);
			self.registerComponent("Player", Player);
			self.registerComponent("PlayerUI", PlayerUI);
			self.registerComponent("ScoreText", ScoreText);
			self.registerComponent("TextureBackground", TextureBackground);
			self.registerComponent("GuidePanel", GuidePanel);
			self.registerComponent("Guide0", Guide0);
			self.registerComponent("Guide1", Guide1);
			self.registerComponent("Guide2", Guide2);
			self.registerComponent("Guide3", Guide3);
			self.registerComponent("ResultPanel", ResultPanel);
	
		}
		protected registerComponent(compName:string, userClass:any, pkgName:string = "leap"){
			let url = fairygui.UIPackage.getItemURL(pkgName, compName);
			fairygui.UIObjectFactory.setPackageItemExtension(url, userClass);
		}	

		/**
		 * 初始化完成
		 */
        protected onInit(){
			super.onInit();
			let self = this;
			self.readyPanel = self.contentPane.getChild("readyPanel") as ReadyPanel;
			self.btnCloseRank = self.contentPane.getChild("btnCloseRank").asButton;
			self.btnCloseRank.addClickListener(self.onCloseRank, self);
			self.btnCloseRank.visible = false;			

			utils.Singleton.get(utils.SoundMgr).preloadBgm("back_music_mp3");
		}	

		// 引导初始化
		private initGuide(){
			let self = this;
			if(self.isFinishGuide()){
				GameMgr.getInstance().guideCompleted = true;				
			}
			else{
				// 引导没有全部完成的话记录全部清除重来
				for(let step = 0; step < 4; step++){
					let key = "leap_guideStep" + step;
					egret.localStorage.removeItem(key);
				}

				GameMgr.getInstance().guideCompleted = false;
				let panel =	utils.ObjectPool.getInstance().createFairyUIObject(GuidePanel, "leap");					
				self.displayListContainer.addChild(panel.displayObject);
			}
		}

		// 引导是否完成
		public isFinishGuide(){
			let doGuideCount = parseInt(egret.localStorage.getItem("doGuideCount") || "0");
			return doGuideCount >= 3; // 做完整的三次引导
		}

		public isCompleteGuide(step:number){
			let key = "leap_guideStep" + step;
			let guideStep = egret.localStorage.getItem(key);
			return guideStep && guideStep != "";
		}

		// 创建游戏
		public createGame(){
			let self = this;
			self.destroyGame();
			GameMgr.getInstance().gameBegin();
			
			utils.Singleton.get(utils.SoundMgr).playBgm("back_music_mp3", true);
			utils.StageUtils.dispatchEvent("createGame");
			
			// 背景
			let bg = utils.ObjectPool.getInstance().createObject(Background);
			self.displayListContainer.addChildAt(bg, 0);
			
			self.textureBg = fairygui.UIPackage.createObject('leap', "TextureBackground") as TextureBackground;
			self.textureBg.visible = false;
			self.addChild(self.textureBg);

			// 世界
			if(self.worldContainer)
				self.worldContainer.removeChildren();
			else
				self.worldContainer = new egret.DisplayObjectContainer();
			self.displayListContainer.addChildAt(self.worldContainer, 1);
			let world = utils.ObjectPool.getInstance().createObject(World);
			self.worldContainer.addChild(world);

			// 引导初始化
			self.initGuide();
		}
		
		// 重开游戏
		public restartGame(){
			let self = this;
			self.createGame();
		}

		// 销毁游戏
		public destroyGame(){			
			ItemMgr.getInstance().dispose();
			utils.ObjectPool.getInstance().dispose();
			GameMgr.getInstance().dispose();
			utils.EventDispatcher.getInstance().dispose();
		}

		/**
		 * 显示排行榜
		 * type： list horizontal vertical
		 */
		public showRankWnd(type:string = "list", maskAlpha:number = 0.8, maskTouchEnabled:boolean = true, showCloseRankBnt:boolean = true){
			let self = this;
			if(!platform.isRunInWX())
				return;
			if(!self.isShowRank) {
				self.lastRankType = self.curRankType;
				self.curRankType = type;
				//Main.userInfoBtn && Main.userInfoBtn.hide();
				
				//处理遮罩,避免开放域数据影响主域
				self.rankingListMask = new egret.Shape();
				self.rankingListMask.graphics.beginFill(0x000000);
				self.rankingListMask.graphics.drawRect(0, 0, utils.StageUtils.stageWidth, utils.StageUtils.stageHeight);
				self.rankingListMask.graphics.endFill();
				self.rankingListMask.alpha = maskAlpha;

				//设置为true,以免触摸到下面的按钮
				self.rankingListMask.touchEnabled = maskTouchEnabled;
				self.parent.displayListContainer.addChildAt(self.rankingListMask, 999);
				
				//显示开放域数据
				self.rankBitmap = platform.openDataContext.createDisplayObject(null, utils.StageUtils.stageWidth, utils.StageUtils.stageHeight);				
				self.parent.displayListContainer.addChild(self.rankBitmap);
				egret.Tween.get(self.rankBitmap).set({alpha:0}).to({alpha:1}, 500, egret.Ease.sineInOut);

				//让关闭排行榜按钮显示在容器内
				if(showCloseRankBnt){
					self.btnCloseRank.visible = true;
					self.parent.displayListContainer.addChild(self.btnCloseRank.displayObject);
				}

				//主域向子域发送数据
				self.isShowRank = true;
				platform.openDataContext.postMessage({
					isRanking: self.isShowRank,
					text: "egret",
					year: (new Date()).getFullYear(),
					command: "open",
					myAvatarUrl:Main.myAvatarUrl,
					rankType:type
				});	
			}

			if(type == "list")
				utils.Singleton.get(AdMgr).hideBanner();
		}	

		private onCloseRank(e){
			let self = this;			
			self.hideRankWnd();
			//if(self.lastRankType == "vertical" && self.testWnd.isShowing)
			//	self.showRankWnd("vertical", 0, false, false);
			
			//utils.Singleton.get(AdMgr).showBannerAd("Banner排行榜");
		}

		/**
		 * 隐藏排行榜
		 */
		public hideRankWnd(){
			let self = this;
			if(!platform.isRunInWX())
				return;
			if(self.isShowRank) {
				if(self.rankBitmap)
					egret.Tween.removeTweens(self.rankBitmap)
				self.rankBitmap.parent && self.rankBitmap.parent.removeChild(self.rankBitmap);
				self.rankingListMask.parent && self.rankingListMask.parent.removeChild(self.rankingListMask);
				self.isShowRank = false;
				self.btnCloseRank.visible = false;
				platform.openDataContext.postMessage({
					isRanking: self.isShowRank,
					text: "egret",
					year: (new Date()).getFullYear(),
					command: "close"
				});
			}
		}
		
		// 返回准备界面
		public backToReadyWindow(){
			let self = this;
			self.destroyGame();
			self.readyPanel.show();
		}
	}
}