module planetJump {
	export class GuidePanel extends fairygui.GComponent implements utils.IGameObject{
		public key:string;
		
		public onCreate(){
			let self = this;
			self.touchable = false;
			
			utils.EventDispatcher.getInstance().once("guideCompleted", () => {
				utils.ObjectPool.getInstance().destroyObject(self);
				let doGuideCount = parseInt(egret.localStorage.getItem("doGuideCount") || "0");
				doGuideCount++;
				egret.localStorage.setItem("doGuideCount", doGuideCount.toString());
			}, self);
		}

		public onDestroy(){
			let self = this;
			self.removeFromParent();
		}

		public onEnterFrame(){
			let self = this;
			let player = World.instance.player;
			let angle = player.getAngle();
			let guideStep = -1;
			if(!self.isCompleteGuide(0))
				guideStep = 0;
			else if(!self.isCompleteGuide(1)){
				if((angle > 315 && angle < 360) && player.jumpSpeed < 0)
					guideStep = 1;
			}
			else if(!self.isCompleteGuide(2)){
				if((angle > 45 && angle < 135) && player.jumpSpeed < -1)
					guideStep = 2;
			}
			else if(!self.isCompleteGuide(3)){
				if((angle > 180 && angle < 360) && player.getHeight() > 350)
					guideStep = 3;
			}
			
			if(guideStep >= 0){			
				GameMgr.getInstance().setPause(true, false);
				self.createGuideUI(guideStep);
			}
		}

		private createGuideUI(step:number){
			let self = this;
			self.visible = true;
			self.touchable = true;	
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