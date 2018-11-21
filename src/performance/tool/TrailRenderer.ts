/**
 * 模拟拖尾效果
 * 实现原理：每帧在目标移动的路径上生成一定密度圆形，图形scale与alpha渐变小即可模拟达到拖尾效果
 * 使用方法：new一个当前实例 => 执行init方法 => addChild到目标身上
 * Created by 张元涛 2018.8.16
 */
class TrailRenderer extends egret.DisplayObject{
	/** 配置项 */
	public trailDensity:number;						// 拖尾密度，每帧直接画拖尾图形的个数，为0或不指定则默认为一个像素间隔画一个拖尾图片，即最密集
	public trailLife:number;						// 持续时间
	public trailScale:number = 1;					// 缩放系数
	private trailWidth:number;						// 拖尾宽度，默认等于目标宽度
	private trailColors:number[];					// 颜色数组，按数组循环使用颜色
	//private trailEase:Function;						// 拖尾缓动
	private alphaFrom:number;						// 起始透明度
	private alphaTo:number;							// 结束透明度

	/** 运行时变量 */
	private inited:boolean;							// 是否初始化
	private target:any;								// 需要拖尾的目标
	private trailShapeCache:egret.Shape[];			// 拖尾图形缓存
	private curColorIdx:number = 0;					// 当前拖尾图形颜色索引
	private lastTargetPos:any;						// 上一帧目标位置

	public constructor(){
		super();
		let self = this;
		self.trailShapeCache = [];
		self.once(egret.Event.ADDED_TO_STAGE, self.onAdded, self);
		self.once(egret.Event.REMOVED_FROM_STAGE, self.onRemoved, self);
	}

	private onAdded(e){
		let self = this;
		self.target = self.parent;
		self.trailWidth = self.trailWidth || self.target.width;
		self.addEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
	}

	private onRemoved(e){
		let self = this;
		egret.Tween.removeTweens(self);
		self.trailShapeCache = null;
		self.removeEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
	}

	private onEnterFrame(e){
		let self = this;
		if(self.parent)
			self.drawTrail();
	}

	/**
	 * 拖尾参数初始化
	 * @param life 拖尾持续时间
	 * @param alphaFrom 初始透明度
	 * @param alphaTo 结束透明度
	 * @param density 拖尾密度，根据目标运动速度动态调整，默认一个像素绘制一个图形，即density==0时拖尾最密
	 * @param width 拖尾宽度，默认等于目标宽度
	 * @param colors 颜色数组，按数组循环使用颜色
	 * @param ease 拖尾缓动函数 使用效果不是很明显，默认即可
	 */
	public init(life:number = 500, alphaFrom:number = 1, alphaTo:number = 0,  density:number = 0, width:number = 0, colors:number[] = [0xFFFFFF]/*, ease:Function = egret.Ease.sineInOut*/){
		let self = this;
		self.trailDensity = density;
		self.trailLife = life;
		self.trailColors = colors;
		self.trailWidth = width;
		//self.trailEase = ease;
		self.alphaFrom = alphaFrom;
		self.alphaTo = alphaTo;		
		self.curColorIdx = 0;
		self.inited = true;
	}

	private drawTrail(){
		let self = this;
		if(!self.lastTargetPos){
			self.lastTargetPos = {};
			self.lastTargetPos.x = self.target.x;
			self.lastTargetPos.y = self.target.y;
		}		

		let dx = self.target.x - self.lastTargetPos.x;
		let dy = self.target.y - self.lastTargetPos.y;

		self.lastTargetPos.x = self.target.x;
		self.lastTargetPos.y = self.target.y;	

		if(Math.abs(dx) < 2 && Math.abs(dy) < 2) 
			return;

		let dis = Math.sqrt(dx * dx + dy * dy);
		let angle = Math.acos(dx / dis);
		let color = self.getCurColor();
		let density = self.trailDensity || dis;

		// 该帧到上帧的位置平均插入density个拖尾图形
		for(let i = 0; i < density; i ++){
			let disTemp = dis / density * i;
			let xTemp = disTemp * Math.cos(angle);
			let yTemp = disTemp * Math.sin(angle);
			yTemp *= dy < 0 ? -1 : 1; 				// 象限问题处理
			let x = self.target.x - xTemp;
			let y = self.target.y - yTemp;
			let sh = self.drawTrailShape(x, y, color);

			// 平滑处理：该帧所有图形做大小渐变
			let frameTime = 33;	// 一帧33ms，根据帧率调整
			let initScale = 1 - frameTime / self.trailLife / density * i;	
			initScale *= self.trailScale;

			egret.Tween.get(sh).set({scaleX:initScale, scaleY:initScale})
			.to({alpha:self.alphaTo, scaleX:0, scaleY:0}, self.trailLife/*, self.trailEase*/)
			.call(() => {
				self.cacheShape(sh);
			});
		}	
	}

	// 添加拖尾图片，注意要跟目标平级
	private addTrailShape(sh:egret.Shape){
		let self = this;
		if(!sh.parent)
			self.target.parent.addChildAt(sh, 0);
	}

	// 画拖尾图形
	private drawTrailShape(x:number, y:number, color:number){
		let self = this;
		let sh = self.getCacheShape();
		if(!sh){
			sh =  new egret.Shape();
			sh.graphics.beginFill(color, self.alphaFrom);
			sh.graphics.drawCircle(0, 0, self.trailWidth * 0.5);
			sh.graphics.endFill();
			self.addTrailShape(sh);
		}
		sh.x = x;
		sh.y = y;
		return sh;
	}

	// 循环获取颜色
	private getCurColor(){
		let self = this;
		let c = self.trailColors[self.curColorIdx++];
		if(self.curColorIdx > self.trailColors.length - 1)
			self.curColorIdx = 0;
		return c;
	}

	private getCacheShape(){
		let self = this;
		let sh = self.trailShapeCache.pop() || null;
		if(sh) sh.visible = true;
		return sh;
	}

	// 缓存图形
	private cacheShape(sh:egret.Shape){
		let self = this;
		sh.visible = false;
		sh.alpha = 1;
		sh.scaleX = 1;
		sh.scaleY = 1;
		if(self.trailShapeCache)
			self.trailShapeCache.push(sh);
	}
}