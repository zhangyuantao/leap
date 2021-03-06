module planetJump {
	export class ScoreText extends fairygui.GComponent{
		private txtScore:fairygui.GTextField;

		private initY:number;

		constructFromResource(){
            super.constructFromResource();
            let self = this; 
			self.txtScore = self.getChild("txtScore").asTextField;         
			self.initY = self.txtScore.y;
        }

		public setScore(score:number){
			let self = this;	
			egret.Tween.removeTweens(self.txtScore);		
			egret.Tween.get(self.txtScore).to({y:self.initY - 30}, 150, egret.Ease.sineOut).call(()=>{
				let text = score > 0 ? "" + score : "";
				self.setText(text);
			})
			.to({y:self.initY}, 200, egret.Ease.sineInOut);
		}

		public setText(text:string){
			let self = this;
			self.txtScore.text = text;
		}
	}
}