<template>
  <div class="map-legend" v-if="legendVisible">
    <div class="remove-all">
      <el-button
        type="text"
        title="全部清空"
        class="button"
        @click="removeAllEntities"
      >
        全部清空
      </el-button>
    </div>
    <div class="legend">
      <div v-for="(item, index) in legend" :key="index" class="legend-item">
        <div
          class="item"
          :title="item.label"
          @click="handleLegendItemClick(item)"
        >
          <img :src="item.image" :alt="item.label" class="img" />
          <div class="description">{{ item.label }}</div>
          <div class="count">
            {{ `(${countCollection[item.type] || 0})` }}
          </div>
        </div>
        <div class="switch">
          <i
            class="el-icon-view"
            title="切换显示"
            :class="{
              'is-active': entitiesVisibleCollection[item.type]
            }"
            @click="handleLegendVisibleClick(item)"
          ></i>
          <i
            class="el-icon-delete"
            title="移除"
            @click="handleLegendDeleteClick(item)"
          ></i>
          <i
            class="el-icon-aim"
            title="切换攻击范围"
            :class="{
              'is-active': entitiesAttackAvailableCollection[item.type]
            }"
            @click="handleAttackClick(item)"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { emitter, EventType } from "../src/EventEmitter";
import { findTargetLegend } from "../src/Methods";

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      legendData: {}
    };
  },

  computed: {
    legendVisible() {
      const { entitiesCollection = [] } = this.legendData;

      return !!entitiesCollection.length;
    },
    entitiesJsonCollection() {
      if (this.legendData) {
        return this.legendData.entitiesJsonCollection;
      }

      return {};
    },
    legend() {
      if (this.legendData) {
        return Object.keys(this.entitiesJsonCollection).map(key => {
          // 取每组的第一个，得到目标图例
          const [first] = this.entitiesJsonCollection[key];
          const { group, groupCategory, category } = first;
          const type = group ? groupCategory : category;
          const targetLegend = findTargetLegend(type);
          const { image } = targetLegend;

          return {
            image,
            label: key,
            type: key,
            group
          };
        });
      }

      return [];
    },
    countCollection() {
      if (this.legendData) {
        return Object.keys(this.entitiesJsonCollection).reduce(
          (previous, current) => {
            previous[current] = this.entitiesJsonCollection[current].length;

            return previous;
          },
          {}
        );
      }

      return {};
    },
    entitiesVisibleCollection() {
      const { entitiesVisibleCollection = {} } = this.legendData;

      return entitiesVisibleCollection;
    },
    entitiesAttackAvailableCollection() {
      const { entitiesAttackAvailableCollection = {} } = this.legendData;

      return entitiesAttackAvailableCollection;
    }
  },

  watch: {},

  created() {
    this.initEventListener();
  },

  mounted() {},

  methods: {
    /**
     * 初始化事件监听
     */
    initEventListener() {
      emitter.on(
        EventType.LEGEND_DATA_CHANGE,
        this.handleLegendDataChange,
        this
      );
    },
    /**
     * 图例数据更新
     */
    handleLegendDataChange(data) {
      this.legendData = JSON.parse(JSON.stringify(data));
    },
    /**
     * 清空地图上的所有实体
     */
    removeAllEntities() {
      emitter.emit(EventType.REMOVE_ALL_ENTITIES);
      emitter.emit(EventType.POPPER_REMOVE);
      emitter.emit(EventType.CONTEXT_MENU_REMOVE);
      emitter.emit(EventType.SELECTED_ENTITY, null);
    },
    /**
     * 点击图例项，飞到项里的最后一个
     */
    handleLegendItemClick(item) {
      const { type } = item;
      const collection = this.entitiesJsonCollection[type];
      const last = [...collection].pop();

      emitter.emit(EventType.FLY_TO_ENTITY, last);
    },
    /**
     * 点击图例显示图标
     */
    handleLegendVisibleClick(item) {
      const { type } = item;
      const show = this.entitiesVisibleCollection[type];

      emitter.emit(EventType.SET_ENTITIES_VISIBLE_BY_TYPE, {
        type,
        value: !show
      });
    },
    /**
     * 点击图例删除图标
     */
    handleLegendDeleteClick(item) {
      const { type } = item;

      emitter.emit(EventType.DELETE_ENTITIES_BY_TYPE, type);
      emitter.emit(EventType.POPPER_REMOVE);
      emitter.emit(EventType.CONTEXT_MENU_REMOVE);
      emitter.emit(EventType.SELECTED_ENTITY, null);
    },
    /**
     * 点击攻击范围图标
     */
    handleAttackClick(item) {
      const { type } = item;
      const entityShow = this.entitiesVisibleCollection[type];
      const attackShow = this.entitiesAttackAvailableCollection[type];

      if (!entityShow) {
        return;
      }

      emitter.emit(EventType.SET_ATTACK_VISIBLE_BY_TYPE, {
        type,
        value: !attackShow
      });
    },
    /**
     * 触发事件
     */
    emitEvent(type, payload) {
      this.$emit("event", type, payload);
    }
  }
};
</script>

<style lang="scss" scoped>
.map-legend {
  width: 224px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0px 4px 0px 0px;

  .remove-all {
    padding-left: 8px;

    .button {
      color: #fafafa;
    }
  }

  .legend {
    max-height: 500px;
    border-top: 1px solid rgba(255, 255, 255, 1);
    overflow: auto;

    .legend-item {
      display: flex;
      align-items: center;
      padding: 8px;
      color: #fafafa;

      & + .legend-item {
        margin-top: 4px;
      }

      .item {
        display: flex;
        align-items: center;
        cursor: pointer;

        .img {
          width: 20px;
          height: 24px;
        }

        .description {
          margin-left: 8px;
          font-size: 14px;
        }

        .count {
          font-size: 12px;
          margin-left: 4px;
        }
      }

      .switch {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        margin-left: 4px;

        i {
          font-size: 16px;
          cursor: pointer;
        }

        i + i {
          margin-left: 8px;
        }

        .is-active {
          color: orange;
        }
      }
    }
  }
}
</style>

