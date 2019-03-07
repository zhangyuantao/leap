module leap {
	export class ThunderboltEffect extends PropEffect{	
		public init(effKey:string, p:Player){
			super.init(effKey, p);
			let self = this;
			p.trail.trailScale = 0.8;
			p.addInvincibleTime(self.cfg.invincibleTime);
		}

		// 移除特效
		public onDestroy(){
			super.onDestroy();
			let self = this;
			if(self.player.trail)
				self.player.trail.trailScale = self.player.trail.initTrailScale;
		}
	}
}