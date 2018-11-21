module leap {
	/**
	 * 圆形环绕运动轨迹
	 */
	export class RoundMotion{
		/**
		 * 得到运动指定时间后在圆上的坐标
		 */
		public static getPointByTime(time:number, angSpeed:number, r:number, clockwise:boolean = true, center:any = {x:0, y:0}){			
			if(!angSpeed || angSpeed <= 0)
				return center;

			// 运动角度		
			let angle = angSpeed * time;		
			if(angle > 360) angle %= 360;
			let rad = angle / 180 * Math.PI;

			// 已知圆心坐标center，半径r，角度rad，求坐标x,y
			let x = center.x + Math.cos(rad) * r;
			let y = clockwise ? center.y + Math.sin(rad) * r : center.y - Math.sin(rad) * r;
			return {x:x, y:y};
		}

		/**
		 * 得到运动指定时间后在圆上的坐标, 线速度版
		 */
		public static getPointByTime2(time:number, speed:number, r:number, clockwise:boolean = true, center:any = {x:0, y:0}){			
			if(!speed || speed <= 0)
				return center;

			let T = 2 * Math.PI * r;

			// 运动长				
			let s = speed * time;		
			if(s > T) s %= T;
			let rad = s / T * Math.PI * 2;

			// 已知圆心坐标center，半径r，角度rad，求坐标x,y
			let x = center.x + Math.cos(rad) * r;
			let y = clockwise ? center.y + Math.sin(rad) * r : center.y - Math.sin(rad) * r;
			return {x:x, y:y};
		}
	}	
}