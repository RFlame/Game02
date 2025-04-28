import Product from "./Product";
import ShopCart from "./ShopCart";

export default class GamePlayManager {

    private static _instance: GamePlayManager = null;
   
    private spawnPostion: Vector = new Vector(96.62222290039062,-170.6253662109375,122)
    private modelsId: string = "106F9D464E669E8AF8E00C82DACA1303;AB7293E847E44B49BD740F97187BB906;F05A9ECC474EBEE5BBB265A527C57A0A;76479E3043960FD06EB4858C67537D0F;3EC7AFF54DFCD7455A16BDAD5DCE5E82;A182B57D484336EC33A2CBB42D75D9CF;54195465478EDB0944658A990A85C4C4;A19FCFFA449AD3362D3B00AB38F3AF65;71F3B28B4E8C427DE2A28C96823044AC;7891055C48BCB70EBA09F0B8FE81A5E8;90B9BCEB41C97588175AF699E218E79E";
	private modlesIdList = this.modelsId.split(";")
    private shopCartList: Map<string, ShopCart> = new Map();

    //移动到盘子的坐标
    private targetPos = new Vector(32.45513916015625, -67.49803161621094, 80)
    private beforeTime: number = 0;
    private tableProductList: GameObject[] = [];
    private selectProductList: GameObject[] = [];
    private curSelectObject: GameObject = null;
    //当前得分
    private _curScore: number = 0;

   
    private constructor() {}
   
    public static getInstance(): GamePlayManager {
        if(!this._instance) {
            this._instance = new GamePlayManager();
        }
        return this._instance;
    }

    public init() {
        this._curScore = 0;
        this.generateShopCartList();
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
        console.log("doubleClickTableProduct position:" + location + ",object name:" + result.gameObject.name)
        if(this.curSelectObject && this.curSelectObject == result.gameObject) {
            if(this.selectProductList.length == 0 || !this.selectProductList.includes(this.curSelectObject)) {
                this.selectProductList.push(this.curSelectObject);
            }               
            //移动模型到盘子里
            //TODO 每个模型的移动动画单独管理，防止连续快点动画冲突     
            this.moveToTargetByTween(this.curSelectObject.worldTransform.position, this.targetPos)
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

    //移动模型到目标位置
    private moveToTargetByTween(currentPosition:Vector, targetPosition: Vector) {
        let m = this.curSelectObject as Model
        m.physicsEnabled = false
        let targetPosition1 = new Vector(currentPosition.x,
            currentPosition.y,
            currentPosition.z + 30)
       let tween1 = new Tween(currentPosition).to(targetPosition1, 200).onUpdate((obj) => {
               this.curSelectObject.worldTransform.position = obj;
           }).onComplete((object) => {
               let tween2 = new Tween(targetPosition1).to(targetPosition, 500).onUpdate((obj) => {
                   // 每一次更新，改变物体targetObj的位置
                   this.curSelectObject.worldTransform.position = obj;
               }).onComplete((object) => {
                   let m = this.curSelectObject as Model
                       m.physicsEnabled = true
               })
               tween2.start()
           })
       tween1.start();
     }
    
   //生成购物篮队列
   private generateShopCartList() {
        this.tableProductList = [];
        for (let i = 0; i < 40; i++) {
            const randomIndex = Math.floor(Math.random()  * this.modlesIdList.length); 
            if(SystemUtil.isClient()) {
                TimeUtil.delayExecute(() => {
                    // console.log("spawn: " + this.modlesIdList[randomIndex] + ",spawnPostion:" + this.spawnPostion)
                    GameObject.asyncSpawn(this.modlesIdList[randomIndex]).then((object) => {
                    object.tag = "selectable"
                    object.worldTransform.position = this.spawnPostion
                    this.tableProductList.push(object);
                })
                }, 15*i)
            }
        }
        // var totalTime: number = 0
        // totalTime += (15 * 40 * (1000 / 60)) + 1000
        // setTimeout(() => {
        //     this.rotateShopCart();
        // }, totalTime)
    }

    //翻转购物车
    private rotateShopCart() {
        let o = GameObject.findGameObjectByName("购物篮")
        let r = o.worldTransform.rotation
        console.log("rotateShopCart: " + o)
        o.rotateTo(new Rotation(r.x, 150, r.z), 0.5, false, () => {
            setTimeout(() => {
                o.rotateTo(r, 1)
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

    getTableProductList(): GameObject[] {
        return this.tableProductList;
    }
}