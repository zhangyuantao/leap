module planetJump {
	export class RecommandBtn extends fairygui.GButton{
		private curAdLogo:egret.Bitmap;
		private adData:any;

		constructFromResource(){
			super.constructFromResource();
			let self = this;
			self.addClickListener(self.onClick, self);
		}

		dispose(){
			super.dispose();
			let self = this;
			self.removeClickListener(self.onClick, self);
		}

	  	public onClick(e){
			let self = this;
			if(!self.adData)
				return;
			tt.previewImage({current:self.adData.img, urls: [self.adData.img], success:null, fail:res => {
				console.log("预览广告图加载失败:", res);
			}, complete:null});
		}
	}
}