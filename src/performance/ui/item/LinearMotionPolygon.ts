module planetJump {
	export class LinearMotionPolygon extends PolygonItem{
		protected speed:number = 0;
		protected speedX:number = 0;
		protected speedY:number = 0;		

		protected onAddToStage(e){
			let self = this;
			super.onAddToStage(e);		
			
			let angle = Math.atan(self.y / self.x);
			self.speedX = self.speed * Math.cos(angle);
			self.speedX *= self.x < 0 ? -1 : 1;
			self.speedX = parseFloat(self.speedX.toFixed(1));

			self.speedY = self.speed * Math.sin(angle);
			self.speedY *= self.x < 0 ? -1 : 1;
			self.speedY = parseFloat(self.speedY.toFixed(1));
		}

		public init(speed:number){
			let self = this;
			self.speed = speed;
		}

		protected onMove(deltaTime:number){
			let self = this;
			super.onMove(deltaTime);
			let newX = self.x + self.speedX;
			let newY = self.y + self.speedY;
			self.x = parseFloat(newX.toFixed(1));
			self.y = parseFloat(newY.toFixed(1));
		}		
	}
}