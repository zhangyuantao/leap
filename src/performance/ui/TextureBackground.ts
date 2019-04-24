module leap {
	export class TextureBackground extends fairygui.GComponent{
		private curImg:fairygui.GImage;
		private imgs:fairygui.GImage[];
		private lastIdx:number = -1;
		
		constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.imgs = [];
			self.imgs.push(self.getChild("n1").asImage);
			self.imgs.push(self.getChild("n2").asImage);
			self.imgs.push(self.getChild("n3").asImage);
			self.imgs.push(self.getChild("n4").asImage);
			self.imgs.push(self.getChild("n5").asImage);
			self.imgs.push(self.getChild("n6").asImage);
			self.imgs.push(self.getChild("n7").asImage);
			self.imgs.push(self.getChild("n8").asImage);
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