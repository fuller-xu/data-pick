/**
 * bean字段后缀常量,用来获取属性值的bean类型
 */
const BEAN_SUFFIX = "__bean__";

/**
 * 返回properties数组中的字段的对象
 * @param {Object} obj 对象数据
 * @param {Object} instance 对象bean空实例
 */
const filterField = (obj, instance) => {
  const properties = Object.keys(instance);
  let result = Object.create(null);
  properties.forEach(field => {
    // 首先判断对象的属性是否还是个对象，如果是，就获取该属性值类型的方法，再根据类型筛选
    let beanField = `${field}${BEAN_SUFFIX}`;
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
  return jsonPick(data, classType);
};

module.exports = {
  dataPick,
  MAPPER_BEAN
};
