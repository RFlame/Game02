"use strict";

class Customer {
    constructor(id) {
        this._id = id;
        this._productList = [];
    }
    get id() {
        return this._id;
    }
    set id(value) {
        if (value < 0) throw new Error("ID不能为负数");
        this._id = value;
    }
    get productList() {
        return [ ...this._productList ];
    }
    set productList(productList) {
        this._productList = productList;
    }
    addProduct(product) {
        this._productList.push(product);
    }
    removeProduct(productId) {
        this._productList = this._productList.filter((p => p.id !== productId));
    }
    destroy() {
        if (this._productList && this._productList.length > 0) {
            this._productList.forEach((p => {
                p.destory();
            }));
            this._productList = [];
        }
    }
}

var foreign1 = Object.freeze({
    __proto__: null,
    Customer: Customer
});

var _a;

class GameConfig {}

_a = GameConfig;

GameConfig.modelsId = "106F9D464E669E8AF8E00C82DACA1303;AB7293E847E44B49BD740F97187BB906;F05A9ECC474EBEE5BBB265A527C57A0A;76479E3043960FD06EB4858C67537D0F;3EC7AFF54DFCD7455A16BDAD5DCE5E82;A182B57D484336EC33A2CBB42D75D9CF;54195465478EDB0944658A990A85C4C4;A19FCFFA449AD3362D3B00AB38F3AF65;71F3B28B4E8C427DE2A28C96823044AC;7891055C48BCB70EBA09F0B8FE81A5E8;90B9BCEB41C97588175AF699E218E79E";

GameConfig.modlesIdList = _a.modelsId.split(";");

GameConfig.targetPos = new Vector(32.45513916015625, -67.49803161621094, 80);

GameConfig.spawnPostion = new Vector(96.62222290039062, -170.6253662109375, 122);

var foreign3 = Object.freeze({
    __proto__: null,
    GameConfig: GameConfig
});

class Product {
    get id() {
        return this._id;
    }
    set id(value) {
        if (value < 0) throw new Error("ID不能为负数");
        this._id = value;
    }
    getPrefab() {
        return this._prefab;
    }
    constructor(bornPos, assistId) {
        this._assistId = assistId;
        this.init(bornPos);
    }
    async init(bornPos) {
        this._prefab = await GameObjPool.asyncSpawn(this._assistId, GameObjPoolSourceType.Prefab);
        this._prefab.worldTransform.position = bornPos;
        this._prefab.tag = "selectable";
    }
    moveToTarget(targetPos) {
        let endPos = targetPos.clone();
        let startPos = this._prefab.worldTransform.position.clone();
        let targetPos1 = startPos.clone().add(new Vector(0, 0, 50));
        this.tween1 = new Tween(startPos).to(targetPos1, 300).easing(TweenUtil.Easing.Cubic.Out).onStart((value => {
            let m = this._prefab;
            m.physicsEnabled = false;
        })).onUpdate((value => {
            console.log("tween1 onUpdate");
            if (this._prefab) {
                this._prefab.worldTransform.position = value;
            }
        }));
        let target2 = endPos.clone().add(new Vector(0, 0, 10));
        this.tween2 = new Tween(targetPos1).to(target2, 500).easing(TweenUtil.Easing.Cubic.Out).onUpdate((value => {
            console.log("tween2 onUpdate");
            if (this._prefab) {
                this._prefab.worldTransform.position = value;
            }
        })).onComplete((value => {
            if (this._prefab) {
                const hitResult = QueryUtil.lineTrace(value, endPos, false, false);
                const result = hitResult.shift();
                if (result && result.gameObject.tag == "selectable") {
                    let z = result.impactPoint.z;
                    endPos.z = z;
                }
                this.tween3.start();
            }
        }));
        this.tween3 = new Tween(target2).to(endPos, 500).easing(TweenUtil.Easing.Cubic.Out).onUpdate((value => {
            console.log("tween3 onUpdate");
            if (this._prefab) {
                this._prefab.worldTransform.position = value;
            }
        })).onComplete((value => {
            let m = this._prefab;
            m.physicsEnabled = true;
        }));
        this.tween1.chain(this.tween2).start();
    }
    isReady() {
        return new Promise((res => {
            if (this._prefab != null) {
                res(true);
            } else {
                let index = 0;
                let id = setInterval((() => {
                    index++;
                    if (this._prefab != null) {
                        clearInterval(id);
                        res(true);
                    } else if (index > 300) {
                        clearInterval(id);
                        res(false);
                    }
                }), 30);
            }
        }));
    }
    destory() {
        if (this.tween1) {
            this.tween1.stopChainedTweens();
        }
        if (this.tween3) {
            this.tween3.stop();
        }
        GameObjPool.despawn(this._prefab);
        this._prefab = null;
    }
}

var foreign7 = Object.freeze({
    __proto__: null,
    default: Product
});

class CustomerManager {
    constructor() {
        this.customerList = [];
        this._currentIndex = 0;
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new CustomerManager;
        }
        return this._instance;
    }
    get currentCustomer() {
        return this._currentCustomer;
    }
    async init() {
        await this.generateCustomerList(1);
        this._currentCustomer = this._nextCustomer;
    }
    async generateCustomerList(customerSize) {
        this.customerList = [];
        this._currentIndex = 0;
        await Promise.all(Array.from({
            length: customerSize
        }).map(((o, index) => {
            console.log("generateCustomerList o:" + o);
            let customer = new Customer(index);
            this.generateProductList(30).then((pl => {
                customer.productList = pl;
            }));
            this.customerList.push(customer);
        })));
        console.log("generateCustomerList finish customerList:" + this.customerList);
        this._nextCustomer = this.customerList[this._currentIndex];
    }
    async nextCustomer() {
        this._currentCustomer = this._nextCustomer;
        await this.generateCustomerList(1);
        return this._currentCustomer;
    }
    customerLeav(customer) {
        customer.destroy();
        this.customerList = this.customerList.filter((c => c.id !== customer.id));
    }
    async generateProductList(productSize) {
        let productList = [];
        await Promise.all(Array.from({
            length: productSize
        }).map((() => {
            new Promise((resolve => {
                const randomIndex = Math.floor(Math.random() * GameConfig.modlesIdList.length);
                TimeUtil.delayExecute((() => {
                    const product = new Product(GameConfig.spawnPostion, GameConfig.modlesIdList[randomIndex]);
                    productList.push(product);
                    resolve(product);
                }), 15);
            }));
        })));
        return productList;
    }
}

CustomerManager._instance = null;

var foreign2 = Object.freeze({
    __proto__: null,
    CustomerManager: CustomerManager
});

class GamePlayManager {
    constructor() {
        this.beforeTime = 0;
        this.selectProductList = [];
        this.curSelectObject = null;
        this.tableProducts = [];
        this._curScore = 0;
        this._customerManager = CustomerManager.getInstance();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new GamePlayManager;
        }
        return this._instance;
    }
    async init() {
        this._curScore = 0;
        await this._customerManager.init();
        this.tableProducts = this._customerManager.currentCustomer?.productList ?? [];
        console.log("init tableProducts:" + this.tableProducts);
        InputUtil.onTouchBegin(((index, location, touchType) => {
            let clickTime = Date.now();
            if (clickTime - this.beforeTime < 500) {
                this.doubleClickTableProduct(location);
            } else {
                this.beforeTime = clickTime;
                this.clickTableProduct(location);
            }
        }));
    }
    clickTableProduct(location) {
        const result = this.getTouchObjectAtPosition(location);
        if (!result) return;
        let f = this.selectProductList.includes(result.gameObject);
        if (this.selectProductList.length > 0 && f) return;
        if (this.curSelectObject == null) {
            this.curSelectObject = result.gameObject;
            this.selectObject(result.gameObject, true);
        } else {
            if (this.curSelectObject != result.gameObject) {
                this.selectObject(this.curSelectObject, false);
                this.curSelectObject = result.gameObject;
                this.selectObject(result.gameObject, true);
            }
        }
    }
    doubleClickTableProduct(location) {
        const result = this.getTouchObjectAtPosition(location);
        if (!result) return;
        console.log("doubleClickTableProduct position:" + location + ",curSelectObject name:" + this.curSelectObject.name + ",resultObject name:" + result.gameObject.name);
        if (this.curSelectObject && this.curSelectObject == result.gameObject) {
            if (this.selectProductList.length == 0 || !this.selectProductList.includes(this.curSelectObject)) {
                this.selectProductList.push(this.curSelectObject);
            }
            console.log("doubleClickTableProduct tableProducts:" + this.tableProducts);
            this.tableProducts.forEach(((p, index) => {
                console.log("doubleClickTableProduct forEach p:" + p);
                if (p.getPrefab() == this.curSelectObject) {
                    console.log("doubleClickTableProduct p moveToTarget:" + p);
                    p.moveToTarget(GameConfig.targetPos);
                }
            }));
        }
    }
    getTouchObjectAtPosition(location) {
        const hitResults = ScreenUtil.getGameObjectByScreenPosition(location.x, location.y);
        const result = hitResults.shift();
        if (!result || result.gameObject.tag != "selectable") return null;
        return result;
    }
    selectObject(obj, select) {
        let mesh = obj;
        mesh.setPostProcessOutline(select, LinearColor.green, 4);
    }
    rotateShopCart() {
        let o = GameObject.findGameObjectByName("购物篮");
        let r = o.worldTransform.rotation;
        o.rotateTo(new Rotation(r.x, 150, r.z), .5, false, (() => {
            setTimeout((() => {
                o.rotateTo(r, 1, false, (async () => {
                    this.tableProducts = (await this._customerManager.nextCustomer()).productList;
                }));
            }), 2e3);
        }));
    }
    productCheck() {
        console.log("productCheck: " + this.selectProductList);
        var getScore = 0;
        if (this.selectProductList != null && this.selectProductList.length > 0) {
            this.selectProductList.forEach((o => {
                o.destroy();
            }));
            getScore = this.selectProductList.length;
            this.selectProductList = [];
        }
        this._curScore += getScore;
        return this._curScore;
    }
    productWeighing() {}
    nextCustomer() {
        this.rotateShopCart();
    }
    getTableProductList() {
        return this.tableProducts;
    }
}

GamePlayManager._instance = null;

var foreign4 = Object.freeze({
    __proto__: null,
    default: GamePlayManager
});

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

let HUD_Generate = class HUD_Generate extends UIScript {
    get mOkBtn() {
        if (!this.mOkBtn_Internal && this.uiWidgetBase) {
            this.mOkBtn_Internal = this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/mOkBtn");
        }
        return this.mOkBtn_Internal;
    }
    get mNextBtn() {
        if (!this.mNextBtn_Internal && this.uiWidgetBase) {
            this.mNextBtn_Internal = this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/mNextBtn");
        }
        return this.mNextBtn_Internal;
    }
    get mScoreTxt() {
        if (!this.mScoreTxt_Internal && this.uiWidgetBase) {
            this.mScoreTxt_Internal = this.uiWidgetBase.findChildByPath("RootCanvas/mScoreTxt");
        }
        return this.mScoreTxt_Internal;
    }
    onAwake() {}
};

HUD_Generate = __decorate([ UIBind("UI/HUD.ui") ], HUD_Generate);

var HUD_Generate$1 = HUD_Generate;

var foreign13 = Object.freeze({
    __proto__: null,
    default: HUD_Generate$1
});

class HUD extends HUD_Generate$1 {
    constructor() {
        super(...arguments);
        this.playerModuleC = ModuleService.getModule(PlayerModuleC);
        this._curScore = 0;
    }
    onStart() {
        this.canUpdate = false;
        this.layer = UILayerMiddle;
    }
    init() {
        this.refreshScore(0);
        this.refreshNextBtnTxt();
        this.mOkBtn.onPressed.add((() => {
            this.playerModuleC.confirmProducts();
        }));
        this.mNextBtn.onPressed.add((() => {
            console.log("HUD mNextBtn onPressed");
            this.playerModuleC.nextCustomer();
        }));
    }
    refreshScore(score) {
        this._curScore = score;
        this.mScoreTxt.text = this._curScore + "";
    }
    refreshNextBtnTxt() {
        if (this.playerModuleC.getTableProductList().length <= 0) {
            this.mNextBtn.text = "开始营业";
        } else {
            this.mNextBtn.text = "下一位";
        }
    }
    clearBtnOnPressed() {
        this.mOkBtn.onPressed.clear();
        this.mNextBtn.onPressed.clear();
    }
}

var foreign14 = Object.freeze({
    __proto__: null,
    default: HUD
});

var GameState;

(function(GameState) {
    GameState[GameState["INIT"] = 0] = "INIT";
    GameState[GameState["PLAYING"] = 1] = "PLAYING";
    GameState[GameState["END"] = 2] = "END";
})(GameState || (GameState = {}));

class PlayerModuleC extends ModuleC {
    constructor() {
        super(...arguments);
        this.gamePlayManager = GamePlayManager.getInstance();
        this._gameState = null;
        this._hud = null;
    }
    onStart() {
        console.log("客户端模块启动");
        this.init();
    }
    init() {
        this.setGameState(GameState.INIT);
    }
    startGame() {}
    confirmProducts() {
        let score = this.gamePlayManager.productCheck();
        this._hud.refreshScore(score);
    }
    nextCustomer() {
        this.gamePlayManager.nextCustomer();
        this._hud.refreshNextBtnTxt();
    }
    getTableProductList() {
        return this.gamePlayManager.getTableProductList();
    }
    setGameState(gameState) {
        this._gameState = gameState;
        switch (this._gameState) {
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

var foreign5 = Object.freeze({
    __proto__: null,
    default: PlayerModuleC
});

class PlayerModuleS extends ModuleS {}

var foreign6 = Object.freeze({
    __proto__: null,
    PlayerModuleS: PlayerModuleS
});

let RankManager = class RankManager extends Script {
    onStart() {}
    onUpdate(dt) {}
    onDestroy() {}
};

RankManager = __decorate([ Component ], RankManager);

var RankManager$1 = RankManager;

var foreign8 = Object.freeze({
    __proto__: null,
    default: RankManager$1
});

class ShopCart {
    constructor() {
        this.products = null;
    }
}

var foreign9 = Object.freeze({
    __proto__: null,
    default: ShopCart
});

let DefaultUI_Generate = class DefaultUI_Generate extends UIScript {
    onAwake() {}
};

DefaultUI_Generate = __decorate([ UIBind("UI/DefaultUI.ui") ], DefaultUI_Generate);

var DefaultUI_Generate$1 = DefaultUI_Generate;

var foreign12 = Object.freeze({
    __proto__: null,
    default: DefaultUI_Generate$1
});

class DefaultUI extends DefaultUI_Generate$1 {
    constructor() {
        super(...arguments);
        this.spawnPostion = new Vector(96.62222290039062, -170.6253662109375, 122);
    }
    onStart() {}
    onAdded() {}
    onRemoved() {}
    onDestroy() {}
}

var foreign10 = Object.freeze({
    __proto__: null,
    default: DefaultUI
});

let GameStart = class GameStart extends Script {
    onStart() {
        this.useUpdate = true;
        ModuleService.registerModule(PlayerModuleS, PlayerModuleC, null);
    }
    onUpdate(dt) {
        TweenUtil.TWEEN.update();
    }
    onDestroy() {}
};

GameStart = __decorate([ Component ], GameStart);

var GameStart$1 = GameStart;

var foreign11 = Object.freeze({
    __proto__: null,
    default: GameStart$1
});

let Zhuozi = class Zhuozi extends Script {
    constructor() {
        super(...arguments);
        this.inTouchObject = null;
        this.beforeTime = 0;
        this.targetPos = new Vector(32.45513916015625, -67.49803161621094, 80);
        this.selectModel = [];
    }
    onStart() {
        this.initTouch();
        SelectionUtil.setGlobalOutlineParams(4, .4, .8, 0, 1);
        this.useUpdate = true;
    }
    initTouch() {
        InputUtil.onTouchBegin(((index, location, touchType) => {
            let clickTime = Date.now();
            if (clickTime - this.beforeTime < 500) {
                console.log("onTouchBegin 双击 this.inTouchObject:" + this.inTouchObject);
                if (this.inTouchObject) {
                    if (this.selectModel.length == 0 || !this.selectModel.includes(this.inTouchObject)) {
                        this.selectModel.push(this.inTouchObject);
                    }
                    this.moveToTargetByTween(this.inTouchObject.worldTransform.position, this.targetPos);
                }
            } else {
                this.beforeTime = clickTime;
                this.onTouchBegin(index, location, touchType);
            }
        }));
        InputUtil.onTouchMove(((index, location, touchType) => {}));
        InputUtil.onTouchEnd(((index, location, touchType) => {}));
    }
    moveToTargetByTween(currentPosition, targetPosition) {
        let m = this.inTouchObject;
        m.physicsEnabled = false;
        let targetPosition1 = new Vector(currentPosition.x, currentPosition.y, currentPosition.z + 30);
        let tween1 = new Tween(currentPosition).to(targetPosition1, 200).onUpdate((obj => {
            this.inTouchObject.worldTransform.position = obj;
        })).onComplete((object => {
            let tween2 = new Tween(targetPosition1).to(targetPosition, 500).onUpdate((obj => {
                this.inTouchObject.worldTransform.position = obj;
            })).onComplete((object => {
                let m = this.inTouchObject;
                m.physicsEnabled = true;
            }));
            tween2.start();
        }));
        tween1.start();
    }
    async ObjTweenStart(targetX, targetY, targetZ) {
        let targetObj = await GameObject.asyncFindGameObjectById("FE9CD8A8");
        let targetPosition = new Vector(targetX, targetY, targetZ);
        let tween = new Tween(targetObj.worldTransform.position).to(targetPosition, 1e3).onUpdate((obj => {
            targetObj.worldTransform.position = obj;
        }));
        tween.start();
    }
    onTouchBegin(index, location, touchType) {
        console.log(`onTouchBegin: ${index}`);
        this.trySelectObjAtPosition(location);
    }
    onTouchMove(index, location, touchType) {
        console.log(`onTouchMove: ${index}`);
        if (this.inTouchObject) {
            this.moveUpdate(location);
        }
    }
    onTouchEnd(index, location, touchType) {
        console.log(`TouchEnd: ${index},`);
        if (this.inTouchObject) {
            this.selectObject(this.inTouchObject, false);
        }
        this.inTouchObject = null;
    }
    trySelectObjAtPosition(location) {
        const result = this.getTouchObjectAtPosition(location);
        if (!result) return;
        let f = this.selectModel.includes(result.gameObject);
        if (this.selectModel.length > 0 && f) return;
        if (this.inTouchObject == null) {
            this.inTouchObject = result.gameObject;
            this.selectObject(result.gameObject, true);
        } else {
            if (this.inTouchObject != result.gameObject) {
                this.selectObject(this.inTouchObject, false);
                this.inTouchObject = result.gameObject;
                this.selectObject(result.gameObject, true);
            }
        }
    }
    getTouchObjectAtPosition(location) {
        const hitResults = ScreenUtil.getGameObjectByScreenPosition(location.x, location.y);
        const result = hitResults.shift();
        if (!result || result.gameObject.tag != "selectable") return null;
        return result;
    }
    selectObject(obj, select) {
        let mesh = obj;
        mesh.setPostProcessOutline(select, LinearColor.green, 4);
    }
    moveUpdate(location) {
        const hitResult = ScreenUtil.getGameObjectByScreenPosition(location.x, location.y, 1e4, true);
        const groundResult = hitResult.find((e => e.gameObject.name == "桌面"));
        if (groundResult) {
            const pos = groundResult.impactPoint;
            pos.z += 10;
            this.inTouchObject.worldTransform.position = pos;
        }
    }
};

Zhuozi = __decorate([ Component ], Zhuozi);

var Zhuozi$1 = Zhuozi;

var foreign15 = Object.freeze({
    __proto__: null,
    default: Zhuozi$1
});

const MWModuleMap = {
    FF4919834951505C8A03239F5509E2E9: foreign1,
    "5B57188449B161DD71A3E98871083D64": foreign2,
    B726963748B367E7C2957092B10140FD: foreign3,
    A01AD7214B8FC35021C688AA445595FC: foreign4,
    F7A145D84560CEBB4A17A2B54D47B779: foreign5,
    F0950F3742470538F153CE852DC7F732: foreign6,
    "1F6CC3F5448770D66AD60FA7129D7C95": foreign7,
    D6EA78184C6BA7BE081A4482CC359728: foreign8,
    F861CD8B4562A36FDDF1F2BC26F8DC50: foreign9,
    E793F4E748068B7014AF149815249190: foreign10,
    E9645BC241B692469876AAAFD6F75036: foreign11,
    "7D664C384FF8706A2BA85CBF46F2177D": foreign12,
    D0CE780048E11C485C62828734C7B3C5: foreign13,
    AAF72E15450F60E4C9A04BBF1F6845F1: foreign14,
    B3E89F2B481ABCE98EA638B7ED80ED90: foreign15
};

const MWFileMapping = new WeakMap([ [ foreign1 || {}, "JavaScripts/Core/Customer" ], [ foreign2 || {}, "JavaScripts/Core/CustomerManager" ], [ foreign3 || {}, "JavaScripts/Core/GameConfig" ], [ foreign4 || {}, "JavaScripts/Core/GamePlayManager" ], [ foreign5 || {}, "JavaScripts/Core/PlayerModuleC" ], [ foreign6 || {}, "JavaScripts/Core/PlayerModuleS" ], [ foreign7 || {}, "JavaScripts/Core/Product" ], [ foreign8 || {}, "JavaScripts/Core/RankManager" ], [ foreign9 || {}, "JavaScripts/Core/ShopCart" ], [ foreign10 || {}, "JavaScripts/DefaultUI" ], [ foreign11 || {}, "JavaScripts/GameStart" ], [ foreign12 || {}, "JavaScripts/ui-generate/DefaultUI_generate" ], [ foreign13 || {}, "JavaScripts/ui-generate/HUD_generate" ], [ foreign14 || {}, "JavaScripts/UI/HUD" ], [ foreign15 || {}, "JavaScripts/Zhuozi" ] ]);

exports.MWFileMapping = MWFileMapping;

exports.MWModuleMap = MWModuleMap;
//# sourceMappingURL=game.js.map
