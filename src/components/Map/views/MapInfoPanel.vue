<template>
  <div class="GisInfoPanel" :class="[show ? 'show-panel' : 'hide-panel']">
    <transition name="el-fade-in-linear">
      <div class="tab-button" @click="clickTabButton" v-show="!show">
        <div class="text">
          <i class="iconfont icon-left3"></i>
          信息面板
        </div>
      </div>
    </transition>
    <div class="panel-content">
      <div class="top"></div>
      <div class="body">
        <div class="content">
          <div class="close-banner">
            <i class="text iconfont icon-right3" @click="show = false"></i>
            <i
              class="text iconfont"
              :class="[fixed ? 'icon-ding' : 'icon-ding-normal']"
              @click="fixedPanel"
            ></i>
          </div>
          <div slot="title" class="slot-title">
            <span>信息面板</span>
            <i class="el-icon-edit edit" @click="onEdit"></i>
          </div>
          <!-- 针对特殊的字段显示特殊的操作 -->
          <GroupInfo v-if="groupInfoVisible" :data="infoData" :edit="edit" ref="groupInfo" />
          <CategoryInfo
            v-if="categoryInfoVisible"
            :data="infoData"
            :edit="edit"
            ref="categoryInfo"
          />
          <div class="footer" v-if="edit" style="text-align: center; margin-bottom: 20px;">
            <el-button type="primary" @click="submitEdit" size="small">确定</el-button>
            <el-button type="default" @click="cancelEdit" size="small">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看详细弹窗 -->
    <el-dialog
      append-to-body
      class="map-info-panel-dialog detail-dialog"
      :title="detailDialogTitle"
      :visible.sync="detailDialogVisible"
    >
      <el-form class="dialog-form">
        <el-form-item
          v-for="(item, index) in detailData"
          :label="item.key"
          :key="index"
        >{{ item.value }}</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  getTransferredKeys,
  transferPropsKey,
  processCategoryData,
  processGroupData
} from "../src/Methods";
import { emitter, EventType } from "../src/EventEmitter";
import {
  knowledgeDataCreate,
  knowledgeDataUpdate,
  knowledgeDataRadiusQuery,
  knowledgeEquipmentQuery,
  knowledgeEquipmentFindOne,
  geoNodeCreate,
  geoNodeUpdate,
  findMountById
} from "@/assets/api/map";

import GroupInfo from "./components/GroupInfo";
import CategoryInfo from "./components/CategoryInfo";

export default {
  components: {
    GroupInfo,
    CategoryInfo
  },

  inject: ["provide"],

  data() {
    return {
      entityInfo: {},
      infoData: [],
      infoEditData: [],
      edit: false,
      detailDialogTitle: "",
      detailData: [],
      detailDialogVisible: false,
      groupInfoVisible: false,
      categoryInfoVisible: false,
      selectedEntityChange: false,
      id: null,
      entityId: null,
      entityProperties: {},
      show: false,
      fixed: false,
      selectedEntity: null
    };
  },

  computed: {
    ...mapState("graphInfo", ["name"]),
    group() {
      const { group } = this.entityProperties;
      return group;
    }
  },

  watch: {
    //点地图判断是否是已有数据，已有的展开对应的组件
    async selectedEntityChange(value) {
      if (value) {
        if (this.selectedEntity) {
          this.show = true;
          this.groupInfoVisible = false;
          this.categoryInfoVisible = false;

          const { id, entityId } = this.selectedEntity;

          this.id = id;
          this.entityId = entityId;
          this.entityProperties = this.selectedEntity.id.properties.getValue();
          this.infoData = await this.getInfoData(); //属性

          if (this.group) {
            this.groupInfoVisible = true;
          } else {
            this.categoryInfoVisible = true;
          }
        } else {
          ({ id: this.id, entityId: this.entityId } = this.$options.data());
          this.groupInfoVisible = false;
          this.categoryInfoVisible = false;
        }

        this.selectedEntityChange = false;
      }
    }
    //实体改变的时候时候开始编辑
    entityId(value) {
      if (this.selectedEntity) {
        if (!value) {
          this.onEdit();
        } else {
          this.offEdit();
        }
      }
    },
  },

  created() {
    emitter.on(EventType.CLICK_BLANK, this.close, this);
    emitter.on(EventType.CLICK_ENTITY, this.handleSelectedEntityChange, this);
  },
  beforeDestroy() {
    emitter.off(EventType.CLICK_BLANK, this.close);
    emitter.off(EventType.CLICK_ENTITY, this.handleSelectedEntityChange);
  },

  methods: {
    clickTabButton() {
      this.show = !this.show;
    },
    fixedPanel() {
      this.fixed = !this.fixed;
      let message = "面板已锁住";
      if (!this.fixed) {
        message = "面板已解锁";
      }
      this.$message.warning({
        message,
        duration: 1500
      });
    },
    close() {
      this.selectedEntity = null;
      !this.fixed && (this.show = false);
    },
    /**
     * 选中的实体变化
     */
    handleSelectedEntityChange(entity) {
      this.selectedEntity = entity;
      this.selectedEntityChange = true;
    },
    /**
     * 获取列表数据
     */
    async getInfoData() {
      const { properties, entityId } = this.selectedEntity.id;
      const values = properties.getValue();
      const { group } = values;
      let result = values;

      // 已经存在的实体
      if (entityId || entityId === 0) {
        // 请求实体信息
        const data = [await this.getEntityInfo(entityId)];

        [result] = group
          ? processGroupData(data)
          : processCategoryData(data, { flat: true });
      }

      return { ...result };
    },
    /**
     * 获取实体信息
     */
    async getEntityInfo(id) {
      const graphName = this.name;
      const res = await knowledgeEquipmentQuery(id, graphName);
      const { data } = res;
      const { object, success, msg } = data;
      // const { object, success, msg } = mapEntityInfoGroupJson;

      if (!success) {
        this.$message.error(msg);
      }

      return object || [];
    },
    /**
     * 开启编辑模式
     */
    onEdit() {
      this.edit = true;
    },
    /**
     * 关闭编辑模式
     */
    offEdit() {
      this.edit = false;
    },
    /**
     * 确定修改
     */
    async submitEdit() {
      const success = await this.vertexModify();

      if (success) {
        this.edit = false;
      }
    },
    /**
     * 取消修改
     */
    cancelEdit() {
      this.edit = false;
      if (!this.entityId) {
        emitter.emit(EventType.DELETE_ENTITIES_BY_ID, this.id);
        emitter.emit(EventType.CLICK_ENTITY, null);
        emitter.emit(EventType.POPPER_REMOVE);
      }
    },
    /**
     * 部署数据新增和修改
     */
    async vertexModify() {
      let params = {};

      if (this.group) {
        const data = this.$refs.groupInfo.submit();
        const {
          name: nameKey,
          lng: lngKey,
          lat: latKey,
          groupCategory: groupCategoryKey,
          groupType: groupTypeKey,
          country: countryKey
        } = getTransferredKeys();
        const props = data.reduce((previous, current) => {
          const { key, value } = current;

          previous[key] = value;

          return previous;
        }, {});
        const {
          name,
          lng,
          lat,
          groupCategory,
          groupType,
          country
        } = transferPropsKey(props);

        if (!name) {
          this.$message.error(`${nameKey}不能为空`);

          return;
        }
        if (!lng) {
          this.$message.error(`${lngKey}不能为空`);

          return;
        }
        if (!lat) {
          this.$message.error(`${latKey}不能为空`);

          return;
        }
        if (!country) {
          this.$message.error(`${countryKey}不能为空`);

          return;
        }

        const properties = {
          name: name,
          [nameKey]: name,
          [lngKey]: String(lng),
          [latKey]: String(lat),
          [groupCategoryKey]: groupCategory,
          [groupTypeKey]: groupType,
          [countryKey]: country
        };

        params = {
          id: this.entityId,
          name: name,
          graphName: this.name,
          properties: properties,
          labels: this.group
        };
      }
      if (!this.group) {
        const data = this.$refs.categoryInfo.submit();
        const {
          name: nameKey,
          lng: lngKey,
          lat: latKey,
          category: categoryKey,
          type: typeKey,
          deployCount: deployCountKey,
          deployment: deploymentKey,
          accessory: accessoryKey,
          membership: membershipKey
        } = getTransferredKeys();
        const props = data.reduce((previous, current) => {
          const { key, value, data } = current;

          if (key === deploymentKey) {
            const deployment = data.length ? data[0].name : "";

            previous[key] = deployment;
          } else {
            previous[key] = value;
          }

          return previous;
        }, {});
        const {
          name,
          lng,
          lat,
          category,
          type,
          deployCount
        } = transferPropsKey(props);
        // 部署装备
        const { data: children } = data.find(
          ({ key }) => key === deploymentKey
        );
        // 挂载方案
        const { data: accessory } = data.find(
          ({ key }) => key === accessoryKey
        );
        // 隶属
        const { data: parent } = data.find(({ key }) => key === membershipKey);
        const { id: childrenId } = children[0] || {};
        const { id: parentId } = parent;

        if (!name) {
          this.$message.error(`${nameKey}不能为空`);

          return;
        }
        if (!lng) {
          this.$message.error(`${lngKey}不能为空`);

          return;
        }
        if (!lat) {
          this.$message.error(`${latKey}不能为空`);

          return;
        }
        if (!childrenId) {
          this.$message.error(`${deploymentKey}不能为空`);

          return;
        }
        if (!parentId) {
          this.$message.error(`${membershipKey}不能为空`);

          return;
        }

        const properties = {
          [nameKey]: name,
          [lngKey]: String(lng),
          [latKey]: String(lat),
          [categoryKey]: category,
          [typeKey]: type,
          [deployCountKey]: deployCount || "1"
        };

        params = {
          graphName: this.name,
          properties: properties,
          groupId: parentId,
          equipmentId: childrenId,
          accessoryId: accessory,
          edgeId: this.entityId
        };
      }

      let result = {};
      // 新增或修改
      if (this.entityId) {
        result = this.group
          ? await this.geoNodeUpdate(params)
          : await this.knowledgeDataUpdate(params);
      } else {
        result = this.group
          ? await this.geoNodeCreate(params)
          : await this.knowledgeDataCreate(params);
      }
      console.log("保存的结果数据", result);
      const { success } = result;

      if (success) {
        this.entityModify(result);
      }

      return success;
    },
    /**
     * group分组新增
     */
    async geoNodeCreate(vertexDTO) {
      const res = await geoNodeCreate(vertexDTO);
      const { data } = res;
      const { success, msg } = data;

      if (!success) {
        this.$message.error(msg);
      } else {
        this.$message.success(msg);
      }

      return data;
    },
    /**
     * group分组编辑
     */
    async geoNodeUpdate(vertexDTO) {
      const res = await geoNodeUpdate(vertexDTO);
      const { data } = res;
      const { success, msg } = data;

      if (!success) {
        this.$message.error(msg);
      } else {
        this.$message.success(msg);
      }

      return data;
    },
    /**
     * 部署数据新增
     */
    async knowledgeDataCreate(vertexDTO) {
      const res = await knowledgeDataCreate(vertexDTO);
      const { data } = res;
      const { success, msg } = data;

      if (!success) {
        this.$message.error(msg);
      } else {
        this.$message.success(msg);
      }

      return data;
    },
    /**
     * 部署数据编辑
     */
    async knowledgeDataUpdate(vertexDTO) {
      const res = await knowledgeDataUpdate(vertexDTO);
      const { data } = res;
      const { success, msg } = data;

      if (!success) {
        this.$message.error(msg);
      } else {
        this.$message.success(msg);
      }

      return data;
    },
    /**
     * 修改到地图中实体
     */
    entityModify(result) {
      // TODO
      const { object } = result;
      const { labels } = object;
      let res = object;

      // group分组
      if (labels) {
        res = object.properties;
      }

      const {
        id,
        name,
        lng,
        lat,
        groupCategory,
        groupType,
        category,
        type,
        radius
      } = transferPropsKey(res);
      const props = {
        id: labels ? object.id : id,
        name,
        lng,
        lat,
        radius,
        groupCategory
      };
      const oldId = this.id;

      Object.assign(
        props,
        labels
          ? {
              groupType: groupCategory,
              group: groupCategory
            }
          : {
              category,
              type
            }
      );

      // labels ? this.groupModify(props): this.deploymentModify(props)
      emitter.emit(EventType.DELETE_ENTITIES_BY_ID, oldId);
      emitter.emit(EventType.RENDER_DATA, [props]);

      const { gisvis } = this.provide();
      const { viewer } = main;
      const newEntity = viewer.entities.getById(props.id);
      const cartesian = newEntity.position.getValue();
      const position = viewer.scene.cartesianToCanvasCoordinates(cartesian);

      viewer.selectedEntity = newEntity;
      emitter.emit(EventType.POPPER_CREATE, {
        position,
        name,
        canMove: true,
        create: false
      });
      emitter.emit(EventType.CLICK_ENTITY, newEntity);
    },
    /**
     * group分组修改
     */
    groupModify(props) {},
    /**
     * 部署设施修改
     */
    deploymentModify() {}
  }
};
</script>

<style lang="scss" scoped>
.GisInfoPanel {
  position: fixed;
  top: 3.58rem;
  right: 0;
  width: 23rem;
  height: calc(100vh - 3.58rem);
  background-color: var(--background-color-panel);
  border-top: 2px var(--color-dark) solid;
  transition: all 0.5s;

  .text {
    color: var(--color-text-regular);
    cursor: pointer;

    &:hover {
      color: var(--color-text-primary);
    }
  }

  .tab-button {
    position: absolute;
    top: calc(50vh - 8.43rem);
    left: -31px;
    width: 31px;
    box-sizing: border-box;
    cursor: pointer;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    background-color: var(--background-color-panel);
    padding: 12px 8px;
  }

  .panel-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .top {
      flex-shrink: 0;
    }

    .body {
      flex-grow: 1;
      overflow: auto;

      .content {
        .close-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
        }

        /deep/ .el-collapse-item__header {
          padding-left: 16px;
          padding-right: 16px;
          color: var(--color-text-regular);
          font-size: 15px;
          font-weight: 600;
        }

        .collapse-body {
          padding-right: 16px;
          padding-left: 16px;
        }

        .properties {
          display: flex;
          color: var(--color-text-regular);
          margin: 4px 0;
          flex-wrap: wrap;

          // div {
          //   padding-bottom: 10px;
          // }

          .label {
            display: block;
            text-align: right;
            width: 68px;
            color: var(--color-text-primary);
            font-weight: var(--font-weight-primary-bold);
            font-size: var(--font-size-base);
          }
          .value {
            display: block;
            flex: 1;
            word-break: break-word;
          }
        }

        .labels {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .avatar-name {
          .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 8.3rem;
            background-color: var(--background-color-item);
            img {
              display: block;
              width: 8.3rem;
              height: 100%;
            }
          }
          .name {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.show-panel {
  right: 0;
}

.hide-panel {
  right: -23rem;
}
.map-info-panel {
  width: 30vw;
  height: calc(100vh - 3.58rem);
  position: fixed;
  top: 3.58rem;
  right: -30vw;
  transition: right 0.3s;

  &.is-active {
    right: 0;
  }

  .toggle-btn {
    position: absolute;
    top: 50%;
    left: 0;
    padding: 12px 8px;
    border-radius: 4px;
    transform: translate(-100%, -50%);
    color: #bfbfbf;
    background-color: #414141;
    text-align: center;
    cursor: pointer;
    writing-mode: vertical-lr;

    &:hover {
      color: #fafafa;
    }
  }

  .drawer {
    position: initial;

    .slot-title {
      .edit {
        margin-left: 4px;
        cursor: pointer;

        &:hover {
          color: #fafafa;
        }
      }
    }

    .footer {
      text-align: center;
    }
  }
}

.map-info-panel-dialog.detail-dialog {
  .dialog-form {
    margin-left: 24px;
  }
}
</style>

<style lang="scss" scoped>
.map-info-panel-drawer.drawer {
  &,
  *,
  *:focus {
    outline: none;
  }
}
.slot-title {
  height: 45px;
  color: #bfbfbf;
  padding-left: 19px;
}
</style>
