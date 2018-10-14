module leap {
	/**
	 * 物品生成器
	 */
	export class ItemSpawner implements ISpawner{
		public spawnInterval:number = 1000;
		public timer:number = 0;
		public key:string;
		
		public constructor(key:string){
			this.key = key;
		}

		public onUpdate() {
			let self = this;
			self.timer += 33;
			if(self.timer > self.spawnInterval){
				self.spawn();
				self.timer = 0;
			}
		}

		public spawn(){
			let self = this;
			let lvCfg = GameCfg.getLevelCfg(GameMgr.getInstance().level);
			let randomRad = Math.random() * Math.PI * 2;
			let randomRadius = lvCfg.propRange[0] + Math.random() * lvCfg.propRange[1];
			let item = ItemMgr.getInstance().spawnItem(self.key, randomRad, randomRadius, Prop.scaleUnit);		
			World.instance.addItem(item.displayObject);
		}
	}

	export interface ISpawner{
		timer:number;
		spawnInterval:number;
		onUpdate();
		spawn();
	}
}