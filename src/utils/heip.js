/**
 * 扁平数据=>树型嵌套结构
 * TODO 有空测试下性能
 * @param {扁平数据} list
 * @param {参数} option
 */
export function flat2nest(list, option = {}) {
  const cache = {};
  let roots = [];

  const {
    idKey = "id", // 支持链式调用，如 properties.id
    pIdKey = "parentId", // 支持链式调用
    isKeyChain = true, // 设为false，关闭idKey和pIdKey的链式调用
    detached = true,
    sortKey = "", // 指定排序字段，若为空，不排序
    order = "ascending", // ascending: 升序，descending: 降序
    traverse = () => { } // traverse(node, parent) 若不存在父亲，则parent为null
  } = option;

  // 排序相关
  const ascending = (a, b) => a[sortKey] - b[sortKey];
  const descending = (a, b) => b[sortKey] - a[sortKey];
  const sortFunc = order === "descending" ? descending : ascending;
  const doSort = arr => arr.length > 1 && arr.sort(sortFunc);
  /**
   * 思路：循环所有节点，对每个节点进行如下动作
   *  1. 找父亲，没父亲则为根节点
   *  2. 找到父亲，将当前节点添加进父亲的children数组
   *
   * 利用对象引用的原理，最终只要返回roots数组即可
   */
  list.forEach(item => {
    const pid = isKeyChain ? getChainVal(item, pIdKey) : item[pIdKey];
    // 1. 父亲id不存在，根节点
    if (typeof pid === "undefined") {
      traverse(item, null);
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
      if (detached) {
        traverse(childNode, null);
        roots.push(childNode);
        return;
      }
      return console.error(
        `${childNode.name} 的父亲，id为 ${pid} 的节点不存在`
      );
    }
    // 3. 找到父亲后，将自己添加进父亲的children数组
    const children = (parentNode.children = parentNode.children || []);
    if (!children.includes(childNode)) {
      traverse(childNode, parentNode);
      children.push(childNode);
    }
  });

  // 排序
  if (sortKey) {
    doSort(roots);
    list.forEach(i => i.children && doSort(i.children));
  }

  console.timeEnd("flat2nest");

  /**
   * 根据id获取节点
   * @param {节点id} id
   */
  function getNodeByPropId(id) {
    if (cache[id]) {
      return cache[id];
    }
    const node = list.find(
      item => (isKeyChain ? getChainVal(item, idKey) : item[idKey]) === id
    );
    if (node) {
      cache[id] = node;
      return node;
    }
    return null;
  }

  function getChainVal(obj, propPath) {
    const propList = propPath.split(".");
    let result = undefined;
    try {
      propList.forEach(prop => {
        result = obj[prop];
        obj = result;
      });
    } catch (e) {
      console.error(`'${propPath}'路径不合法`);
      result = undefined;
    }
    return result;
  }

  return roots;
}

/**
 * @author xiezc
 * @time 2020/5/9
 * @description: 控制主题的方法
 * @param {String} theme 选填；目标主题，所要更换的主题；'blue'||'white'||null;默认'blue'
 */
export function themeCtrl(theme) {
  let themeType = theme || localStorage.getItem("experience-theme") || "white";
  const styleSheets = document.querySelectorAll("link[data-theme]");
  // console.log(styleSheets);
  styleSheets.forEach(styleSheet => {
    const theme = styleSheet.getAttribute("data-theme");

    styleSheet.disabled = !(theme === themeType);
  });
  localStorage.setItem("experience-theme", themeType);
}

/**
 * @author xiezc
 * @time 2020/5/9
 * @param: srcObj: 源对象
 * dstObj: 目标对象
 * key: 当前key
 * @return: Function
 * @description: 对象key连接，如
 * {
 *    node: {
 *      color: 'red'
 *    }
 * }
 * 转化后
 * {
 *    'node.color': 'red'
 * }
 */
export function mergeObjectKey(srcObj, dstObj, key) {
  Object.keys(srcObj).forEach(k => {
    let kk = k;

    if (key) kk = key + "." + k;

    if (isObject(srcObj[k])) {
      mergeObjectKey(srcObj[k], dstObj, kk);
    } else {
      dstObj[kk] = srcObj[k];
    }
  });
}

/**
 * @author xiezc
 * @time 2020/5/9
 * @return: Boolean
 * @description: 判断是否是Object类型
 */
export function isObject(obj) {
  return toString.call(obj) === "[object Object]";
}

// 导出语音类
// export { default as IatRecorder } from "./Iat-recorder/index";
export { iatRecorder } from "./Iat-recorder/index";

/**
 * @author xiezc
 * @time 2020/6/22
 * @description 生成不带“-”的UUID方法
 * @param {Number} len 生成UUID的长度，默认36位
 * @param {Number} radix 生成UUID的进制，默认16进制
 * @returns {String} 返回UUID
 * */
export function uuid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

/**
 * @author: laidx
 * @time: 2018/12/12
 * @param: -
 * @return: String
 * @description: 该方法会生成一串随机字符串,可用作生成唯一id
 */
export function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

/**
 * @author: laidx
 * @time: 2018/12/12
 * @param: Object || Array
 * @return: Object || Array
 * @description: 深拷贝方法，可以对数组或者对象进行深度拷贝,返回新的对象（数组）
 */
export function clone(obj) {
  // 深拷贝
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== "object") return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

/**
 * @author: laidx
 * @time: 2018/12/12
 * @param: {time: Number, action: Function, context: Object}
 * @return: Function
 * @description: 防抖函数，context绑定上下文，对给定动作（action）在time毫秒内只执行一次，防止连续操作
 */
export function debounce(time, action, context) {
  let timer;
  return (...args) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      action.apply(context, args);
    }, time);
  };
}

/**
 * @author: laidx
 * @time: 2018/12/12
 * @param: {delay: Number, action: Function, context: Object}
 * @return: Function
 * @description: 节流函数，context绑定上下文，对连续的给定动作（action）设为每隔delay毫秒执行一次
 */
export function throttle(delay, action, context) {
  let last = 0;
  return (...args) => {
    let curr = +new Date();
    if (curr - last > delay) {
      action.apply(context, args);
      last = curr;
    }
  };
}

/**
 * @author: laidx
 * @time: 2018/12/12
 * @param: -
 * @return: Function
 * @description: 将变量转换成json字符串，同时删除掉循环套用的属性
 */
export function stringify(v) {
  try {
    var seen = [];
    json = JSON.stringify(v, function (key, val) {
      if (typeof val === "object") {
        if (seen.indexOf(val) >= 0) return;
        seen.push(val);
      }
      return val;
    });
    return json;
  } catch (e) {
    return e;
  }
}

/**
 * @author: LoryHuang
 * @time: 2019/3/25
 * @param: {variable: String}
 * @return: Function
 * @description: 获取url参数
 */
export function getQueryVariable(variable) {
  let search = decodeURIComponent(window.location.href);
  let url = new URL(search);
  if (url.searchParams.has(variable)) {
    return url.searchParams.get(variable);
  } else {
    return false;
  }
  // let search = decodeURIComponent(window.location.search)
  // let query = search.substring(1)
  // let vars = query.split('&')
  // for (let i = 0; i < vars.length; i++) {
  //   let pair = vars[i].split('=')
  //   if (pair[0] === variable) { return pair[1] }
  // }
  // return (false)
}
/**
 * @author: Linyj
 * @time: 2019/11/18
 * @param: {graph: graphData}
 * @return: Function
 * @description: 判断是否是连通图
 */
export function isConnectedGraph(graph) {
  let connected = false;
  let nodeIds = graph.nodes.map(v => v.id);
  let connectedIds = [];
  let tempIds = [];
  connectedIds.push(nodeIds[0]);
  nodeIds.splice(0, 1);
  while (connectedIds.length) {
    tempIds.splice(0);
    graph.edges.forEach(e => {
      if (connectedIds.includes(e.source)) {
        let index = nodeIds.findIndex(item => item === e.target);
        if (index !== -1) {
          tempIds.push(e.target);
          nodeIds.splice(index, 1);
        }
      }
      if (connectedIds.includes(e.target)) {
        let index = nodeIds.findIndex(item => item === e.source);
        if (index !== -1) {
          tempIds.push(e.source);
          nodeIds.splice(index, 1);
        }
      }
    });
    connectedIds = JSON.parse(JSON.stringify(tempIds));
  }
  if (!nodeIds.length) {
    connected = true;
  }
  return connected;
}

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

  // console.log("list", list.length);
  // console.time("flat2nest");

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

/**
 * 将分类数据=>树型嵌套结构
 * TODO 有时间测下方法性能，数据量级
 * @param {图谱实体数据} vertices
 */
export function categoryToTree(vertices) {
  const cache = {};

  let roots = [];
  // console.log("vertices", vertices.length);
  // console.time("flat2nest");
  vertices.forEach(vertice => {
    const pId = vertice.parentId;
    if (!pId) {
      return roots.push(vertice);
    }
    const childNode = vertice;
    const parentNode = getNodeByPropId(pId);
    if (!parentNode) {
      // return console.error(
      //   `${childNode.name} 的父亲，id为 ${pId} 的节点不存在`
      // );
      return roots.push(vertice);
    }
    //
    const children = (parentNode.children = parentNode.children || []);
    if (!children.includes(childNode)) {
      children.push(childNode);
    }
  });
  // console.timeEnd("flat2nest");

  function getNodeByPropId(id) {
    if (cache[id]) {
      return cache[id];
    }
    const node = vertices.find(vertice => vertice.id === id);
    if (node) {
      cache[id] = node;
      return node;
    }
    return null;
  }

  return roots;
}

/**
 * 扁平数据=>树型嵌套结构
 * TODO 有空测试下性能
 * @param {扁平数据} list
 * @param {参数} option
 */
export function flat3nest(list, option = {}) {
  const cache = {};
  let roots = [];

  const {
    idKey = "id", // 支持链式调用，如 properties.id
    pIdKey = "parentId", // 支持链式调用
    isKeyChain = true, // 设为false，关闭idKey和pIdKey的链式调用
    detached = true,
    sortKey = "", // 指定排序字段，若为空，不排序
    order = "ascending", // ascending: 升序，descending: 降序
    traverse = () => { } // traverse(node, parent) 若不存在父亲，则parent为null
  } = option;

  // 排序相关
  const ascending = (a, b) => a[sortKey] - b[sortKey];
  const descending = (a, b) => b[sortKey] - a[sortKey];
  const sortFunc = order === "descending" ? descending : ascending;
  const doSort = arr => arr.length > 1 && arr.sort(sortFunc);
  /**
   * 思路：循环所有节点，对每个节点进行如下动作
   *  1. 找父亲，没父亲则为根节点
   *  2. 找到父亲，将当前节点添加进父亲的children数组
   *
   * 利用对象引用的原理，最终只要返回roots数组即可
   */
  list.forEach(item => {
    const pid = isKeyChain ? getChainVal(item, pIdKey) : item[pIdKey];
    // 1. 父亲id不存在，根节点
    if (typeof pid === "undefined") {
      traverse(item, null);
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
      if (detached) {
        traverse(childNode, null);
        roots.push(childNode);
        return;
      }
      return console.error(
        `${childNode.name} 的父亲，id为 ${pid} 的节点不存在`
      );
    }
    // 3. 找到父亲后，将自己添加进父亲的children数组
    const children = (parentNode.children = parentNode.children || []);
    if (!children.includes(childNode)) {
      traverse(childNode, parentNode);
      children.push(childNode);
    }
  });

  // 排序
  if (sortKey) {
    doSort(roots);
    list.forEach(i => i.children && doSort(i.children));
  }

  console.timeEnd("flat2nest");

  /**
   * 根据id获取节点
   * @param {节点id} id
   */
  function getNodeByPropId(id) {
    if (cache[id]) {
      return cache[id];
    }
    const node = list.find(
      item => (isKeyChain ? getChainVal(item, idKey) : item[idKey]) === id
    );
    if (node) {
      cache[id] = node;
      return node;
    }
    return null;
  }

  function getChainVal(obj, propPath) {
    const propList = propPath.split(".");
    let result = undefined;
    try {
      propList.forEach(prop => {
        result = obj[prop];
        obj = result;
      });
    } catch (e) {
      console.error(`'${propPath}'路径不合法`);
      result = undefined;
    }
    return result;
  }

  return roots;
}

/**
 * 将图谱实体数据=>树型嵌套结构
 * TODO 有时间测下方法性能，数据量级
 * @param {图谱实体数据} vertices
 */
export function verticesToTree(vertices) {
  const cache = {};

  let roots = [];

  vertices.forEach(vertice => {
    const pId = vertice.properties.ParentId;
    if (!pId) {
      return roots.push(vertice);
    }
    const parentNode = getNodeByPropId(pId);
    process(vertice, parentNode);
    if (!parentNode) {
      // return console.error(
      //   `${childNode.properties.name} 的父亲，id为 ${pId} 的节点不存在`
      // );
      return roots.push(vertice);
    }
    //
    process(parentNode);
    const childNode = vertice;
    const children = (parentNode.children = parentNode.children || []);
    if (!children.includes(childNode)) {
      children.push(childNode);
    }
  });

  function process(node, parent) {
    const properties = node.properties;
    node.name = properties.name;
    // 真的是，维护父子关系用node.properties.ID，保存接口又要用node.id
    parent && (node.pid = parent.id);
  }

  function getNodeByPropId(id) {
    if (cache[id]) {
      return cache[id];
    }
    const node = vertices.find(vertice => vertice.properties.ID === id);
    if (node) {
      cache[id] = node;
      return node;
    }
    return null;
  }

  return roots;
}

/**
 * 整合国家数据与实体数据
 * @param {所有国家数据} countries
 * @param {所有实体数据} vertices
 */
export function countryCategoryTree(countries, vertices) {
  countries.forEach(i => (i.children = []));
  vertices.forEach(vertice => {
    const tmp = countries.find(
      country => country.label === vertice.properties["国家"]
    );
    if (tmp) tmp.children.push(vertice);
  });
  return countries;
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

//数字过滤成万
export function graphNumber(value) {
  let number = value;
  if (typeof value !== "number") {
    number = parseFloat(value);
  }
  if (number >= 10000) {
    number = number / 1000;
    number = Math.floor(number);
    number = number / 10;
    number = number + "万";
    return number;
  } else {
    return number;
  }
}