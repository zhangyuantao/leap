module planetJump {
	/**
	 * 物品管理
	 */
	export class ItemMgr{
		private itemClasses:any;
		private spawnItems:Item[];
		private itemNumRecord:any;
		private spwaners:ItemSpawner[];
		private lastCheckPlayerPos:IPoint = <IPoint>{};

		private static instance:ItemMgr;
		public static getInstance():ItemMgr{
			if(!ItemMgr.instance)
				ItemMgr.instance = new ItemMgr();
			return ItemMgr.instance;
		}

		private constructor(){
			let self = this;			
			self.spawnItems = [];	
			self.itemNumRecord = {};	
			self.registerItem();
		}

		public dispose(){
			let self = this;
			self.spawnItems = null;
			self.itemNumRecord = null;
			self.itemClasses = null;
			ItemMgr.instance = null;
			console.log("ItemMgr释放");
		}

		private registerItem(){
			let self = this;
			self.itemClasses = {};
			self.itemClasses[ItemDefine.WhiteBall] = WhiteBall;
			self.itemClasses[ItemDefine.ScoreBall_new] = ScoreBall_new;
			self.itemClasses[ItemDefine.Explode] = Explode;
			self.itemClasses[ItemDefine.ExplodeSpike] = ExplodeSpike;
			self.itemClasses[ItemDefine.MegaJump] = MegaJump;
			self.itemClasses[ItemDefine.Star] = Star;
			self.itemClasses[ItemDefine.Thunderbolt] = Thunderbolt;
			self.itemClasses[ItemDefine.Magnet] = Magnet;
			self.itemClasses[ItemDefine.Plus] = Plus;
			self.itemClasses[ItemDefine.Cut] = Cut;
			self.itemClasses[ItemDefine.ObCircle] = ObCircle;
			self.itemClasses[ItemDefine.ObTriangle] = ObTriangle;
			self.itemClasses[ItemDefine.ObSquare_new] = ObSquare_new;
			self.itemClasses[ItemDefine.ObTube] = ObTube;

			self.spwaners = [];	
			self.spwaners.push(new WhiteBallSpawner());
			self.spwaners.push(new ScoreBallSpawner());
			self.spwaners.push(new ExplodeSpawner());
			self.spwaners.push(new MegaJumpSpawner());
			self.spwaners.push(new StarSpawner());
			self.spwaners.push(new ThunderboltSpawner());
			self.spwaners.push(new PlusSpawner());
			self.spwaners.push(new MagnetSpawner());
			self.spwaners.push(new CutSpawner());
			self.spwaners.push(new ObCircleSpawner());
			self.spwaners.push(new ObTriangleSpawner());
			self.spwaners.push(new ObSquareSpawner());
			self.spwaners.push(new ObTubeSpawner());
		}

		/**
		 * 生成物品
		 * @param 物品类名
		 */
		public spawnItem(itemClassName:any, rad:number, r:number, scale:number = 1):Item{
			let self = this;
			let classFactory = self.itemClasses[itemClassName];
			if(!classFactory) 
				return;
			
			let item = utils.ObjectPool.getInstance().createFairyUIObject(classFactory, "leap") as Item;
			item.touchable = false;

			// 围绕中心点生成	
			let dx = r * Math.cos(rad);
			let dy = r * Math.sin(rad);		
			item.x = (dx + World.instance.spike.x) | 0;
			item.y = (dy + World.instance.spike.y) | 0;

			item.scaleX = item.scaleY = parseFloat(scale.toFixed(1));

			self.spawnItems.push(item);
			
			// 记录生成数量
			self.itemNumRecord[item.key] = (self.itemNumRecord[item.key] || 0) + 1;

			return item;
		}

		/**
		 * 销毁物品
		 */
		public destroyItem(item:Item){
			let self = this;			
			let idx = self.spawnItems.indexOf(item);
			if(idx != -1)
				self.spawnItems.splice(idx, 1);

			// 减去生成数量
			if(self.itemNumRecord[item.key] && self.itemNumRecord[item.key] > 0)
				self.itemNumRecord[item.key] --;

			let parent = item.displayObject.parent;
			if(parent) parent.removeChild(item.displayObject);
			utils.ObjectPool.getInstance().destroyObject(item);			
		}

		// 物品定时生成
		public onUpdate(){
			let self = this;
			self.collisionCheck();	
			self.onSpawnsUpdate();
		}

		/**
		 * 碰撞检测
		 */
		private collisionCheck(){
			let self = this;
			let player = World.instance.player;
			let playerPos = <IPoint>{x:player.x, y:player.y};
			let pCollider = player.collider;
			for(let i = 0; i < self.spawnItems.length; i++){
				let item = self.spawnItems[i];
				if(!item.colliderEnabled)
					continue;
				
				if(item.key == ItemDefine.ExplodeSpike)
					continue;

				// 距离超过多少不检测
				let dx = player.x - item.x;
				let dy = player.y - item.y;
				let d = dx * dx + dy * dy;
				if(d > 10000)
					continue;

				let collided = g2.SAT.checkCollision(pCollider, item.collider);
				player.isCollided = collided;
				item.isCollided = collided;
				if(collided){
					player.onCollisionEnter();
					item.onCollisionEnter(player, self.lastCheckPlayerPos || playerPos);

					if(GameMgr.getInstance().gameOver)
						break;
					
					self.destroyItem(item);
					i--;
				}		
			}
			self.lastCheckPlayerPos = playerPos;
		}

		/**
		 * 子弹碰撞检测
		 */
		public bulletCollisionCheck(bullet:ExplodeSpike){
			let self = this;
			let bCollider = bullet.collider;
		
			for(let i = 0; i < self.spawnItems.length; i++){
				let item = self.spawnItems[i];
				if(!item.colliderEnabled)
					continue;
				
				if(item.key.indexOf("Ob") == -1)
					continue;

				// 距离超过多少不检测
				let dx = bullet.x - item.x;
				let dy = bullet.y - item.y;
				let d = dx * dx + dy * dy;
				if(d > 10000)
					continue;

				let collided = g2.SAT.checkCollision(bCollider, item.collider);
				bullet.isCollided = collided;
				item.isCollided = collided;
				if(collided){
					item.onCollisionEnter(bullet);
					self.destroyItem(item);
					self.destroyItem(bullet);
					break; // 只能触碰一个物体		
				}		
			}
		}

		// 生成器刷新
		private onSpawnsUpdate(){
			let self = this;

			// 引导期间不生成
			if(!GameMgr.getInstance().guideCompleted)
				return;

			for(let i = 0, len = self.spwaners.length; i < len; i++){
				self.spwaners[i].onUpdate();
			}
		}

		// 找到玩家指定范围内的道具
		public findItemsByRange(playerPos:g2.Vector2, range:number, ...findKeys:string[]){
			let self = this;
			let result:Item[] = [];
			for(let i = 0, len = self.spawnItems.length; i < len; i++){
				let item = self.spawnItems[i];
				if(!item.colliderEnabled)
					 continue;
				let sub = g2.Vector2.substract(playerPos, item.position);
				if(sub.length <= range && findKeys.indexOf(item.key) != -1)
					result.push(item);				
			}
			return result;
		}

		// 找到指定物体
		public findItemsByKey(...findKeys:string[]){
			let self = this;
			let result:Item[] = [];
			for(let i = 0, len = self.spawnItems.length; i < len; i++){
				let item = self.spawnItems[i];
				if(!item.colliderEnabled)
					 continue;
				if(findKeys.indexOf(item.key) != -1)
					result.push(item);				
			}
			return result;
		}

		// 获得已生成物品数量
		public getItemSpawnNum(key:string){
			let self = this;
			return self.itemNumRecord[key] || 0;
		}
	}
}