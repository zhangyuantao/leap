module leap {
	export class GameCfg {
		public static readonly frameTime:number = 33;
		public static readonly colliderDisplayCfg = <IColliderDisplayCfg>{
			display:false,
			color:0x00FF00,
			collidedColor:0xFF0000,
			alpha:1,
			lineSize:2
		};

		public static cfg:IGameCfg = null;

		public static getCfg():IGameCfg{
			if(!GameCfg.cfg)			
				GameCfg.cfg = RES.getRes('leapConfig_json');
			return GameCfg.cfg;
		}

		public static getLevelCfg(lv:number):ILevelCfg{
			if(lv > 8) lv = 8;
			return GameCfg.getCfg().LevelCfg[lv];
		}
	}
}