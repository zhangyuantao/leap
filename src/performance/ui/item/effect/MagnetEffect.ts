module leap {
	export class MagnetEffect extends PropEffect {
		private foundItemIds:number[] = [];	// 已经找到的
		private foundItems:	Item[] = [];
		
		protected onUpdate(){
			let self = this;

			// 找到磁铁吸引范围内的道具	
			let items = ItemMgr.getInstance().findItemsByRange(self.player.position, self.cfg.range, ItemDefine.WhiteBall, ItemDefine.ScoreBall);

			if(!items.length){
				self.foundItems = [];
				self.foundItemIds = [];
				return;
			}

			for(let i = 0, len = items.length; i < len; i++){
				let tmp = items[i];
				if(self.foundItemIds.indexOf(tmp.hashCode) != -1)
					continue;
				
				self.foundItemIds.push(tmp.hashCode);
				self.foundItems.push(tmp);				
			}
			
			// 随机吸引力范围
			let speed = self.cfg.attractionRange[0] + Math.random() * (self.cfg.attractionRange[1] - self.cfg.attractionRange[0]);
			speed = Math.floor(speed);

			for(let i = 0; i < self.foundItems.length; i++){
				let item = self.foundItems[i] as LinearMotionCircle;
				if(!item.displayObject.parent){
					self.foundItems.splice(i--, 1);
					continue;
				}
				let dx = self.player.x - item.x;
				let dy = self.player.y - item.y;
				item.setSpeed(speed, dx, dy);
			}
		}

		public onCreate(){
			let self = this;
			super.onCreate();
			self.foundItemIds = [];
			self.foundItems = [];
		}

		public onDestroy(){
			let self = this;
			super.onDestroy();

			// 恢复影响物体的速度
			for(let i = 0, len = self.foundItems.length; i < len; i++){
				let item = self.foundItems[i] as LinearMotionCircle;			
				item.setSpeed(item.speed, item.x, item.y);
			}

			self.foundItems = null;
			self.foundItemIds = null;
		}
	}
}