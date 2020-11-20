/**
 * 扁平数据=>树型嵌套结构
 * @param {扁平数据} list
 * @param {参数} option
 */
export function flat2nest(
  list,
  option = { idKey: "id", pIdKey: "parentId", detached: true }
) {
  const cache = {};
  let roots = [];

  const { idKey, pIdKey, detached } = option;

  console.log("list", list.length);
  console.time("flat2nest");

  /**
   * 思路：循环所有节点，对每个节点进行如下动作
   *  1. 找父亲，没父亲则为根节点
   *  2. 找到父亲，将当前节点添加进父亲的children数组
   *
   * 利用对象引用的原理，最终只要返回roots数组即可
   */
  list.forEach(item => {
    const pid = item[pIdKey];
    // 1. 父亲id不存在，根节点
    if (!pid) {
      return roots.push(item);
    }
    const childNode = item;
    const parentNode = getNodeByPropId(pid);
    /**
     * 2. 指明了父亲id，但根本不存在对应节点，两种处理
     *  (1) 直接丢弃，并且在控制台输出错误信息
     *  (2) 直接作为根节点
     */
    if (!parentNode) {
      return detached
        ? roots.push(item)
        : console.error(`${childNode.name} 的父亲，id为 ${pid} 的节点不存在`);
    }
    // 3. 找到父亲后，将自己添加进父亲的children数组
    const children = (parentNode.children = parentNode.children || []);
    if (!children.includes(childNode)) {
      children.push(childNode);
    }
  });

  console.timeEnd("flat2nest");

  /**
   * 根据id获取节点
   * @param {节点id} id
   */
  function getNodeByPropId(id) {
    if (cache[id]) {
      return cache[id];
    }
    const node = list.find(item => item[idKey] === id);
    if (node) {
      cache[id] = node;
      return node;
    }
    return null;
  }

  return roots;
}
