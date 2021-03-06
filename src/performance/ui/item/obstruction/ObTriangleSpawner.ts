module planetJump {
	export class ObTriangleSpawner extends ItemSpawner{

		public constructor(){
			super(ItemDefine.ObTriangle);
			let self = this;
			let itemCfg = GameCfg.getCfg().Items[self.key];
			self.spawnInterval = itemCfg.spawnInterval;
		}

		public spawn(){
			let self = this;
			if(!self.canSpawnOb())
				return;					

			//utils.EventDispatcher.getInstance().dispatchEvent("spawnSpike");
			
			let itemCfg = GameCfg.getCfg().Items[self.key];

			// 生成一圈
			for(let i = 0; i < 10; i++){
				let rad = i * Math.PI / (10 / 2);
				let item = ItemMgr.getInstance().spawnItem(self.key, rad, 10) as Item;	
				item.init(itemCfg.speed);
				World.instance.addItem(item.displayObject);
			}
		}
	}
}