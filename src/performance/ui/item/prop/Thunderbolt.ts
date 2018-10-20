module leap {
	export class Thunderbolt extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;
			super.applyEffect(player);
			player.addEffect(self.key, ThunderboltEffect);

			utils.Singleton.get(utils.SoundMgr).playSound("thunderbolt_mp3");
		}	
	}
}