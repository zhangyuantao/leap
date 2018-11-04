module leap {
	export class GuidePanel extends fairygui.GComponent implements utils.IGameObject{
		public key:string;
		
		public onCreate(){
			let self = this;
			utils.EventDispatcher.getInstance().once("guideCompleted", () => {
				utils.ObjectPool.getInstance().destroyObject(self);
			}, self);
		}

		public onDestroy(){
		}

		public onEnterFrame(){
			let self = this;
			let player = World.instance.player;
			let angle = player.getAngle();
			let guideStep = -1;
			if(!self.isCompleteGuide(0))
				guideStep = 0;
			else if(!self.isCompleteGuide(1)){
				if(angle > 280 && player.jumpSpeed < -2)
					guideStep = 1;
			}
			else if(!self.isCompleteGuide(2)){
				if(angle > 320 && player.jumpSpeed < -2)
					guideStep = 2;
			}
			else if(!self.isCompleteGuide(3)){
				if(angle > 90 && angle < 180 && player.getHeight() > 350)
					guideStep = 3;
			}
			
			if(guideStep >= 0){				
				GameMgr.getInstance().pause(true);
				self.createGuideUI(guideStep);
			}
		}

		private createGuideUI(step:number){
			let self = this;
			self.visible = true;
			let ui = fairygui.UIPackage.createObject("leap", "Guide" + step) as GuideUI;	
			self.addChild(ui);
			ui.do(step);			
		}

		public isCompleteGuide(step:number){
			let key = "leap_guideStep" + step;
			let guideStep = egret.localStorage.getItem(key);			
			return guideStep != null && guideStep != "";
		}
	}
}