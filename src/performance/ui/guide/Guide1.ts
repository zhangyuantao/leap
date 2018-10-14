module leap {
	/**
	 * 引导“不要落入中心”
	 */
	export class Guide1 extends GuideUI{
		public constructFromResource(){
			super.constructFromResource();
			let self = this;
		}

		// 做改引导做的事
		public do(step:number){
			super.do(step);

			let self = this;
			let center = World.instance.spike;
			let pos = World.instance.localToGlobal(center.x, center.y);
			self.x = pos.x + 60;
			self.y = pos.y - 60;
			self.getTransition("t0").play(() => {
				utils.StageUtils.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onStageTouch, self);
			}, self);
		}

		private onStageTouch(){
			let self = this;
			utils.StageUtils.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onStageTouch, self);
			self.getTransition("t1").play(() => {				
				self.complete();
			}, self);
		}
	}
}