module leap {
	export class ExplodeSpike extends LinearMotionPolygon{
		public rootX:number;
		public rootY:number;

		//@override
		protected onAddToStage(e){
			let self = this;
			super.onAddToStage(e);
			self.x += self.rootX;	
			self.y += self.rootY;
			
			let angle = Math.atan((self.y - self.rootY) / (self.x - self.rootX));
			self.speedX = self.speed * Math.cos(angle);
			self.speedX *= (self.x - self.rootX) < 0 ? -1 : 1;
			self.speedY = self.speed * Math.sin(angle);
			self.speedY *= (self.x - self.rootX) < 0 ? -1 : 1;

			self.rotation = self.getAngle() - 270;
			self.collider.rotation = self.rotation;
		}

		//@override
		public getAngle(){
			let self = this;
			let dx = self.x - self.rootX;
			let dy = self.y - self.rootY;
			let rad = Math.atan(dy / dx);
			let angle = rad / Math.PI  * 180;
			if(angle < 0) {
				angle += dy > 0 ? 180 : 360;				
			}
			else{
				if(dy < 0 || dx < 0)
					angle += 180;
			}
			
			return angle;
		}

		//@override
		protected initVertices(){
			let self = this;   			
			let p0 = self.getChild("p0").asCom;
			let p1 = self.getChild("p1").asCom;
			let p2 = self.getChild("p2").asCom;			
			let p3 = self.getChild("p3").asCom;	
			let p4 = self.getChild("p4").asCom;	
			self.vertices = [];
			self.vertices.push(new g2.Vector2(p0.x, p0.y));
			self.vertices.push(new g2.Vector2(p1.x, p1.y));
			self.vertices.push(new g2.Vector2(p2.x, p2.y));
			self.vertices.push(new g2.Vector2(p3.x, p3.y));
			self.vertices.push(new g2.Vector2(p4.x, p4.y));			
		}

		//@override
		public updateTransform(){
			let self = this;
			if(!self.collider)
				return;
				
			self.collider.x = self.x;
			self.collider.y = self.y;
		}

		protected onMove(deltaTime:number){
			super.onMove(deltaTime);
			ItemMgr.getInstance().bulletCollisionCheck(this);
		}
	}
}