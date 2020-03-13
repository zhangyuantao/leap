module planetJump {
	export class WhiteBall extends LinearMotionCircle {
		private c1: fairygui.Controller;

		constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.c1 = self.getController("c1");
			let idx = self.c1.pageCount * Math.random() | 0;
			self.c1.setSelectedIndex(idx);
		}

		public onCreate() {
			super.onCreate();
			let self = this;
			self.key = ItemDefine.WhiteBall;
		}

		protected applyEffect(player: Player) {
			let self = this;
			self.addScore();
			player.jump(self.cfg.jumpSpeed);
			utils.Singleton.get(utils.SoundMgr).playSound("power_1_b_edited_mp3");
		}
	}
}