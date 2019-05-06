module planetJump {
	export class PlusEffect extends PropEffect{	
		public init(effKey:string, p:Player){
			super.init(effKey, p);
			let self = this;		
			self.player.addInvincibleTime(self.cfg.invincibleTime);
			MainWindow.instance.textureBg.show();
		}

		// 效果进行叠加
		public added(){
			let self = this;
			super.added();
			MainWindow.instance.textureBg.change();		
		}

		protected onUpdate(){
			let self = this;
			MainWindow.instance.textureBg.setRotation(self.player.rotation);
		}

		// 移除特效
		public onDestroy(){
			super.onDestroy();
			let self = this;	
			if(MainWindow.instance)		
				MainWindow.instance.textureBg.hide();
		}
	}
}