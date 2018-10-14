module leap {
	/**
	 * 多边形物品
	 */
	export class PolygonItem extends Item{
		protected vertices:g2.Vector2[];
		constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.initVertices();
			self.initCollider(self.vertices);
        }

		protected initVertices(){
		}

		//@override
		public collider:g2.SAT.Polygon;
		
		//@override
		public initCollider(vertices:g2.Vector2[]){
			let self = this;
			self.collider = new g2.SAT.Polygon(vertices);
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
			
			// 连线成矩形
			let vertices = self.collider.originVertices;
			self.colliderGraphics.moveTo(vertices[0].x, vertices[0].y);
			for(let i = 1, len = vertices.length; i < len; i++){
				let v = vertices[i];			
				self.colliderGraphics.lineTo(v.x, v.y);
			}			
			self.colliderGraphics.lineTo(vertices[0].x, vertices[0].y);

			self.colliderGraphics.endFill();
		}
	}
}