import DefaultUI_Generate from "./ui-generate/DefaultUI_generate";

export default class DefaultUI extends DefaultUI_Generate {

	private spawnPostion: Vector = new Vector(96.62222290039062,-170.6253662109375,122)
	
	/** 仅在游戏时间对非模板实例调用一次 */
    protected  onStart() {
		
    }
	


	/** 
	 * 构造UI文件成功后，onStart之后 
	 * 对于UI的根节点的添加操作，进行调用
	 * 注意：该事件可能会多次调用
	 */
	protected onAdded() {
	}

	/** 
	 * 构造UI文件成功后，onAdded之后
	 * 对于UI的根节点的移除操作，进行调用
	 * 注意：该事件可能会多次调用
	 */
	protected onRemoved() {
	}

	/** 
	* 构造UI文件成功后，UI对象再被销毁时调用 
	* 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
	*/
	protected onDestroy() {
	}

	/**
	* 每一帧调用
	* 通过canUpdate可以开启关闭调用
	* dt 两帧调用的时间差，毫秒
	*/
	//protected onUpdate(dt :number) {
	//}

	/**
	 * 设置显示时触发
	 */
	//protected onShow(...params:any[]) {
	//}

	/**
	 * 设置不显示时触发
	 */
	//protected onHide() {
	//}

	/**
	 * 当这个UI界面是可以接收事件的时候
	 * 手指或则鼠标触发一次Touch时触发
	 * 返回事件是否处理了
	 * 如果处理了，那么这个UI界面可以接收这次Touch后续的Move和End事件
	 * 如果没有处理，那么这个UI界面就无法接收这次Touch后续的Move和End事件
	 */
	//protected onTouchStarted(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
	//	return EventReply.unHandled; //EventReply.handled
	//}

	/**
	 * 手指或则鼠标再UI界面上移动时
	 */
	//protected onTouchMoved(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
	//	return EventReply.unHandled; //EventReply.handled
	//}

	/**
	 * 手指或则鼠标离开UI界面时
	 */
	//protected OnTouchEnded(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
	//	return EventReply.unHandled; //EventReply.handled
	//}

	/**
	 * 当在UI界面上调用detectDrag/detectDragIfPressed时触发一次
	 * 可以触发一次拖拽事件的开始生成
	 * 返回一次生成的拖拽事件 newDragDrop可以生成一次事件
	 */
	//protected onDragDetected(InGemotry :Geometry,InPointerEvent:PointerEvent):DragDropOperation {
	//	return this.newDragDrop(null);
	//}

	/**
	 * 拖拽操作生成事件触发后经过这个UI时触发
	 * 返回true的话表示处理了这次事件，不会再往这个UI的下一层的UI继续冒泡这个事件
	 */
	//protected onDragOver(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation):boolean {
	//	return true;
	//}

	/**
	 * 拖拽操作生成事件触发后在这个UI释放完成时
	 * 返回true的话表示处理了这次事件，不会再往这个UI的下一层的UI继续冒泡这个事件
	 */
	//protected onDrop(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation):boolean {
	//	return true;
	//}

	/**
	 * 拖拽操作生成事件触发后进入这个UI时触发
	 */
	//protected onDragEnter(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation) {
	//}

	/**
	 * 拖拽操作生成事件触发后离开这个UI时触发
	 */
	//protected onDragLeave(InGemotry :Geometry,InDragDropEvent:PointerEvent) {
	//}
	
	/**
	 * 拖拽操作生成事件触发后，没有完成完成的拖拽事件而取消时触发
	 */
	//protected onDragCancelled(InGemotry :Geometry,InDragDropEvent:PointerEvent) {
	//}

}
