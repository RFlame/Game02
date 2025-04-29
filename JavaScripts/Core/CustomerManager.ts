import { Customer } from "./Customer";
import { GameConfig } from "./GameConfig";
import Product from "./Product";

export class CustomerManager {

    private static _instance: CustomerManager = null;
    private constructor() {}
   
    public static getInstance(): CustomerManager {
        if(!this._instance) {
            this._instance = new CustomerManager();
        }
        return this._instance;
    }

    private customerList: Customer[] = [];
    private _currentIndex: number = 0;

    private _currentCustomer: Customer;
    private _nextCustomer: Customer;

    public get currentCustomer(): Customer {
        return this._currentCustomer;
    }

    public async init() {
        await this.generateCustomerList(1);
        this._currentCustomer = this._nextCustomer;
    }


    //生成顾客
    public async generateCustomerList(customerSize: number): Promise<void> {
        this.customerList = [];
        this._currentIndex = 0;
        await Promise.all(Array.from({ length: customerSize }).map((o, index) => {
            console.log("generateCustomerList o:" + o)
            let customer = new Customer(index)
             this.generateProductList(30).then((pl) => {
                customer.productList = pl;
            });
            this.customerList.push(customer)
            })
        )
        // for (let i = 0; i < customerSize; i++) {
        //     let customer = new Customer(i)
        //     customer.productList = await this.generateProductList(30);
        //     this.customerList.push(customer)
        // }
        console.log("generateCustomerList finish customerList:" + this.customerList)
        this._nextCustomer = this.customerList[this._currentIndex];
    }

    //下一个顾客
    public async nextCustomer(): Promise<Customer> {
        // todo 切换顾客逻辑
        // this.customerLeav(this._currentCustomer);
        this._currentCustomer = this._nextCustomer;
        await this.generateCustomerList(1);
        return this._currentCustomer;
        // if(this.currentIndex < this.customerList.length) {
        //     return this.customerList[this.currentIndex];
        // } else {
        //     return null;
        // }
    }

    //顾客离开
    public customerLeav(customer: Customer) {
        customer.destroy();
        this.customerList = this.customerList.filter(c => c.id !== customer.id);
    }

    //生成购物车零食
    private async generateProductList(productSize: number): Promise<Product[]> {
        let productList = [];
        await Promise.all(Array.from({ length: productSize }).map(() => {
            new Promise<Product>(resolve => {
                const randomIndex = Math.floor(Math.random()  * GameConfig.modlesIdList.length); 
                TimeUtil.delayExecute(() => {
                    // console.log("spawn: " + this.modlesIdList[randomIndex] + ",spawnPostion:" + this.spawnPostion)
                    const product: Product = new Product(GameConfig.spawnPostion, GameConfig.modlesIdList[randomIndex])
                    productList.push(product);
                    resolve(product)
                }, 15);
            })
        }))
        return productList;
    }        
    
}