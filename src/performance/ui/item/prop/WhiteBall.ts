module leap {
	export class WhiteBall extends LinearMotionCircle{
		protected applyEffect(player:Player){
			let self = this;		
			self.addScore();
			let cfg = GameCfg.getCfg().Items[self.key];
			player.jump(cfg.jumpSpeed, cfg.jumpDis);	
			//MySoundMgr.getInstance().playSound("resource/game/leap/sound/power_1_b_edited.mpt", 1, false, 1);
		}
	}
}