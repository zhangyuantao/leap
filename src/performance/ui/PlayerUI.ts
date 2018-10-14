module leap {
	export class PlayerUI extends fairygui.GComponent{
		public face:fairygui.GComponent;
		private eyes:fairygui.GComponent;
		private plusEff:fairygui.GImage;
		private thunderEff:fairygui.GImage;
		private magnetEff:fairygui.GComponent;
		
		private isJump:boolean;
		private isFall:boolean;

		public constructFromResource(){
            super.constructFromResource();
            let self = this;
			self.face = self.getChild("face").asCom; 
			self.eyes = self.face.getChild("eyes").asCom;
			self.plusEff = self.getChild("plusEff").asImage; 
			self.plusEff.visible = false;  
			self.thunderEff = self.getChild("thunderEff").asImage;  
			self.thunderEff.visible = false;
			self.magnetEff = self.getChild("magnetEff").asCom; 
			self.magnetEff.visible = false;
        }

		public onEnterFrame(){
			let self = this;
			if(self.thunderEff.visible){
				self.thunderEff.rotation += 20;
			}
			if(self.plusEff.visible){
				self.plusEff.rotation += 5;
			}
		}

		public playJumpEff(){
			let self = this;
			if(self.isJump) return;
			self.isJump = true;
			self.isFall = false;

			egret.Tween.removeTweens(self);
			egret.Tween.get(self).to({scaleX:0.64, scaleY:1.12}, 300, egret.Ease.sineInOut);
			egret.Tween.removeTweens(self.eyes);
			egret.Tween.get(self.eyes).to({scaleY:1.4, y:14}, 300, egret.Ease.sineInOut);
		}

		public playFallEff(){
			let self = this;
			if(self.isFall) return;
			self.isFall = true;
			self.isJump = false;
			egret.Tween.removeTweens(self);
			egret.Tween.get(self).to({scaleX:0.8, scaleY:0.8}, 300, egret.Ease.sineInOut);
			egret.Tween.removeTweens(self.eyes);
			egret.Tween.get(self.eyes).to({scaleX:1, scaleY:1, y:27}, 300, egret.Ease.sineInOut);
		}

		public showThunderEff(){
			let self = this;
			if(self.thunderEff.visible)			
				return;

			self.thunderEff.visible = true;
			egret.Tween.removeTweens(self.thunderEff);
			egret.Tween.get(self.thunderEff).to({alpha:1}, 300, egret.Ease.sineInOut);
		}

		public removeThunderEff(){
			let self = this;
			if(!self.thunderEff.visible)			
				return;

			self.thunderEff.visible = false;
			egret.Tween.removeTweens(self.thunderEff);
			egret.Tween.get(self.thunderEff).to({alpha:0}, 300, egret.Ease.sineInOut).call(() => {
				self.thunderEff.visible = false;
			});
		}

		public showPlusEff(){
			let self = this;
			if(self.plusEff.visible)			
				return;			

			self.plusEff.visible = true;
			egret.Tween.removeTweens(self.plusEff);
			egret.Tween.get(self.plusEff).to({alpha:1}, 300, egret.Ease.sineInOut);

			// 脸变大
			egret.Tween.removeTweens(self.face);
			egret.Tween.get(self.face).to({scaleX:1.5, scaleY:1.5}, 300, egret.Ease.sineInOut);
		}


		public removePlusEff(){
			let self = this;
			if(!self.plusEff.visible)				
				return;

			egret.Tween.removeTweens(self.plusEff);
			egret.Tween.get(self.plusEff).to({alpha:0}, 300, egret.Ease.sineInOut).call(()=>{
				self.plusEff.visible = false;
			});
			
			egret.Tween.removeTweens(self.face);
			egret.Tween.get(self.face).to({scaleX:1, scaleY:1}, 300, egret.Ease.sineInOut);		
		}

		public showMagnetEff(){
			let self = this;
			self.magnetEff.visible = true;
			egret.Tween.removeTweens(self.magnetEff);
			egret.Tween.get(self.magnetEff).to({alpha:1}, 300, egret.Ease.sineInOut);
		}

		public removeMagnetEff(){
			let self = this;
			egret.Tween.removeTweens(self.magnetEff);
			egret.Tween.get(self.magnetEff).to({alpha:0}, 300, egret.Ease.sineInOut).call(()=>{
				self.magnetEff.visible = false;
			});
		}

		public removeAllEff(){
			let self = this;
			self.removePlusEff();
			self.removeThunderEff();
			self.removeMagnetEff();
		}
	}
}