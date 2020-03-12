module planetJump {
	export class ScoreBall_new extends LinearMotionCircle{
		private c1:fairygui.Controller;

		constructFromResource(){
			super.constructFromResource();
			let self = this;
			self.c1 = self.getController("c1");	
			let idx = Math.floor(self.c1.pageCount * Math.random());
			self.c1.setSelectedIndex(idx);
		}

		public onCreate(){
			super.onCreate();
			let self = this;
			self.key = ItemDefine.ScoreBall_new;
		}

		protected applyEffect(player:Player){
			let self = this;		
			self.addScore();
			let cfg = GameCfg.getCfg().Items[self.key];
			player.jump(cfg.jumpSpeed);			
			utils.Singleton.get(utils.SoundMgr).playSound("power_1_b_edited_mp3");
		}
	}
}