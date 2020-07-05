# JS继承方案及优缺点

继承就是在已有类的基础上创建新的类的过程，已有类称为`父类`，新类称为`子类`。也就是说`子类`可以访问`父类`的属性和方法


### 一、原型链继承

其实 `JavaScript继承` 最根本都是基于原型链继承，即使是 `ES6 class` 。只不过 `class` 换了一个语法糖。那么第一个 `原型链继承` 可以认为是最简单粗暴的继承。

```javascript
// 父类
function Person() {
}

Person.prototype.say = function () {
  console.log('我的职业是' + this.position);
};

// 子类
function Teacher() {
  // 子类特有属性
  this.position = '老师';
}

// 继承
Teacher.prototype = new Person();

new Teacher().say(); // 我的职业是老师
```

这个方式会有个问题，就是父类的某个属性是引用类型时会产生问题

```javascript
// 父类
function Person() {
  // 授课列表
  this.teachList = [];
}

// 子类
function Teacher() {
}

// 继承
Teacher.prototype = new Person();

// 实例化两位老师
let zhangSan = new Teacher();
let liSi = new Teacher();
// 张三开始授课语文
zhangSan.teachList.push('语文');
// 张三和李四的授课都出现了语文
console.log(zhangSan.teachList); // [ '语文' ]
console.log(liSi.teachList); // [ '语文' ]
```

解决方法是将属性都写在子类`构造函数`体内

```javascript
// 父类
function Person() {
}

// 子类
function Teacher() {
  // 授课列表
  this.teachList = [];
}

// 继承
Teacher.prototype = new Person();

// 实例化两位老师
let zhangSan = new Teacher();
let liSi = new Teacher();
// 张三开始授课语文
zhangSan.teachList.push('语文');
// 李四
console.log(zhangSan.teachList); // [ '语文' ]
console.log(liSi.teachList); // []
```


**扩展**：其实不管是继承还是不继承类，都不应该将`属性`写在原型上。所以一般的写法都是这样子的

```javascript
function Teacher(name) {
  // 将属性写在构造函数内
  this.teachList = [];
  this.name = name;
}
// 方法挂在原型上
Teacher.prototype.sayName = function () {
  return this.name;
};
```


### 二、构造函数继承

构造函数继承是通过 call 父类来实现。这种方式可以解决原型链继承的问题，但是没有使用到原型链

```javascript
// 父类
function Person() {
  // 授课列表
  this.teachList = [];
}

// 子类
function Teacher() {
  // 构造函数继承
  Person.call(this);
}

// 实例化两位老师
let zhangSan = new Teacher();
let liSi = new Teacher();
// 张三开始授课语文
zhangSan.teachList.push('语文');
console.log(zhangSan.teachList); // [ '语文' ]
// 李四
console.log(liSi.teachList); // []

```

可以看到李四仍然还是没有授课列表，但是这种方式没有没有使用原型链

```javascript
// 父类
function Person() {
  // 授课列表
  this.teachList = [];
}

Person.prototype.sayTeachList = function () {
  console.log('授课列表：' + this.teachList.join('-'));
};

// 子类
function Teacher() {
  // 构造函数继承
  Person.call(this);
}

let zhangSan = new Teacher();
// 不存在 sayTeachList 方法
zhangSan.sayTeachList(); // zhangSan.sayTeachList is not a function
```

用另一种方式给 `Teacher` 添加 `sayTeachList`

```javascript
// 父类
function Person() {
  // 授课列表
  this.teachList = [];
  this.sayTeachList = function () {
    console.log('授课列表：' + this.teachList.join('-'));
  };
}

// 子类
function Teacher() {
  // 构造函数继承
  Person.call(this);
}

let zhangSan = new Teacher();
zhangSan.teachList.push('语文');
zhangSan.teachList.push('数学');
// 存在 sayTeachList 方法
zhangSan.sayTeachList(); // 授课列表：语文-数学
// 这种方式会给每个实例都增加一个方法，从而影响性能
console.log(zhangSan.hasOwnProperty('sayTeachList')); // true
```
但是这种方式是子类通过 `call` 父类的方式，最终是给每个子类的实例都增加了 `sayTeachList` 方法。并不像是继承的概念，因为会给每个实例都新增 `sayTeachList` 方法

### 三、组合继承

综合上面两种方法即是组合继承，用原型链方式来继承方法。用构造函数方式来继承属性。

```javascript
// 父类
function Person() {
  // 授课列表
  this.teachList = [];
}

Person.prototype.sayTeachList = function () {
  console.log('授课列表：' + this.teachList.join('-'));
};

// 子类
function Teacher() {
  // 构造函数继承属性
  Person.call(this);
}

// 继承原型
Teacher.prototype = new Person();
Teacher.prototype.constructor = Teacher;

let zhangSan = new Teacher();
let liSi = new Teacher();
zhangSan.teachList.push('语文');

liSi.teachList.push('数学');

zhangSan.sayTeachList();  // 授课列表：语文
liSi.sayTeachList();      // 授课列表：数学

// false 因为 hasOwnProperty 方法是原型上的方法
console.log(zhangSan.hasOwnProperty('sayTeachList')); // false
```

### 四、混入方式

通过合并其他对象的方式的方式进行继承

```javascript
// 父类
function Person() {
}

Person.prototype.sayName = function () {
  console.log('我的名字：' + this.name);
};

// 子类
function Teacher(name) {
  this.name = name;
}

Teacher.prototype = Object.assign(Teacher.prototype, Person.prototype);
// Teacher.prototype = Object.assign(Teacher.prototype,其他);
Teacher.prototype.constructor = Teacher;

let zhangSan = new Teacher('张三');
zhangSan.sayName();  // 我的名字：张三
```
这种方式很方便，但是如果混入对象中存在属性，有可能会导致原型链继承方式的问题。但是通过在子类构造函数体内重写就可以解决这个问题，所以这个方式不能继承属性

### 五、寄生式继承

寄生式继承即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象

```javascript
function extend(original) {
  let obj = Object(original);
  // 增强对象
  obj.sayName = function () {
    console.log('我的名字：' + this.name);
  };
  return obj;
}

function Teacher(name) {
  this.name = name;
}

let zhangSan = extend(new Teacher('张三'));
zhangSan.sayName(); // 我的名字：张三
```

这种方式，最终其实也是给每个实例增加方法。

### 六、寄生组合式继承

寄生组合式是结合借用构造函数传递参数和寄生模式实现继承，以使用构造函数继承属性、使用寄生模式增强对象

```javascript
function extend(S, P) {
  // 创建父类原型副本
  let prototype = Object.create(P.prototype);
  prototype.constructor = S;
  S.prototype = prototype;
}

// 父类
function Person(name) {
  this.name = name;
  this.teachList = [];
}

Person.prototype.sayName = function () {
  console.log('我的名字：' + this.name);
};

Person.prototype.sayTeachList = function () {
  console.log('授课列表：' + this.teachList.join('-'));
};

// 子类
function Teacher(name, age) {
  Person.call(this, name);
  this.age = age;
}

// 将父类原型指向子类
extend(Teacher, Person);

// 扩展子类方法
Teacher.prototype.sayAge = function () {
  console.log('我的年龄：' + this.age);
};

let zhangSan = new Teacher('张三', 23);
let liSi = new Teacher('李四', 24);
zhangSan.teachList.push('语文');
liSi.teachList.push('数学');
//
zhangSan.sayAge();  // 我的年龄：23
liSi.sayAge();    // 我的年龄：24
zhangSan.sayTeachList(); // 授课列表：语文
liSi.sayTeachList();  // 授课列表：数学
```

### 七、ES6 extends

`ES6` 的 `extends` 语法糖，无疑是最好的解决方案了。有关它和原型链的关系。[点此查看](#doc/javascript/再谈对象和原型链.md) [查看继承](https://es6.ruanyifeng.com/#docs/class-extends)
