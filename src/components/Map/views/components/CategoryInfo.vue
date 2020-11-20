<template>
  <div class="category-info">
    <div class="info-list">
      <!-- 显示阶段 -->
      <template v-if="!edit">
        <el-form class="form">
          <el-form-item
            class="info"
            v-for="(info, index) in detailData"
            :key="index"
            :label="info.key"
          >
            <!-- 是否显示查看详细按钮 -->
            <template v-if="isDetail(info)">
              {{ info.value }}
              <el-button type="text" @click="seeDetail(info)">
                查看详细
              </el-button>
            </template>
            <template v-else>{{ info.value }}</template>
          </el-form-item>
        </el-form>
      </template>
      <!-- 编辑阶段 -->
      <template v-if="edit">
        <el-form class="form">
          <template v-for="(info, index) in editData">
            <el-form-item class="info" :key="index" :label="info.key">
              <!-- 是否显示设置按钮 -->
              <template v-if="isConfigButton(info)">
                {{ info.value }}
                <el-button type="text" @click="setConfig(info)">
                  设置
                </el-button>
              </template>
              <!-- 是否显示设置输入框 -->
              <template v-else-if="isConfigInput(info)">
                <el-input
                  v-model="info.value"
                  :placeholder="info.value"
                ></el-input>
              </template>
              <!-- 当然是默认了 -->
              <template v-else>{{ info.value }}</template>
            </el-form-item>
          </template>
        </el-form>
      </template>
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
          v-for="(item, index) in seeDetailData"
          :label="item.key"
          :key="index"
        >
          {{ item.value }}
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 部署装备设置弹窗 -->
    <MapDeployment
      v-if="deploymentVisible"
      @before-close="handleDeploymentBeforeClose"
      @submit="handleDeploymentSubmit"
      :infoData="data"
    />
    <!-- 挂载方案弹窗 -->
    <MapMount
      v-if="mountVisible"
      :current-checked="mountCurrentChecked"
      @before-close="handleMountBeforeClose"
      @submit="handleMountSubmit"
      :infoData="data"
    />
    <!-- 隶属设置弹窗 -->
    <MapMembership
      v-if="membershipVisible"
      @before-close="handleMembershipBeforeClose"
      @submit="handleMembershipSubmit"
      :infoData="data"
    />
  </div>
</template>

<script>
import MapDeployment from "./MapDeployment";
import { mapState } from "vuex";
import { getTransferredKeys, processCategoryData } from "../../src/Methods";
import { emitter, EventType } from "../../src/EventEmitter";
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

import MapMount from "./MapMount";
import MapMembership from "./MapMembership";


export default {
  components: { MapDeployment, MapMount, MapMembership },

  inject: {},

  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      detailData: [],
      editData: [],
      detailDialogVisible: false,
      detailDialogTitle: "",
      deploymentVisible: false,
      membershipVisible: false,
      mountVisible: false,
      seeDetailData: [],
      mountCurrentChecked: []
    };
  },

  computed: {
    ...mapState("graphInfo", ["name"]),
    id() {
      const { id } = this.data || {};

      return id;
    },
    group() {
      const { group } = this.data || {};

      return group;
    }
  },

  watch: {
    data(value) {
      this.generateData();
    }
  },

  created() {
    this.generateData();
  },

  methods: {
    /**
     * 构造信息数据
     */
    generateData() {
      const {
        name: nameKey,
        lng: lngKey,
        lat: latKey,
        category: categoryKey,
        type: typeKey,
        deployment: deploymentKey,
        deployCount: deployCountKey,
        accessory: accessoryKey,
        membership: membershipKey
      } = getTransferredKeys();
      const {
        name,
        lng,
        lat,
        category,
        type,
        deployment,
        deployCount,
        accessory = [],
        membership
      } = this.data;

      const obj = {
        [nameKey]: name,
        [lngKey]: lng,
        [latKey]: lat,
        [categoryKey]: category,
        [typeKey]: type,
        [deploymentKey]: deployment,
        [deployCountKey]: deployCount,
        [accessoryKey]: accessory,
        [membershipKey]: membership
      };

      this.generateDetailData(obj);
      this.generateEditData(obj);
    },
    /**
     * 构造详细信息数据
     */
    generateDetailData(data) {
      const { deployment, membership, accessory } = getTransferredKeys();
      this.detailData = Object.entries(data).map(([key, value]) => {
        const item = {
          key,
          value: value,
          data: value
        };

        if (key === deployment) {
          item.value = value.length ? value[0].name : "";
        }
        if (key === membership) {
          item.value = value ? value.name : "";
        }
        if (key === accessory) {
          item.value = "";
        }

        return item;
      });
    },
    /**
     * 构造编辑信息数据
     */
    generateEditData(data) {
      const { deployment, membership, accessory } = getTransferredKeys();
      const excludesSet = [];

      this.editData = Object.entries(data).reduce((previous, current) => {
        const [key, value] = current;

        if (!excludesSet.includes(key)) {
          const item = {
            key,
            value: value,
            data: value
          };

          if (key === deployment) {
            item.value = value.length ? value[0].name : "";
          }
          if (key === membership) {
            item.value = value ? value.name : "";
          }
          if (key === accessory) {
            item.value = "";
          }

          previous.push(item);
        }

        return previous;
      }, []);
    },
    /**
     * 是否显示查看详细按钮
     */
    isDetail(item) {
      const { key } = item;
      const { deployment, accessory, membership } = getTransferredKeys();
      const includesSet = [deployment, accessory, membership];

      return includesSet.includes(key);
    },
    /**
     * 是否显示设置按钮
     */
    isConfigButton(item) {
      const { key } = item;
      const { deployment, accessory, membership } = getTransferredKeys();
      const includesSet = [deployment, accessory, membership];

      return includesSet.includes(key);
    },
    /**
     * 是否显示设置输入框
     */
    isConfigInput(item) {
      const { key } = item;
      const { name, lng, lat, deployCount } = getTransferredKeys();
      const includesSet = [name, lng, lat, deployCount];

      return includesSet.includes(key);
    },
    /**
     * 查看详细
     */
    async seeDetail(item) {
      const { key, data } = item;
      const { accessory } = getTransferredKeys();
      let obj = data;

      if (key === accessory) {
        obj = await this.getMount();
      }
      if (Array.isArray(data)) {
        obj = data[0] || {};
      }

      this.seeDetailData = Object.entries(obj).map(([keyString, val]) => {
        return {
          key: keyString,
          value: val
        };
      });

      this.detailDialogTitle = key;
      this.detailDialogVisible = true;
    },
    /**
     * 获取挂载方案
     */
    async getMount() {
      if (this.id) {
        const res = await findMountById(this.id, this.name);
        const { success, object, msg } = res.data;

        if (!success) {
          this.$message.error(msg);
        }

        return object || [];
      }

      return [];
    },
    /**
     * 设置属性
     */
    setConfig(info) {
      const { key, data } = info;
      const { deployment, accessory, membership } = getTransferredKeys();

      if (key === deployment) {
        this.deploymentVisible = true;
      } else if (key === accessory) {
        this.mountCurrentChecked = [...data];  //默认选中的
        this.mountVisible = true;
      } else if (key === membership) {
        this.membershipVisible = true;
      }
    },
    /**
     * 部署装备设施组件传来的关闭事件
     */
    handleDeploymentBeforeClose() {
      this.deploymentVisible = false;
      this.seeDetailData = [];
    },
    /**
     * 处理挂载方案组件传来的关闭事件
     */
    handleMountBeforeClose() {
      this.mountVisible = false;
      this.seeDetailData = [];
    },
    /**
     * 处理隶属组件传来的关闭事件
     */
    handleMembershipBeforeClose() {
      this.membershipVisible = false;
      this.seeDetailData = [];
    },
    /**
     * 部署装备确定提交
     */
    handleDeploymentSubmit(children) {
      if (Array.isArray(children)) {
        if (children.length) {
          const { deployment } = getTransferredKeys();
          const target = this.editData.find(({ key }) => key === deployment);

          target.value = children[0].name;
          target.data = children;
        }
      }
    },
    /**
     * 挂载方案确定提交
     */
    handleMountSubmit(accessory) {
      if (Array.isArray(accessory)) {
        const { accessory: accessoryKey } = getTransferredKeys();
        const target = this.editData.find(({ key }) => key === accessoryKey);

        if (accessory.length) {
          const [a, b, c] = accessory;
          const nameCollection = [a, b, c]
            .filter(item => item)
            .map(item => item.label);
          const ids = accessory.map(item => item.id);

          target.value = nameCollection.join("、");
          target.data = ids;
        } else {
          target.value = "";
          target.data = [];
        }
      }
    },
    /**
     * 隶属确定提交
     */
    handleMembershipSubmit(parent) {
      if (typeof parent === "object") {
        if (Object.keys(parent)) {
          const { membership } = getTransferredKeys();
          const target = this.editData.find(({ key }) => key === membership);

          target.value = parent.name;
          target.data = parent;
        }
      }
    },
    /**
     * 提交
     */
    submit() {
      return this.editData;
    }
  }
};
</script>

<style lang="scss" scoped>
.category-info {
  .info-list {
    list-style: none;
    margin: 0;
    padding: 0;

    .form {
      padding: 0 20px;
    }

    .info {
      color: var(--color-text-primary)
    }
  }
}
.map-info-panel-dialog.detail-dialog {
  .dialog-form {
    margin-left: 24px;
  }
}
</style>

