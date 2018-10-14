module utils {
	/**
	 * 对象池
	 * Created by zhangyuantao
	 * 使用方法：
	 *  1.使用对象池创建的对象需实现此接口实现IGameObject接口
	 * 	2.一般对象创建：	 let bg = objectPool.ObjectPool.getInstance().createObject(Background);
	 *  3.fairyGUI对象创建：let spike = objectPool.ObjectPool.getInstance().createFairyUIObject(Spike, "leap");		
	 */
	export class ObjectPool{
		public pause:boolean = false;
		private pool;						// 缓存销毁对象(重复利用)
		private list:any[];					// 存储创建对象 
		private lastEnterFrameTime:number;	// 上帧时间		

		public constructor(){
			let self = this;
			self.pool = {};
			self.list = [];
			egret.MainContext.instance.stage.addEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
		}

		/** 单例 */
		private static instance:ObjectPool;
		public static getInstance():ObjectPool{
			if (ObjectPool.instance == null)
				ObjectPool.instance = new ObjectPool();			
			return ObjectPool.instance;
		}

		// 帧循环
		private onEnterFrame(){
			let self = this;
			if(self.pause)
				return;
			let now = egret.getTimer();
			self.lastEnterFrameTime = self.lastEnterFrameTime || now;
			let deltaTime = now - self.lastEnterFrameTime
			
			let list = self.list.concat();
			for(let i = 0, length = list.length; i < length; i++){
				let obj:IGameObject = list[i];
				obj.onEnterFrame(deltaTime);
			}

			self.lastEnterFrameTime = egret.getTimer();
		}

		/**
		 * 创建对象
		 * @param classFactory 具体对象类
		 */
		public createObject<T>(classFactory:{new():T}):T{
			let self = this;
			let result;
			let key = egret.getQualifiedClassName(classFactory); // 代码混淆后要用这个取
			key = key.split(".")[1]; // 去除命名空间
			let arr = self.pool[key];
			
			if(arr != null && arr.length)
				result = arr.shift();			
			else{
				result = new classFactory();
				result.key = key;
			}

			result.onCreate();
			self.list.push(result);

			return result;
		}

		/**
		 * 创建fairyGUI对象
		 * @param 具体UI对象类
		 * @param packageName 包名
		 */
		public createFairyUIObject<T>(classFactory:{new():T}, packageName:string):T{
			let self = this;
			let result;
			let key = egret.getQualifiedClassName(classFactory);
			key = key.split(".")[1]; // 去除命名空间
			let arr = self.pool[key];

			if(arr != null && arr.length)
				result = arr.shift();			
			else{
				result = fairygui.UIPackage.createObject(packageName, key, classFactory);
				result.key = key;
			}

			result.onCreate();
			self.list.push(result);

			return result;
		}

		/**
		 * 移除已创建对象
		 */
		public destroyObject(obj:any){
			let self = this;
			obj.onDestroy();

			let key = obj.key;
			if(self.pool[key] == null)
				self.pool[key] = [];			

			self.pool[key].push(obj);			

			let parent = obj.parent;
			if(parent)
				parent.removeChild(obj);

			let index = self.list.indexOf(obj);
			if(index != -1)
				self.list.splice(index, 1);			
		}

		/**
		 * 释放对象池
		 */
		public dispose(){
			let self = this;
			egret.MainContext.instance.stage.removeEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);

			// 销毁移除所有已创建对象
			for(let i = 0; i < self.list.length; i++){
				let obj = self.list[i];				
				obj.onDestroy();
				let parent = obj.parent;
				if(parent)
					parent.removeChild(obj);
				else if(obj.displayObject && obj.displayObject.parent){
					parent = obj.displayObject.parent;
					parent.removeChild(obj.displayObject);
				}
			}

			self.list = null;
			self.pool = null;
			ObjectPool.instance = null;
		}
	}

	/**
	 * 对象接口
	 * 使用对象池创建的对象需实现此接口
	 */
	export interface IGameObject{
		key:string;	
		onCreate();
		onDestroy();
		onEnterFrame(deltaTime:number);
	}
}