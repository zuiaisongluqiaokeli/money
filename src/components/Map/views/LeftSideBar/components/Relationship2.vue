<template>
  <div class="">
    <!-- 实体对应关系列表 -->
    <el-dialog
      :title="dialogTitle"
      class="dialog"
      append-to-body
      :visible.sync="addEdgesDialogVisible"
      @closed="resetForm"
      width="1000px"
    >
      <div class="dialog-body">
        <el-button-group>
          <el-button>新增关系</el-button>
          <el-button @click="editEdges(scope.row)">修改关系</el-button>
          <el-button @click="deleteEdges(scope.row, 'one')">删除关系</el-button>
        </el-button-group>
        <el-form
          ref="newEdgesData"
          :model="newEdgesData"
          :rules="edgesRules"
          label-width="110px"
          class="addFrom"
          style="margin: 24px"
        >
          <el-form-item label="实体关系">
            <div class="relation">
              <div class="img-wrap">
                <img
                  v-if="edgeInfo.avatar"
                  :src="edgeInfo.avatar"
                  alt="实体图片"
                  class="img"
                />
                <img v-else :src="imageError" class="img" />
                <div class="name-text" :title="verticesName">
                  {{ verticesName }}
                </div>
              </div>
              <div class="center">
                <div
                  class="rect triangle border hidden left"
                  :class="{ 'is-active': !newEdgesData.toRight }"
                  @click="verticesSwitching"
                ></div>
                <div class="line"></div>
                <div
                  class="rect triangle border hidden right"
                  :class="{ 'is-active': newEdgesData.toRight }"
                  @click="verticesSwitching"
                ></div>
                <div class="input">
                  <el-input
                    v-model.trim="newEdgesData.name"
                    placeholder="关系名称"
                    maxlength="20"
                  ></el-input>
                  <div class="text">点击箭头可设置关系指向</div>
                </div>
              </div>
              <div class="img-wrap">
                <img v-if="tempImg" :src="tempImg" alt="实体图片" class="img" />
                <img v-else :src="imageError" class="img" />
                <div class="name-text" :title="vertexName2">
                  {{ vertexName2 }}
                </div>
              </div>
              <div class="vert-select">
                <el-select
                  v-show="show"
                  v-model="vertexName2"
                  v-focus
                  v-loadmore="loadMoreResult"
                  filterable
                  remote
                  style="margin-top: 10px; transform: translateX(50px)"
                  placeholder="请输入实体名称"
                  value-key="id"
                  :filter-method="searchVertex"
                  @blur="handleBlur"
                  @change="handleChange"
                >
                  <el-option
                    v-for="(opt, i) in searchResult"
                    :key="i.id"
                    :label="opt.name"
                    :value="opt.name"
                    :title="opt.name"
                    style="width: 430px"
                  ></el-option>
                </el-select>
                <el-button
                  v-show="!show"
                  style="margin-top: 10px"
                  type="primary"
                  @click="selectEntity"
                  >{{ vertexName2 === "" ? "选择实体" : "更换实体" }}</el-button
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px" label="关系属性">
            <div v-if="newEdgesData.prop.length > 0">
              <el-row
                v-for="(item, index) in newEdgesData.prop"
                :key="index"
                :style="{
                  margin: item.key[0] === '_' ? '0' : '',
                  display: item.key[0] === '_' ? 'none' : 'block',
                  marginBottom: '20px',
                }"
              >
                <div v-if="item.key[0] !== '_'">
                  <el-col :span="7" style="margin-right: 1%">
                    <el-form-item
                      :prop="'prop.' + index + '.key'"
                      :rules="{
                        required: true,
                        validator: validateProp,
                        trigger: 'change',
                      }"
                    >
                      <div v-if="graphType === 'NeoServer'">
                        <el-select
                          v-model.trim="item.key"
                          filterable
                          allow-create
                          save-when-blur
                          default-first-option
                          placeholder="属性名"
                          :attrs="{ maxlength: 20 }"
                        >
                          <el-option
                            v-for="(item2, index2) in edgesPropList"
                            :key="index2"
                            :label="item2"
                            :value="item2"
                          >
                          </el-option>
                        </el-select>
                      </div>
                      <div
                        v-if="
                          graphType === 'JanusHBase' ||
                          graphType === 'SeraphServer'
                        "
                      >
                        <el-select
                          v-model.trim="item.key"
                          default-first-option
                          placeholder="属性名"
                        >
                          <el-option
                            v-for="(item2, index2) in edgesPropList"
                            :key="index2"
                            :label="item2"
                            :value="item2"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item
                      :prop="'prop.' + index + '.value'"
                      :rules="{
                        required: true,
                        message: '属性值不能为空',
                        trigger: 'blur',
                      }"
                    >
                      <el-input
                        v-model.trim="item.value"
                        placeholder="属性值"
                        clearable
                        :title="item.value"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="margin-left: 3%">
                    <i
                      class="el-icon-circle-plus-outline"
                      style="font-size: 20px; line-height: 35px"
                      @click="addNewFrom(index)"
                    ></i>
                    <i
                      class="el-icon-remove-outline"
                      style="
                        font-size: 20px;
                        line-height: 35px;
                        margin-left: 14px;
                      "
                      @click="delFrom(index)"
                    ></i>
                  </el-col>
                </div>
              </el-row>
            </div>
            <div>
              <el-button
                class="changeBtnsBorder"
                icon="el-icon-plus"
                style="width: 80%"
                plain
                @click="addNewFrom(newEdgesData.prop.length - 1)"
                >新增</el-button
              >
            </div>
          </el-form-item>
        </el-form>

        <span class="dialog-footer">
          <el-button @click="resetForm()">取 消</el-button>
          <el-button type="primary" @click="addEdges('newEdgesData')"
            >确 定</el-button
          >
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as graphVerticesDetail from "@/services/graph-vertices-detail";
import AdvanceSearch from "./AdvanceSearch";
import * as graphDetail from "@/services/graph-detail";
import * as sortManage from "@/services/sort-manage";

const defaultImgUrl = require("@/assets/img/empty.svg");

export default {
  name: "GraphVerticesDetailEdges",
  components: {AdvanceSearch },
  directives: {
    loadmore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );

        SELECTWRAP_DOM.addEventListener("scroll", function () {
          /*
           * scrollHeight 获取元素被遮挡住没有显示的内容高度和(只读)
           * scrollTop 获取或者设置元素距离顶部的偏移值, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度, 包括padding(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false
           */
          const CONDITION =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (CONDITION) {
            binding.value();
          }
        });
      },
    },
  },
  props: {
    edgeInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    //表单验证
    let startNode = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("请输入开始节点"));
      } else {
        callback();
      }
    };
    let endNode = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("请输入终止节点"));
      } else {
        callback();
      }
    };
    var validateProp = (rule, value, cb) => {
      if (value === "") {
        cb(new Error("属性名不能为空"));
      } else {
        let count = 0;
        window.relatePropList.forEach((item) => {
          if (item.key === value) {
            count++;
          }
        });
        if (count > 1) {
          cb(new Error("属性名不能重复"));
        }
        cb();
      }
      cb();
    };
    return {
      validateProp,
      imageError: defaultImgUrl,
      tempImg: null,
      show: false, // 切换按钮状态
      vertexName1: "", // 实体名称1
      vertexName2: "", // 实体名称2
      graphId: "", //图谱ID
      graphType: "", //图谱类型
      graphName: "", // 图谱名称
      verticesId: "", //实体ID
      verticesName: "", //实体名称
      activeName: "first", //tab显示
      edgesListLoading: false, //列表loading
      edgesListLoadingText: "", //列表loading显示文字
      edgesListData: [
        // {
        //   //实体列表数据
        //   id: "", //实体id
        //   name: "", //实体名称
        //   type: "" //分类
        // }
      ],
      addEdgesDialogVisible: false, //控制添加或编辑弹窗
      dialogTitle: "", //添加或编辑弹框标题
      dialogLoading: false, //添加或编辑loading
      edgesSelectList: [], //关系名称下拉框
      newEdgesData: {
        //新增或编辑关系数据
        name: "", //关系名称
        id: null, //关系ID
        vertexName: "", //开始节点
        vertexId: null,
        rsVertexName: "", //终止节点
        rsVertexId: null, //新增传null,编辑传id
        prop: [
          // {
          //   //关系属性
          //   key: "", //属性名
          //   value: "" //属性值
          // }
        ],
        oldName: null, //旧关系名
        toRight: true, // 关系方向
      },
      selectEdges: [], //被选中的关系
      edgesPropList: [], //关系属性下拉框数据
      disableFrom: {
        vertexName: false,
        rsVertexName: false,
      },
      edgesRules: {
        //新增实体表单验证
        name: [
          { required: true, message: "请输入关系名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 50 个字符以内",
            trigger: "change",
          },
        ],
        vertexName: [
          { required: true, validator: startNode, trigger: "blur" },
          { min: 1, max: 50, message: "长度在 50 个字符以内", trigger: "blur" },
        ],
        rsVertexName: [
          { required: true, validator: endNode, trigger: "blur" },
          { min: 1, max: 50, message: "长度在 50 个字符以内", trigger: "blur" },
        ],
      },
      tableKey: 0,
      listQuery1: {
        //列表的分页器
        page: 1, //页码
        size: 10, //每页显示数据量
        total: 0, //总条数
      },
      lookVerticesDialogVisible: false, // 节点弹窗
      lookVerticesDialogObject: {
        name: "",
        labelsList: [],
        propsList: [],
      },
      btnShow: {
        newAdd: "graphManagement-graphVerticesDetailEdges-newAdd",
        deleteMultiple:
          "graphManagement-graphVerticesDetailEdges-deleteMultiple",
        startVertices: "graphManagement-graphVerticesDetailEdges-startVertices",
        endVertices: "graphManagement-graphVerticesDetailEdges-endVertices",
        edit: "graphManagement-graphVerticesDetailEdges-edit",
        delete: "graphManagement-graphVerticesDetailEdges-delete",
      },
      btnPermission: {},
      showAdvancedSearch: false,
      advanceSearch: {
        advancedSearchFlag: false,
        gid: 0,
        graphName: "",
        moreCondition: [
          {
            moreConditions: [
              {
                conditionsEnum: "EQ",
                conditionsTypeEnum: "startName",
                key: "",
                operator: "且",
                value: "",
                valueType: "String",
              },
            ],
            operator: "且",
          },
        ],
        searchContent: "",
        title: "",
      },
      searchType: [
        {
          key: "开始节点名称",
          value: "startName",
        },
        {
          key: "终止节点名称",
          value: "endName",
        },
        {
          key: "关系名称",
          value: "name",
        },
        {
          key: "关系属性名",
          value: "prop",
        },
      ],
      searchRelation: [
        { key: "等于", value: "EQ" },
        { key: "模糊等于", value: "FUZZY" },
        { key: "不等于", value: "NOTEQ" },
        // { key: "大于", value: "GT" },
        // { key: "小于", value: "LT" },
        // { key: "大于等于", value: "GE" },
        // { key: "小于等于", value: "LE" }
      ],
      searchKey: [],
      searchName: [],
      placeholder: "请输入内容",
      reFresh: true,
      prevSearchInfo: {}, // 记录上一次的搜索信息
      prevName: "",
      searchResult: [],
      page: 0,
      size: 20,
      searchInput: "",
    };
  },
  watch: {
    edgeInfo() {
      this.edgesListData = [];
      // this.graphName = this.edgeInfo.graphName;
      // this.getGraphId();
      // this.getRelationShipSelected();
    },
  },
  mounted() {
    // 初始化滚动条高度
    this.mixinScrollbarControl();
    this.graphName = this.edgeInfo.graphName;
    this.getGraphId();
    this.getRelationShipSelected();
    this.btnPermission = this.$_btnPermission;
  },
  methods: {
    // 关系属性下拉框数据
    async getRelationShipSelected() {
      const res = await graphVerticesDetail.relationShipSelected(
        this.graphName
      );
      if (res && res.data && res.data.success) {
        this.searchKey = res.data.object.relationPropList || [];
      } else {
        this.$message.error("获取关系属性失败");
      }
    },
    //获取图谱ID
    getGraphId() {
      this.verticesId = String(this.edgeInfo.vertices);
      this.newEdgesData.vertexId = String(this.edgeInfo.vertices);
      this.graphId = parseInt(this.edgeInfo.graph);
      this.graphType = this.edgeInfo.graphType;
      this.verticesName = this.edgeInfo.name;
      // let title = this.verticesName + "实体的对应关系";
      // this.$store.dispatch("page/setPageHeader", title);

      if (
        this.verticesId === null ||
        this.verticesId === undefined ||
        !this.graphId ||
        !this.graphType ||
        !this.verticesName
      ) {
        this.$message.warning("找不到该图谱，请重新进入查看!");
        this.$router.push({
          name: "graphManage",
        });
      }

      //获取当前图谱所有关系属性
      // this.allRelationPropsGet();

      //获取图谱所有关系
      this.virtualMappingFindOne();
    },
    //获取当前图谱所有关系属性
    async allRelationPropsGet() {
      let res = await graphVerticesDetail
        .allRelationPropsGet(this.graphId)
        .catch(() => {
          this.$message({
            type: "error",
            message: "获取关系属性请求失败",
          });
        });
      if (!res && !res.data.success) {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
        return;
      } else if (res && res.data && res.data.success) {
        this.edgesPropList = res.data.object;
      }
    },

    //获取图谱所有关系
    async virtualMappingFindOne() {
      let res = await graphVerticesDetail
        .virtualMappingFindOne(this.graphId)
        .catch(() => {
          this.$message({
            type: "error",
            message: "获取关系名称请求失败",
          });
        });
      if (!res.data.success) {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
        return;
      } else if (res && res.data && res.data.success) {
        this.edgesSelectList = JSON.parse(
          JSON.stringify(res.data.object).replace(/DATAEXA_EDGE/g, "关联")
        );
      }
    },

    //搜索关系
    findEdges() {
      this.listQuery1.page = 1;
      this.graphEdgesGet("search");
    },

    //多选关系
    handleSelectChange(list) {
      this.selectEdges = [];
      if (list.length) {
        list.forEach((item) => {
          this.selectEdges.push(item);
        });
      }
    },

    //表格复选框禁用
    checkboxAble(row) {
      if (row.examineState != null && row.examineState == 0) {
        return 0;
      } else {
        return 1;
      }
    },

    //删除关系
    deleteEdges(item, type) {
      if (type === "some") {
        if (!this.selectEdges.length) {
          this.$message({
            type: "error",
            message: "请选择需要删除的关系！",
          });
          return;
        }
      }
      this.$confirm("此操作将永久删除关系, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          this.advanceSearch.advancedSearchFlag = false;
          this.edgesListLoading = true;
          this.edgesListLoadingText = "正在删除，请稍候...";
          if (type === "some") {
            //批量
            this.deleteList();
          } else {
            //单个
            let some = {
              atlasId: this.graphId,
              examineState: null,
              id: item.id,
              name: item.name,
              pointToSyn: null,
              propsList: null,
              rsVertexId: item.rsVertexId,
              rsVertexIdStr: item.rsVertexIdStr,
              rsVertexName: item.rsVertexName,
              synType: null,
              typeName: null,
              vertexId: item.vertexId,
              vertexIdStr: item.vertexIdStr,
              vertexName: item.vertexName,
            };
            if ((this.listQuery1.total - 1) % this.listQuery1.size === 0) {
              this.listQuery1.page = 1;
            }
            let res = await graphVerticesDetail
              .relationDelete(some)
              .catch(() => {
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
              this.edgesListLoading = false;
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
              setTimeout(() => {
                this.edgesListLoading = false;
              }, 2000);
            }
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //批量删除
    async deleteList() {
      if (
        (this.listQuery1.total - this.selectEdges.length) %
          this.listQuery1.size ===
        0
      ) {
        this.listQuery1.page = 1;
      }
      let rel = JSON.stringify(this.selectEdges);
      let res = await graphVerticesDetail
        .relationListDelete(rel, this.graphId, this.verticesId)
        .catch(() => {
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
        this.edgesListLoading = false;
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
        setTimeout(() => {
          this.edgesListLoading = false;
        }, 2000);
      }
    },

    //打开编辑关系
    async editEdges(item) {
      this.page = 0;
      this.searchVertex("");
      this.dialogTitle = "编辑关系";
      let vertexId =
        item.rsVertexName !== this.verticesName
          ? item.rsVertexIdStr
          : item.vertexIdStr;
      let avatar = await graphVerticesDetail
        .vertexDetailView(vertexId, this.graphId)
        .catch(() => {
          this.$message({
            type: "error",
            message: "获取实体图片请求失败",
          });
        });
      if (avatar.data.success) {
        this.tempImg = avatar.data.object.properties.avatar;
      }
      let res = await graphVerticesDetail
        .relationPropGet(
          item.name,
          item.vertexIdStr,
          item.rsVertexIdStr,
          item.idStr,
          this.graphId,
          0,
          100
        )
        .catch(() => {
          this.$message({
            type: "error",
            message: "关系属性请求失败",
          });
        });
      if (!res && !res.data.success) {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
        res.data.object.data = [];
      }
      this.vertexName2 =
        item.rsVertexName === this.verticesName
          ? item.vertexName
          : item.rsVertexName;
      const toRight = item.rsVertexName !== this.verticesName;
      this.newEdgesData = {
        name: item.name === "DATAEXA_EDGE" ? "关联" : item.name, //关系名称
        id: item.idStr, //关系ID
        vertexName: item.vertexName, //开始节点
        vertexId: item.vertexIdStr,
        rsVertexName: item.rsVertexName, //终止节点
        rsVertexId: item.rsVertexIdStr,
        prop: res.data.object.data || [],
        oldName: item.name || null, //旧关系名
        toRight,
      };
      window.relatePropList = this.newEdgesData.prop;
      this.disableFrom.vertexName = true;
      this.disableFrom.rsVertexName = true;
      this.addEdgesDialogVisible = true;
    },

    //取消添加或编辑
    resetForm() {
      this.$refs["newEdgesData"].resetFields();
      this.newEdgesData = {
        //新增或编辑关系数据
        name: "", //关系名称
        id: null, //关系ID
        vertexName: "", //开始节点
        vertexId: null,
        rsVertexName: "", //终止节点
        rsVertexId: null,
        prop: [
          // {
          //   //关系属性
          //   key: "", //属性名
          //   value: "" //属性值
          // }
        ],
        oldName: null, //旧关系名
        toRight: true,
      };
      this.addEdgesDialogVisible = false;
      this.disableFrom.vertexName = false;
      this.disableFrom.rsVertexName = false;
    },

    //打开新增弹框
    openFrom() {
      this.page = 0;
      this.searchVertex("");
      this.vertexName2 = "";
      this.tempImg = null;
      this.disableFrom.vertexName = false;
      this.disableFrom.rsVertexName = false;
      this.newEdgesData = {
        //新增或编辑关系数据
        name: "", //关系名称
        id: null, //关系ID
        vertexName: this.verticesName, //开始节点
        vertexId: this.verticesId,
        rsVertexName: "", //终止节点
        rsVertexId: null,
        prop: [
          // {
          //   //关系属性
          //   key: "", //属性名
          //   value: "" //属性值
          // }
        ],
        oldName: null, //旧关系名
        toRight: true,
      };
      this.dialogTitle = "新增关系";
      this.disableFrom.vertexName = true;
      this.addEdgesDialogVisible = true;
    },

    //新增或编辑关系
    addEdges(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.advanceSearch.advancedSearchFlag = false;
          let some = this.newEdgesData.prop.map((item) => ({
            [item.key]: String(item.value),
          }));
          let someObj = Object.assign({}, ...some);
          let props = JSON.stringify(someObj);
          let relateShip = {
            atlasId: this.graphId,
            id: this.newEdgesData.id || null,
            vertexName: this.newEdgesData.toRight
              ? this.verticesName
              : this.vertexName2,
            vertexId: this.newEdgesData.vertexId,
            rsVertexName: this.newEdgesData.toRight
              ? this.vertexName2
              : this.verticesName,
            rsVertexId: this.newEdgesData.rsVertexId || null,
            name: this.newEdgesData.name,
            typeName: this.newEdgesData.oldName || null,
          };
          if (relateShip.name === "") {
            this.$message.warning("关系名称不能为空");
            return;
          }
          if (relateShip.rsVertexName === "" || relateShip.vertexName === "") {
            this.$message.warning("请选择实体");
            return;
          }
          this.dialogLoading = true;
          let res = await graphVerticesDetail
            .relationPropsEdit(props, relateShip)
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
            this.dialogLoading = false;
            return;
          } else if (res && res.data && res.data.success) {
            if (!res && !res.data.object) {
              if (!this.newEdgesData.id) {
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
              if (!this.newEdgesData.id) {
                this.$message({
                  type: "success",
                  message: "新增关系成功！",
                });
              } else {
                this.$message({
                  type: "success",
                  message: "编辑关系成功！",
                });
                let some = {
                  atlasId: this.graphId,
                  examineState: null,
                  id: relateShip.id,
                  name: relateShip.name,
                  pointToSyn: null,
                  propsList: null,
                  rsVertexId: relateShip.rsVertexId,
                  rsVertexIdStr: relateShip.rsVertexIdStr,
                  rsVertexName: relateShip.rsVertexName,
                  synType: null,
                  typeName: null,
                  vertexId: relateShip.vertexId,
                  vertexIdStr: relateShip.vertexIdStr,
                  vertexName: relateShip.vertexName,
                };
                let res = await graphVerticesDetail
                  .relationDelete(some)
                  .catch(() => {
                    // this.$message({
                    //   type: "error",
                    //   message: "删除请求失败"
                    // });
                    this.edgesListLoading = false;
                    return;
                  });
                if (!res && !res.data.success) {
                  this.$message({
                    type: "error",
                    message: res.data.msg,
                  });
                  this.edgesListLoading = false;
                  return;
                } else if (res && res.data && res.data.success) {
                }
              }
            }

            this.$emit("relate-after");
            this.dialogLoading = false;
            this.addEdgesDialogVisible = false;
          }
        } else {
          return false;
        }
      });
    },

    //开始、终止节点交换
    verticesSwitching() {
      if (this.dialogTitle === "编辑关系") {
        // 编辑状态全部禁用
        this.disableFrom.vertexName = true;
        this.disableFrom.rsVertexName = true;
      } else if (this.dialogTitle === "新增关系") {
        this.disableFrom.vertexName = false;
        this.disableFrom.rsVertexName = false;
      }

      let someOne = this.newEdgesData.vertexName;
      let someId = this.newEdgesData.vertexId;

      this.newEdgesData.vertexName = this.newEdgesData.rsVertexName;
      this.newEdgesData.vertexId = this.newEdgesData.rsVertexId;

      this.newEdgesData.rsVertexName = someOne;
      this.newEdgesData.rsVertexId = someId;
      if (this.newEdgesData.vertexName === this.verticesName) {
        this.disableFrom.vertexName = true;
      } else if (this.newEdgesData.rsVertexName === this.verticesName) {
        this.disableFrom.rsVertexName = true;
      }
      this.$nextTick(() => {
        this.newEdgesData.toRight = !this.newEdgesData.toRight;
      });
    },

    //新增表单
    addNewFrom(index) {
      this.newEdgesData.prop.splice(index + 1, 0, {
        key: "", //属性名
        value: "", //属性值
      });
      window.relatePropList = this.newEdgesData.prop;
    },

    //删除表单
    delFrom(index) {
      this.newEdgesData.prop.splice(index, 1);
      if (!this.newEdgesData.prop.length) {
        this.$refs["newEdgesData"].validateField("properties");
      }
    },
    selectEntity() {
      this.show = true;
    },
    handleBlur() {
      this.show = false;
    },
    handleChange(val) {
      this.searchResult.forEach((item) => {
        if (item.name === val) {
          this.newEdgesData.rsVertexId = item.id;
        }
      });
    },
    searchVertex(val) {
      this.searchInput = val;
      sortManage
        .verticesNeo4jSeniorQuery(this.page, this.size, {
          advancedSearchFlag: true,
          categoryName: "",
          gid: 0,
          graphName: this.graphName,
          moreCondition: [
            {
              operator: "且",
              moreConditions: [
                {
                  conditionsTypeEnum: "name",
                  conditionsEnum: "FUZZY",
                  key: "",
                  value: this.searchInput,
                  valueType: "String",
                  operator: "且",
                },
              ],
            },
          ],
          searchContent: "", // 普通搜索的内容
          title: "名称", // 后端需要的字段
        })
        .then((res) => {
          this.searchResult = res.data.data;
        });
    },
    loadMoreResult() {
      this.page++;
      sortManage
        .verticesNeo4jSeniorQuery(this.page, this.size, {
          advancedSearchFlag: true,
          categoryName: "",
          gid: 0,
          graphName: this.graphName,
          moreCondition: [
            {
              operator: "且",
              moreConditions: [
                {
                  conditionsTypeEnum: "name",
                  conditionsEnum: "FUZZY",
                  key: "",
                  value: this.searchInput,
                  valueType: "String",
                  operator: "且",
                },
              ],
            },
          ],
          searchContent: "", // 普通搜索的内容
          title: "名称", // 后端需要的字段
        })
        .then((res) => {
          this.searchResult.push(...res.data.data);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  background-color: #ffffff;
  padding: 0px 24px 0px 24px;
  margin-bottom: 0px;
  overflow: hidden;
}

.header > .graph {
  color: #333333;
  font-weight: Bold;
  font-size: 16px;
  line-height: 35px;
}
.headTab {
  float: left;

  /deep/.el-tabs__header {
    margin-bottom: 0px;
    font-size: 14px;
  }
}
.search-input {
  width: 220px;
}
.changeBtnsBorder {
  border: 1px dashed #dcdcdc;
}
.changeBtnsBorder:hover {
  border: 1px dashed #188cff;
}
.el-icon-circle-plus-outline,
.el-icon-remove-outline {
  color: #999;
  cursor: pointer;
}
.el-icon-remove-outline:hover {
  color: #f13a30;
}
.el-icon-circle-plus-outline:hover {
  color: #188cff;
}
.content-container {
  .delete {
    color: var(--color-danger);
  }
}
.change-add-point {
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  text-align: left;
  display: inline-block;
}
.is-first-item {
  margin-top: 20px;
}
.is-empty-item {
  position: relative;
  bottom: 32px;
  margin: 0 !important;
}
.btn-color {
  overflow: hidden;
  // width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  text-align: left;
  // display: inline-block;
  cursor: pointer;
  color: #188cff;
}
.button-group {
  text-align: center;
  margin-bottom: 24px;
  margin-top: 2px;
}
.dialog-footer {
  float: right;
  margin: 20px;
  bottom: 0;
}
.addFrom {
  /deep/ .el-select {
    width: 100%;
  }
}

.dialog {
  .dialog-body {
    height: 60vh;
    position: relative;
    display: flex;
    flex-direction: column;

    .row {
      height: 100%;

      &::before {
        content: "";
        width: 2px;
        height: 100%;
        position: absolute;
        top: 0;
        left: calc(50% - 1px);
        background-color: var(--border-color-base);
      }

      .col {
        height: 100%;
      }
    }

    .wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .title {
      margin-bottom: 8px;
    }

    .content {
      height: 100%;
      position: relative;
    }

    .map-category {
      position: absolute;
      top: 0;
      left: 0;
    }

    .map-mark {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .current-selected {
      width: 100%;
      position: absolute;
      bottom: -24px;
      background-color: var(--background-color-dialog);

      .delete {
        margin-left: 8px;
        cursor: pointer;

        &:hover {
          color: var(--color-text-primary);
        }
      }
    }
  }
}
.relation {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 260px;
  padding: 0 112px;
  border: 1px solid #ddd;
  // background-color: var(--background-color-item);
  border-radius: 4px;

  .img-wrap {
    // position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .img {
      display: block;
      width: 100px;
      // height: 100px;
    }

    .name-text {
      width: 100px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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

      .text {
        position: absolute;
        width: 100%;
        color: #999;
        margin-top: 8px;
        font-size: 14px;
        text-align: center;
      }
    }
  }
  .vert-select {
    position: absolute;
    right: 118px;
    top: 200px;
  }
}
// /deep/ .el-select-dropdown__list {
//   width: 430px;
// }
</style>
