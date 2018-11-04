module leap {
	export class AddScoreAni extends fairygui.GComponent implements utils.IGameObject{
		private txt:fairygui.GTextField;

		public constructFromResource(){
            super.constructFromResource();
            let self = this;
			self.txt = self.getChild("txt").asTextField;
        }

		public key:string;

		public onCreate(){
			let self = this;
			//console.log("onCreate:", self.key);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
		}

		public onEnterFrame(deltaTime:number){
		}
		
		public setScore(score:number){
			let self = this;
			self.txt.text = "+" + score;
		}
	}
}