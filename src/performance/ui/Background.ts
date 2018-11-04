module leap{
	export class Background extends egret.Sprite implements utils.IGameObject{
		private static instance:Background = null;
		public static getInstance(){
			return Background.instance || new Background();
		}

		public curColor:number = 0xAD0E0E;
		private bgs:egret.Sprite[] = [];
		private curBgIdx:number = 0;	

		//********************* 接口实现 ********************//
		public key:string;		

		public onCreate(){
			let self = this;			
			//console.log("onCreate:", self.key);
			Background.instance = self;
			self.curColor = parseInt(GameCfg.getCfg().BgColors[0]);

			self.once(egret.Event.ADDED_TO_STAGE, self.onAddToStage, self);
			utils.EventDispatcher.getInstance().addEventListener("levelUp", self.onLevelUp, self);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
			self.bgs = null;
			Background.instance = null;
			utils.EventDispatcher.getInstance().removeEventListener("levelUp", self.onLevelUp, self);
		}

		public onEnterFrame(deltaTime:number){
		}
		//********************* 接口实现结束 ********************//

		protected onAddToStage(e){
			let self = this;
			self.width = self.stage.stageWidth;
			self.height = self.stage.stageHeight;
			let bg1 = new egret.Sprite();
			bg1.width = self.width;
			bg1.height = self.height;
			self.addChild(bg1);
			self.bgs.push(bg1);
			let bg2 = new egret.Sprite();
			bg2.width = self.width;
			bg2.height = self.height;
			self.addChild(bg2);		
			self.bgs.push(bg2);

			self.setStartColor(self.curColor);
		}

		private setStartColor(color:number){
			let self = this;
			let curBg = self.getCurBgSprite();	
			curBg.graphics.clear();
			curBg.graphics.beginFill(color)	;
			curBg.graphics.drawRect(0, 0, curBg.width, curBg.height);
			curBg.graphics.endFill();
		}

		// 改变背景颜色，新颜色层级提到最高渐变出现，当前颜色渐变消失
		public changeColor(color:number){
			let self = this;
			let curBg = self.getCurBgSprite();		
			egret.Tween.get(curBg).to({alpha:0}, 1000, egret.Ease.sineInOut);

			let nxtBg = self.getNextBgSprite();	
			nxtBg.graphics.clear();
			nxtBg.graphics.beginFill(color)	;
			nxtBg.graphics.drawRect(0, 0, nxtBg.width, nxtBg.height);
			nxtBg.graphics.endFill();			
			self.addChildAt(nxtBg, 1);
			egret.Tween.get(nxtBg).set({alpha:0}).to({alpha:1}, 1000, egret.Ease.sineInOut);

			self.curColor = color;
			utils.EventDispatcher.getInstance().dispatchEvent("changeBgColor", color);
		}

		private getCurBgSprite(){
			let self = this;
			return self.bgs[self.curBgIdx] || null;
		}

		private getNextBgSprite(){
			let self = this;
			self.curBgIdx++;
			if(self.curBgIdx > self.bgs.length - 1)
				self.curBgIdx = 0;
			return self.bgs[self.curBgIdx] || null;
		}

		private onLevelUp(){
			let self = this;

			// 升级随机换一种和当前不一样的颜色
			let color;
			let colors = GameCfg.getCfg().BgColors;
			do{
				let idx = Math.round(Math.random() * (colors.length - 1));
				color = parseInt(colors[idx]);
			}while(self.curColor == color);

			self.changeColor(color);
		}
	}
}