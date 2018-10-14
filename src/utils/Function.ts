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
}