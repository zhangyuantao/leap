module planetJump {
	export class Plus extends Prop {

		// 执行效果
		protected applyEffect(player: Player) {
			let self = this;
			super.applyEffect(player);
			player.addEffect(self.key, PlusEffect);

			utils.Singleton.get(utils.SoundMgr).playSound("Increase_chord_1_edited_mp3");

			// 录屏，高光时刻			
			GameMgr.getInstance().recordClip([1, (self.cfg.duration / 1000 | 0) + 1]);
		}
	}
}