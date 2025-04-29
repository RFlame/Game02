import { CustomerManager } from "./CustomerManager";
import { GameConfig } from "./GameConfig";
import Product from "./Product";

export default class GamePlayManager {

    private static _instance: GamePlayManager = null;

    private beforeTime: number = 0;
    private selectProductList: GameObject[] = [];
    private curSelectObject: GameObject = null;
    private tableProducts: Product[] = [];
    //当前得分
    private _curScore: number = 0;

    private _customerManager: CustomerManager = CustomerManager.getInstance();
    
    private constructor() {}
   
    public static getInstance(): GamePlayManager {
        if(!this._instance) {
            this._instance = new GamePlayManager();
        }
        return this._instance;
    }

    public async init() {
        this._curScore = 0;
        await this._customerManager.init();
        this.tableProducts = this._customerManager.currentCustomer?.productList??[];
        console.log("init tableProducts:" + this.tableProducts)
        InputUtil.onTouchBegin((index, location, touchType) => {
            let clickTime = Date.now();
            if(clickTime - this.beforeTime < 500) {
                //双击
                this.doubleClickTableProduct(location)
            } else {
                this.beforeTime = clickTime;
                //单击
                this.clickTableProduct(location);
            }
         })
    }

     /**
      * 单击桌子上的商品
      * @param location  触摸屏幕的位置
      * @returns 
      */
     private clickTableProduct(location: Vector2) {
        const result = this.getTouchObjectAtPosition(location);
        if (!result) return;
        let f = this.selectProductList.includes(result.gameObject);
        if(this.selectProductList.length > 0 && f) return;
        
        if(this.curSelectObject == null) {
           this.curSelectObject = result.gameObject;
           this.selectObject(result.gameObject, true);
        } else {
           if(this.curSelectObject != result.gameObject) {
               this.selectObject(this.curSelectObject, false);
               this.curSelectObject = result.gameObject;
               this.selectObject(result.gameObject, true);
           }
        }
    }

    //双击桌子上的商品
    private doubleClickTableProduct(location: Vector2) {
        const result = this.getTouchObjectAtPosition(location);
        if (!result) return;
        console.log("doubleClickTableProduct position:" + location + ",curSelectObject name:" + this.curSelectObject.name + ",resultObject name:" + result.gameObject.name)
        if(this.curSelectObject && this.curSelectObject == result.gameObject) {
            if(this.selectProductList.length == 0 || !this.selectProductList.includes(this.curSelectObject)) {
                this.selectProductList.push(this.curSelectObject);
            }
            //移动模型到盘子里
            console.log("doubleClickTableProduct tableProducts:" + this.tableProducts)
            this.tableProducts.forEach((p, index) => {
                console.log("doubleClickTableProduct forEach p:" + p)
                if(p.getPrefab() == this.curSelectObject) {
                    console.log("doubleClickTableProduct p moveToTarget:" + p)
                    p.moveToTarget(GameConfig.targetPos);
                }
            })              
        }
    }

    /**
      *  获取触摸屏幕的物体
      * @param location  触摸屏幕的位置
      * @returns 
      */
    private getTouchObjectAtPosition(location: Vector2) {
        const hitResults = ScreenUtil.getGameObjectByScreenPosition(location.x, location.y);
        const result = hitResults.shift();
        if (!result || result.gameObject.tag != "selectable") return null;
        return result;
    }

    /**
      *  选择物体，为物体添加描边
      * @param obj     选择的物体
      * @param select     是否选中
      */
    private selectObject(obj: GameObject, select: boolean) {
        let mesh = obj as Model;
        mesh.setPostProcessOutline(select, LinearColor.green, 4);
    }


    //翻转购物车
    private rotateShopCart() {
        let o = GameObject.findGameObjectByName("购物篮")
        let r = o.worldTransform.rotation
        o.rotateTo(new Rotation(r.x, 150, r.z), 0.5, false, () => {
            setTimeout(() => {
                o.rotateTo(r, 1, false, async () => {
                    //todo 顾客排队逻辑
                    this.tableProducts = (await this._customerManager.nextCustomer()).productList;
                });
            }, 2000)
        })
    }

    //商品检查
    productCheck(): number {
        console.log("productCheck: " + this.selectProductList)
        var getScore: number = 0;
        //TODO 检查商品是否为同一类
        if(this.selectProductList != null && this.selectProductList.length > 0) {
            this.selectProductList.forEach(o => {
                o.destroy();
            });
            //TODO 计算得分
            getScore = this.selectProductList.length;
            this.selectProductList = [];
        }
        this._curScore += getScore;
        return this._curScore;
    }

    //商品称重
    private productWeighing() {

    }

    //下一位顾客
    nextCustomer() {
        this.rotateShopCart();
    }

    getTableProductList(): Product[] {
        return this.tableProducts;
    }
}