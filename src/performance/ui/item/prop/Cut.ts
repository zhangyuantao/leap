module planetJump {
	export class Cut extends Prop{
		// 执行效果
		protected applyEffect(player:Player){
			let self = this;
			super.applyEffect(player);
			player.addEffect(self.key, CutEffect);

			utils.Singleton.get(utils.SoundMgr).playSound("thunderbolt_mp3");

			// 录屏，高光时刻			
			GameMgr.getInstance().recordClip([1, (self.cfg.duration / 1000 | 0) + 1]);
		}	
	}
}