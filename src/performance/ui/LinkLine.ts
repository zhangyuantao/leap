module planetJump {
	export class LinkLine extends fairygui.GComponent{
		private styleCtrl:fairygui.Controller;
		private originWidth:number;

		public constructFromResource(){
            super.constructFromResource();
            let self = this;
			self.styleCtrl = self.getController("c1"); 
        }

		public setColor(){
			let self = this;
			self.originWidth = self.width;
			self.width = 10;
			self.styleCtrl.setSelectedIndex(1);

			egret.Tween.removeTweens(self);
			egret.Tween.get(self, {loop:true}).to({scaleX:4}, 500).to({scaleX:1}, 500);
		}

		public resetColor(){
			let self = this;
			egret.Tween.removeTweens(self);
			self.width = self.originWidth;
			egret.Tween.get(self).to({scaleX:1}, 500);
			self.styleCtrl.setSelectedIndex(0);
		}
	}
}