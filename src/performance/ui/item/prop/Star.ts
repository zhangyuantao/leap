module leap {
	export class Star extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;	
			super.applyEffect(player);		
			player.addEffect(self.key, StarEffect);	

			utils.Singleton.get(utils.SoundMgr).playSound("star_sound_final_mp3");
		}	
	}
}