class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

    public constructor() {
        super();
        this.createView();
    }

    private textField: egret.TextField;

    private createView(): void {
        // this.textField = new egret.TextField();
        // this.addChild(this.textField);
        // this.textField.y = egret.MainContext.instance.stage.stageHeight * 0.5;
        // this.textField.width = egret.MainContext.instance.stage.stageWidth;
        // this.textField.height = 100;
        // this.textField.textAlign = "center";
        // this.textField.lineSpacing = 10;
    }

    public onProgress(current: number, total: number): void {
        //this.textField.text = `Loading assets ...\n[${current}/${total}]`;
    }
}
