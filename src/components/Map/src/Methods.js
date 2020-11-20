import legendJson from "../mock/legend.json";
import { groupBy as _groupBy } from "lodash";

/** 计算圆线上的所有点位置
 * @returns {[]}
 */
function calculateCircleOutlineGeometry(options = {}) {
  const { center = [], radius } = options;
  const [lng, lat] = center;
  const circleOutlineGeometry = new Cesium.CircleOutlineGeometry({
    center: Cesium.Cartesian3.fromDegrees(lng, lat),
    radius: radius
  });

  const geometry = Cesium.CircleOutlineGeometry.createGeometry(
    circleOutlineGeometry
  );
  const float64ArrayPositions = [...geometry.attributes.position.values];

  // 将一维数组转换成二维数组，然后再转成一维数组
  const length = float64ArrayPositions.length / 3;
  const positions = Array.from({ length: length }, (value, index) => {
    const x = 3 * index;
    const y = 3 * index + 1;
    const z = 3 * index + 2;

    return [
      float64ArrayPositions[x],
      float64ArrayPositions[y],
      float64ArrayPositions[z]
    ];
  }).reduce((previous, current) => {
    const [x, y, z] = current;

    previous.push(new Cesium.Cartesian3(x, y, z));

    return previous;
  }, []);
  const [first] = positions;

  positions[positions.length] = first;

  return positions;
}

/**
 * 计算椭圆的点位置
 */
function computeEllipsePositions(options = {}) {
  const { center, radius } = options;
  const ellipsePositions = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
    {
      center: center,
      semiMajorAxis: radius,
      semiMinorAxis: radius,
      rotation: 0,
      granularity: 0.005
    },
    false,
    true
  );
  const positions = Cesium.Cartesian3.unpackArray(
    ellipsePositions.outerPositions
  );
  const [first] = positions;

  positions[positions.length] = first;

  return positions;
}

/**
 * 根据key得到属性
 */
function getPropsByKey() {}

const toString = new Proxy(Object.prototype.toString, {
  apply(target, ctx, arg) {
    const [call, type] = arg;

    if (arg.length > 1) {
      return (
        Reflect.apply(target, call, arg) === Reflect.apply(target, type, arg)
      );
    }

    const result = Reflect.apply(target, arg[0], arg);

    return result;
  }
});

// 字典
const propsKeyMap = {
  // 通用
  经度: "lng",
  纬度: "lat",
  id: "id",
  名称: "name",
  最大作战半径: "radius",
  最小作战半径: "minRadius",
  国家: "country",
  类别: "groupCategory", // 决定分组group的图标

  // 分类category才有的
  装备类别: "category", // 决定图标
  装备类型: "type",
  parent: "membership",
  children: "deployment",
  部署数量: "deployCount",
  挂载方案: "accessory",

  // 分组group才有的
  类型: "groupType",
  group: "group",
  部署设施: "groupDeployment"
};

// 因为后端传的是英文，主要是给得到汉字用
const extraTransferredKeyMap = {
  membership: "隶属",
  deployment: "部署装备"
};

/**
 * 得到转换的key字典，返回object
 * @returns {object}
 */
function getTransferredKeys() {
  const props = Object.entries(propsKeyMap).reduce((previous, current) => {
    const [key, value] = current;

    previous[value] = key;

    return previous;
  }, {});

  Object.assign(props, extraTransferredKeyMap);

  return props;
}

/**
 * 转换数据的key，返回对象，getValueOf()返回原始值
 * @param {object} 源数据
 * @returns {object}
 */
function transferPropsKey(propsObject = {}) {
  const obj = {};

  Object.entries(propsKeyMap).forEach(([key, value]) => {
    if (propsObject.hasOwnProperty(key)) {
      obj[key] = propsObject[key];
      obj[value] = propsObject[key];
    }
  });
  obj.getValueOf = function() {
    return { ...propsObject };
  };

  return obj;
}

/**
 * 查到目标图例
 * @param {string} value 对比的值
 * @returns {object}
 */
function findTargetLegend(value) {
  const targetLegend = legendJson.find(legend => legend.markType === value);

  if (!targetLegend) {
    console.log("[findTargetLegend]", "未知图例类型");

    return {
      ...legendJson[0],
      markType: value
    };
  }

  return targetLegend;
}

/**
 * 转换分组group数据
 */
function processGroupData(groupData = []) {
  return groupData.map(item => {
    const {
      id,
      name,
      lng,
      lat,
      groupCategory,
      groupType = groupCategory,
      radius = 0,
      country
    } = transferPropsKey(item);

    return {
      id,
      name,
      lng,
      lat,
      groupCategory,
      groupType,
      group: groupCategory,
      radius,
      country
    };
  });
}

/**
 * 转换分类category数据
 * @param {object} [options]
 * @param {object} [options.flat] 数据是否扁平
 */
function processCategoryData(categoryData = [], options = {}) {
  const { flat } = options;

  return categoryData.map(item => {
    const {
      id,
      name,
      lng,
      lat,
      groupCategory,
      category,
      type,
      radius,
      membership = {},
      deployment = [],
      deployCount = "1",
      accessory = []
    } = transferPropsKey(item);
    let country;

    if (flat) {
      country = transferPropsKey(item).country;
    } else {
      const { country: countryKey } = getTransferredKeys();

      country = membership[countryKey];
    }

    return {
      id,
      name,
      lng,
      lat,
      groupCategory,
      category,
      type,
      radius,
      country,
      membership,
      deployment,
      deployCount,
      accessory
    };
  });
}

/**
 * 内容分组
 */
function groupBy(data, value) {
  if (data.length) {
    return _groupBy(data, item => {
      if (value) {
        return item[value];
      } else {
        const { group, groupType, type } = item;

        return group ? groupType : type;
      }
    });
  }

  return {};
}

export {
  calculateCircleOutlineGeometry,
  computeEllipsePositions,
  getPropsByKey,
  getTransferredKeys,
  transferPropsKey,
  findTargetLegend,
  processGroupData,
  processCategoryData,
  groupBy
};

export default {
  calculateCircleOutlineGeometry,
  computeEllipsePositions,
  getPropsByKey,
  getTransferredKeys,
  transferPropsKey,
  findTargetLegend,
  processGroupData,
  processCategoryData,
  groupBy
};
