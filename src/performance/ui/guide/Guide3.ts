module leap {
	/**
	 * 引导“道具”
	 */
	export class Guide3 extends GuideUI{
		public constructFromResource(){
			super.constructFromResource();
			let self = this;
		}

		// 做改引导做的事
		public do(step:number){
			super.do(step);
			let self = this;
			
			// 在玩家前面生成一个Plus道具	
			let player = World.instance.player;
			let rad = (player.getAngle() + 15) / 180 * Math.PI;
			let radius = player.getHeight();			
			let item = ItemMgr.getInstance().spawnItem(ItemDefine.Plus, rad, radius, Prop.scaleUnit);		
			World.instance.addItem(item.displayObject);

			let pos = item.displayObject.parent.localToGlobal(item.x, item.y);
			self.x = pos.x;
			self.y = pos.y;
			
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