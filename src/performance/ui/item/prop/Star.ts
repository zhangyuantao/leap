module leap {
	export class Star extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;	
			super.applyEffect(player);		
			player.addEffect(self.key, StarEffect);	

			//MySoundMgr.getInstance().playSound("resource/game/leap/sound/star_sound_final.mpt", 1, false, 1);
		}	
	}
}