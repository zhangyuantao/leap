module planetJump {
	export class Cut extends Prop{
		// 执行效果
		protected applyEffect(player:Player){
			let self = this;
			super.applyEffect(player);
			player.addEffect(self.key, CutEffect);

			utils.Singleton.get(utils.SoundMgr).playSound("thunderbolt_mp3");
		}	
	}
}