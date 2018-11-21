module leap {
	export class ObTubeSpawner extends ItemSpawner{
		public constructor(){
			super(ItemDefine.ObTube);
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
			let item = ItemMgr.getInstance().spawnItem(ItemDefine.ObTube, randomRad, randomRadius, randomScale) as ObTube;
			let randomSpeed = itemCfg.speedRange[0] + Math.random() * (itemCfg.speedRange[1] - itemCfg.speedRange[0]);
			item.init(randomSpeed);
			World.instance.addItem(item.displayObject);
		}
	}
}