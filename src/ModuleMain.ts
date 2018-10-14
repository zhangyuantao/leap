// module leap {
// 	export class ModuleMain extends BaseSingleGameModule {
// 		private m_pGameMainWindow: GameMainWindow;		

// 		//初始化界面
// 		protected initView(): void {
// 			super.initView();
// 			let self = this;
// 			self.m_pGameMainWindow = self.showSubWin(GameMainWindow);
// 		}

// 		listNotificationInterests(): string[] {
// 			return [
// 				MainNotes.SINGLE_GAME_BEGIN,
// 				MainNotes.BATTLE_SETTLEMENT, 
// 				MainNotes.SHARE_SUCCESS,
// 				MainNotes.SINGLE_GAME_REST,
// 				MainNotes.LOAD_MODULE,
// 				MainNotes.MODULE_REMOVED,
// 				MainNotes.SINGLE_GAME_LEAVE,
// 				MainNotes.APP_PAUSE,
// 				MainNotes.APP_RESUME
// 			];
// 		}

// 		handleNotification(notification: puremvc.INotification): void {
// 			let self = this;
// 			let body:any = notification.getBody();
// 			switch (notification.getName()) {				
// 				case MainNotes.SINGLE_GAME_BEGIN: // 开始
// 					self.m_pGameMainWindow.createGame();
// 					GameMgr.getInstance().gameBegin();
// 					break;				
// 				case MainNotes.BATTLE_SETTLEMENT: // 结算	
// 					let dataArg = <any>{};
// 					dataArg.newRecode = body.curScore; // 游戏分数
// 					dataArg.bestNum = body.maxScore || 0;// 本周最佳
// 					dataArg.rank = body.ranking ? "第" + body.ranking + "名" : "未上榜";
// 					dataArg.newFlag = body.curScore > GameMgr.getInstance().oldScoreRecord;
// 					dataArg.weekRankName = "leapWeekRank";
// 					dataArg.showRelive = !GameMgr.getInstance().hasResurgenced;
// 					FWFacade.instance.sendNotification(MainNotes.LOAD_MODULE, {flag:MainNotes.SINGLE_SETTLEMENT_MODULE,dataArg:dataArg});

// 					MySoundMgr.getInstance().disposeSound();

// 					// 强制关闭可能残留的引导界面
// 					FWFacade.instance.sendNotification(MainNotes.MODULE_REMOVED,"GuideModule");

// 					utils.EventDispatcher.getInstance().dispatchEvent('settlement');	
// 					break;	
// 				case MainNotes.SINGLE_GAME_REST:	// 重玩
// 					self.m_pGameMainWindow.restartGame();
// 				break;
// 				case MainNotes.SHARE_SUCCESS:	// 分享成功操作
// 					// 复活				
// 					CMD.instance.gameResurgence(new CallBackVo((a, shareOk) => {
// 						if(shareOk){
// 							FWFacade.instance.sendNotification(MainNotes.MODULE_REMOVED, "singleSettlement");
// 							GameMgr.getInstance().resurgence();				
// 							utils.EventDispatcher.getInstance().dispatchEvent('onAppPause');		
// 						}
// 					}, self));
// 				break;
// 				case MainNotes.SINGLE_GAME_LEAVE: // 离开
// 					CMD.instance.gameGiveUp();
// 					self.m_pGameMainWindow.destroyGame();
// 					utils.StageUtils.dispatchEvent("leaveGame");
// 					MySoundMgr.getInstance().disposeSound();
// 				break;
// 				case MainNotes.LOAD_MODULE:{
// 					let moduleName = body.flag;
// 					if(moduleName == "GuideModule")
// 						GameMgr.getInstance().pause(true);					
// 				}
// 				break;	
// 				case MainNotes.MODULE_REMOVED:{
// 					let moduleName = body;
// 					if(moduleName == "GuideModule" && !GameMgr.getInstance().gameOver)
// 						GameMgr.getInstance().pause(false);					
// 				}
// 				break;
// 				case MainNotes.APP_PAUSE:					
// 					utils.EventDispatcher.getInstance().dispatchEvent('onAppPause');
// 					break;
// 				case MainNotes.APP_RESUME:
// 					break;
// 			}
// 		}
// 	}
// }