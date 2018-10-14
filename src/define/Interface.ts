module leap {	
	// 游戏配置结构	 
	export interface IGameCfg{
		WorldRange:number;	// 世界半径
		Gravity:number;
		PlayerRotateSpeed:number;	// 小球正常旋转速度
		BgColors:string[];			// 背景颜色
		Items:any;
		LevelCfg:any;
	}

	// 关卡配置
	export interface ILevelCfg{
		score:number;
		propSpawnMax:number;
		propSpawnInterval:number[];
		propRange:number[];
	}

	// 坐标点
	export interface IPoint{
        x:number;
        y:number;
    }

	export interface IColliderDisplayCfg{
		display:boolean;
		color:number;
		collidedColor:number;
		alpha:number;
		lineSize:number;
	}
}