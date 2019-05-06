module planetJump{
	export class World extends egret.Sprite implements utils.IGameObject{
		public static instance:World;

		// 显示对象
		public player:Player;
		public spike:SpikeCenter;
		public linkLine:fairygui.GObject;
		public endLine:EndLine;

		private itemContainer:egret.DisplayObjectContainer;

		private camera:Camera;		

		public constructor(){
			super();
			this.touchEnabled = true;
		}	

		//********************* 接口实现 ********************//		
		public key:string;

		public onCreate(){
			let self = this;
			World.instance = self;
			//console.log("onCreate:", self.key);			

			self.init();
			self.once(egret.Event.ADDED_TO_STAGE, self.onAddToStage, self);
			utils.EventDispatcher.getInstance().addEventListener("gameOver", self.onGameOver, self);
			utils.EventDispatcher.getInstance().addEventListener("playerJump", self.cameraShakeEff, self);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);	

			self.camera = null;
			World.instance = null;
			utils.EventDispatcher.getInstance().removeEventListener("gameOver", self.onGameOver, self);
			utils.EventDispatcher.getInstance().removeEventListener("playerJump", self.cameraShakeEff, self);
		}

		public onEnterFrame(deltaTime:number){
			let self = this;
			if(self.isGameOver)
				return;
			
			self.camera.onUpdate();
			ItemMgr.getInstance().onUpdate();	
			self.updatePlayerLine();
		}
		
		//********************* 接口实现结束 ********************//

		private onGameOver(){
			let self = this;
			egret.Tween.removeTweens(self.linkLine);
			self.linkLine.alpha = 0;
		}

		private get isGameOver():boolean{
			return GameMgr.getInstance().gameOver;
		}

		private set isGameOver(b:boolean){
			GameMgr.getInstance().gameOver = b;
		}

		private onAddToStage(e){
			let self = this;
			self.x = self.stage.stageWidth / 2;
			self.y = self.stage.stageHeight / 2;
		}	

		private updatePlayerLine(){
			let self = this;
			if(self.isGameOver)
				return;
			
			let playHeight = self.player.getHeight();
			// if(playHeight > GameCfg.getCfg().WorldRange * 0.5){
			// 	if(self.linkLine.alpha == 1){
			// 		egret.Tween.removeTweens(self.linkLine);
			// 		egret.Tween.get(self.linkLine).to({alpha:0}, 500, egret.Ease.sineInOut);
			// 	}
			// }
			// else{
			// 	if(self.linkLine.alpha == 0){
			// 		egret.Tween.removeTweens(self.linkLine);
			// 		egret.Tween.get(self.linkLine).to({alpha:1}, 500, egret.Ease.sineInOut);
			// 	}
			// }

			if(!self.linkLine.alpha) self.linkLine.alpha = 1;
			self.linkLine.height = playHeight;
			self.linkLine.rotation = self.player.getAngle() - 90;
		}

		private init(){
			let self = this;

			// 物品容器
			self.itemContainer = new egret.DisplayObjectContainer();
			self.itemContainer.touchEnabled = false;
			self.itemContainer.touchChildren = false;
			self.addChild(self.itemContainer);

			// 终点线
			self.endLine = utils.ObjectPool.getInstance().createObject(EndLine);
			self.addChild(self.endLine);

			// 玩家连线
			self.linkLine = fairygui.UIPackage.createObject("leap", "BaseImgWhite");
			self.linkLine.touchable = false;
			self.linkLine.width = 4;
			self.linkLine.pivotX = 0.5;
			self.addChild(self.linkLine.displayObject);

			// 玩家显示对象
			self.player = utils.ObjectPool.getInstance().createFairyUIObject(Player, "leap");
			self.player.touchable = false;
			self.addChild(self.player.displayObject);

			// 中心锯齿陷阱
			self.spike = utils.ObjectPool.getInstance().createFairyUIObject(SpikeCenter, "leap");	
			self.spike.touchable = false;	
			self.addChild(self.spike.displayObject);

			// 摄像机
			self.camera = new Camera(self, utils.StageUtils.stageWidth, utils.StageUtils.stageHeight);
			self.camera.follow(self.player);

			// 生成一圈球
			for(let i = 0; i < 16; i++){
				let rad = i * Math.PI / (16 / 2);
				let ball = ItemMgr.getInstance().spawnItem(ItemDefine.WhiteBall, rad, 150, 0.9) as WhiteBall;
				ball.init(0.05 + Math.random() * 0.05);
				self.addItem(ball.displayObject);
			}
		}

		// 添加一个道具
		public addItem(item:any){
			let self = this;
			self.itemContainer.addChild(item);
		}

		// 生成一个UI动效
		public spawnUIAni(classFactory:any, x:number, y:number){
			let self = this;
			let ani = utils.ObjectPool.getInstance().createFairyUIObject(classFactory, "leap") as any;
			ani.touchable = false;	
			self.itemContainer.addChild(ani.displayObject);
			ani.x = Math.floor(x);
			ani.y = Math.floor(y);
			ani.getTransition("t0").play(()=>{
				utils.ObjectPool.getInstance().destroyObject(ani);
			}, self);
			
			return ani;
		}

		// 摄像机震动		
		public cameraShakeEff(){
			let self = this;
			let oldX = self.parent.x;
			let oldY = self.parent.y;
			egret.Tween.removeTweens(self.parent);
			egret.Tween.get(self.parent).to({x:oldX + 10, y:oldY + 10}, 80, egret.Ease.backInOut)
			.to({x:oldX - 7, y:oldY - 7}, 90, egret.Ease.backInOut)
			.to({x:oldX + 4, y:oldY + 4}, 100, egret.Ease.backInOut)
			.to({x:oldX, y:oldY}, 110, egret.Ease.sineInOut);
		}
	}
}