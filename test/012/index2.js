class BaseModel {
  constructor(fields, data) {
    // 遍历字段名称
    Object.keys(fields).forEach(field => {

      this[field] =
        // 判断是否存在map方法，存在则优先调用
        typeof fields[field].map === 'function'
          ? fields[field].map(data)
          // 判断构造参数是否存在该属性，否则使用默认值
          : (data.hasOwnProperty(field) ? data[field] : fields[field].defaultValue);
    });
  }
}

class UserModel extends BaseModel {
  constructor(data) {
    const fields = {
      id: {type: Number, defaultValue: 0},
      username: {type: String, defaultValue: ''},
      createTime: {
        type: String, defaultValue: '',
        // 添加一个map方法，会在遍历字段时调用，接收一个参数：实例构造对象。
        map({createTime}) {
          return new Date(createTime).getFullYear() + '-' + (new Date(createTime).getMonth() + 1);
        }
      },
      // 添加多一个描述，使用map方法实现自动添加属性
      _createTime: {
        type: String, defaultValue: '',
        map({createTime}) {
          return new Date(createTime).getFullYear() + '-' + (new Date(createTime).getMonth() + 1);
        }
      },
    };
    super(fields, data);
  }
}

let user = new UserModel({
  id: 2019,
  username: 'long',
  createTime: new Date().getTime(),
});
console.log(user);
/*
UserModel {
  id: 2019,
  username: 'long',
  createTime: '2020-4',
  _createTime: '2020-4'
}
* */
