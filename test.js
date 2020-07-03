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

