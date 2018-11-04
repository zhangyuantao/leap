module leap {
	export class EndLine extends egret.Sprite implements utils.IGameObject{
		//********************* 接口实现 ********************//		
		public key:string;

		public onCreate(){
			let self = this;
			//console.log("onCreate:", self.key);
			self.once(egret.Event.ADDED_TO_STAGE, self.onAdded, self);
			utils.EventDispatcher.getInstance().addEventListener("newRound", self.onNewRound, self);
			utils.EventDispatcher.getInstance().addEventListener("nearEnd", self.onNearEnd, self);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
			utils.EventDispatcher.getInstance().removeEventListener("newRound", self.onNewRound, self);
			utils.EventDispatcher.getInstance().removeEventListener("nearEnd", self.onNearEnd, self);
		}

		public onEnterFrame(deltaTime:number){
			let self = this;
			if(self.isNear)
				self.draw();
		}
		//********************* 接口实现结束 ********************//
	
		private readonly lineSpace:number = 25;
		private readonly lineW:number = 5;
		private readonly lineH:number = 30;

		private bg:egret.Shape;
		private dottedLine:egret.Shape;
		private lineLen:number = 0;
		private isNear:boolean;

		private onAdded(e){
			let self = this;
			self.bg = new egret.Shape();
			self.addChild(self.bg);
			self.dottedLine = new egret.Shape();
			self.addChild(self.dottedLine);
			self.dottedLine.graphics.lineStyle(self.lineW, 0xffffff, 0.8);
		}

		private draw(){
			let self = this;
			let local = self.globalToLocal(0, 0);
			let length = Math.abs(local.y);
			if(length <= self.lineLen)
				return;
			
			// 画虚线
			let lineNum = Math.ceil((length - self.lineLen) / (self.lineH +  self.lineSpace));
			let startY = self.lineLen;
			let graphics = self.dottedLine.graphics;
			for(let i = 0; i < lineNum; i++){
				startY += self.lineSpace;
				graphics.moveTo(0, -startY);
				startY += self.lineH;
				graphics.lineTo(0, -startY);
			}
			graphics.endFill();

			self.lineLen = startY;
			
			// 画背景		
			self.bg.scaleX = 0;
			self.bg.alpha = 0;
			self.bg.graphics.clear();
			self.bg.graphics.beginFill(0xffffff);
			self.bg.graphics.drawRect(-5, 0, 10, -self.lineLen);
			self.bg.graphics.endFill();
		}

		private onNewRound(rounds){
			let self = this;		
			if(rounds <= 1)
				return;
			
			utils.Singleton.get(utils.SoundMgr).playSound("multiplier2_mp3");

			// 爆炸渐变动画
			egret.Tween.get(self.bg).set({alpha:0})
			.to({alpha:1}, 200, egret.Ease.quadInOut)
			.to({alpha:0}, 600, egret.Ease.quadInOut)
			.call(()=>{
				self.isNear = false;
			});
			egret.Tween.get(self.bg).set({scaleX:0}).to({scaleX:10}, 800, egret.Ease.quadInOut);

			// 隐藏虚线
			egret.Tween.removeTweens(self.dottedLine);
			egret.Tween.get(self.dottedLine).to({alpha:0}, 200);
		}

		// 接近终点
		private onNearEnd(){
			let self = this;
			if(self.isNear)
				return;
			self.isNear = true;

			// 显示虚线
			egret.Tween.get(self.dottedLine, {loop:true})
			.to({alpha:1, scaleX:1.3}, 500)
			.to({alpha:0.3, scaleX:0.7}, 500);
		}
	}
}