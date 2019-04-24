module leap {
	export class GuideUI extends fairygui.GComponent{
		protected step:number;

		public do(step:number){
			this.step = step;
		}

		protected complete(){
			let self = this;
			let key = "leap_guideStep" + self.step;
			egret.localStorage.setItem(key, "1");
			GameMgr.getInstance().setPause(false, false);

			self.parent.visible = false;
			self.parent.touchable = false;	
			self.removeFromParent();	

			// 标记引导完成
			if(self.step == 3){
				GameMgr.getInstance().guideCompleted = true;
				utils.EventDispatcher.getInstance().dispatchEvent("guideCompleted");
			}
		}
	}
}