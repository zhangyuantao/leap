module utils {
	/**
	 * 自定义事件分发
	 */
	export class EventDispatcher {
		private static instance:EventDispatcher;
		public static getInstance() {
			if(!EventDispatcher.instance)
				EventDispatcher.instance = new EventDispatcher();
			return EventDispatcher.instance;
		}

		private listeners = <any>{};		

		public addEventListener(type:string, listener:Function, thisObj:any, refObj?:any){
			let self = this;
			let pair = self._addEventListener(type, listener, thisObj, refObj);			
			self.listeners[type].push(pair);
		}

		public once(type:string, listener:Function, thisObj:any, refObj?:any){
			let self = this;
			let pair = self._addEventListener(type, listener, thisObj, refObj, true);	
			self.listeners[type].push(pair);
		}

		private _addEventListener(type:string, listener:Function, thisObj:any, refObj?:any, once:boolean = false){
			let self = this;
			if(!self.listeners) self.listeners = <any>{};
			if(!self.listeners[type]) self.listeners[type] = [];
			let pair = <IEventListenerVO>{};
			pair.listener = listener;
			pair.thisObj = thisObj;
			pair.refObj = refObj;
			pair.once = once;
			return pair;
		}

		public removeEventListener(type:string, listener:Function, thisObj:any){
			let self = this;
			if(!self.listeners[type] || !self.listeners[type].length)
				return;
			
			let listenerArr = self.listeners[type] as Array<IEventListenerVO>;
			for(let i = 0; i < listenerArr.length; i++){
				let pair = listenerArr[i];
				if(pair.listener == listener && pair.thisObj == thisObj){
					listenerArr.splice(i--, 1);					
				}
			}

			if(!listenerArr.length)
				delete self.listeners[type];
		}

		public removeAllEventListener(type:string){
			let self = this;
			if(!self.listeners[type])
				return;
			
			self.listeners[type] = null;
			delete self.listeners[type];
		}

		public removeAll(){
			let self = this;			
			self.listeners = {};
		}

		public dispatchEvent(type:string, args?:any, refObj?:any){
			let self = this;
			if(!self.listeners[type] || !self.listeners[type].length)
				return;

			let listenerArr = self.listeners[type] as Array<IEventListenerVO>;
			for(let i = 0; i < listenerArr.length; i++){
				let pair = listenerArr[i];
				if(refObj && refObj != pair.refObj)
					continue;				
				if(pair.once)
					listenerArr.splice(i--, 1);		
				pair.listener.call(pair.thisObj, args);		
			}

			if(!listenerArr.length)
				delete self.listeners[type];
		}


		public dispose(){
			let self = this;
			self.listeners = null;
			EventDispatcher.instance = null;
		}
	}

	export interface IEventListenerVO{
		listener:Function;
		thisObj:any;
		refObj:any;
		once:boolean;
	}
}