module leap {
	/**
	 * 物品基类
	 */
	export class Item extends fairygui.GComponent implements utils.IGameObject, g2.SAT.ICollider{
		public colliderEnabled:boolean = false;	// 是否能启用碰撞器
		protected colliderDisplay:egret.Shape;	

		protected get colliderGraphics():egret.Graphics{
			let self = this;
			if(!self.colliderDisplay)
				return null;
			return self.colliderDisplay.graphics;
		}

		// 位置向量
		public get position():g2.Vector2{
			return new g2.Vector2(this.x, this.y);
		}

		public init(...args:any[]){
		}

		public onCollisionEnter(target:any, ...args:any[]){
			let self = this;
			if(target instanceof Player)
				self.applyEffect(target, ...args);
			if(target instanceof ExplodeSpike)
				self.hitBySpike();
			
			self.collisionEffect();
		}

		// 执行效果
		protected applyEffect(target:Player, ...args:any[]){
		}

		// 碰撞效果
		protected collisionEffect(){
			let self = this;

			// 生成一个碰撞特效
			World.instance.spawnUIAni(CollisionAni, self.x, self.y);
		}

		// 被爆炸子弹打中
		protected hitBySpike(){
			let self = this;			
			self.addScore();
		}

		// 加分
		protected addScore(){
			let self = this;			
			let cfg = GameCfg.getCfg().Items[self.key];
			let addValue = GameMgr.getInstance().addScore(cfg.score);
			let ani = World.instance.spawnUIAni(AddScoreAni, self.x, self.y) as AddScoreAni; // 加分特效
			ani.setScore(addValue);
		}

		protected onAddToStage(e){
			let self = this;			
			let originScale = self.scaleX;
			egret.Tween.get(self).set({scaleX:0, scaleY:0, alpha:0}).to({scaleX:originScale, scaleY:originScale, alpha:1}, 600, egret.Ease.sineInOut)
			.call(() => {
				self.colliderEnabled = true;
			});
		}

		protected onMove(deltaTime:number){
			let self = this;
			if(self.getHeight() > GameCfg.getCfg().WorldRange)
				ItemMgr.getInstance().destroyItem(self);
		}

		// 获取物品的高度（以世界中心为圆心的半径）
		public getHeight(){
			let self = this;
			return Math.sqrt(self.x * self.x + self.y * self.y);
		}

		// 获取物品的角度（以世界中心为圆心的半径）
		public getAngle(){
			let self = this;
			let rad = Math.atan(self.y / self.x);
			let angle = rad / Math.PI  * 180;
			if(angle < 0) {
				angle += self.y > 0 ? 180 : 360;				
			}
			else{
				if(self.y < 0 || self.x < 0)
					angle += 180;
			}
			return angle;
		}

		//********************* 接口实现 ********************//
		public key:string;

		public onCreate(){
			let self = this;
			//console.log("onCreate:", self.key);

			if(GameCfg.colliderDisplayCfg.display && !self.colliderDisplay){
				self.colliderDisplay = new egret.Shape();
				self.displayListContainer.addChild(self.colliderDisplay);
			}

			self.isCollided = false;
			self.colliderEnabled = false;
			self.displayObject.once(egret.Event.ADDED_TO_STAGE, self.onAddToStage, self);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
		}

		public onEnterFrame(deltaTime:number){
			let self = this;
			self.onMove(deltaTime);
			self.updateTransform();			
			self.drawCollider();
		}

		public isCollided:boolean;
		public collider:g2.SAT.IShape;

		public initCollider(...args:any[]){

		}

		public updateTransform(){
			let self = this;
			if(!self.collider)
				return;
				
			self.collider.x = self.x;
			self.collider.y = self.y;
			self.collider.scaleX = self.scaleX;
			self.collider.scaleY = self.scaleY;
			self.rotation = self.getAngle() - 270;
			self.collider.rotation = self.rotation;
		}

		public drawCollider(...args:any[]){

		}
	}
}