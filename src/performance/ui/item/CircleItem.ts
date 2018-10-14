module leap {
	/**
	 * 圆形物品
	 */
	export class CircleItem extends Item{
		protected radius:number;
		constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.initRadius();
			self.initCollider(self.radius);
        }
		
		protected initRadius(){	
			let self = this;
			self.radius = 25;
		}	

		//@override		
		public collider:g2.SAT.Circle;

		//@override
		public initCollider(r:number){
			let self = this;
			self.collider = new g2.SAT.Circle(r);
		}

		//@override
		public drawCollider(){
			let self = this;
			let colliderCfg = GameCfg.colliderDisplayCfg;
			if(!colliderCfg.display || !self.collider || !self.colliderGraphics)
				return;
			
			self.colliderGraphics.clear();
			let color = self.isCollided ? colliderCfg.collidedColor : colliderCfg.color;
			self.colliderGraphics.lineStyle(colliderCfg.lineSize, color, colliderCfg.alpha);		
			self.colliderGraphics.drawCircle(0, 0, self.collider.r);
			self.colliderGraphics.endFill();
		}
	}
}