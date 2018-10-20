module leap {
	export class Plus extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;
			super.applyEffect(player);
			player.addEffect(self.key, PlusEffect);
			
			utils.Singleton.get(utils.SoundMgr).playSound("Increase_chord_1_edited_mp3");
		}	
	}
}