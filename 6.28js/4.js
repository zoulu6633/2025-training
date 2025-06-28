//定义一个animal类，包含构造函数和speak方法，然后拓展子类dog添加bark方法并调用输出"Woof!"，最后创建dog实例并调用speak和bark方法
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + " speak ");
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

const dog = new Dog("dog");
dog.speak(); // "dog speak "
dog.bark();  // "Woof!"