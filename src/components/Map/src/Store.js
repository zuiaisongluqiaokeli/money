import { groupBy } from "./Methods";

let _instance = null;

class Store {
  constructor(options = {}) {
    if (_instance) {
      return _instance;
    }

    this.data = [];
    /** 分类后的json数据 */
    this.entitiesJsonCollection = {};
    /** 分类后的billboard实例 */
    this.entitiesCollection = {};
    /** 分类后的billboard实例可视条件 */
    this.entitiesVisibleCollection = {};
    /** 分类后的攻击范围 */
    this.entitiesAttackCollection = {};
    /** 分类后的攻击范围可视条件 */
    this.entitiesAttackAvailableCollection = {};
    this.radarsData=[{name:'雷达名字'}], //所有画圈雷达数据
    this.lastEntity = null;
    this.selectedEntity = null;
    this.measureType = null;

    _instance = this;
    window.StoreInstance = this;

    // this.initEventListener();
  }
  /**
   * 初始化事件监听
   */
  initEventListener() {}
  /**
   * 添加数据
   * @param {array} data
   * @returns {array} 成功加入的数据
   */
  addData(data = []) {
    const res = this.getUniqueData(data);

    this.data.push(...res);
    this.groupData();

    return res;
  }
  /**
   * 数据去重
   * @param {array} data 需要对比的数据
   */
  getUniqueData(data) {
    const res = data.filter(
      item => !this.data.some(({ id }) => item.id === id)
    );

    return res;
  }
  //雷达数据
  setallRadarsData(val){
    this.radarsData = this.radarsData.push(val)
  }
  /**
   * 分类数据，比如是否可见
   */
  groupData() {
    this.entitiesJsonCollection = groupBy(this.data);  //转化成key:arr格式

    const visibleCollection = this.entitiesVisibleCollection;
    const attackAvailableCollection = this.entitiesAttackAvailableCollection;
    const visibleKeys = Object.keys(visibleCollection); //拿到各种type
    const attackKeys = Object.keys(attackAvailableCollection);

    this.entitiesVisibleCollection = {};
    this.entitiesAttackAvailableCollection = {};

    Object.keys(this.entitiesJsonCollection).forEach(key => {
      const entityVisible = visibleCollection[key];
      const attackVisible = attackAvailableCollection[key];

      // 分类后的billboard实例可视条件
      if (visibleKeys.includes(key)) {
        this.entitiesVisibleCollection[key] = entityVisible;
      } else {
        this.entitiesVisibleCollection[key] = true;
      }

      // 分类后的攻击范围可视条件
      if (attackKeys.includes(key)) {
        this.entitiesAttackAvailableCollection[key] = attackVisible;
      } else {
        this.entitiesAttackAvailableCollection[key] = false;
      }
    });
  }
  /**
   * 设置最后一个实体
   */
  setLastEntity(entity = null) {
    this.lastEntity = entity;
  }
  /**
   *  设置选中实体
   */
  setSelectedEntity(entity = null) {
    this.selectedEntity = entity;
  }
  /**
   * 清空所有所有数据
   */
  removeAllData() {
    this.data = [];
    /** 分类后的json数据 */
    this.entitiesJsonCollection = {};
    /** 分类后的billboard实例 */
    this.entitiesCollection = {};
    /** 分类后的billboard实例可视条件 */
    this.entitiesVisibleCollection = {};
    /** 分类后的攻击范围 */
    this.entitiesAttackCollection = {};
    /** 分类后的攻击范围可视条件 */
    this.entitiesAttackAvailableCollection = {};
    this.lastEntity = null;
    this.selectedEntity = null;
  }
  /**
   * 通过id删除数据
   * @param {number|array} ids
   */
  deleteDataById(ids) {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    this.data = this.data.filter(({ id }) => !ids.includes(id));
    this.groupData();
  }
  /**
   * 设置分类的可见性
   */
  setEntityVisibleCollection(type, value) {
    this.entitiesVisibleCollection[type] = value;
  }
  /**
   * 通过类别删除数据
   */
  deleteDataByType(type) {
    const ids = this.entitiesJsonCollection[type].map(({ id }) => id);

    this.deleteDataById(ids);
  }
  /**
   * 设置分类的攻击范围可见性
   */
  setAttackVisibleCollection(type, value) {
    this.entitiesAttackAvailableCollection[type] = value;
  }
  /**
   * 设置测量类型
   */
  setMeasureType(type) {
    this.measureType = type;
  }
}

export { Store };

export default Store;
