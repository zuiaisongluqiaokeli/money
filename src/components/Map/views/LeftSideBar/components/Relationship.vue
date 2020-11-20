<template>
  <div id="editConnectionModal">
    <el-dialog
      title="关联"
      :close-on-click-modal="false"
      :visible="dialogVisible"
      @close="closeDialog"
      v-loading="loading"
      append-to-body
      class="edit-connection-modal"
    >
      <!-- form -->
      <el-form ref="form" class="form" label-width="100px">
        <el-form-item label="关系修改">
          <el-radio-group v-model="type">
            <el-radio-button label="add">新增关系</el-radio-button>
            <el-radio-button label="edit">修改关系</el-radio-button>
            <el-radio-button label="delete">删除关系</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 新增关系 -->
        <div class="add" v-if="type === 'add'">
          <el-form-item label="实体关系">
            <div class="relation">
              <div class="img-wrap">
                <img
                  :src="avatar[0]"
                  alt="实体图片"
                  class="img"
                  :onerror="defaultAvatar"
                />
                <div
                  class="name-text"
                  :title="selectedVertices[0] && selectedVertices[0].name"
                >
                  {{ selectedVertices[0] && selectedVertices[0].name }}
                </div>
              </div>
              <div class="center">
                <div
                  class="rect triangle border hidden left"
                  :class="{ 'is-active': addFormData.direction[0] }"
                  @click="setDirectionByClick(0)"
                ></div>
                <div class="line"></div>
                <div
                  class="rect triangle border hidden right"
                  :class="{ 'is-active': addFormData.direction[1] }"
                  @click="setDirectionByClick(1)"
                ></div>
                <div class="input">
                  <el-input
                    v-model="addFormData.relationName"
                    placeholder="关系名称"
                    maxlength="20"
                  ></el-input>
                  <div class="text">点击箭头可设置关系指向</div>
                </div>
              </div>
              <div class="img-wrap">
                <img
                  :src="avatar[1]"
                  alt="实体图片"
                  class="img"
                  :onerror="defaultAvatar"
                />
                <div
                  class="name-text"
                  :title="selectedVertices[1] && selectedVertices[1].name"
                >
                  {{ selectedVertices[1] && selectedVertices[1].name }}
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="关系属性">
            <div class="relation-props">
              <div
                class="prop"
                v-for="(item, index) in addFormData.relationProps"
                :key="index"
              >
                <el-input
                  v-model="item.key"
                  placeholder="属性名"
                  class="input"
                  maxlength="20"
                ></el-input>
                <el-input
                  v-model="item.value"
                  placeholder="属性值"
                  class="input"
                  maxlength="20"
                ></el-input>
                <i class="el-icon-close icon" @click="deleteProp(index)"></i>
              </div>
              <div class="add-prop">
                <span class="btn" @click="addProp">
                  <i class="el-icon-plus"></i><span>新增关系属性</span>
                </span>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- 修改关系 -->
        <div class="edit" v-if="type === 'edit'">
          <el-form-item label="关系方向">
            <div class="relation-direction">
              <el-select
                v-model="editFormData.currentDirection"
                placeholder="请选择方向"
                @change="handleDirectionChange"
              >
                <el-option value="forward" label="正向"></el-option>
                <el-option value="reverse" label="反向"></el-option>
              </el-select>
              <el-form-item label="关系名称">
                <el-select
                  v-model="editFormData.currentRelationName"
                  value-key="id"
                  placeholder="请选择名称"
                  @change="handleRelationNameChange"
                >
                  <el-option
                    v-for="(item,
                    index) in editFormData.currentRelationNameList"
                    :key="index"
                    :value="item"
                    :label="item.type"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="实体关系">
            <div class="relation">
              <div class="img-wrap">
                <img
                  :src="avatar[0]"
                  alt="实体图片"
                  class="img"
                  :onerror="defaultAvatar"
                />
                <div
                  class="name-text"
                  :title="selectedVertices[0] && selectedVertices[0].name"
                >
                  {{ selectedVertices[0] && selectedVertices[0].name }}
                </div>
              </div>
              <div class="center" v-if="showCenter">
                <div
                  class="rect triangle hidden left"
                  :class="{ 'is-active': editFormData.direction[0] }"
                ></div>
                <div class="line"></div>
                <div
                  class="rect triangle hidden right"
                  :class="{ 'is-active': editFormData.direction[1] }"
                ></div>
                <div class="input">
                  <el-input
                    v-model="editFormData.relationName"
                    placeholder="关系名称"
                    maxlength="20"
                  ></el-input>
                  <div class="change-direction">
                    <i class="el-icon-sort icon" @click="exchangeDirection"></i>
                  </div>
                </div>
              </div>
              <div class="img-wrap">
                <img
                  :src="avatar[1]"
                  alt="实体图片"
                  class="img"
                  :onerror="defaultAvatar"
                />
                <div
                  class="name-text"
                  :title="selectedVertices[1] && selectedVertices[1].name"
                >
                  {{ selectedVertices[1] && selectedVertices[1].name }}
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="关系属性">
            <div class="relation-props">
              <div
                class="prop"
                v-for="(item, index) in editFormData.relationProps"
                :key="index"
              >
                <el-input
                  v-model="item.key"
                  placeholder="属性名"
                  class="input"
                  maxlength="20"
                ></el-input>
                <el-input
                  v-model="item.value"
                  placeholder="属性值"
                  class="input"
                  maxlength="20"
                ></el-input>
                <i class="el-icon-close icon" @click="deleteProp(index)"></i>
              </div>
              <div class="add-prop">
                <span class="btn" @click="addProp">
                  <i class="el-icon-plus"></i><span>新增关系属性</span>
                </span>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- 删除关系 -->
        <div class="delete" v-if="type === 'delete'">
          <el-form-item label="关系方向">
            <div class="relation-direction">
              <el-select
                v-model="deleteFormData.currentDirection"
                placeholder="请选择方向"
                @change="handleDirectionChange"
              >
                <el-option value="forward" label="正向"></el-option>
                <el-option value="reverse" label="反向"></el-option>
              </el-select>
              <el-form-item label="关系名称">
                <el-select
                  v-model="deleteFormData.currentRelationName"
                  value-key="id"
                  placeholder="请选择名称"
                  @change="handleRelationNameChange"
                >
                  <el-option
                    v-for="(item,
                    index) in deleteFormData.currentRelationNameList"
                    :value="item"
                    :label="item.type"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="实体关系">
            <div class="relation">
              <div class="img-wrap">
                <img
                  :src="avatar[0]"
                  alt="实体图片"
                  class="img"
                  :onerror="defaultAvatar"
                />
                <div
                  class="name-text"
                  :title="selectedVertices[0] && selectedVertices[0].name"
                >
                  {{ selectedVertices[0] && selectedVertices[0].name }}
                </div>
              </div>
              <div class="center" v-if="showCenter">
                <div
                  class="rect triangle hidden left"
                  :class="{ 'is-active': deleteFormData.direction[0] }"
                ></div>
                <div class="line"></div>
                <div
                  class="rect triangle hidden right"
                  :class="{ 'is-active': deleteFormData.direction[1] }"
                ></div>
                <div class="text">{{ deleteFormData.relationName }}</div>
              </div>
              <div class="img-wrap">
                <img
                  :src="avatar[1]"
                  alt="实体图片"
                  class="img"
                  :onerror="defaultAvatar"
                />
                <div
                  class="name-text"
                  :title="selectedVertices[1] && selectedVertices[1].name"
                >
                  {{ selectedVertices[1] && selectedVertices[1].name }}
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="关系属性">
            <div class="relation-props">
              <div
                class="prop"
                v-for="(item, index) in deleteFormData.relationProps"
                :key="index"
              >
                <el-form-item class="no-colon">
                  <div slot="label" class="key">{{ item.key }}</div>
                  {{ item.value }}
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog"> 取 消 </el-button>
        <el-button @click="saveDialog" type="primary">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import * as graphVerticesDetail from "@/services/graph-vertices-detail";
import * as sortManage from "@/services/sort-manage";
export default {
  components: {},

  data() {
    return {
      loading: false,
      formData: {}, // 拉取的表单数据
      type: "add", // 关系修改类型
      currentTypeData: {}, // 当前关系数据
      addFormData: {
        direction: [false, true], // 关系方向
        relationName: "", // 关系名称
        relationProps: [{ key: "", value: "" }], // 关系属性
      },
      editFormData: {
        currentDirection: "", // 当前关系方向
        currentRelationName: {}, // 当前关系名称
        currentRelationNameList: [], // 当前关系名称列表
        direction: [false, false], // 关系方向
        relationName: "", // 关系名称
        relationProps: [], // 关系属性
      },
      deleteFormData: {
        currentDirection: "", // 当前关系方向
        currentRelationName: {}, // 当前关系名称
        currentRelationNameList: [], // 当前关系名称列表
        direction: [false, false], // 关系方向
        relationName: "", // 关系名称
        relationProps: [], // 关系属性
      },
      defaultImg: "./img/default.png",
      dialogVisible: true,
    };
  },

  computed: {
    ...mapState("map", ["selectedVertices"]), //选中的两个点坐标数据
    ...mapGetters("graphInfo", ["graphName"]),
    ...mapState("graphInfo", ["id", "graphType"]),
    /**
     * 头像
     */
    avatar() {
      return this.selectedVertices.map(
        (vertices) => vertices.properties.avatar || ""
      );
    },
    /**
     * 默认头像
     */
    defaultAvatar() {
      return `this.src = "${this.defaultImg}"`;
    },
    /**
     * 是否展示实体关系中间的元素
     */
    showCenter() {
      const name = this.currentTypeData.currentRelationName;

      return !!name && JSON.stringify(name) !== "{}";
    },
  },
  //currentTypeData代提增/删/改数据
  watch: {
    type: {
      handler(newValue) {
        const map = {
          add: this.addFormData,
          edit: this.editFormData,
          delete: this.deleteFormData,
        };

        this.currentTypeData = map[newValue] || {};
      },
      immediate: true,
    },
  },
  created() {
    //一开始就得查询数据
    this.getFormData();
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("before-close");
    },
    /**
     * 拉取表单数据
     */
    async getFormData() {
      this.loading = true;
      this.type = "add";
      const startId = this.selectedVertices[0].id;
      const endId = this.selectedVertices[1].id;
      const { data } = await sortManage.nodeRelationShipList(
        this.graphName,
        startId,
        endId
      );
      this.loading = false;
      this.formData = data;
    },
    /**
     * 新增关系时选择方向
     */
    setDirectionByClick(index) {
      const boolean = !this.addFormData.direction[index];

      this.addFormData.direction.splice(index, 1, boolean);
    },
    /**
     * 选择关系方向
     * @param {string} newValue
     */
    handleDirectionChange(newValue) {
      this.currentTypeData.currentRelationNameList = this.formData[newValue];
      this.currentTypeData.direction = [
        newValue === "reverse",
        newValue === "forward",
      ];
      this.currentTypeData.currentRelationName = {};
      this.handleRelationNameChange({});
    },
    /**
     * 选择属性关系名称
     * @param {object} newValue
     */
    handleRelationNameChange(newValue) {
      const { type, properties = {} } = newValue;

      this.currentTypeData.relationName = type;
      this.currentTypeData.relationProps = Object.entries(properties).map(
        (prop) => {
          return { key: prop[0], value: prop[1] };
        }
      );
    },
    /**
     * 修改关系时切换方向
     */
    exchangeDirection() {
      if (this.editFormData.relationName) {
        this.editFormData.direction = this.editFormData.direction.map(
          (value) => !value
        );
      }
    },
    /**
     * 添加一条属性
     */
    addProp() {
      this.currentTypeData.relationProps.push({
        key: "",
        value: "",
      });
    },
    /**
     * 删除一条属性
     */
    deleteProp(index) {
      this.currentTypeData.relationProps.splice(index, 1);
    },
    /**
     * 保存关系
     * startId, endId, type, both, props, name
     */
    async saveDialog() {
      const currentData = this.currentTypeData;
      if (this.type === "add") {
        const hasDirection = currentData.direction.some((value) => value);
        if (!hasDirection) {
          return this.$message.error("关系指向必选");
        }
        if (!this.currentTypeData.relationName.trim()) {
          return this.$message.error("关系名称必填");
        }
      }

      if (this.type === "edit") {
        if (!currentData.currentDirection) {
          return this.$message.error("关系指向必选");
        }
        if (JSON.stringify(currentData.currentRelationName) === "{}") {
          return this.$message.error("关系名称必填");
        }
      }
      if (this.type === "delete") {
        if (!currentData.currentDirection) {
          return this.$message.error("关系指向必选");
        }
        if (JSON.stringify(currentData.currentRelationName) === "{}") {
          return this.$message.error("关系名称必填");
        }
        this.deleteEdges();
        return
      }

      let props = currentData.relationProps.reduce((previous, current) => {
        const key = current.key.trim();
        const value = current.value;
        if (key) {
          Object.assign(previous, { [key]: value });
        }
        return previous;
      }, {});
      let propsJSON = JSON.stringify(props);
      const name = this.graphName; //图谱名字
      let relateShip = {
        atlasId: this.id,
        id:
          (this.currentTypeData.hasOwnProperty("currentRelationName") &&
            Number(this.currentTypeData.currentRelationName.id)) ||
          null, //新增或修改的ID
        vertexName: !this.currentTypeData.direction[0]
          ? this.selectedVertices[0].name
          : this.selectedVertices[1].name,
        vertexId: !this.currentTypeData.direction[0]
          ? this.selectedVertices[0].id
          : this.selectedVertices[1].id,
        rsVertexName: this.currentTypeData.direction[1]
          ? this.selectedVertices[1].name
          : this.selectedVertices[0].name,
        rsVertexId: this.currentTypeData.direction[1]
          ? this.selectedVertices[1].id
          : this.selectedVertices[0].id,
        name: this.currentTypeData.relationName,
        typeName: this.currentTypeData.oldName || null,
      };
      let res = await graphVerticesDetail
        .relationPropsEdit(propsJSON, relateShip)
        .catch(() => {
          this.$message({
            type: "error",
            message: "提交请求失败",
          });
        });
      if (!res.data.success) {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
        return;
      } else if (res && res.data && res.data.success) {
        if (!res && !res.data.object) {
          if (!this.currentTypeData.hasOwnProperty("currentRelationName")) {
            this.$message({
              type: "success",
              message: "新增关系已进入审核阶段！",
            });
          } else {
            this.$message({
              type: "success",
              message: "编辑关系已进入审核阶段！",
            });
          }
        } else {
          if (!this.currentTypeData.hasOwnProperty("currentRelationName")) {
            this.$message({
              type: "success",
              message: "新增关系成功！",
            });
          } else {
            if (this.type == "edit") {
              this.$message({
                type: "success",
                message: "编辑关系成功！",
              });
            } else {
              this.$message({
                type: "success",
                message: "删除关系成功！",
              });
            }
            let some = {
              atlasId: this.id,
              examineState: null,
              id: Number(relateShip.id), //新增或修改的ID
              idStr: relateShip.id.toString(),
              name: relateShip.name,
              pointToSyn: null,
              propsList: null,
              rsVertexId: Number(relateShip.rsVertexId),
              rsVertexIdStr: relateShip.rsVertexId.toString(),
              rsVertexName: relateShip.rsVertexName,
              synType: null,
              typeName: null,
              vertexId: Number(relateShip.vertexId),
              vertexIdStr: relateShip.vertexId.toString(),
              vertexName: relateShip.vertexName,
            };
            let res = await graphVerticesDetail
              .relationDelete(some)
              .catch(() => {
                return;
              });
            if (!res && !res.data.success) {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
              return;
            }
          }
        }
        this.closeDialog();
      }
    },

    //删除关系(item相当于后端返回的)
    async deleteEdges() {
      let some = {
        atlasId: this.id, //图谱id
        examineState: null,
        id: Number(this.currentTypeData.currentRelationName.id),
        idStr: this.currentTypeData.currentRelationName.id.toString(),
        name: this.currentTypeData.name,
        pointToSyn: null,
        propsList: null,
        rsVertexId: Number(this.selectedVertices[1].id),
        rsVertexIdStr: this.selectedVertices[1].id.toString(),
        rsVertexName: this.selectedVertices[1].name,
        synType: null,
        typeName: null,
        vertexId: Number(this.selectedVertices[0].id),
        vertexIdStr: this.selectedVertices[0].id.toString(),
        vertexName: this.selectedVertices[0].name,
      };
      let res = await graphVerticesDetail.relationDelete(some).catch(() => {
        this.$message({
          type: "error",
          message: "删除请求失败",
        });
        this.edgesListLoading = false;
        return;
      });
      if (!res && !res.data.success) {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
        return;
      } else if (res && res.data && res.data.success) {
        if (!res.data.object) {
          this.$message({
            type: "success",
            message: "删除关系已进入审核阶段！",
          });
        } else {
          this.$message({
            type: "success",
            message: "删除关系成功！",
          });
        }
        this.closeDialog();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-connection-modal {
  .form {
    .add {
      .center {
        .text {
          position: absolute;
          width: 100%;
          color: var(--color-text-secondary);
          margin-top: 8px;
          font-size: 1rem;
          text-align: center;
        }
      }
    }

    .edit {
      .center {
        .change-direction {
          position: absolute;
          width: 100%;
          color: var(--color-primary);
          text-align: center;
          transform: rotate(90deg);

          .icon:hover {
            cursor: pointer;
          }
        }
      }
    }

    .delete {
      .center {
        .line {
          background-color: var(--color-text-regular);
        }
        .text {
          position: absolute;
          bottom: 0;
          width: 100%;
          color: var(--color-text-regular);
          text-align: center;
        }

        .left.triangle::before {
          border-right-color: var(--color-text-regular);
        }

        .right.triangle::before {
          border-left-color: var(--color-text-regular);
        }
      }

      .no-colon {
        flex: 1;
      }

      .key {
        color: var(--color-text-primary);
        text-align: left;
      }
    }
  }

  .center {
    position: relative;
    flex: 1;

    .rect {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 0;
      box-sizing: initial;
      transform: translateY(-50%);
      cursor: pointer;
    }

    .line {
      height: 1px;
      margin: 0 14px;
      background-color: var(--color-primary);
    }

    .triangle::before {
      content: "";
      position: absolute;
      top: 4px;
      border-width: 8px 12px;
      border-style: solid;
      border-color: transparent;
    }

    .hidden.triangle::before {
      display: none;
    }

    .is-active.triangle::before {
      display: block;
    }

    .left {
      left: 0;

      &.triangle::before {
        right: 9px;
        border-right-color: var(--color-primary);
      }
    }

    .right {
      right: 0;

      &.triangle::before {
        left: 9px;
        border-left-color: var(--color-primary);
      }
    }

    .border {
      border: 1px solid var(--color-primary);
    }

    .input {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      background-color: var(--background-color-dialog);
      transform: translate(-50%, -50%);
    }
  }

  .relation-direction {
    display: flex;
  }

  .relation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 200px;
    padding: 0 60px;
    border: 1px solid var(--border-color-base);
    background-color: var(--background-color-item);
    border-radius: 4px;

    .img-wrap {
      position: relative;

      .img {
        display: block;
        width: 100px;
        height: 100px;
      }

      .name-text {
        position: absolute;
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .relation-props {
    .prop {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .input {
        width: 200px;

        & + .input {
          margin-left: 8px;
        }
      }

      .icon {
        color: var(--color-text-regular);
        margin-left: 8px;
        cursor: pointer;

        &:hover {
          color: var(--color-danger);
        }
      }
    }

    .add-prop {
      color: var(--color-primary);

      .btn {
        cursor: pointer;
      }
    }
  }
}
</style>
