import PlayerModuleC from "./Core/PlayerModuleC";
import { PlayerModuleS } from "./Core/PlayerModuleS";

@Component
export default class GameStart extends Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.useUpdate = true
        ModuleService.registerModule(PlayerModuleS, PlayerModuleC, null)
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {
        TweenUtil.TWEEN.update();
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}