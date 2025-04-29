import Product from "./Product";
 
export class Customer {
    // 私有属性声明 
    private _id: number;
    private _productList: Product[];

    constructor(id: number) {
        this._id = id;
        this._productList = [];  // 默认空数组 
    }
 
    public get id(): number {
        return this._id;
    }
 
    public set id(value: number) {
        if (value < 0) throw new Error("ID不能为负数");
        this._id = value;
    }
 
    public get productList(): Product[] {
        return [...this._productList];  // 返回副本防止外部修改
    }

    public set productList(productList: Product[]){
        this._productList = productList;
    }
 
    public addProduct(product: Product): void {
        this._productList.push(product); 
    }
 
    public removeProduct(productId: number): void {
        this._productList = this._productList.filter(p => p.id !== productId);
    }

    public destroy() {
        if(this._productList && this._productList.length > 0) {
            this._productList.forEach((p) => {
                p.destory();
            });
            this._productList = [];
        }
    }
}