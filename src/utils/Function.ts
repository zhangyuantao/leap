module utils{
    //----------------------------------------------//
    //---------- Function.ts 功能函数集合 -----------//
    //----------------------------------------------//

    /**
     * 灰色滤镜
     */
    export let grayFilters = () => {
        let colorMatrix = [
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0,0,0,1,0
        ];
        let colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        return [colorFlilter];
    };

    /**
     * 根据xy坐标获取角度
     * 水平x > 0 y == 0 开始的顺时针0-360范围
     */
	 export let  getAngle = (x:number, y:number) => {
        // let l = Math.sqrt(self.x * self.x + self.y * self.y);
        // let rad = Math.acos(self.x / l);
        // let angle = rad / Math.PI  * 180;
        // if(self.y < 0) angle = 360 - angle
        // return parseFloat(angle.toFixed(2));

        // tan免开根，提高性能
        let rad = Math.atan(y / x);
        let angle = rad / Math.PI  * 180;
        if(x < 0) 
            angle = 180 + angle;			
        else if(y < 0)
            angle = 360 + angle;
        
        return parseFloat(angle.toFixed(2));
    }
}