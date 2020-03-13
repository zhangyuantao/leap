module planetJump {
	export class ObTube extends CircleMotionSquare{		
		private selfRotateSpeed:number; // 自转速度
		private c1:fairygui.Controller;

		public constructFromResource(){
			super.constructFromResource();
			let self = this;
			self.c1 = self.getController("c1");
			let idx = (self.c1.pageCount * Math.random()) | 0;
			self.c1.setSelectedIndex(idx);		
		}

		public init(rotateSpeed:number){
			super.init(rotateSpeed);
			let self = this;
			let tmp = self.cfg.selfRotateSpeedRange[0] + Math.random() * (self.cfg.selfRotateSpeedRange[1] - self.cfg.selfRotateSpeedRange[0]);
			self.selfRotateSpeed = parseFloat(tmp.toFixed(1));
		}

		//@override
		protected initVertices(){
			let self = this;   
			self.vertices = [];
			let p0 = self.getChild("p0").asCom;
			let p1 = self.getChild("p1").asCom;
			let p2 = self.getChild("p2").asCom;			
			let p3 = self.getChild("p3").asCom;
			self.vertices.push(new g2.Vector2(p0.x, p0.y));
			self.vertices.push(new g2.Vector2(p1.x, p1.y));
			self.vertices.push(new g2.Vector2(p2.x, p2.y));
			self.vertices.push(new g2.Vector2(p3.x, p3.y));
		}

		//@override
		public updateTransform(){
			let self = this;
			if(!self.collider)
				return;

			self.collider.x = self.x;
			self.collider.y = self.y;
			self.collider.scaleX = self.scaleX;
			self.collider.scaleY = self.scaleY;
			self.rotation += self.selfRotateSpeed;
			self.collider.rotation = self.rotation;
		}

		//@override
		// protected applyEffect(player:Player, lastCheckPlayerPos:IPoint){
		// 	let self = this;
		// 	let d1 = 0, d2 = 0

		// 	if(!player.isInvincible){
		// 		let p0 = self.vertices[0];
		// 		let p3 = self.vertices[3];
		// 		let playerGlobal = player.displayObject.parent.localToGlobal(player.x, player.y);
		// 		let local = self.globalToLocal(playerGlobal.x, playerGlobal.y);
		// 		let pPlayer = new g2.Vector2(local.x, local.y);
		// 		d1 = g2.Vector2.distance(p0, pPlayer);
		// 		d2 = g2.Vector2.distance(p3, pPlayer);
		// 	}

		// 	if(!player.isInvincible && d1 < d2){
		// 		player.dead();
		// 	}
		// 	else{
		// 		self.addScore();
		// 		utils.Singleton.get(utils.SoundMgr).playSound("black_explosion_mp3");
		// 	}
		// }
	}
}