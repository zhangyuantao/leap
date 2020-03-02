/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
    openDataContext: any;
    isRunInTT(): boolean;
    getUserInfo(): Promise<any>;
    login(force: boolean): Promise<any>;
    getSetting(): Promise<any>;
    getSystemInfo(): Promise<any>;
    getUserCloudStorage(keyArr: string[]): Promise<any>;
    createBannerAd(info: any);
    createVideoAd(adUnitId);
    isRuniOS(): boolean;
    setUserCloudStorage(kvDataList: any[], success?: Function, fail?: Function, complete?: Function);
    loadFont(url: string);
    getGameRecorderManager(): GameRecorderManager;
    showToast(title, duration, icon, successCb, failCb);
    authorize(scope);
    showModal(title, content);
}

/**头条必接录屏功能 */
declare interface GameRecorderManager {
    start(arg: { duration: number });
    pause();
    resume();
    stop();
    recordClip(arg: { timeRange, success, fail, complete });
    clipVideo(arg: any);

    onStart(func: Function);
    onPause(func: Function);
    onResume(func: Function);
    onStop(func: Function);
    onError(func: Function);
    onInterruptionBegin(func: Function);
    onInterruptionEnd(func: Function);
}

class DebugPlatform implements Platform {
    openDataContext: any;

    isRunInTT() {
        return false;
    }

    async getUserInfo() {
        return { nickName: "username" }
    }

    async login() {
        return {};
    }

    async getSetting() {
        let setting = {};
        setting["authSetting"] = {};
        return setting;
    }

    async getSystemInfo() {
        return null;
    }

    async getUserCloudStorage(keyArr: string[]): Promise<any> {
        return null;
    }

    //广告
    async createBannerAd(info: any) {
        return null;
    }

    // 视频广告
    createVideoAd(adUnitId) {
        return null;
    }

    isRuniOS() {
        return true;
    }

    setUserCloudStorage(kvDataList: any[], success?: Function, fail?: Function, complete?: Function) {

    }

    loadFont(url: string) {

    }

    getGameRecorderManager() {
        return null;
    }

    showToast(title, duration) {
        console.log(title);
    }

    async authorize(scope) {
        return null;
    }

    async showModal(title, content) {
        return null;
    }
}

if (!window.platform) {
    window.platform = new DebugPlatform();
}

declare let platform: Platform;

declare interface Window {
    platform: Platform
}





