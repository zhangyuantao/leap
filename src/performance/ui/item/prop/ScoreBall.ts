module leap {
	export class ScoreBall extends LinearMotionCircle{
		private colorImg:fairygui.GImage;

		constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.colorImg = self.getChild("colorImg").asImage;
        }

		protected onAddToStage(e){
			let self = this;
			super.onAddToStage(e);
			self.colorImg.color = Background.getInstance().curColor;
			utils.EventDispatcher.getInstance().addEventListener("changeBgColor", self.changeBgColor, self);
		}

		private changeBgColor(color:number){
			let self = this;
			self.colorImg.color = color;
		}

		protected applyEffect(player:Player){
			let self = this;		
			self.addScore();
			let cfg = GameCfg.getCfg().Items[self.key];
			player.jump(cfg.jumpSpeed, cfg.jumpDis);			
			utils.Singleton.get(utils.SoundMgr).playSound("power_1_b_edited_mp3");
		}
	}
}