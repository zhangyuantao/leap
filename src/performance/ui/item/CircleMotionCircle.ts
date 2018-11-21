module leap {
	export class CircleMotionCircle extends CircleItem{
		private rotateSpeed:number = 0;
		private rotateTime:number = 0;
		private curClockwise:boolean = true;

		public init(rotateSpeed:number){
			let self = this;
			self.rotateSpeed = rotateSpeed;
			self.rotateTime = self.getAngle() / self.rotateSpeed;	
		}

		protected onMove(deltaTime:number){
			let self = this;
			super.onMove(deltaTime);

			if(GameMgr.getInstance().level > 1){				
				let cw = self.getMoveClockwise();

				// 更改方向处理
				if(self.curClockwise != cw){
					let a = 360 / self.rotateSpeed; // 一圈需要时间
					self.rotateTime = a - (self.rotateTime % a);
				}

				self.curClockwise = cw;
				let pos = RoundMotion.getPointByTime(self.rotateTime, self.rotateSpeed, self.getHeight(), self.getMoveClockwise());
				self.x = pos.x;
				self.y = pos.y;
				self.rotateTime ++;
			}
		}		

		// 决定顺逆时针
		private getMoveClockwise(){
			return GameMgr.getInstance().level % 2 == 0;
		}

		protected applyEffect(player:Player, lastCheckPlayerPos:IPoint){
			let self = this;
			let lastHeight = 0;	
			let playerHeight = 0;
			let selfHeight = 0;

			if(!player.isInvincible){
				lastHeight = Math.sqrt(lastCheckPlayerPos.x * lastCheckPlayerPos.x + lastCheckPlayerPos.y * lastCheckPlayerPos.y);	
				playerHeight = player.getHeight();
				selfHeight = self.getHeight();
			}

			if(!player.isInvincible && playerHeight > selfHeight && lastHeight > playerHeight){
				player.dead();
			}
			else{
				self.addScore();
				utils.Singleton.get(utils.SoundMgr).playSound("black_explosion_mp3");
			}
		}

		protected collisionEffect(){
			let self = this;
			World.instance.spawnUIAni(CollisionBlackAni, self.x, self.y);
		} 
	}
}