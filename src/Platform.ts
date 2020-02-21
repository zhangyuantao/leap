/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
    openDataContext:any;
    isRunInTT():boolean;
    getUserInfo(): Promise<any>;
    login(): Promise<any>;
    getSetting():Promise<any>;
    getSystemInfo():Promise<any>;
    getUserCloudStorage(keyArr:string[]):Promise<any>;
    createBannerAd(info:any); 
    createVideoAd(adUnitId);
    layaAdChange(cb:Function);
    layaAdToMiniProgram();
    isRuniOS():boolean;
    setUserCloudStorage(kvDataList:any[], success?:Function, fail?:Function, complete?:Function);
    loadFont(url:string);
}

class DebugPlatform implements Platform {
    openDataContext:any;
    
    isRunInTT(){
        return false;
    }

    async getUserInfo() {
        return { nickName: "username" }
    }

    async login() {

    }

    async getSetting(){
        let setting = {};
        setting["authSetting"] = {};
        return setting;
    }

    async getSystemInfo(){
        return null;
    }

    async getUserCloudStorage(keyArr:string[]):Promise<any>{
        return null;
    }
    
    //广告
    async createBannerAd(info:any) {
       return null;
    }

    // 视频广告
    createVideoAd(adUnitId) {
        return null;
    }

    // 微量平台广告接口
    wladGetAds(num, cb){
        let testInfo = {
            "code": 0,
            "data": [
            {
            "appid": "wx46ce62a969b2c121",
            "desc": "追忆似水年华，天天答题领红包，可以转发给父母的关爱",
            "img": "https://wllm.oss-cn-beijing.aliyuncs.com/trackposter/wx46ce62a969b2c121/1127155c9372026a8098_1.jpg",
            "logo": "https://wllm.oss-cn-beijing.aliyuncs.com/logoa/wx46ce62a969b2c121.png",
            "name": "答题天天乐"
            },
            {
            "appid": "wx7e5637f105ddc564",
            "desc": "没有来日方长，只有时光匆匆。珍惜当下的每一分每一秒",
            "img": "https://wllm.oss-cn-beijing.aliyuncs.com/trackposter/wx7e5637f105ddc564/d3c358c96baed85e4e7e_1.jpg",
            "logo": "https://wllm.oss-cn-beijing.aliyuncs.com/logoa/wx7e5637f105ddc564.png",
            "name": "人生时间管理"
            }
            ]
       };
       
       cb(testInfo);
    }

    layaAdChange(cb){
      cb(true, "");
    }

    layaAdToMiniProgram(){
     
    }
    
    isRuniOS(){
        return true;
    }

    setUserCloudStorage(kvDataList:any[], success?:Function, fail?:Function, complete?:Function){
       
    }

    loadFont(url:string){
        
    }
}

if (!window.platform) {
    window.platform = new DebugPlatform();
}

declare let platform: Platform;

declare interface Window {
    platform: Platform
}





