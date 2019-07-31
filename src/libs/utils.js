/**
 *
 * @param obj 被处理对象
 * @param keyPattern 要处理的键的pattern
 * @param fn 处理函数 (key, value) => newValue
 * @return {Object}
 */
export function objectMap (obj, keyPattern, fn) {
  const result = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      result[key] = keyPattern.test(key) ? fn(key, value) : value
    }
  }
  return result
}
