module leap {
	export class ObCircleSpawner extends ItemSpawner{
		public constructor(){
			super(ItemDefine.ObCircle);
			let self = this;
			let itemCfg = GameCfg.getCfg().Items[self.key];
			self.spawnInterval = itemCfg.spawnInterval;
		}

		public spawn(){		
			let self = this;	
			let itemCfg = GameCfg.getCfg().Items[self.key];
			let randomRad = Math.random() * Math.PI * 2;
			let randomRadius = Math.floor(itemCfg.spawnRange[0] + Math.random() * (itemCfg.spawnRange[1] - itemCfg.spawnRange[0]));
			let randomScale = itemCfg.scaleRange[0] + Math.random() * (itemCfg.scaleRange[1] - itemCfg.scaleRange[0]);
			let item = ItemMgr.getInstance().spawnItem(ItemDefine.ObCircle, randomRad, randomRadius, randomScale) as ObCircle;
			let randomSpeed = itemCfg.speedRange[0] + Math.random() * (itemCfg.speedRange[1] - itemCfg.speedRange[0]);
			item.init(randomSpeed);
			World.instance.addItem(item.displayObject);
		}
	}
}