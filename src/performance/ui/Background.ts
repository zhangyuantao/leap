module planetJump{
	export class Background extends egret.Sprite implements utils.IGameObject{
		private static instance:Background = null;
		public static getInstance(){
			return Background.instance || new Background();
		}

		public curColor:number = 0x001733;
		private bgs:egret.Sprite[] = [];
		private curBgIdx:number = 0;	

		//********************* 接口实现 ********************//
		public key:string;		

		public onCreate(){
			let self = this;			
			//console.log("onCreate:", self.key);
			Background.instance = self;
			self.curColor = parseInt(GameCfg.getCfg().BgColors[0]);

			self.once(egret.Event.ADDED_TO_STAGE, self.onAddToStage, self);
			utils.EventDispatcher.getInstance().addEventListener("levelUp", self.onChangeBgColor, self);
			utils.EventDispatcher.getInstance().addEventListener("showPlusEff", self.onChangeBgColor, self);
		}

		public onDestroy(){
			let self = this;
			//console.log("onDestroy:", self.key);
			self.bgs = null;
			Background.instance = null;
			utils.EventDispatcher.getInstance().removeEventListener("levelUp", self.onChangeBgColor, self);
			utils.EventDispatcher.getInstance().removeEventListener("showPlusEff", self.onChangeBgColor, self);
		}

		public onEnterFrame(deltaTime:number){
		}
		//********************* 接口实现结束 ********************//

		protected onAddToStage(e){
			let self = this;
			self.width = self.stage.stageWidth;
			self.height = self.stage.stageHeight;
			let bg1 = new egret.Sprite();
			bg1.width = self.width;
			bg1.height = self.height;
			self.addChild(bg1);
			self.bgs.push(bg1);
			let bg2 = new egret.Sprite();
			bg2.width = self.width;
			bg2.height = self.height;
			self.addChild(bg2);		
			self.bgs.push(bg2);

			self.setStartColor(self.curColor);

			// self.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			// 	self.onChangeBgColor(0)
			// }, self);
		}

		private setStartColor(color:number){
			let self = this;
			let curBg = self.getCurBgSprite();	
			curBg.graphics.clear();
			curBg.graphics.beginFill(color)	;
			curBg.graphics.drawRect(0, 0, curBg.width, curBg.height);
			curBg.graphics.endFill();
		}

		// 改变背景颜色，新颜色层级提到最高渐变出现，当前颜色渐变消失
		public changeColor(color:number){
			let self = this;
			let curBg = self.getCurBgSprite();		
			egret.Tween.get(curBg).to({alpha:0}, 1000, egret.Ease.sineInOut);

			let nxtBg = self.getNextBgSprite();	
			nxtBg.graphics.clear();
			nxtBg.graphics.beginFill(color)	;
			nxtBg.graphics.drawRect(0, 0, nxtBg.width, nxtBg.height);
			nxtBg.graphics.endFill();			
			self.addChildAt(nxtBg, 1);
			egret.Tween.get(nxtBg).set({alpha:0}).to({alpha:1}, 1000, egret.Ease.sineInOut);

			self.curColor = color;
			utils.EventDispatcher.getInstance().dispatchEvent("changeBgColor", color);
		}

		private getCurBgSprite(){
			let self = this;
			return self.bgs[self.curBgIdx] || null;
		}

		private getNextBgSprite(){
			let self = this;
			self.curBgIdx++;
			if(self.curBgIdx > self.bgs.length - 1)
				self.curBgIdx = 0;
			return self.bgs[self.curBgIdx] || null;
		}

		private onChangeBgColor(lv:number){
			let self = this;

			// 升级随机换一种和当前不一样的颜色
			// let colors = GameCfg.getCfg().BgColors;
			// let c = self.curColor;
			// while(self.curColor == c){
			// 	let idx = Math.floor(Math.random() * colors.length);
			// 	c = parseInt(colors[idx]);
			// }
			//let idx = (lv - 1) % colors.length;
			//let color = parseInt(colors[idx]);

			let c = self.getRandomColor16ByHSV([0, 360], [46, 90], [0, 45]);
			self.changeColor(c);
		}

		/**
		 * 随机十六进制颜色随机 HSL模式
		 * H:色相 S:饱和度 L:亮度
		 */
		getRandomColor16ByHSL(hRange:number[] = [0, 1], sRange:number[] = [0, 1], lRange:number[] = [0, 1]){
			let self = this;
			let h = hRange[0] + Math.random() * hRange[1];
			let s = sRange[0] + Math.random() * sRange[1];
			if(s < 50) s = 0;
			let l = lRange[0] + Math.random() * lRange[1];
			let rgb = self.hsl2rgb(h, s, l);
			let hex = "0x";
			for(let i = 0; i < rgb.length; i++){
				let tmp = rgb[i].toString(16);
				if(tmp.length <= 1)
					tmp = "0" + tmp;
				hex += tmp;
			}
			return parseInt(hex);
		}

		/**
		 * 随机十六进制颜色随机 HSB/HSV模式
		 * H:色相 S:饱和度 B/V:明度
		 */
		getRandomColor16ByHSV(hRange:number[] = [0, 360], sRange:number[] = [0, 100], vRange:number[] = [0, 100]){
			let self = this;
			let h = hRange[0] + Math.random() * hRange[1];
			let s = sRange[0] + Math.random() * sRange[1];
			let v = vRange[0] + Math.random() * vRange[1];
			let rgb = self.hsv2rgb(h, s, v);
			let hex = "0x";
			for(let i = 0; i < rgb.length; i++){
				let tmp = rgb[i].toString(16);
				if(tmp.length <= 1)
					tmp = "0" + tmp;
				hex += tmp;
			}
			return parseInt(hex);
		}


		/**
		 * HSV/HSB颜色转RGB
		 * h:[0,360],s:[0,100],v:[0,100]
		 * 返回的 r, g, 和 b 在 [0, 255]之间
		 */
		hsv2rgb(h, s, v) {
		　　s = s / 100;
		　　v = v / 100;
		　　let h1 = Math.floor(h / 60) % 6;
		　　let f = h / 60 - h1;
		　　let p = v * (1 - s);
		　　let q = v * (1 - f * s);
		　　let t = v * (1 - (1 - f) * s);
		　　let r, g, b;
		　　switch (h1) {
		　　　　case 0:
		　　　　　　r = v;
		　　　　　　g = t;
		　　　　　　b = p;
		　　　　　　break;
		　　　　case 1:
		　　　　　　r = q;
		　　　　　　g = v;
		　　　　　　b = p;
		　　　　　　break;
		　　　　case 2:
		　　　　　　r = p;
		　　　　　　g = v;
		　　　　　　b = t;
		　　　　　　break;
		　　　　case 3:
		　　　　　　r = p;
		　　　　　　g = q;
		　　　　　　b = v;
		　　　　　　break;
		　　　　case 4:
		　　　　　　r = t;
		　　　　　　g = p;
		　　　　　　b = v;
		　　　　　　break;
		　　　　case 5:
		　　　　　　r = v;
		　　　　　　g = p;
		　　　　　　b = q;
		　　　　　　break;
		　　}
		　　return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		}

		/**
		 * HSL颜色值转换为RGB. 
		 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
		 * h, s, 和 l 设定在 [0, 1] 之间
		 * 返回的 r, g, 和 b 在 [0, 255]之间
		 * @param   Number  h       色相
		 * @param   Number  s       饱和度
		 * @param   Number  l       亮度
		 * @return  Array           RGB色值数值
		 */
		hsl2rgb(h, s, l){
			let r, g, b;

			if(s == 0){
				r = g = b = l; // achromatic
			}
			else{
				let hue2rgb = (p, q, t) => {
					if(t < 0) t += 1;
					if(t > 1) t -= 1;
					if(t < 1/6) return p + (q - p) * 6 * t;
					if(t < 1/2) return q;
					if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
					return p;
				}

				let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				let p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}

			return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		}
	}
}