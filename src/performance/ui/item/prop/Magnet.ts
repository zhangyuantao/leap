module leap {
	export class Magnet extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;		
			super.applyEffect(player);

			player.addEffect(self.key, MagnetEffect);

			//MySoundMgr.getInstance().playSound("resource/game/leap/sound/gravityeffect2.mpt", 1, false, 1);
		}	
	}
}