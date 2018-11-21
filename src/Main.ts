class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        if(wx && wx.loadFont)
            wx.loadFont("resource/RubikOne-Regular.ttf");
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
            //console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource();            
        await platform.login();
        this.createGameScene(); 
        const userInfo = await platform.getUserInfo();
        //console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
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
        //fairygui.UIConfig.defaultFont = "RubikOne";
        fairygui.UIPackage.addPackage("leap");        
        this.stage.addChild(fairygui.GRoot.inst.displayObject);
        this.stage.removeChild(this);
        let wnd = new leap.MainWindow();
        wnd.show();
    }
}

let wx = <any>{};