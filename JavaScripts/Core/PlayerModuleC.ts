import HUD from "../UI/HUD";
import GamePlayManager from "./GamePlayManager";

enum GameState {
    INIT,
    PLAYING,
    END,
}

export default class PlayerModuleC extends ModuleC<null, null> {

    private gamePlayManager: GamePlayManager = GamePlayManager.getInstance();
    private _gameState: GameState = null;
    private _hud: HUD = null;

    protected onStart(): void {
        console.log("客户端模块启动")
        this.init();
        
    }

    init() {
        this.setGameState(GameState.INIT); 
    }

    startGame() {

    }

    
    //确认秤盘中商品
    confirmProducts() {
        let score = this.gamePlayManager.productCheck();
        this._hud.refreshScore(score);
    }

    //下一位顾客
    nextCustomer() {
        this.gamePlayManager.nextCustomer();
        this._hud.refreshNextBtnTxt();
    }

    //获取桌面商品列表
    getTableProductList(): GameObject[]  {
        return this.gamePlayManager.getTableProductList();
    }

    setGameState(gameState: GameState) {
        this._gameState = gameState;
        switch(this._gameState) {
            case GameState.INIT:
                this.gamePlayManager.init();
                this._hud = UIService.show(HUD);
                this._hud.init();
                break;
            case GameState.PLAYING:
                break;
            case GameState.END:
                this._hud.destroy();
                break;
        }
    }
}