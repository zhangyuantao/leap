module leap {
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
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
			utils.EventDispatcher.getInstance().removeEventListener("newRound", self.onNewRound, self);
		}

		public onEnterFrame(deltaTime:number){
			let self = this;
			self.rotate.rotation++;
			if(self.rotate.rotation > 180)
				self.rotate.rotation -= 360;
		}
		//********************* 接口实现结束 ********************//

		private rotate:fairygui.GImage;
		private multiNum:fairygui.GTextField;

		constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.rotate = self.getChild("n0").asImage;
			self.multiNum = self.getChild("multiNum").asTextField;
        }

		private onNewRound(rounds){
			let self = this;		
			self.multiNum.text = "x" + rounds;
		}
	}
}