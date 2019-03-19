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
				self.drawLine();
		}
		//********************* 接口实现结束 ********************//

		private line:egret.Shape;
		private lineLen:number = 0;
		private isNear:boolean;

		private onAdded(e){
			let self = this;
			self.line = new egret.Shape();
			self.addChild(self.line);
		}

		private drawLine(){
			let self = this;
			let local = self.globalToLocal(0, 0);
			let length = Math.abs(local.y);
			if(length <= self.lineLen)
				return;
			self.lineLen = length;
			
			// 画线
			let graphics = self.line.graphics;			
			graphics.clear();
			self.line.graphics.lineStyle(4, 0xffffff, 0.7);
			graphics.moveTo(0, 0);
			graphics.lineTo(0, -length);
			graphics.endFill();
		}

		private onNewRound(rounds){
			let self = this;		
			if(rounds <= 1)
				return;
			
			utils.Singleton.get(utils.SoundMgr).playSound("multiplier2_mp3");			

			// 爆炸渐变动画
			egret.Tween.removeTweens(self.line);
			egret.Tween.get(self.line)
			.to({scaleX:15, alpha:1}, 300, egret.Ease.sineIn)
			.to({scaleX:30, alpha:0}, 700, egret.Ease.sineOut)
			.set({visible:false})
			.call(() => {
				self.isNear = false;
			});		
		}

		// 接近终点
		private onNearEnd(){
			let self = this;
			if(self.isNear)
				return;
			self.isNear = true;

			// 显示虚线
			egret.Tween.get(self.line, {loop:true})
			.set({scaleX:1, visible:true})
			.to({alpha:1}, 600, egret.Ease.sineInOut)
			.to({alpha:0.1}, 600, egret.Ease.sineInOut);
		}
	}
}