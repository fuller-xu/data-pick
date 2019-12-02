/**
 * bean字段后缀常量,用来获取属性值的bean类型
 */
const PREFIX_BEAN = "__bean__";

/**
 * 返回固定格式的字段
 * @param {String} field
 */
const getFieldWithPrefix = field => `${PREFIX_BEAN}${field}`;

/**
 * 获取实例的属性集合
 * @param {Object} instance
 */
const getProperties = instance => Object.keys(instance);

/**
 * 循环属性
 * @param {Array} properties 属性集合
 * @param {Function} fn 执行函数
 * @param {Any} args 参数
 */
const forEachFields = (properties, fn, ...args) => {
  properties.forEach(field => {
    fn && fn(field, ...args);
  });
};

/**
 * 给固定格式的字段设置隐藏。方便使用者遍历使用。
 * @param {String} field
 */
const setFieldHidden = (field, instance) => {
  let beanField = getFieldWithPrefix(field);
  if (beanField in instance) {
    const oldVal = instance[beanField];
    delete instance[beanField];
    Object.defineProperty(instance, beanField, {
      value: oldVal,
      enumerable: false,
      configurable: true,
      writable: true
    });
  }
};

/**
 * 返回properties数组中的字段的对象
 * @param {Object} obj 对象数据
 * @param {Object} instance 对象bean空实例
 */
const filterField = (obj, instance) => {
  let result = Object.create(null);
  // 首先判断对象的属性是否还是个对象，如果是，就获取该属性值类型的方法，再根据类型筛选
  forEachFields(getProperties(instance), field => {
    let beanField = getFieldWithPrefix(field);
    if (beanField in instance) {
      result[field] = dataPick(obj[field], instance[beanField]);
    } else result[field] = obj[field];
  });
  return result;
};

/**
 * 直接传入json数据
 * @param {Object|Array} data // 元数据
 * @param {Object} instance // 数据实例
 */
const jsonPick = (data, instance) => {
  if (Array.isArray(data)) {
    return data.map(item => filterField(item, instance));
  } else {
    return filterField(data, instance);
  }
};

/**
 * 传入class 定义的类型
 * @param {Object|Array} data 元数据
 * @param {Class|Object} classType 需要转换的class类型或者json对象
 */
const dataPick = (data, classType) => {
  if (!data || typeof data !== "object") return data;
  if (
    !classType ||
    (typeof classType !== "function" && typeof classType !== "object")
  ) {
    throw new Error("The second param is expected to be a function or object");
  }
  if (typeof classType === "function") {
    // let instance = Object.create(classType.prototype);
    // classType.call(instance);
    // 上面两行等同于下面的一行
    let instance = Reflect.construct(classType, []);
    return jsonPick(data, instance);
  }
  // typeof classType === "object"
  else {
    // 设置字段类型为不可枚举
    let instance = classType;
    forEachFields(getProperties(instance), setFieldHidden, instance);
    return jsonPick(data, instance);
  }
};

module.exports = {
  dataPick,
  PREFIX_BEAN
};
