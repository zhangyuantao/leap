module leap {
	export class Prop extends CircleItem{
		public static readonly scaleUnit:number = 1; // 统一功能道具缩放

		private n:fairygui.GImage;

		constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.n = self.getChild("n1").asImage;
        }

		protected onAddToStage(e){
			super.onAddToStage(e);
			let self = this;
			egret.Tween.removeTweens(self.n);
			egret.Tween.get(self.n, {loop:true}).to({scaleX:1.1, scaleY:1.1}, 300).to({scaleX:0.9, scaleY:0.9}, 300).to({scaleX:1, scaleY:1}, 300);
		}

		protected applyEffect(player:Player){
			let self = this;
			let cfg = GameCfg.getCfg().Items[self.key];
			if(cfg.jumpSpeed && cfg.jumpDis)
				player.jump(cfg.jumpSpeed, cfg.jumpDis);
		}
	}
}