/**
 * 主游戏入口
 */
module leap {
	export class MainWindow extends fairygui.Window {
		public static instance:MainWindow;

		public constructor() {
			super();		
			let self = this;		
			MainWindow.instance = self;
			self.registerComponents();  // 要在窗体创建(initUI)之前
			self.initUI();				// UI初始化
			self.addEventListeners();	// 事件监听
		}	

		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.removeEventListeners();
			self.destroyGame();		
			utils.Singleton.destroy(utils.SoundMgr);
			utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
			//console.log("game dispose");
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("leap", "MainWindow").asCom;
		}

		protected addEventListeners(){
			let self = this;
			utils.StageUtils.addEventListener(egret.Event.RESIZE, self.setResolution, self); // 监听屏幕大小改变
			utils.EventDispatcher.getInstance().addEventListener("startGame", self.createGame, self);
		}

		protected removeEventListeners(){
			let self = this;
			utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
			utils.EventDispatcher.getInstance().removeEventListener("startGame", self.createGame, self);
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

		// /**
		//  * 初始化完成
		//  */
        // protected onInit(){			
		// 	//console.log("onInit");
		// 	//utils.Singleton.get(utils.SoundMgr).playBgm("back_music_mp3");
		// }	

		// 动态调整窗口分辨率
		private setResolution(){
			let self = this;
			self.height = utils.StageUtils.stageHeight;
			self.width = utils.StageUtils.stageWidth;
		}


		// 引导初始化
		private initGuide(){
			let self = this;
			if(self.isCompleteGuide(3)){
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

		public isCompleteGuide(step:number){
			let key = "leap_guideStep" + step;
			let guideStep = egret.localStorage.getItem(key);
			return guideStep && guideStep != "";
		}

		// 创建游戏
		public createGame(){
			let self = this;
			utils.Singleton.get(utils.SoundMgr).playBgm("back_music_mp3");
			utils.StageUtils.dispatchEvent("createGame");
			
			// 背景
			let bg = utils.ObjectPool.getInstance().createObject(Background);
			self.displayListContainer.addChildAt(bg, 0);

			// 世界
			let worldContainer = new egret.DisplayObjectContainer();
			self.displayListContainer.addChildAt(worldContainer, 1);
			let world = utils.ObjectPool.getInstance().createObject(World);
			worldContainer.addChild(world);

			// 引导初始化
			self.initGuide();
		}
		
		// 重开游戏
		public restartGame(){
			let self = this;
			self.destroyGame();
			self.createGame();
		}

		// 销毁游戏
		public destroyGame(){			
			ItemMgr.getInstance().dispose();
			utils.ObjectPool.getInstance().dispose();
			GameMgr.getInstance().dispose();
			utils.EventDispatcher.getInstance().dispose();
			egret.Tween.removeAllTweens();
		}
	}
}