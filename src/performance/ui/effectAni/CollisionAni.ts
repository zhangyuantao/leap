module leap {
	export class CollisionAni extends fairygui.GComponent implements utils.IGameObject{
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
	}
}