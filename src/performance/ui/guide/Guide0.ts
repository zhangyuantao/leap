module leap {
	/**
	 * 引导“按住屏幕转动”
	 */
	export class Guide0 extends GuideUI{

		// 做改引导做的事
		public do(step:number){
			super.do(step);

			let self = this;
			self.x = utils.StageUtils.stageWidth * 0.5;
			self.y = 980;

			// 监听舞台点击
			utils.StageUtils.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onTouchBegin, self);
		}

		private onTouchBegin(){
			let self = this;
			utils.StageUtils.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onTouchBegin, self);
			egret.Tween.get(self).to({alpha:0}, 300, egret.Ease.sineInOut).call(() => {				
				self.complete();		
			});			
		}
	}
}