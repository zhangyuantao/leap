module planetJump {
	// 该效果使线具有切割功能
	export class CutEffect extends PropEffect{
		private lastPos:g2.Vector2;

		public init(effKey:string, p:Player){
			super.init(effKey, p);
			let self = this;
			self.lastPos = p.position;

			p.addInvincibleTime(self.cfg.invincibleTime);

			World.instance.linkLine.setColor();
		}

		// 移除特效
		public onDestroy(){
			super.onDestroy();
			let self = this;

			// 玩家连线恢复样式
			World.instance && World.instance.linkLine.resetColor();
		}

		protected onUpdate(){
			let self = this;
			// 查找所有陨石
			let obs = ItemMgr.getInstance().findItemsByKey(ItemDefine.ObCircle, ItemDefine.ObSquare, ItemDefine.ObTriangle);

			for(let i = 0, len = obs.length; i < len; i++){
				let tmp = obs[i];
				// 线是否和陨石所在圆碰撞
				let r = Math.floor(Math.min(tmp.img.width, tmp.img.height) * 0.5);
				let hit = self.lineCircleHitTest({x:0, y:0}, {x:self.player.x, y:self.player.y}, {x:tmp.x, y:tmp.y}, r);

				if(!hit){
					// 是否落在上一真到当前的三角形区域
					hit = self.pointInTriangle(tmp.x, tmp.y, 0, 0, self.player.x, self.player.y, self.lastPos.x, self.lastPos.y);					
				}

				if(hit){
					tmp.onCollisionEnter(self.player);
					ItemMgr.getInstance().destroyItem(tmp);
				}
			}

			self.lastPos = self.player.position;
		}

		/**
         * 线段和圆碰撞检测
         */
        private lineCircleHitTest(linePoint1:IPoint, linePoint2:IPoint, circlePoint:IPoint, radius:number){            
            let dx1 = linePoint1.x - circlePoint.x;
            let dy1 = linePoint1.y - circlePoint.y;
            let len1Power2 = Math.floor(dx1 * dx1 + dy1 * dy1);

            let dx2 = linePoint2.x - circlePoint.x;
            let dy2 = linePoint2.y - circlePoint.y;
            let len2Power2 = Math.floor(dx2 * dx2 + dy2 * dy2);

            let radiusPower2 = radius * radius;
            
            // 有一点在圆内则相交
            if(len1Power2 < radiusPower2 || len2Power2 < radiusPower2)
                return true;
            
            // 两点在圆外：判断圆心到直线的垂直距离小于半径 && 投影到线段上的点在线段内
            let dis = this.disPointToLine(circlePoint, linePoint1, linePoint2);
            if(dis < radius){
                let dxLine = linePoint1.x - linePoint2.x;
                let dyLine = linePoint1.y - linePoint2.y;
                let lenPower2 = Math.floor(dxLine * dxLine + dyLine * dyLine); // 线段距离平方
                let maxLen = Math.max(len1Power2, len2Power2);
                if(lenPower2 > maxLen - dis * dis)
                    return true;
            }

            return false;
        }

        /**
         * 点到直线距离公式
         */
        private disPointToLine(p:IPoint, linePoint1:IPoint, linePoint2:IPoint){
            let a = linePoint2.y - linePoint1.y;
            let b = linePoint1.x - linePoint2.x;
            let c = linePoint2.x * linePoint1.y - linePoint1.x * linePoint2.y;
            let d = Math.abs(a * p.x + b * p.y + c) / Math.sqrt(a *a + b * b);
            return Math.floor(d);
        }


		private pointInTriangle(x0, y0, x1, y1, x2, y2, x3, y3) {
			var divisor = (y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3);
			var a = ((y2 - y3)*(x0 - x3) + (x3 - x2)*(y0 - y3)) / divisor;
			var b = ((y3 - y1)*(x0 - x3) + (x1 - x3)*(y0 - y3)) / divisor;
			var c = 1 - a - b;

			return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1
		}
	}
}