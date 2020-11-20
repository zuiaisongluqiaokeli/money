<template>
  <div class="group-info">
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
            <!-- 是否是分组的部署设施 -->
            <template v-if="isGroupDeployment(info)">
              <el-button type="text" @click="showGroupDeployment">
                载入
              </el-button>
            </template>
            <!-- 是否显示查看详细按钮 -->
            <template v-else-if="isDetail(info)">
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
    <!-- 国家设置弹窗 -->
    <MapCountry
      v-if="countryVisible"
      @before-close="handleCountryBeforeClose"
      @submit="handleCountrySubmit"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getTransferredKeys, processCategoryData } from "../../src/Methods";
import { emitter, EventType } from "../../src/EventEmitter";
import { knowledgeEquipmentFindOne } from "@/assets/api/map";
import MapCountry from "./MapCountry";


export default {
  components: { MapCountry },

  inject: {},

  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      detailData: [], //查看的数据,都是数组对象
      editData: [], //修改的数据,都是数组对象
      countryVisible: false,
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
    },
  },

  watch: {
    data(value) {
      this.generateData();
    },
  },

  created() {
    this.generateData();
  },

  methods: {
    /**
     * 构造信息数据（把{名字：'name',年份:"year"}这样的数据与{name:"12",year:"122"}对照并且合并成为数组对象）
     */
    generateData() {
      const {
        name: nameKey,
        lng: lngKey,
        lat: latKey,
        groupType: groupTypeKey,
        groupCategory: groupCategoryKey,
        country: countryKey,
        groupDeployment: groupDeploymentKey,
      } = getTransferredKeys();
      const {
        name,
        lng,
        lat,
        groupType,
        groupCategory,
        country,
        groupDeployment,
      } = this.data;

      const obj = {
        [nameKey]: name,
        [lngKey]: lng,
        [latKey]: lat,
        [groupTypeKey]: groupType,
        [groupCategoryKey]: groupCategory,
        [countryKey]: country,
        [groupDeploymentKey]: groupDeployment,
      };
      this.generateDetailData(obj);
      this.generateEditData(obj);
    },
    /**
     * 构造详细信息数据
     */
    generateDetailData(data) {
      this.detailData = Object.entries(data).map(([key, value]) => {
        const item = {
          key,
          value: value,
        };

        return item;
      });
    },
    /**
     * 构造编辑信息数据
     */
    generateEditData(data) {
      const { groupDeployment, country } = getTransferredKeys();
      const excludesSet = [groupDeployment];

      this.editData = Object.entries(data).reduce((previous, current) => {
        const [key, value] = current;

        if (!excludesSet.includes(key)) {
          const item = {
            key,
            value: value,
            data: value,
          };

          previous.push(item);
        }

        return previous;
      }, []);
    },
    /**
     * 是否是分组的部署设施
     */
    isGroupDeployment(item) {
      const { key } = item;
      const { groupDeployment } = getTransferredKeys();

      return key === groupDeployment;
    },
    /**
     * 是否显示查看详细按钮
     */
    isDetail(item) {
      const { key } = item;
      const includesSet = [];

      return includesSet.includes(key);
    },
    /**
     * 是否显示设置按钮
     */
    isConfigButton(item) {
      const { key } = item;
      const { country } = getTransferredKeys();
      const includesSet = [country];

      return includesSet.includes(key);
    },
    /**
     * 是否显示设置输入框
     */
    isConfigInput(item) {
      const { key } = item;
      const { name, lng, lat } = getTransferredKeys();
      const includesSet = [name, lng, lat];

      return includesSet.includes(key);
    },
    /**
     * 查看详细
     */
    async seeDetail(info) {},
    /**
     * 载入部署设施
     */
    async showGroupDeployment() {
      if (this.id) {
        const res = await knowledgeEquipmentFindOne(this.id, this.name);
        const { success, object, msg } = res.data;

        if (success) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }

        if (object) {
          const data = processCategoryData(object, { flat: true });

          emitter.emit(EventType.RENDER_DATA, data);
        }
      } else {
        this.$message.info("无部署设施");
      }
    },
    /**
     * 设置属性
     */
    setConfig(item) {
      const { key } = item;
      const { country } = getTransferredKeys();

      if (key === country) {
        this.countryVisible = true;
      }
    },
    /**
     * 处理国家设置组件传来的关闭事件
     */
    handleCountryBeforeClose() {
      this.countryVisible = false;
    },
    /**
     * 国家设置确定提交
     */
    handleCountrySubmit(data) {
      const { country } = getTransferredKeys();

      if (typeof data === "object") {
        const target = this.editData.find(({ key }) => key === country);

        target.value = data.label;
      }
    },
    /**
     * 提交
     */
    submit() {
      return this.editData;
    },
  },
};
</script>

<style lang="scss" scoped>
.group-info {
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
</style>

