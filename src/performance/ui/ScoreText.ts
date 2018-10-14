module leap {
	export class ScoreText extends fairygui.GComponent{
		//private txtScoreOut:fairygui.GTextField;
		private txtScore:fairygui.GTextField;

		private initY:number;

		constructFromResource(){
            super.constructFromResource();
            let self = this;
			//self.txtScoreOut = self.getChild("txtScoreOut").asTextField;   
			self.txtScore = self.getChild("txtScore").asTextField;         
			self.initY = self.txtScore.y;
        }

		public setScore(score:number){
			let self = this;	
			egret.Tween.removeTweens(self.txtScore);		
			egret.Tween.get(self.txtScore).to({y:self.initY - 30}, 200, egret.Ease.sineOut).call(()=>{
				let text = score > 0 ? "" + score : "";
				self.setText(text);
			})
			.to({y:self.initY}, 200, egret.Ease.sineInOut);
		}

		public setText(text:string){
			let self = this;
			//self.txtScore.text = self.txtScoreOut.text = text;
			self.txtScore.text = text;
		}
	}
}