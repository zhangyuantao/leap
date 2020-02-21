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
			utils.EventDispatcher.getInstance().addEventListener("changeBgColor", self.onChangLight, self);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
			utils.EventDispatcher.getInstance().removeEventListener("newRound", self.onNewRound, self);
			utils.EventDispatcher.getInstance().removeEventListener("changeBgColor", self.onChangLight, self);
		}

		public onEnterFrame(deltaTime:number){
			let self = this;
			self.blackHole.rotation++;
			if(self.blackHole.rotation > 180)
				self.blackHole.rotation -= 360;
		}
		//********************* 接口实现结束 ********************//

		private blackHole:fairygui.GComponent;
		private lightImg:fairygui.GImage;
		private multiNum:fairygui.GTextField;

		constructFromResource(){
            super.constructFromResource();
            let self = this;         
			self.blackHole = self.getChild("blackHole").asCom;
			self.lightImg = self.blackHole.getChild("lightImg").asImage;
			self.lightImg.color = parseInt(GameCfg.getCfg().BgColors[0]);
			self.multiNum = self.getChild("multiNum").asTextField;
        }

		private onNewRound(rounds){
			let self = this;		
			self.multiNum.text = "x" + rounds;
		}

		private onChangLight(color:number){
			let self = this;
			self.lightImg.color = color;
		}
	}
}