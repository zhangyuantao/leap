module leap{
	export class World extends egret.Sprite implements utils.IGameObject{
		public static instance:World;

		// 显示对象
		public player:Player;
		public spike:SpikeCenter;
		public linkLine:egret.Sprite;
		public endLine:EndLine;
		public textureBg:TextureBackground;

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
			self.drawLine();
		}
		
		//********************* 接口实现结束 ********************//

		private onGameOver(){
			let self = this;
			self.linkLine.graphics.clear();
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

		private drawLine(){
			let self = this;
			if(self.isGameOver)
				return;

			if(self.player.getHeight() > GameCfg.getCfg().WorldRange * 0.5){
				if(self.linkLine.alpha == 1){
					egret.Tween.removeTweens(self.linkLine);
					egret.Tween.get(self.linkLine).to({alpha:0}, 1000, egret.Ease.sineInOut);
				}
			}
			else{
				if(self.linkLine.alpha == 0){
					egret.Tween.removeTweens(self.linkLine);
					egret.Tween.get(self.linkLine).to({alpha:1}, 1000, egret.Ease.sineInOut);
				}
			}

			if(self.linkLine.alpha == 0)
				return;
			
			self.linkLine.graphics.clear();
			self.linkLine.graphics.lineStyle(3, 0xFFFFFF, 0.5);
			let global = self.localToGlobal(self.player.x, self.player.y);
			let local = self.linkLine.globalToLocal(global.x, global.y);
			self.linkLine.graphics.moveTo(0, 0);
			self.linkLine.graphics.lineTo(local.x, local.y);
			self.linkLine.graphics.endFill();
		}

		private init(){
			let self = this;	
			
			// 纹理背景
			self.textureBg = fairygui.UIPackage.createObject('leap', "TextureBackground") as TextureBackground;
			self.textureBg.visible = false;
			self.addChild(self.textureBg.displayObject);

			// 物品容器
			self.itemContainer = new egret.DisplayObjectContainer();
			self.addChild(self.itemContainer);

			// 终点线
			self.endLine = utils.ObjectPool.getInstance().createObject(EndLine);
			self.addChild(self.endLine);

			// 玩家连线
			self.linkLine = new egret.Sprite();	
			self.addChild(self.linkLine);

			// 玩家显示对象
			self.player = utils.ObjectPool.getInstance().createFairyUIObject(Player, "leap");
			self.addChild(self.player.displayObject);

			// 中心锯齿陷阱
			self.spike = utils.ObjectPool.getInstance().createFairyUIObject(SpikeCenter, "leap");		
			self.addChild(self.spike.displayObject);

			// 摄像机
			self.camera = new Camera(self, utils.StageUtils.stageWidth, utils.StageUtils.stageHeight);
			self.camera.follow(self.player);

			// 生成一圈球
			for(let i = 0; i < 16; i++){
				let rad = i * Math.PI / (16 / 2);
				let ball = ItemMgr.getInstance().spawnItem(ItemDefine.WhiteBall, rad, 150, 1) as WhiteBall;
				ball.init(0.1 + Math.random() * 0.3);
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
			self.itemContainer.addChild(ani.displayObject);
			ani.x = x;
			ani.y = y;
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
			egret.Tween.get(self.parent).to({x:oldX + 5, y:oldY + 5}, 80, egret.Ease.backInOut)
			.to({x:oldX - 4, y:oldY - 4}, 90, egret.Ease.backInOut)
			.to({x:oldX + 3, y:oldY + 3}, 100, egret.Ease.backInOut)
			.to({x:oldX, y:oldY}, 110, egret.Ease.sineInOut);
		}
	}
}