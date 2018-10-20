module leap {
	export class Magnet extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;		
			super.applyEffect(player);

			player.addEffect(self.key, MagnetEffect);

			utils.Singleton.get(utils.SoundMgr).playSound("gravityeffect2_mp3");
		}	
	}
}