module leap {
	export class WhiteBall extends LinearMotionCircle{
		protected applyEffect(player:Player){
			let self = this;		
			self.addScore();
			let cfg = GameCfg.getCfg().Items[self.key];
			player.jump(cfg.jumpSpeed, cfg.jumpDis);	
			utils.Singleton.get(utils.SoundMgr).playSound("power_1_b_edited_mp3");
		}
	}
}