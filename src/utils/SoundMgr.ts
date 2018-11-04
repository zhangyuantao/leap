module utils {
	/**
	 * 声音管理
	 */
	export class SoundMgr implements utils.ISingleton{
		private sounds:any;

		private bgm:egret.Sound;
		private bgmSoundChannel:egret.SoundChannel;
		private lastBgmPos:number = 0;
		private bgmLoops:number = 0;

		public isMuteBgm:boolean = false;
		public isMuteSound:boolean = false;

		// 实例化
		public onCreate() {
			let self = this;
			self.sounds = {};

			// 是否静音存储
			let a = egret.localStorage.getItem("isMuteBgm");			
			self.isMuteBgm = a && a == "1";
			let b = egret.localStorage.getItem("isMuteSound");			
			self.isMuteSound = b && b == "1";
		}

		// 销毁
		public onDestroy() {
			let self = this;
			self.disposeBgm();
			self.disposeAllSound();
		}

		/** 背景音乐 */
		public playBgm(url:string, startTime:number = 0, loops:number = 0, volume:number = 1){
			let self = this;

			// 正在播放
			// if(self.bgmSoundChannel && self.bgmSoundChannel.position > 0)
			// 	return;
			if(self.bgmSoundChannel)
			 	self.bgmSoundChannel.stop();

			if(!self.bgm)
				self.bgm = RES.getRes(url) as egret.Sound;					
			
			self.bgmLoops = loops;

			if(self.isMuteBgm)
				return;

			self.bgmSoundChannel = self.bgm.play(startTime || self.lastBgmPos, loops);
			self.bgmSoundChannel.volume = volume;
		}

		// 暂停背景音乐
		public pauseBgm(){
			let self = this;
			if(self.bgmSoundChannel){
				self.lastBgmPos = self.bgmSoundChannel.position;
				self.bgmSoundChannel.stop();			
			}
		}

		// 恢复背景音乐
		public resumeBgm(){
			let self = this;
			if(self.bgm){
				self.bgmSoundChannel = self.bgm.play(self.lastBgmPos, self.bgmLoops);		
			}
		}

		// 释放背景音乐
		public disposeBgm(){
			let self = this;
			self.bgmSoundChannel.stop();
			self.bgmSoundChannel = null;
			self.bgm.close();
			self.bgm = null;
		}
		
		// 设置背景音乐静音状态
		public setBgmMute(mute:boolean){
			let self = this;
			if(self.isMuteBgm == mute)
				return;
			
			if(mute)
				self.pauseBgm();			
			else
				self.resumeBgm();

			self.isMuteBgm = mute;
			egret.localStorage.setItem("isMuteBgm", mute ? "1" : "0");
		}

		/** 音效 */
		public playSound(url:string, startTime:number = 0, loops:number = 1, volume:number = 1){
			let self = this;
			if(self.isMuteSound)
				return;
			
			let info = self.sounds[url];
			let sound:egret.Sound;
			if(!info){
				sound = RES.getRes(url) as egret.Sound;
				self.sounds[url] = {sound:sound};
			}
			else
				sound = info.sound;

			self.sounds[url].loops = loops;
			let channel = sound.play(startTime, loops);
			channel.volume = volume;
			self.sounds[url].channel = channel;
		}

		// 暂停声音
		public pauseSound(url:string){
			let self = this;
			let sound = self.sounds[url];
			if(sound)
				sound.channel.stop();
		}

		private pauseAllSound(){
			let self = this;
			for(let url in self.sounds){
				let info = self.sounds[url];
				let channel = info.channel as egret.SoundChannel;
				info.lastSoundPos = channel.position;
				channel.stop();
			}
		}

		// 恢复声音
		public resumeSound(url:string){
			let self = this;
			let info = self.sounds[url];
			if(info){
				let channel = info.channel as egret.SoundChannel;
				info.channel = info.sound.play(info.lastSoundPos, info.loops);
			}
		}

		// 设置全局音效静音
		public setSoundMute(mute:boolean){
			let self = this;
			if(self.isMuteSound == mute)
				return;

			if(mute)
				self.pauseAllSound();		

			self.isMuteSound = mute;
			egret.localStorage.setItem("isMuteSound", mute ? "1" : "0");
		}

		// 释放某个声音
		public disposeSound(url:string){
			let self = this;
			let info = self.sounds[url];
			if(!info) return;
			let sound = info.sound as egret.Sound;
			sound.close();
			let channel = info.channel as egret.SoundChannel;
			channel.stop();

			self.sounds[url] = null;
			delete self.sounds[url];
		}

		// 释放所有声音
		public disposeAllSound(){
			let self = this;
			for(let url in self.sounds){
				self.disposeSound(url);
			}
			self.sounds = null;
		}
	}
}