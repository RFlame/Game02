
@Component
export default class Zhuozi extends Script {

     /** 当前触摸屏幕选定的物体 */
     inTouchObject: GameObject = null;

     private beforeTime: number = 0;

     private targetPos = new Vector(32.45513916015625, -67.49803161621094, 80)

    selectModel: Array<GameObject> = []

 
     /** 当脚本被实例后，会在第一帧更新前调用此函数 */
     protected onStart(): void {
         this.initTouch();
         // 设置全局描边效果
         SelectionUtil.setGlobalOutlineParams(4, 0.4, 0.8, 0, 1);
         this.useUpdate = true;
     }
 
     /** 初始化绑定触摸事件 */
     initTouch() {
         InputUtil.onTouchBegin((index, location, touchType) => {
            let clickTime = Date.now();
            if(clickTime - this.beforeTime < 500) {
                console.log("onTouchBegin 双击 this.inTouchObject:" + this.inTouchObject)
                if(this.inTouchObject) {
                    if(this.selectModel.length == 0 || !this.selectModel.includes(this.inTouchObject)) {
                        this.selectModel.push(this.inTouchObject);
                    }                    
                    this.moveToTargetByTween(this.inTouchObject.worldTransform.position, this.targetPos)
                }
            } else {
                this.beforeTime = clickTime;
                this.onTouchBegin(index, location, touchType);
            }
         })
         InputUtil.onTouchMove((index, location, touchType) => {
            //  this.onTouchMove(index, location, touchType);
         })
         InputUtil.onTouchEnd((index, location, touchType) => {
            //  this.onTouchEnd(index, location, touchType);
         })
     }


     private moveToTargetByTween(currentPosition:Vector, targetPosition: Vector) {
        let m = this.inTouchObject as Model
        m.physicsEnabled = false
        let targetPosition1 = new Vector(currentPosition.x,
            currentPosition.y,
            currentPosition.z + 30)
       let tween1 = new Tween(currentPosition).to(targetPosition1, 200).onUpdate((obj) => {
               this.inTouchObject.worldTransform.position = obj;
           }).onComplete((object) => {
               let tween2 = new Tween(targetPosition1).to(targetPosition, 500).onUpdate((obj) => {
                   // 每一次更新，改变物体targetObj的位置
                   this.inTouchObject.worldTransform.position = obj;
               }).onComplete((object) => {
                   let m = this.inTouchObject as Model
                       m.physicsEnabled = true
               })
               tween2.start()
           })
       tween1.start();
     }

     private async ObjTweenStart(targetX: number, targetY: number, targetZ: number) {
        // 查找物体
        let targetObj = await GameObject.asyncFindGameObjectById("FE9CD8A8")
        // 根据传入值创建目标点坐标
        let targetPosition = new Vector(targetX, targetY, targetZ)
        let tween = new Tween(targetObj.worldTransform.position).to(targetPosition, 1000).onUpdate((obj) => {
            // 每一次更新，改变物体targetObj的位置
            targetObj.worldTransform.position = obj;
        })
        tween.start()
    }
 
 
     /**
      * 触摸开始
      * @param index      触摸的索引
      * @param location   触摸的位置
      * @param touchType     触摸类型
      * @returns 
      */
     onTouchBegin(index: number, location: Vector2, touchType: TouchInputType) {
         console.log(`onTouchBegin: ${index}`);
         this.trySelectObjAtPosition(location);
 
     }
 
     /**
      *  触摸移动
      * @param index      触摸的索引
      * @param location   触摸的位置
      * @param touchType     触摸类型
      */
     onTouchMove(index: number, location: Vector2, touchType: TouchInputType) {
        console.log(`onTouchMove: ${index}`);
         if (this.inTouchObject) {
             this.moveUpdate(location);
         }
     }
 
     /**
      *  触摸结束
      * @param index      触摸的索引
      * @param location   触摸的位置
      * @param touchType     触摸类型
      * @returns 
      */
     onTouchEnd(index: number, location: Vector2, touchType: TouchInputType) {
         console.log(`TouchEnd: ${index},`);
         if (this.inTouchObject) {
            this.selectObject(this.inTouchObject, false);
        }
         this.inTouchObject = null;
     }
 
     /**
      *  尝试选择物体
      * @param location  触摸屏幕的位置
      * @returns 
      */
     trySelectObjAtPosition(location: Vector2) {
         const result = this.getTouchObjectAtPosition(location);
         if (!result) return;
         let f = this.selectModel.includes(result.gameObject);
         if(this.selectModel.length > 0 && f) return;
         
         if(this.inTouchObject == null) {
            this.inTouchObject = result.gameObject;
            this.selectObject(result.gameObject, true);
         } else {
            if(this.inTouchObject != result.gameObject) {
                this.selectObject(this.inTouchObject, false);
                this.inTouchObject = result.gameObject;
                this.selectObject(result.gameObject, true);
            }
         }
         
     }
 
     /**
      *  获取触摸屏幕的物体
      * @param location  触摸屏幕的位置
      * @returns 
      */
     getTouchObjectAtPosition(location: Vector2) {
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
     selectObject(obj: GameObject, select: boolean) {
         let mesh = obj as Model;
         mesh.setPostProcessOutline(select, LinearColor.green, 4);
     }
 
     /**
      * 拖动更新未知
      * @param location 触摸屏幕的位置
      */
     moveUpdate(location: Vector2) {
         // 找到触摸屏幕的位置对应3d世界的地板的碰撞点
         const hitResult = ScreenUtil.getGameObjectByScreenPosition(location.x, location.y, 10000, true);
         const groundResult = hitResult.find(e => e.gameObject.name == "桌面");
         if (groundResult) {
             const pos = groundResult.impactPoint;
             pos.z += 10
             this.inTouchObject.worldTransform.position = pos;
         }
     }
}