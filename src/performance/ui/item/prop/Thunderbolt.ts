module leap {
	export class Thunderbolt extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;
			super.applyEffect(player);
			player.addEffect(self.key, ThunderboltEffect);

			//MySoundMgr.getInstance().playSound("resource/game/leap/sound/thunderbolt.mpt", 1, false, 1);
		}	
	}
}