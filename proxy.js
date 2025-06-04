let human = {
    name: 'jack',
    age: 20
}
let handler = {
    get: (obj, key, receiver) => {
        console.info('proxy get')
        return key in obj ? obj[key] : undefined
    },
    set: (obj, key, value, receiver) => {
        console.info('proxy set', `receiver==proxy1:${receiver==proxy1}`, `receiver==male:${receiver==male}`)
        if (key == 'name') {
            throw new Error(`can not change property ${key}`)
        }
        obj[key] = value
        return Reflect.set(obj, key, value, receiver)
    },
    deleteProperty: (obj, key, receiver) => {
        console.info('proxy delete');
        if (key == 'name') {
            throw new Error(`can not delete property ${key}`)
            delete obj[key]
            return true
        }
    }
}
let proxy1 = new Proxy(human, handler)
    //赋值name属性报错
proxy1.name = 100; //Uncaught Error: can not change property name at Object.set
// 删除name属性报错
delete proxy1.name; //Uncaught Error: can not delete property name at Object.deleteProperty
male = {}
Object.setPrototypeOf(male, proxy1)

//触发handler的set方法
proxy1.age = 30; //set方法输出 proxy set receiver==proxy1:true receiver==male:false
male.moustache = true; //set方法输出 proxy set receiver==proxy1:false receiver==male:true