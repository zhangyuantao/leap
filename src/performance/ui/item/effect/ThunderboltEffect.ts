module leap {
	export class ThunderboltEffect extends PropEffect{	
		public init(effKey:string, p:Player){
			super.init(effKey, p);
			let self = this;
			p.trail.trailDensity = 20;

			self.player.addInvincibleTime(self.cfg.invincibleTime);
		}

		// 移除特效
		public onDestroy(){
			super.onDestroy();
			let self = this;	
			if(self.player.trail)
				egret.Tween.get(self.player.trail).to({trailDensity:10}, 300);
		}
	}
}