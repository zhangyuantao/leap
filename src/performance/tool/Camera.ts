/**
 * 伪2D摄像机
 * 实现目标跟随目标移动和“世界”缩放，同时控制目标在活动半径内（以屏幕中心为原点）
 */
class Camera {
	private readonly worldRadius:number = 4000; 	// 世界半径
	private readonly worldMinScale:number = 0.3; 	// 世界最小缩放系数

	private worldRoot:any;					// 世界节点
	private stageWidth:number;				// 舞台宽
	private stageHeight:number;				// 舞台高
	private screenCenter:any = {};			// 屏幕中心坐标
	private target:any;						// 跟随目标
	private targetMoveRadius:number; 		// 目标活动半径

	/**
	 * @param worldRoot 世界节点,总的容器
	 * @param stageWidth 舞台宽
	 * @param stageHeight 舞台高
	 */
	public constructor(worldRoot:any, stageWidth:number, stageHeight:number){
		let self = this;
		self.worldRoot = worldRoot;
		self.stageWidth = stageWidth;
		self.stageHeight = stageHeight;
		self.screenCenter.x = self.stageWidth * 0.5;
		self.screenCenter.y = self.stageHeight * 0.5;
	}

	/**
	 * 摄像机跟随目标
	 * @param target 目标
	 * @param disToBound 目标距离屏幕边界的最小距离（距离屏幕较长边的最小距离）
	 */
	public follow(target:any, disToBound:number = 150){
		let self = this;
		self.target = target;
		self.targetMoveRadius = self.stageWidth / 2 - disToBound;	// 以舞台宽度720，disToBound=150为例，活动半径就是210
	}

	/**
	 * 每帧更新摄像机
	 */
	public onUpdate(){
		let self = this;
		self.followTarget();
	}

	// 跟随目标
	private followTarget(){
		let self = this;
		if(!self.target)
			return;

		// 目标距离世界中心距离
		let disToCenter = Math.sqrt(Math.pow(self.target.x, 2) + Math.pow(self.target.y, 2));

		// 根据目标距离圆心的距离来缩放“世界”
		let toScale = 1 - disToCenter / self.worldRadius;
		toScale = Math.max(toScale, self.worldMinScale);		
		self.worldRoot.scaleX = toScale;
		self.worldRoot.scaleY = toScale;

		// worldOffsetX worldOffsetY 控制目标在一个屏幕半径范围内活动
		let angle = Math.atan(self.target.y / self.target.x);
		let cos = Math.cos(angle);
		let sin = Math.sin(angle);	
		cos *= self.target.x < 0 ? -1 : 1; 	// 象限问题处理		 	
		sin *= self.target.x < 0 ? -1 : 1;
		
		let worldOffsetX = self.targetMoveRadius * cos;
		let worldOffsetY = self.targetMoveRadius * sin;

		// 根据距离圆心距离控制活动半径（该段代码作用：当目标越靠近世界中心时世界中心越接近屏幕中央）
		let temp = Math.min(disToCenter / self.targetMoveRadius, 1);
		worldOffsetX *= temp;
		worldOffsetY *= temp;		

		// 根据缩放关系得（该段代码作用：使得世界缩放的同时仍保证目标在一个屏幕半径范围内活动，即距离屏幕边界最小距离不变）
		let temp2 = disToCenter * (1 - toScale);
		worldOffsetX += temp2 * cos;
		worldOffsetY += temp2 * sin;

		// 世界位置==目标相对屏幕中心的坐标取反 + 偏移
		self.worldRoot.x = (-self.target.x + self.screenCenter.x) + worldOffsetX;
		self.worldRoot.y = (-self.target.y + self.screenCenter.y) + worldOffsetY;		
	}
}