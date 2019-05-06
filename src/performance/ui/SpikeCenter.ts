module planetJump {
	/**
	 * 世界中心齿轮状物体
	 */
	export class SpikeCenter extends fairygui.GComponent implements utils.IGameObject{
		//********************* 接口实现 ********************//
		public key:string;

		public onCreate(){
			let self = this;
			//console.log("onCreate:", self.key);
			utils.EventDispatcher.getInstance().addEventListener("newRound", self.onNewRound, self);
			utils.EventDispatcher.getInstance().addEventListener("spawnSpike", self.onSpawnSpike, self);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
			utils.EventDispatcher.getInstance().removeEventListener("newRound", self.onNewRound, self);
			utils.EventDispatcher.getInstance().removeEventListener("spawnSpike", self.onSpawnSpike, self);
		}

		public onEnterFrame(deltaTime:number){
			let self = this;
			self.rotate.rotation++;
			if(self.rotate.rotation > 180)
				self.rotate.rotation -= 360;
		}
		//********************* 接口实现结束 ********************//

		private rotate:fairygui.GObject;
		private multiNum:fairygui.GTextField;
		private t0:fairygui.Transition;

		constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.rotate = self.getChild("n0");
			self.multiNum = self.getChild("multiNum").asTextField;
			self.t0 = self.getTransition("t0");
        }

		private onNewRound(rounds){
			let self = this;		
			self.multiNum.text = "x" + rounds;
		}

		public onSpawnSpike(){
			let self = this;
			self.t0.play(null, self, null, 3);
		}
	}
}