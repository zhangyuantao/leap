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
        }

		public setWidth(w:number){
			let self = this;
			w = Math.max(w, utils.StageUtils.stageHeight * 2);
			if(self.curImg.width < w)
				self.curImg.width = self.curImg.height = w;
		}

		public show(){
			let self = this;
			self.visible = true;
			if(self.curImg){
				egret.Tween.removeTweens(self.curImg);
				self.curImg.visible = false;
				// self.curImg.width = 0;
				// self.curImg.height = 0;
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
				// self.curImg.width = 0;
				// self.curImg.height = 0;
				self.visible = false;
			});			
		}

		public change(){
			let self = this;
			self.curImg.visible = false;
			// self.curImg.width = 0;
			// self.curImg.height = 0;
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