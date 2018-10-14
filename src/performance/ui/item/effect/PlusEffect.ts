module leap {
	export class PlusEffect extends PropEffect{	
		public init(effKey:string, p:Player){
			super.init(effKey, p);
			let self = this;		
			self.player.addInvincibleTime(self.cfg.invincibleTime);
			World.instance.textureBg.show();
			World.instance.textureBg.setWidth(self.player.getHeight() * 3 + 500);
		}

		// 效果进行叠加
		public added(){
			let self = this;
			super.added();
			World.instance.textureBg.change();
			World.instance.textureBg.setWidth(self.player.getHeight() * 3 + 500);			
		}

		protected onUpdate(){
			let self = this;
			World.instance.textureBg.setWidth(self.player.getHeight() * 3 + 500);
			World.instance.textureBg.rotation = self.player.rotation;
		}

		// 移除特效
		public onDestroy(){
			super.onDestroy();
			let self = this;	
			if(World.instance)		
				World.instance.textureBg.hide();
		}
	}
}