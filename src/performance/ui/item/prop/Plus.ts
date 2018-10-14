module leap {
	export class Plus extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;
			super.applyEffect(player);
			player.addEffect(self.key, PlusEffect);
			
			//MySoundMgr.getInstance().playSound("resource/game/leap/sound/Increase_chord_1_edited.mpt", 1, false, 1);
		}	
	}
}