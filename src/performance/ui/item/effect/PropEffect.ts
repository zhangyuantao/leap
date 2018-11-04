module leap {
	/**
	 * 有持续时间的功能道具效果
	 */
	export class PropEffect implements utils.IGameObject{
		protected player:Player;
		protected effKey:string;
		protected cfg:any;
		protected timer:number;
		protected duration:number;

		public init(effKey:string, p:Player){
			let self = this;
			self.effKey = effKey;
			self.player = p;
			self.cfg = GameCfg.getCfg().Items[effKey];
			self.timer = 0;
			self.duration = self.cfg.duration;
		}

		protected onUpdate(){
		}

		// 效果进行叠加
		public added(){
			let self = this;
			// 持续时间叠加
			self.duration += self.cfg.duration;

			// 无敌时间叠加
			if(self.cfg.invincibleTime)
				self.player.addInvincibleTime(self.cfg.invincibleTime);
		}

		// 移除特效
		private remove(){
			let self = this;
			self.player.removeEffect(self.effKey);
			utils.ObjectPool.getInstance().destroyObject(self);
		}

		/** 接口实现 */
		
		public key:string;

		public onCreate(){
			let self = this;
			//console.log("onCreate:", self.key);

		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
		}

		public onEnterFrame(deltaTime:number){			
			let self = this;
			if(self.duration){ // 有duration字段说明是时效道具
				self.timer += GameCfg.frameTime;
				if(self.timer >= self.duration){
					self.timer = 0;
					self.remove();
					return;
				}
			}

			self.onUpdate();
		}
	}
}