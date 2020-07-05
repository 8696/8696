//观察者列表
class ObserverList {
  constructor() {
    this.observerList = [];
  }
  // 添加观察者
  add(obj) {
    return this.observerList.push(obj);
  }
}

//目标
class Subject {
  constructor() {
    this.observers = new ObserverList();
  }
  // 添加观察者
  addObserver(observer) {
    this.observers.add(observer);
  }
  // 发布通知
  notify() {
    this.observers.observerList.forEach(observer => {
      // 调用观察者接口
      observer.update();
    });
  }
}

//观察者
class Observer {
  // 接收通知接口
  update() {
    console.log('update');
  }
}

let subject = new Subject();
subject.addObserver(new Observer());
subject.notify(); // update

let subject2 = new Subject();
subject2.addObserver(new Observer());
subject2.notify(); // update
