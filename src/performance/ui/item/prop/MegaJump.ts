module leap {
	export class MegaJump extends Prop{

		// 执行效果
		public applyEffect(player:Player){
			let self = this;
			let cfg = GameCfg.getCfg().Items[self.key];
			player.jump(cfg.jumpSpeed, cfg.jumpDis);			
			utils.Singleton.get(utils.SoundMgr).playSound("retro_jump_collect_bonus_03_mp3");
		}	
	}
}