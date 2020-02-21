class Main extends egret.DisplayObjectContainer {
    //public static systemInfo:any;
    public static isScopeUserInfo:boolean;
    public static myAvatarUrl:string = "";

    public constructor() {
        super();    
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

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
        let loginData = await platform.login();

        // 读取设备信息
        //Main.systemInfo = await platform.getSystemInfo();

        const setting = await platform.getSetting();  
        Main.isScopeUserInfo = setting["authSetting"]["scope.userInfo"];   

        // 在getUserInfo执行会导致黑屏
        this.createGameScene(); 

        if(Main.isScopeUserInfo){
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

            platform.loadFont("resource/RubikOne-Regular.ttf");             
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