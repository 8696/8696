class Index {
  useID = {
    type: Number,
    defaultValue: 0,
    allowEmpty: false,
    references: {
      // Model: Classes,
      filed: 'userID'
    }
  };
  username = {
    type: String,
    defaultValue: '',
    allowEmpty: false,
    minLength: 6,
    maxLength: 16
  };
  status = {
    type: Number,
    defaultValue: 0,
    enum: [0, 1]
  };
}

console.log(new Index().status)
