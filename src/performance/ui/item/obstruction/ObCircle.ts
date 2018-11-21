module leap {
	export class ObCircle extends CircleMotionCircle{
		public init(rotateSpeed:number){
			let self = this;
			super.init(rotateSpeed);		
			self.initCollider(50);
		}
	}
}