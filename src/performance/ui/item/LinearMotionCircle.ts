module planetJump {
	export class LinearMotionCircle extends CircleItem{
		public speed: number;
		protected speedX:number = 0;
		protected speedY:number = 0;

		protected onAddToStage(e){
			let self = this;
			super.onAddToStage(e);
			self.setSpeed(self.speed, self.x, self.y);
		}

		// 设置运动速度
		public setSpeed(speed:number, dx:number, dy:number){
			let self = this;
			let angle = Math.atan(dy / dx);
			self.speedX = speed * Math.cos(angle);
			self.speedX *= dx < 0 ? -1 : 1;
			self.speedY = speed * Math.sin(angle);
			self.speedY *= dx < 0 ? -1 : 1;
		}

		public init(speed:number){
			super.init();
			let self = this;
			self.speed = parseFloat(speed.toFixed(2));
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