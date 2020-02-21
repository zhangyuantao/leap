module planetJump {
	export class Prop extends CircleItem{
		public static readonly scaleUnit:number = 1; // 统一功能道具缩放
		
		protected onAddToStage(e){
			super.onAddToStage(e);
			let self = this;
			egret.Tween.removeTweens(self.img);
			egret.Tween.get(self.img, {loop:true}).to({scaleX:1.1, scaleY:1.1}, 300).to({scaleX:0.9, scaleY:0.9}, 300).to({scaleX:1, scaleY:1}, 300);
		}

		protected applyEffect(player:Player){
			let self = this;
			let cfg = GameCfg.getCfg().Items[self.key];
			if(cfg.jumpSpeed)
				player.jump(cfg.jumpSpeed);
		}
	}
}