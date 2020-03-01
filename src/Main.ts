class Main extends egret.DisplayObjectContainer {
    //public static systemInfo:any;
    public static isScopeUserInfo: boolean;
    public static myAvatarUrl: string = "";
    public static loginData:any; 

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    // 是否在平台登录
    public static isLogin(){
        return Main.loginData.isLogin;
    }

    private onAddToStage(event: egret.Event) {

        /*egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })*/

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
            utils.EventDispatcher.getInstance().dispatchEvent('onAppPause');
            //console.log("pause");
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {    
        await this.loadResource();

        this.createGameScene();

        Main.loginData  = await platform.login();

        // 读取设备信息
        //Main.systemInfo = await platform.getSystemInfo();

        const setting = await platform.getSetting();
        Main.isScopeUserInfo = setting["authSetting"]["scope.userInfo"];
        if (Main.isScopeUserInfo) {
            const userInfo = await platform.getUserInfo();
            Main.myAvatarUrl = userInfo.avatarUrl;
        }
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);

            //加载排行榜资源
            platform.openDataContext && platform.openDataContext.postMessage({
                command: "loadRes"
            });

            // let fontName = platform.loadFont("resource/RubikOne-Regular.ttf");
            // console.log("loadFont:", fontName);
        }
        catch (e) {
            console.error(e);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        fairygui.UIPackage.addPackage("leap");
        this.stage.addChild(fairygui.GRoot.inst.displayObject);
        this.stage.removeChild(this);
        let wnd = new planetJump.MainWindow();
        wnd.show();
    }
}