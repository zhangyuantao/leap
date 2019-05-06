module planetJump {
	export class TextureBackground extends fairygui.GComponent{
		private curImg:fairygui.GImage;
		private imgs:fairygui.GImage[];
		private lastIdx:number = -1;
		
		constructFromResource(){
            super.constructFromResource();
            let self = this;   
			let w = utils.StageUtils.stageWidth;
			let h = utils.StageUtils.stageHeight;
			self.x = w / 2;
			self.y = h / 2;      
			self.imgs = [];
			let size = Math.ceil(Math.sqrt(w * w + h * h));
			for(let i = 1; i <= 8; i++){
				let img = self.getChild("n" + i).asImage;
				img.width = img.height = size;
				img.setPivot(0.5, 0.5, true);
				self.imgs.push(img);
			}
        }

		public show(){
			let self = this;
			self.visible = true;
			if(self.curImg){
				egret.Tween.removeTweens(self.curImg);
				self.curImg.visible = false;
			}

			// 随机一个纹理
			let idx = 0;
			do{
				idx = Math.round(Math.random() * (self.imgs.length - 1));
			}
			while(self.lastIdx == idx);
			
			self.lastIdx = idx;
			self.curImg = self.imgs[idx];

			egret.Tween.get(self.curImg).set({visible:true, alpha:0}).to({alpha:0.2}, 500, egret.Ease.sineInOut);
		}

		public hide(){
			let self = this;
			egret.Tween.removeTweens(self.curImg);
			egret.Tween.get(self.curImg).to({alpha:0}, 800, egret.Ease.sineInOut).call(() => {
				self.curImg.visible = false;
				self.visible = false;
			});			
		}

		public setRotation(rot:number){
			let self = this;
			self.rotation = rot;
		}

		public change(){
			let self = this;
			self.show();
		}

		public dispose(){
			super.dispose();
			let self = this;
			self.curImg = null;
			self.imgs = null;
		}
	}
}