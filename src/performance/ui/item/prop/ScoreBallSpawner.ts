module leap {
	export class ScoreBallSpawner extends ItemSpawner{
		public spawnInterval:number = 1500;
		
		public constructor(){
			super(ItemDefine.ScoreBall);
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
			let item = ItemMgr.getInstance().spawnItem(self.key, randomRad, randomRadius, randomScale) as WhiteBall;
			let speed = itemCfg.speedRange[0] + Math.random() * (itemCfg.speedRange[1] - itemCfg.speedRange[0]);		
			speed *= Math.random() < 0.5 ? -1 : 1;
			item.init(speed);
			World.instance.addItem(item.displayObject);
		}
	}
}