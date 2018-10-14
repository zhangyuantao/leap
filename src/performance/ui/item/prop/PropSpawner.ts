module leap {
	/**
	 * 道具生成器
	 */
	export class PropSpawner extends ItemSpawner{	
		private levelUpFlag:boolean = false;

		public constructor(key:string){
			super(key);
			let self = this;

			// 监听升级，更改生成频率
			utils.EventDispatcher.getInstance().addEventListener("levelUp", () => {
				self.levelUpFlag = true;
			}, self);
		}

		public spawn(){
			let self = this;

			// 升级后更新生成频率
			if(self.levelUpFlag){
				self.levelUpFlag = false;
				let lvCfg = GameCfg.getLevelCfg(GameMgr.getInstance().level);
				let spawnInterval = lvCfg.propSpawnInterval[0] + Math.random() * (lvCfg.propSpawnInterval[1] - lvCfg.propSpawnInterval[0]);
				self.spawnInterval = Math.floor(spawnInterval);
			}

			let lvCfg = GameCfg.getLevelCfg(GameMgr.getInstance().level);
			let spawnedNum = ItemMgr.getInstance().getItemSpawnNum(self.key);
			if(spawnedNum >= lvCfg.propSpawnMax)
				return;

			let randomRad = Math.random() * Math.PI * 2;
			let randomRadius = Math.floor(lvCfg.propRange[0] + Math.random() * (lvCfg.propRange[1] - lvCfg.propRange[0]));
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