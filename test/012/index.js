class BaseMode {
  constructor(fields, modelData = {}) {
    Object.keys(fields).forEach(field => {
      this[field] = modelData[field] !== undefined && typeof fields[field].map === 'undefined'
        ? modelData[field]
        : (fields[field].map
          ? fields[field].map(modelData)
          : fields[field].default);
    });
    // 定义一个不可枚举属性
    Object.defineProperty(this, '__fields__',
      {value: fields, enumerable: false});
  }

  /**
   * @description 获取保存时需要的字段
   * */
  getSaveFieldsData() {
    let obj = {};
    Object.keys(this.__fields__).forEach(field => {
      if (this.__fields__[field].save === true) {
        obj[field] = this[field];
      }
    });
    return obj;
  }

  /**
   * @description 获取更新时需要后端提交的字段
   * @return {Object}
   * */
  getUpdateFieldsData() {
    let obj = {};
    Object.keys(this.__fields__).forEach(field => {
      if (this.__fields__[field].update === true) {
        obj[field] = this[field];
      }
    });
    return obj;
  }

  /**
   * @description 保存 model
   * @param api {Function} 提供返回 promise 的函数
   * @return {Promise}
   * */
  save(api) {
    return api(this.getSaveFieldsData());
  }

  /**
   * @description 更新 model
   * @param api {Function} 提供返回 promise 的函数
   * @return {Promise}
   * */
  update(api) {
    return api(this.getUpdateFieldsData());
  }

  /**
   * @description 克隆一份 model
   * @return {Object}
   * */
  clone() {
    // 继承原型
    let model = Object.create(Object.getPrototypeOf(this));
    // 拷贝可枚举属性
    Object.keys(this).forEach(key => {
      model[key] = this[key];
    });
    Object.defineProperty(model, '__fields__', {value: this.__fields__});
    return model;
  }
}


class DemoModel extends BaseMode {
  constructor(modelData) {
    const fields = {
      id: {type: Number, default: '', desc: 'ID', update: true},
      username: {type: String, default: '', desc: '用户名', save: true, update: true},
      createTime: {type: String, default: '', desc: '创建时间', save: false, update: false},
      _createTime: {
        type: String, default: '',
        desc: '创建时间(格式化)', save: false,
        update: false, map({createTime}) {
          if (createTime) {
            return new Date(createTime).getFullYear() +
              '/' + (new Date(createTime).getMonth() + 1) +
              '/' + (new Date(createTime).getDate());
          }
        }
      },

    };
    super(fields, modelData);
  }
}

let demoModel = new DemoModel({
  id: 1,
  // username: 'long',
  createTime: new Date().getTime()
});

console.log(demoModel);


let UserModel = {
  useID: {
    type: Number,
    defaultValue: 0,
    allowEmpty: false
  },
  username: {
    type: String,
    defaultValue: '',
    allowEmpty: false,
    minLength: 6,
    maxLength: 16
  },
  status: {
    type: Number,
    defaultValue: 0,
    enum: [0, 1]
  }
};


