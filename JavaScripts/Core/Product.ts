
export default class Product {
    private _id: number;
    private name: number;
    private weight: number;
    private price: number;
    private tween1: Tween<Vector>;
    private tween2: Tween<Vector>;
    private tween3: Tween<Vector>;

    public get id(): number {
        return this._id;
    }
 
    public set id(value: number) {
        if (value < 0) throw new Error("ID不能为负数");
        this._id = value;
    }
    
    /**商品预制体 */
    private _prefab: GameObject;
    private _assistId: string;

    public getPrefab(): GameObject {
        return this._prefab;
    }

    /**构造函数，new的时候传入一个位置来进行初始化 */
    constructor(bornPos: Vector, assistId: string) {
        this._assistId = assistId;
        this.init(bornPos)
    }

    /**初始化DaoDan */
    private async init(bornPos: Vector) {
        // 使用对象池来创建预制体，并设置预制体的位置
        this._prefab = await GameObjPool.asyncSpawn(this._assistId, GameObjPoolSourceType.Prefab)
        this._prefab.worldTransform.position = bornPos;
        this._prefab.tag = "selectable"
    }

    public moveToTarget(targetPos: Vector) {
        let endPos = targetPos.clone();
        let startPos: Vector = this._prefab.worldTransform.position.clone();
        let targetPos1: Vector = startPos.clone().add(new Vector(0, 0, 50));
        this.tween1 = new Tween(startPos).to(targetPos1, 300)
        .easing(TweenUtil.Easing.Cubic.Out)
        .onStart((value) => {
            let m = this._prefab as Model
            m.physicsEnabled = false
        }).onUpdate((value) => {
            console.log("tween1 onUpdate")
            if(this._prefab) {
                this._prefab.worldTransform.position = value
            }
        })

        let target2: Vector = endPos.clone().add(new Vector(0, 0, 10));
        this.tween2 = new Tween(targetPos1).to(target2, 500)
        .easing(TweenUtil.Easing.Cubic.Out)
        .onUpdate((value) => {
            console.log("tween2 onUpdate")
            if(this._prefab) {
                this._prefab.worldTransform.position = value
            }
        })
        .onComplete((value) => {
            if(this._prefab) {
                // 进行射线检测
                const hitResult = QueryUtil.lineTrace(value, endPos, false, false);
                const result = hitResult.shift()
                if(result && result.gameObject.tag == "selectable") {
                    let z = result.impactPoint.z
                    endPos.z = z;
                }
                this.tween3.start();
            }
            
        })

        this.tween3 = new Tween(target2).to(endPos, 500)
        .easing(TweenUtil.Easing.Cubic.Out)
        .onUpdate((value) => {
            console.log("tween3 onUpdate")
            if(this._prefab) {
                this._prefab.worldTransform.position = value
            }
        })
        .onComplete((value) => {
            let m = this._prefab as Model
            m.physicsEnabled = true
        })


        this.tween1.chain(this.tween2).start()
    }

    /**判断预制体是否创建完毕 */
    public isReady(): Promise<boolean> {
        return new Promise((res) => {
            if (this._prefab != null) {
                res(true);
            } else {
                let index = 0
                let id = setInterval(() => {
                    index++
                    if (this._prefab != null) {
                        clearInterval(id)
                        res(true);
                    } else if (index > 300) {
                        clearInterval(id)
                        res(false)
                    }
                }, 30);
            }
        })
    }

    public destory() {
        if(this.tween1) {
            this.tween1.stopChainedTweens();
        }
        if(this.tween3) {
            this.tween3.stop();
        }
        // 回收预制体
        GameObjPool.despawn(this._prefab)
        this._prefab = null;
    }
}