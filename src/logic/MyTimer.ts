module leap {
	export class MyTimer implements utils.IGameObject{
		private gameRunTime:number = 0;	// 游戏运行时间
		private timers:ITimer[];

		public startTimer(timeout:number, cb:Function, thisObj:any){
			let self = this;
			let t = <ITimer>{};
			t.endTime = self.gameRunTime + timeout;
			t.callBack = cb;
			t.thisObj = thisObj;
			self.timers.push(t);
		}

		//********************* 接口实现 ********************//	

		public key:string;

		public onCreate(){
			let self = this;
			self.timers = [];
			//console.log("onCreate:", self.key);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
		}

		public onEnterFrame(deltaTime:number){
			let self = this;
			self.gameRunTime += GameCfg.frameTime;
			for(let i = 0; i < self.timers.length; i++){
				let t = self.timers[i];
				if(t.endTime <= self.gameRunTime){
					t.callBack.call(t.thisObj);
					self.timers.splice(i--, 1);
				}
			}
		}
	}

	export interface ITimer{		
		endTime:number
		thisObj:any;
		callBack:Function;		
	}
}