module leap {
	export class StarEffect extends PropEffect{	
		public init(effKey:string, p:Player){
			super.init(effKey, p);
			let self = this;
			egret.Tween.removeTweens(self.player);
			p.rotateTimeAdd = 1;
			p.trail.trailScale = 1.5;
			if(p.jumpSpeed < 0)	p.jumpSpeed = 0;
			p.addInvincibleTime(self.cfg.invincibleTime);
		}

		// 移除特效
		public onDestroy(){
			super.onDestroy();
			let self = this;				
			if(!self.player.isPressed){
				egret.Tween.removeTweens(self.player);	
			    egret.Tween.get(self.player).to({rotateTimeAdd:0}, 500);
			}

			if(self.player.trail)
				self.player.trail.trailScale = 1;
		}
	}
}