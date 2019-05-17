module planetJump {
	export class LinkLine extends fairygui.GComponent{
		private img:fairygui.GImage;

		public constructFromResource(){
            super.constructFromResource();
            let self = this;
			self.img = self.getChild("n0").asImage; 
        }

		public setColor(c:number){
			let self = this;
			self.img.color = c;
		}
	}
}