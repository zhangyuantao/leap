module leap {
	export class MegaJump extends Prop{

		// 执行效果
		public applyEffect(player:Player){
			let self = this;
			let cfg = GameCfg.getCfg().Items[self.key];
			player.jump(cfg.jumpSpeed, cfg.jumpDis);			
			//MySoundMgr.getInstance().playSound("resource/game/leap/sound/retro_jump_collect_bonus_03.mpt", 1, false, 1);
		}	
	}
}