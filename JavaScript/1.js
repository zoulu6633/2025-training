//请你编写一个函数，检查给定的值是否是给定类或超类的实例
var checkIfInstanceOf = function(obj, classFunction) {
    if (obj === null || obj === undefined || classFunction === null || classFunction === undefined) {
        return false;
    }
    // classFunction 必须是函数
    if (typeof classFunction !== 'function') {
        return false;
    }

    return obj.__proto__===  classFunction.prototype||checkIfInstanceOf(obj.__proto__, classFunction);
};

console.log(checkIfInstanceOf(new Date(), Date)); // true
func = () => {
    class Animal {};
    class Dog extends Animal {};
    return checkIfInstanceOf(new Dog(), Animal); // true
};
console.log(func());
func = () => checkIfInstanceOf(Date, Date)
console.log(func());
console.log(checkIfInstanceOf(5, Number)); // true
