module leap {
	/**
	 * 玩家控制的小球
	 */
	export class Player extends fairygui.GComponent implements utils.IGameObject, g2.SAT.ICollider{	
		public rotateSpeed:number = 0;				// 旋转速度
		public rotateTimeAdd:number = 0;			// 小球旋转运动没帧增加时间大小
		public invincibleTime:number = 0;			// 无敌时间
		public trail:TrailRenderer;					// 拖尾组件
		public isPressed:boolean;                   // 是否按下屏幕
		public jumpSpeed:number = 0;				// 当前跳跃速度
		
		private jumpContinueCnt:number = 0;			// 连跳次数
		private jumpHeight:number = 400;			// 当前跳跃高度，初始高度400	
		private rotateTime:number = 0;				// 小球旋转运动时间
		private rotateRounds:number = 0;			// 小球旋转圈数
		private isNearEnd:boolean = true;			// 是否接近终点	
		private colliderDisplay:egret.Shape;		// 碰撞体显示对象
		private mainUI:PlayerUI;					// 显示对象

		protected get colliderGraphics():egret.Graphics{
			let self = this;
			if(!self.colliderDisplay)
				return null;
			return self.colliderDisplay.graphics;
		}

		public get position():g2.Vector2{
			return new g2.Vector2(this.x, this.y);
		}

		// 当前是否处于旋转
		private get isRotate():boolean{
			let self = this;
			return self.rotateTimeAdd > 0 || self.hasEffect(ItemDefine.Star);
		}
		
		private get acceleration(){
			let self = this;
			if(self.hasEffect(ItemDefine.Star)){
				return GameCfg.getCfg().Items[ItemDefine.Star].acceleration;
			}
			else if(self.hasEffect(ItemDefine.Thunderbolt)){
				return GameCfg.getCfg().Items[ItemDefine.Thunderbolt].acceleration;
			}
			else{
				return 1;
			}
		}

		// 是否处于无敌状态
		public get isInvincible(){
			return this.invincibleTime > 0;
		}

		public constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.mainUI = self.getChild("ui") as PlayerUI;
        }

		private onTouchBegin(e:egret.TouchEvent){
			let self = this;

			// 点击菜单
			if(e.target.parent && e.target.parent instanceof MainUI)
				return;

			self.isPressed = true;
			egret.Tween.removeTweens(self);
			egret.Tween.get(self).to({rotateTimeAdd:1}, 300, egret.Ease.sineInOut);
		}

		private onTouchEnd(){
			let self = this;
			self.isPressed = false;

			if(self.hasEffect(ItemDefine.Star))
				return;
			
			egret.Tween.removeTweens(self);
			egret.Tween.get(self).to({rotateTimeAdd:0}, 500, egret.Ease.sineInOut);
		}	

		public onCollisionEnter(){
			let self = this;
		}

		/**
		 * 跳跃
		 */
		public jump(jumpSpeed:number, jumpDis:number){
			let self = this;
			
			// 连跳逻辑
			self.jumpContinueCnt ++;
			if(self.jumpSpeed < 0)
				self.jumpContinueCnt = 1;
			
			// 连跳表现
			if(self.jumpContinueCnt > 1){
				let ani = World.instance.spawnUIAni(JumpAni, self.x + 70, self.y + 50) as JumpAni;
				ani.setNum(self.jumpContinueCnt);
			}

			if(self.jumpSpeed < jumpSpeed)
				self.jumpSpeed = jumpSpeed;

			self.mainUI.playJumpEff();

			utils.EventDispatcher.getInstance().dispatchEvent("playerJump");
		}
		
		public dead(){
			let self = this; 
			//console.log("game over");

			GameMgr.getInstance().dead();

			// 死亡特效
			egret.Tween.get(self.mainUI).to({alpha:0}, 200);		
			World.instance.spawnUIAni(DeadAni, self.x, self.y);
			
			// 死亡音效
			utils.Singleton.get(utils.SoundMgr).playSound("DM-CGS-10_edited_mp3");
			let handle = setTimeout(function() {
				clearTimeout(handle);
				utils.Singleton.get(utils.SoundMgr).playSound("Decrease_swap_1_mp3");
			}, 400);				
		}

		// 复活
		private onResurgence(){
			let self = this;

			// 属性重置
			self.jumpHeight = 500;		// 复活高度
			self.effects = {};			// 清除效果
			self.jumpContinueCnt = 0;	
			self.invincibleTime = 0;
			self.jumpSpeed = 20;		// 复活的时候上升
			self.rotateTimeAdd = 0;
			self.isPressed = false;

			// 玩家复活后在玩家下方生成两个小球，防止死亡
			for(let i = 1, radius = self.jumpHeight; i <= 2; i++, radius -= 100){
				let rad = self.getAngle() / 180 * Math.PI;			
				let item = ItemMgr.getInstance().spawnItem(ItemDefine.WhiteBall, rad, radius) as WhiteBall;			
				let speed = 0.1;
				item.init(speed);
				World.instance.addItem(item.displayObject);
			}

			// 复活无敌
			self.addEffect(ItemDefine.Plus, PlusEffect);
			utils.Singleton.get(utils.SoundMgr).playSound("revive2_mp3"); // 复活音效		

			egret.Tween.removeTweens(self.mainUI);
			egret.Tween.get(self.mainUI).to({alpha:1}, 200);
		}

		public getHeight(){
			let self = this;
			return Math.sqrt(self.x * self.x + self.y * self.y);
		}

		public getAngle(){
			let self = this;
			let rad = Math.atan(self.y / self.x);
			let angle = rad / Math.PI  * 180;
			if(angle < 0) {
				angle += self.y > 0 ? 180 : 360;				
			}
			else{
				if(self.y < 0)
					angle += 180;
			}
			return angle;
		}

		public onMove(){
			let self = this;
	
			// 竖直方向匀减速运动	
			self.jumpHeight += self.jumpSpeed;
			if(!self.hasEffect(ItemDefine.Star))	// 加速的时候不下落
				self.jumpSpeed -= GameCfg.getCfg().Gravity;

			// 下落动画
			if(self.jumpSpeed < 0)
				self.mainUI.playFallEff();

			//  小于中心半径
			if(self.jumpHeight < 90){
				self.dead();
				return;
			}

			// 圆周运动
			if(self.isRotate)
				self.rotateTime += self.rotateTimeAdd * self.acceleration;			
			
			let pos = RoundMotion.getPointByTime(self.rotateTime, self.rotateSpeed, self.jumpHeight);
			self.x = pos.x;
			self.y = pos.y;			
		
			// 总旋转角度
			let playerAngle = self.getAngle();	

			// 判断是否接近终点
			if(playerAngle > 180 && playerAngle < 270){
				self.isNearEnd = true;
				utils.EventDispatcher.getInstance().dispatchEvent("nearEnd");
			}

			// 判断是否运动满一圈
			if(self.isNearEnd && playerAngle >= 270){
				self.isNearEnd = false;
				self.rotateRounds ++;
				//console.log("New Round");
				utils.EventDispatcher.getInstance().dispatchEvent("newRound", self.rotateRounds);
			}
		}

		// 增加无敌时间
		public addInvincibleTime(time:number){
			let self = this;
			if(!time || time <= 0)
				return;
			if(self.invincibleTime < 0)
				self.invincibleTime = 0;
			self.invincibleTime += time;
		}

		/** 接口实现 */

		public key:string;

		public onCreate(){
			let self = this;
			//console.log("onCreate:", self.key);
			
			// 加拖尾组件
			if(!self.trail){
				self.trail = new TrailRenderer();
				self.trail.init(200, 0.4, 0, 10, 38);
				self.displayListContainer.addChild(self.trail);
			}

			if(GameCfg.colliderDisplayCfg.display && !self.colliderDisplay){
				self.colliderDisplay = new egret.Shape();
				self.displayListContainer.addChild(self.colliderDisplay);
			}

			self.rotateSpeed = GameCfg.getCfg().PlayerRotateSpeed;
			self.rotateTime = 270 / self.rotateSpeed;	 // 决定玩家初始位置	

			self.initCollider(21);
			
			utils.EventDispatcher.getInstance().addEventListener("gameResurgence", self.onResurgence, self);

			utils.StageUtils.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onTouchBegin, self);
			utils.StageUtils.addEventListener(egret.TouchEvent.TOUCH_END, self.onTouchEnd, self);
			utils.StageUtils.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, self.onTouchEnd, self);
			utils.StageUtils.addEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onTouchEnd, self);

			// utils.StageUtils.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e) => {
			// 	let local = World.instance.globalToLocal(e.stageX, e.stageY);
			// 	self.x = local.x;
			// 	self.y = local.y;
			// }, self);
		}

		public onDestroy(){
			let self = this;			
			//console.log("onDestroy:", self.key);
			self.effects = null;
			self.colliderDisplay = null;
			self.trail = null;
			utils.EventDispatcher.getInstance().removeEventListener("gameResurgence", self.onResurgence, self);
			utils.StageUtils.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onTouchBegin, self);
			utils.StageUtils.removeEventListener(egret.TouchEvent.TOUCH_END, self.onTouchEnd, self);
			utils.StageUtils.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, self.onTouchEnd, self);
			utils.StageUtils.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onTouchEnd, self);
		}

		public onEnterFrame(deltaTime:number){
			let self = this;
			if(GameMgr.getInstance().gameOver)
				return;
			
			// 无敌时间递减
			if(self.invincibleTime > 0)
				self.invincibleTime -= GameCfg.frameTime;

			self.onMove();
			self.updateTransform();			
			self.drawCollider();
			self.mainUI.onEnterFrame();
		}

		public isCollided:boolean;
		public collider:g2.SAT.Circle;

		public initCollider(r:number){
			let self = this;
			self.collider = new g2.SAT.Circle(r);
		}

		public updateTransform(){
			let self = this;
			if(!self.collider)
				return;
				
			self.collider.x = self.x;
			self.collider.y = self.y;
			self.collider.scaleX = self.mainUI.face.scaleX;
			self.collider.scaleY = self.mainUI.face.scaleY;
			self.rotation = self.getAngle() - 270;
			self.collider.rotation = self.rotation;
		}

		public drawCollider(){
			let self = this;
			let colliderCfg = GameCfg.colliderDisplayCfg;
			if(!colliderCfg.display || !self.collider || !self.colliderGraphics)
				return;
			
			self.colliderGraphics.clear();
			let color = self.isCollided ? colliderCfg.collidedColor : colliderCfg.color;
			self.colliderGraphics.lineStyle(colliderCfg.lineSize, color, colliderCfg.alpha);
			self.colliderGraphics.drawCircle(0, 0, self.collider.getRadius());
			self.colliderGraphics.endFill();
		}

		/** 道具效果相关 */
		private effects:any;
		
		public hasEffect(key:string){
			let self = this;
			if(!self.effects)
				return false;
			if(self.effects[key])
				return true;
			return false;
		}

		// 添加效果
		public addEffect(key:string, effClass:any){
			let self = this;

			if(!self.effects)
				self.effects = {};

			// 如果存在该效果 就进行叠加
			if(self.effects[key]){
				self.effects[key].added();				
			}
			else{
				let eff:PropEffect = utils.ObjectPool.getInstance().createObject(effClass) as PropEffect;
				eff.init(key, self);
				self.effects[key] = eff;			
			}

			if(key == ItemDefine.Thunderbolt)
				self.mainUI.showThunderEff();
			if(key == ItemDefine.Plus)
				self.mainUI.showPlusEff();	
			if(key == ItemDefine.Magnet)
				self.mainUI.showMagnetEff();		
		}

		// 移除效果
		public removeEffect(key:string){
			let self = this;
			if(!self.effects || !self.effects[key])
				return;			
			delete self.effects[key];

			if(key == ItemDefine.Thunderbolt)
				self.mainUI.removeThunderEff();
			if(key == ItemDefine.Plus)
				self.mainUI.removePlusEff();
			if(key == ItemDefine.Magnet)
				self.mainUI.removeMagnetEff();
		}
	}
}