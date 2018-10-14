module utils{ 
    /**
     * 舞台工具类
     */
    export class StageUtils{   
        static get stage(){
            return egret.MainContext.instance.stage;
        }

        static get stageWidth(){
            return egret.MainContext.instance.stage.stageWidth;
        }

        static get stageHeight(){
            return egret.MainContext.instance.stage.stageHeight;
        }

        static get halfStageWidth(){
            return egret.MainContext.instance.stage.stageWidth * 0.5;
        }

        static get halfStageHeight(){
            return egret.MainContext.instance.stage.stageHeight * 0.5;
        }

        static dispatchEvent(type:string, bubbles?:boolean, data?:any, cancelable?:boolean){
            StageUtils.stage.dispatchEventWith(type, bubbles, data, cancelable);
        }

        static addEventListener(type:string, listener:any, thisObj:any){
            StageUtils.stage.addEventListener(type, listener, thisObj);
        }

        static removeEventListener(type:string, listener:any, thisObj:any){
            StageUtils.stage.removeEventListener(type, listener, thisObj);
        }      
    }
}