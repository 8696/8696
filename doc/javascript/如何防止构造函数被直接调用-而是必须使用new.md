# 如何防止构造函数被直接调用，而是必须使用 new

在JavaScript中，原型链是不可缺少的一部分，也是JavaScript经典的一部分之一，而构造函数又是原型链的基础。

构造函数之所以被称为构造函数，其实是为了实现类的概念。但是构造函数其实就是函数。那么、既然是函数就可以直接进行调用，问题来了，怎么防止被直接调用呢？

### 一、new.target

`new.target`是`ES6`为`new`运算符引入的一个新属性

先看一下MDN上对它的描述：

-  `new.target`属性允许你检测函数或构造方法是否是通过`new`运算符被调用的。在通过`new`运算符被初始化的函数或构造方法中，`new.target`返回一个指向构造方法或函数的引用。在普通的函数调用中，`new.target`的值是`undefined`

普通函数中
```javascript
function say() {
  console.log(new.target) // undefined
}
say()
```
如上代码：输出`undefined`,那么检测可以这么写
```javascript
function T() {
  if (new.target !== T) {
    throw new Error('该构造函数必须使用new调用');
  }
}
T(); // error
new T(); // 通过
```
但是需要注意的是，由于`new.target`是`ES6`引入的，所以IE并不支持，不然是最完美的解决方案

### 二、构造函数里面声明严格模式

在严格模式下，函数被直接调用时禁止`this`指向window，那么可以通过`this`来判断
```javascript
function T() {
  'use strict';
  console.log(this) // undefined
}
T()
```
可以看到在严格模式下，函数被直接调用`this`是`undefined`，那么在使用`new`操作符下，`this`指向的是该对象，所以就可以通过`this`是否为`undefined`来判断
```javascript
function T() {
  'use strict';
  if (this === undefined) {
    throw new Error('该构造函数必须使用new调用');
  }
}
T(); // error
new T(); // 通过
```
### 三、使用 instanceof 判断
`instanceof`运算符用于检测构造函数的`prototype`属性是否出现在某个实例对象的原型链上

`instanceof` 用法
```javascript
function B() {
}
let b = new B();
console.log(b instanceof B); // true
console.log(Object.getPrototypeOf(b) === B.prototype); // true
```
结合用法可以做如下判断
```javascript
function T() {
  if (!(this instanceof T)) {
   throw new Error('该构造函数必须使用new调用');
  }
}
T();
new T() // 通过
```
上述代码中，由于直接通过`T()`调用时`this`指向`window`，而`Object.getPrototypeOf(window)`结果是`Window`，并非是构造函数本身

`instanceof`还可以防止直接被挂在到其他对象下面调用，因为构造函数里面的`this`此时指向`obj`，如下
```javascript
function T() {
  if (!(this instanceof T)) {
    throw new Error('该构造函数必须使用new调用');
  }
}
let obj = {};
obj.a = T; // 将构造函数挂到对象下面
obj.a(); // error
```
虽然看上去`instanceof`已经很完美，但是仍然有一个缺陷，就是当该构造函数被作为`原型`方式继承时无法检测
```javascript
function T() {
  if (!(this instanceof T)) {
    throw new Error('该构造函数必须使用new调用');
  }
}
function Y() {
}
Y.prototype = new T(); // 原型继承
Y.prototype.say = T; // 添加方法
Y.prototype.constructor = Y;
new Y().say(); // 通过
```
