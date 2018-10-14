module leap {
	export class Explode extends Prop{

		// 执行效果
		protected applyEffect(player:Player){
			let self = this;
			super.applyEffect(player);
			let cfg = GameCfg.getCfg().Items[self.key];

			// 生成一圈子弹
			for(let i = 0; i < cfg.bulletNum; i++){
				let rad = i * Math.PI / (cfg.bulletNum / 2);
				let item = ItemMgr.getInstance().spawnItem(ItemDefine.ExplodeSpike, rad, 10, 0.8) as ExplodeSpike;	
				item.rootX = self.x;
				item.rootY = self.y;
				item.init(cfg.bulletSpeed);
				World.instance.addItem(item.displayObject);
			}

			//MySoundMgr.getInstance().playSound("resource/game/leap/sound/WhooshesImpacts_Impact_64_edited.mpt", 1, false, 1);
		}	

		protected collisionEffect(){
			let self = this;

			// 生成一个爆炸特效
			World.instance.spawnUIAni(ExplodeAni, self.x, self.y);
		} 
	}
}