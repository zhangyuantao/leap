class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        if(platform.isRunInWX())
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
        fairygui.UIPackage.addPackage("leap");        
        this.stage.addChild(fairygui.GRoot.inst.displayObject);
        this.stage.removeChild(this);
        let wnd = new leap.MainWindow();
        wnd.show();

        if(platform.isRunInWX()){
            // 启用显示转发分享菜单
            wx.showShareMenu({withShareTicket:true});

            // 用户点击了“转发”按钮
            wx.onShareAppMessage(() => {
                return {
                    title:"LeapOn微信小游戏版终于出了！",
					imageUrl:"resource/assets/share1.png",
					imageUrlId:"",
					query:"",		
                }
            });
        }
    }
}

declare let wx;