module planetJump {
	export class Star extends Prop {

		// 执行效果
		protected applyEffect(player: Player) {
			let self = this;
			super.applyEffect(player);
			player.addEffect(self.key, StarEffect);

			utils.Singleton.get(utils.SoundMgr).playSound("star_sound_final_mp3");

			// 录屏，高光时刻			
			GameMgr.getInstance().recordClip([1, (self.cfg.duration / 1000 | 0) + 1]);
		}
	}
}