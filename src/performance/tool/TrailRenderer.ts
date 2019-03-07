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
	public trailScale:number = 1;					// 拖尾缩放
	public initTrailScale:number = 1;
	private alphaFrom:number;						// 起始透明度
	private alphaTo:number;							// 结束透明度

	/** 运行时变量 */
	private inited:boolean;							// 是否初始化
	private target:any;								// 需要拖尾的目标
	private trailItemCache:any[];					// 拖尾图形缓存
	private lastTargetPos:any;						// 上一帧目标位置

	public constructor(){
		super();
		let self = this;
		self.trailItemCache = [];
		self.once(egret.Event.ADDED_TO_STAGE, self.onAdded, self);
		self.once(egret.Event.REMOVED_FROM_STAGE, self.onRemoved, self);
	}

	private onAdded(e){
		let self = this;
		self.target = self.parent;
		self.addEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
	}

	private onRemoved(e){
		let self = this;
		egret.Tween.removeTweens(self);
		self.trailItemCache = null;
		self.removeEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
	}

	private onEnterFrame(e){
		let self = this;
		if(self.inited && self.parent)
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
	public init(life:number = 500, alphaFrom:number = 1, alphaTo:number = 0,  density:number = 0, initScale:number = 0){
		let self = this;
		self.trailDensity = density;
		self.trailLife = life;
		self.trailScale = initScale;
		self.initTrailScale = initScale;
		self.alphaFrom = alphaFrom;
		self.alphaTo = alphaTo;
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

		if(Math.abs(dx) < 1 && Math.abs(dy) < 1) 
			return;

		let dis = Math.sqrt(dx * dx + dy * dy);
		let angle = Math.acos(dx / dis);
		let density = self.trailDensity || dis;

		// 该帧到上帧的位置平均插入density个拖尾图形
		for(let i = 0; i < density; i ++){
			let disTemp = dis / density * i;
			let xTemp = disTemp * Math.cos(angle);
			let yTemp = disTemp * Math.sin(angle);
			yTemp *= dy < 0 ? -1 : 1; // 象限问题处理
			let x = parseFloat((self.target.x - xTemp).toFixed(1));
			let y = parseFloat((self.target.y - yTemp).toFixed(1));
			let sh = self.drawTrailItem(x, y);

			// 平滑处理：该帧所有图形做大小渐变
			let frameTime = 33;	// 一帧33ms，根据帧率调整
			let initScale = 1 - frameTime / self.trailLife / density * i;	
			initScale *= self.trailScale;
			initScale = parseFloat(initScale.toFixed(2));

			egret.Tween.get(sh).set({scaleX:initScale, scaleY:initScale})
			.to({alpha:self.alphaTo, scaleX:0, scaleY:0}, self.trailLife, egret.Ease.sineInOut)
			.call(() => {
				self.cacheItem(sh);
			});
		}	
	}

	// 画拖尾图形
	private drawTrailItem(x:number, y:number){
		let self = this;
		let item = self.getCacheItem();
		if(!item){
			item = self.createTrailItem();
			item.alpha = self.alphaFrom;
			self.target.parent.addChildAt(item.displayObject ? item.displayObject : item, 0);
		}
		item.x = x;
		item.y = y;
		return item;
	}

	/**
	 * new一个拖尾图形
	 */
	public createTrailItem():any{
		let self = this;

		// 由外部重写决定创建什么拖尾图形对象
		// 默认画个圆，该方式一个圆产生一个drawCall，慎重控制拖尾生命和密度		
		let sh = new egret.Shape();
		sh.graphics.beginFill(0xffffff);
		sh.graphics.drawCircle(0, 0, 15);
		sh.graphics.endFill();

		return sh;
	}

	private getCacheItem(){
		let self = this;
		let sh = self.trailItemCache.pop() || null;
		if(sh) sh.visible = true;
		return sh;
	}

	// 缓存拖尾对象
	private cacheItem(item:any){
		let self = this;
		item.visible = false;
		item.alpha = self.alphaFrom;
		item.scaleX = self.trailScale;
		item.scaleY = self.trailScale;
		if(self.trailItemCache)
			self.trailItemCache.push(item);
	}
}