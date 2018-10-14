module leap {
	/**
	 * 引导“黑色障碍”
	 */
	export class Guide2 extends GuideUI{
		public constructFromResource(){
			super.constructFromResource();
			let self = this;
		}

		// 做改引导做的事
		public do(step:number){
			super.do(step);

			let self = this;

			// 在玩家身后生成一个黑白障碍		
			let player = World.instance.player;
			let rad = (player.getAngle() - 15) / 180 * Math.PI;
			let radius = player.getHeight();
			let itemCfg = GameCfg.getCfg().Items[ItemDefine.ObCircle];			
			let item = ItemMgr.getInstance().spawnItem(ItemDefine.ObCircle, rad, radius) as ObCircle;
			item.init(itemCfg.speed);
			World.instance.addItem(item.displayObject);
			item.rotation = item.getAngle() - 270;
			
			let pos = item.displayObject.parent.localToGlobal(item.x, item.y);
			self.x = pos.x - 20;
			self.y = pos.y - 20;

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