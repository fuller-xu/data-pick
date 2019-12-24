"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _create = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/create"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

/**
 * bean字段后缀常量,用来获取属性值的bean类型
 */
var PREFIX_BEAN = "__bean__";
/**
 * 返回固定格式的字段
 * @param {String} field
 */

var getFieldWithPrefix = function getFieldWithPrefix(field) {
  var _context;

  return (0, _concat.default)(_context = "".concat(PREFIX_BEAN)).call(_context, field);
};
/**
 * 获取实例的属性集合
 * @param {Object} instance
 */


var getProperties = function getProperties(instance) {
  return (0, _keys.default)(instance);
};
/**
 * 循环属性
 * @param {Array} properties 属性集合
 * @param {Function} fn 执行函数
 * @param {Any} args 参数
 */


var forEachFields = function forEachFields(properties, fn) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  (0, _forEach.default)(properties).call(properties, function (field) {
    var _context2;

    fn && fn.apply(void 0, (0, _concat.default)(_context2 = [field]).call(_context2, args));
  });
};
/**
 * 给固定格式的字段设置隐藏。方便使用者遍历使用。
 * @param {String} field
 */


var setFieldHidden = function setFieldHidden(field, instance) {
  var beanField = getFieldWithPrefix(field);

  if (beanField in instance) {
    var oldVal = instance[beanField];
    delete instance[beanField];
    (0, _defineProperty.default)(instance, beanField, {
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


var filterField = function filterField(obj, instance) {
  var result = (0, _create.default)(null); // 首先判断对象的属性是否还是个对象，如果是，就获取该属性值类型的方法，再根据类型筛选

  forEachFields(getProperties(instance), function (field) {
    var beanField = getFieldWithPrefix(field);

    if (beanField in instance) {
      result[field] = dataPick(obj[field], instance[beanField]);
    } else result[field] = obj[field];
  });
  return result;
};
/**
 * 对实例对象进行过滤
 * @param {Object|Array} data // 元数据
 * @param {Object} instance // 数据实例
 */


var jsonPick = function jsonPick(data, instance) {
  if ((0, _isArray.default)(data)) {
    return (0, _map.default)(data).call(data, function (item) {
      return filterField(item, instance);
    });
  } else {
    return filterField(data, instance);
  }
};
/**
 * 返回对应的数据结构
 * @param {Object|Array} data 元数据
 * @param {Class|Object} classType 需要转换的class类型或者json对象
 */


var dataPick = function dataPick(data, classType) {
  if (!data || (0, _typeof2.default)(data) !== "object") return data;

  if (!classType || typeof classType !== "function" && (0, _typeof2.default)(classType) !== "object") {
    throw new Error("The second param is expected to be a function or object");
  }

  var instance;

  if (typeof classType === "function") {
    // let instance = Object.create(classType.prototype);
    // classType.call(instance);
    // 上面两行等同于下面的一行
    instance = (0, _construct.default)(classType, []);
  } // typeof classType === "object"
  else {
      // 设置字段类型为不可枚举
      instance = classType;
      forEachFields(getProperties(instance), setFieldHidden, instance);
    }

  return jsonPick(data, instance);
};

module.exports = {
  dataPick: dataPick,
  PREFIX_BEAN: PREFIX_BEAN
};