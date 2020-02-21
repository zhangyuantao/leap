module planetJump {
	export class RecommandBtn extends fairygui.GButton{
		private curAdLogo:egret.Bitmap;
		private adData:any;

		constructFromResource(){
			super.constructFromResource();
			let self = this;
			self.wladGetAds();
			self.addClickListener(self.onClick, self);
		}

		dispose(){
			super.dispose();
			let self = this;
			self.removeClickListener(self.onClick, self);
		}

		private wladGetAds(){
			let self = this;
			if(self.curAdLogo)
				self.displayListContainer.removeChild(self.curAdLogo);
		
			/*platform.wladGetAds(1, (info) => {
				let data = info.data[0];	
				self.adData = data;
				RES.getResByUrl(data.logo, (res) => {
					let tex = res as egret.Texture;
					self.curAdLogo = new egret.Bitmap(tex);
					self.curAdLogo.touchEnabled = true;
					self.curAdLogo.width = 86;
					self.curAdLogo.height = 86;
					self.curAdLogo.x = 6;
					self.curAdLogo.y = 6;
					self.displayListContainer.addChildAt(self.curAdLogo, 2);
				}, self);				
			});*/
		}

	  	public onClick(e){
			let self = this;
			if(!self.adData)
				return;
			tt.previewImage({current:self.adData.img, urls: [self.adData.img], success:null, fail:res => {
				console.log("预览广告图加载失败:", res);
			}, complete:null});

			self.wladGetAds(); // 刷新
		}
	}
}