module planetJump {
	export class ObTriangle extends LinearMotionPolygon{
		//@override
		protected initVertices(){
			let self = this;   
			self.vertices = [];
			let p0 = self.getChild("p0").asCom;
			let p1 = self.getChild("p1").asCom;
			let p2 = self.getChild("p2").asCom;			
			let p3 = self.getChild("p3").asCom;
			let p4 = self.getChild("p4").asCom;
			self.vertices.push(new g2.Vector2(p0.x, p0.y));
			self.vertices.push(new g2.Vector2(p1.x, p1.y));
			self.vertices.push(new g2.Vector2(p2.x, p2.y));
			self.vertices.push(new g2.Vector2(p3.x, p3.y));
			self.vertices.push(new g2.Vector2(p4.x, p4.y));
		}

		protected collisionEffect(){
			let self = this;
			World.instance.spawnUIAni(CollisionBlackAni, self.x, self.y);
		} 
	}
}