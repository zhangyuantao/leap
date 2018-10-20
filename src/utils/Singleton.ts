module utils {
	export interface ISingleton{
		onCreate();
		onDestroy();
	}

	/**
	 * 通用单例模板 
	 * Created by zhangyuantao
	 * 目标需要实现ISingleton接口
	 * 注意：这不是严格的单例模式，依然允许new出不同实例，只是为了方便达到单例目的
	 * 可以自行加私有构造函数private constructor(){}来避免误使用new()创建
	 * 使用方法： let instance = Singleton.get(Class);
	 */
	export class Singleton{
		/**
		 * 获取、创建单例
		 */
		public static get<T>(classFactory:{new ():T}):T{
			let Class = <any>classFactory;
			if(!Class.instance){
				Class.instance = new Class();
				if(Class.instance.onCreate)
					Class.instance.onCreate();
			}
			return Class.instance;
		}

		/**
		 * 销毁单例
		 */
		public static destroy(classFactory:any){
			let instance = Singleton.get(classFactory) as any;
			if(instance.onDestroy)
				instance.onDestroy();
			classFactory.instance = null;
		}
	}
}