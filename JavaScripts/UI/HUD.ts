
/** 
 * AUTHOR: 233用户487234960
 * TIME: 2025.04.28-21.51.01
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 */

import PlayerModuleC from "../Core/PlayerModuleC";
import HUD_Generate from "../ui-generate/HUD_generate";

export default class HUD extends HUD_Generate {

	private playerModuleC: PlayerModuleC = ModuleService.getModule(PlayerModuleC);
	private _curScore: number = 0;

	protected onStart() {
		this.canUpdate = false;
        this.layer = UILayerMiddle;
	}

	public init() {
		this.refreshScore(0)
		this.refreshNextBtnTxt();
		this.mOkBtn.onPressed.add(() => {
			//确认商品
			this.playerModuleC.confirmProducts()
		})
		this.mNextBtn.onPressed.add(() => {
			console.log("HUD mNextBtn onPressed")
			//下一位顾客
			this.playerModuleC.nextCustomer()
		})
	}

	public refreshScore(score: number) {
		this._curScore = score;
		this.mScoreTxt.text = this._curScore + "";
	}

	public refreshNextBtnTxt() {
		if(this.playerModuleC.getTableProductList().length <= 0) {
			this.mNextBtn.text = "开始营业"
		} else {
			this.mNextBtn.text = "下一位"
		}
	}

	public clearBtnOnPressed() {
		this.mOkBtn.onPressed.clear();
		this.mNextBtn.onPressed.clear();
	}
}
