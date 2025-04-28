
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/HUD.ui
*/



@UIBind('UI/HUD.ui')
export default class HUD_Generate extends UIScript {
		private mOkBtn_Internal: mw.StaleButton
	public get mOkBtn(): mw.StaleButton {
		if(!this.mOkBtn_Internal&&this.uiWidgetBase) {
			this.mOkBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mOkBtn') as mw.StaleButton
		}
		return this.mOkBtn_Internal
	}
	private mNextBtn_Internal: mw.StaleButton
	public get mNextBtn(): mw.StaleButton {
		if(!this.mNextBtn_Internal&&this.uiWidgetBase) {
			this.mNextBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mNextBtn') as mw.StaleButton
		}
		return this.mNextBtn_Internal
	}
	private mScoreTxt_Internal: mw.TextBlock
	public get mScoreTxt(): mw.TextBlock {
		if(!this.mScoreTxt_Internal&&this.uiWidgetBase) {
			this.mScoreTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mScoreTxt') as mw.TextBlock
		}
		return this.mScoreTxt_Internal
	}


 
	/**
	* onStart 之前触发一次
	*/
	protected onAwake() {
	}
	 
}
 