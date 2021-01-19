<template>
  <div class>
    <el-dialog
      :title="dialogTattle"
      class="dialog"
      append-to-body
      :visible.sync="dialogVisible"
      @closed="cancel"
      width="1000px"
      :close-on-click-modal="false"
    >
      <div class="dialog-body" v-loading="verticesListLoading" :element-loading-text="loadingText">
        <el-form
          ref="newVerticesData"
          :model="newVerticesData"
          label-width="160px"
          class="addFrom"
          style="margin-top: 24px"
          :rules="rules"
        >
          <el-form-item label="图片设置" prop="avatar">
            <el-upload
              ref="upload"
              action
              accept=".png, .jpg, .jpeg, .gif, .bmp"
              list-type="picture-card"
              :limit="1"
              :auto-upload="false"
              :on-exceed="handleExceed"
              :file-list="imgList"
              :on-change="uploadSectionFile"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="属性" style="margin-bottom: 0px">
            <el-row>
              <el-col :span="1">
                <i
                  v-if="dialogTattle === '新增实体'"
                  class="el-icon-key"
                  style="font-size: 16px; cursor: pointer"
                  :class="{
                    'activate-primary': tempForm['名称'],
                    'inactivate-primary': !tempForm['名称'],
                  }"
                  @click="handleKey('名称')"
                />
              </el-col>
              <el-col
                :class="{
                  'add-change-width': dialogTattle === '新增实体',
                  'edit-change-width': dialogTattle !== '新增实体',
                }"
                style="margin-bottom: 20px"
              >
                <el-input :disabled="true" value="名称"></el-input>
              </el-col>
              <el-col
                :class="{
                  'add-change-width': dialogTattle === '新增实体',
                  'edit-change-width': dialogTattle !== '新增实体',
                }"
                style="margin-left: 1.1%; margin-bottom: 20px"
              >
                <el-form-item
                  prop="name"
                  :rules="{
                    required: true,
                    message: '名称不能为空',
                    trigger: 'change',
                  }"
                >
                  <el-input v-model="newVerticesData.name" placeholder="请输入名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="1">
                <i
                  v-if="dialogTattle === '新增实体'"
                  class="el-icon-key"
                  style="font-size: 16px; cursor: pointer"
                  :class="{
                    'activate-primary': tempForm['实体分类'],
                    'inactivate-primary': !tempForm['实体分类'],
                  }"
                  @click="handleKey('实体分类')"
                />
              </el-col>
              <el-col
                :class="{
                  'add-change-width': dialogTattle === '新增实体',
                  'edit-change-width': dialogTattle !== '新增实体',
                }"
                style="margin-bottom: 20px"
              >
                <el-input :disabled="true" value="实体分类"></el-input>
              </el-col>
              <el-col
                :class="{
                  'add-change-width': dialogTattle === '新增实体',
                  'edit-change-width': dialogTattle !== '新增实体',
                }"
                style="margin-left: 1.1%; margin-bottom: 20px"
              >
                <el-form-item
                  prop="categoryName"
                  :rules="{
                    required: true,
                    message: '实体分类不能为空',
                    trigger: 'change',
                  }"
                >
                  <el-select
                    v-model="newVerticesData.categoryName"
                    filterable
                    clearable
                    :filter-method="selectTreeFilterNode"
                    placeholder="请选择"
                    class="add-dialog-select"
                    @visible-change="selectTreeBlur"
                    @clear="clearCategory"
                  >
                    <el-option :value="0" class="hidden" />
                    <template>
                      <el-tree
                        ref="selectTree"
                        :filter-node-method="filterNode"
                        accordion
                        highlight-current
                        :data="treeData"
                        node-key="id"
                        @node-click="nodeClick"
                      />
                    </template>
                    <template slot="empty">暂时没有数据</template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="margin-left: 14px">
                <i
                  class="el-icon-circle-plus-outline"
                  style="font-size: 20px; line-height: 35px"
                  @click="addNewFrom(-1)"
                ></i>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :offset="dialogTattle === '新增实体' ? 1 : 0"
                :class="{
                  'add-change-width': dialogTattle === '新增实体',
                  'edit-change-width': dialogTattle !== '新增实体',
                }"
                style="margin-bottom: 20px"
              >
                <el-input :disabled="true" value="经度"></el-input>
              </el-col>
              <el-col
                :class="{
                  'add-change-width': dialogTattle === '新增实体',
                  'edit-change-width': dialogTattle !== '新增实体',
                }"
                style="margin-left: 1.1%; margin-bottom: 20px"
              >
                <el-input v-model="longitude"></el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :offset="dialogTattle === '新增实体' ? 1 : 0"
                :class="{
                  'add-change-width': dialogTattle === '新增实体',
                  'edit-change-width': dialogTattle !== '新增实体',
                }"
                style="margin-bottom: 20px"
              >
                <el-input :disabled="true" value="纬度"></el-input>
              </el-col>
              <el-col
                :class="{
                  'add-change-width': dialogTattle === '新增实体',
                  'edit-change-width': dialogTattle !== '新增实体',
                }"
                style="margin-left: 1.1%; margin-bottom: 20px"
              >
                <el-input v-model="latitude"></el-input>
              </el-col>
            </el-row>

            <div v-for="(item, index) in newVerticesData.propertiesJson" :key="index">
              <el-row
                v-if="
                  item.name !== '实体分类' &&
                  item.name !== '名称' &&
                  item.name !== 'avatar' &&
                  item.name !== 'docs' &&
                  item.name !== 'name' &&
                  item.name[0] !== '_' &&
                  item.name !== 'pk_id' &&
                  item.name !== 'id' &&
                  item.name !== '经度' &&
                  item.name !== '纬度'
                "
                class="item-margin-bottom"
              >
                <el-col :span="1">
                  <i
                    v-if="dialogTattle === '新增实体'"
                    class="el-icon-key"
                    style="font-size: 16px; cursor: pointer"
                    :class="{
                      'activate-primary': item.primary,
                      'inactivate-primary': !item.primary,
                    }"
                    @click="primarySwitching(index)"
                  />
                </el-col>
                <el-col
                  :class="{
                    'add-change-width': dialogTattle === '新增实体',
                    'edit-change-width': dialogTattle !== '新增实体',
                  }"
                  style="margin-right: 1%"
                >
                  <el-form-item
                    :prop="'propertiesJson.' + index + '.name'"
                    :rules="{
                      required: true,
                      message: '属性名不能为空',
                      trigger: 'change',
                    }"
                  >
                    <div v-if="graphType === 'Neo4j'">
                      <el-select
                        v-model.trim="item.name"
                        filterable
                        allow-create
                        save-when-blur
                        default-first-option
                        placeholder="属性名"
                        clearable
                        :attrs="{ maxlength: 20 }"
                      >
                        <LazyLoadOption
                          :options="allPropsList"
                          :search="true"
                          :model-value="item.name"
                        ></LazyLoadOption>
                      </el-select>
                    </div>
                    <div
                      v-if="
                        graphType === 'JanusHBase' ||
                        graphType === 'SeraphServer'
                      "
                    >
                      <el-select v-model.trim="item.name" filterable placeholder="属性名">
                        <LazyLoadOption
                          :options="allPropsList"
                          :search="true"
                          :model-value="item.name"
                        ></LazyLoadOption>
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col
                  :class="{
                    'add-change-width': dialogTattle === '新增实体',
                    'edit-change-width': dialogTattle !== '新增实体',
                  }"
                >
                  <el-form-item
                    v-if="!attributeIsNull"
                    :prop="'propertiesJson.' + index + '.value'"
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
                    ></el-input>
                  </el-form-item>
                  <el-form-item v-if="attributeIsNull">
                    <el-input
                      v-model.trim="item.value"
                      placeholder="属性值"
                      clearable
                      :title="item.value"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-left: 14px">
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
              </el-row>
            </div>
          </el-form-item>

          <el-form-item label="标签" prop="labels">
            <el-select
              v-model="newVerticesData.labelsList"
              multiple
              allow-create
              save-when-blur
              filterable
              default-first-option
              placeholder="请选择"
              :class="{
                addDialogSelect: dialogTattle === '新增实体',
                editDialogSelect: dialogTattle != '新增实体',
              }"
              :attrs="{ maxlength: 20 }"
            >
              <LazyLoadOption
                :options="allLabelsList"
                :search="true"
                :model-value="newVerticesData.labelsList"
              ></LazyLoadOption>
            </el-select>
          </el-form-item>
          <el-form-item v-if="uploading" label="上传进度" prop="progress">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="percentage"
              style="width: 370px"
            ></el-progress>
          </el-form-item>
          <el-form-item label="相关文档" prop="docs">
            <drag-upload :file-way="false" :accepts="accepts" @upload-entity-file="uploadFile"></drag-upload>
            <span class="tip-type">
              <span>支持格式：</span>
              <span v-for="(icon, index) in iconList" :key="index" style="margin-right: 10px">
                <div :class="icon" class="file-icon"></div>
              </span>
              <span>
                <el-popover placement="bottom-start" title="全部格式如下：" width="250" trigger="hover">
                  <div style="margin-bottom: 10px">
                    <div class="file-word file-icon"></div>
                    <span>&nbsp;doc、docx</span>
                  </div>
                  <div style="margin-bottom: 10px">
                    <div class="file-pdf file-icon"></div>
                    <span>&nbsp;pdf</span>
                  </div>
                  <div style="margin-bottom: 10px">
                    <div class="file-excel file-icon"></div>
                    <span>&nbsp;xlsx、xls</span>
                  </div>
                  <div style="margin-bottom: 10px">
                    <div class="file-txt file-icon"></div>
                    <span>&nbsp;txt</span>
                  </div>
                  <div style="margin-bottom: 10px">
                    <div class="file-img file-icon"></div>
                    <span>&nbsp;jpg、jpeg、png、gif、bmp</span>
                  </div>
                  <div style="margin-bottom: 10px">
                    <div class="file-music file-icon"></div>
                    <span>&nbsp;mp3、wav</span>
                  </div>
                  <div style="margin-bottom: 10px">
                    <div class="file-video file-icon"></div>
                    <span>&nbsp;mp4、webm</span>
                  </div>
                  <div slot="reference" class="more-format">···</div>
                </el-popover>
              </span>
            </span>
            <el-table
              v-if="fileData.length > 0"
              :data="fileData"
              style="width: 60%; margin-top: 10px"
              :header-cell-style="{ 'text-align': 'left' }"
              :cell-style="{ 'text-align': 'left' }"
            >
              <el-table-column prop="name" label="文件名" show-overflow-tooltip width="350px">
                <template slot-scope="scope">
                  <span :class="scope.row.icon" class="file-icon"></span>
                  <span
                    style="margin-left: 10px; cursor: pointer; color: #188cff"
                    :title="scope.row.name"
                    @click="preview(scope.row)"
                  >{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="operate" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    class="delete"
                    @click.native.prevent="deleteFile(scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer" slot="footer">
        <el-button type="primary" @click="addVertices" size="small">确定</el-button>
        <el-button type="default" @click="cancel" size="small">取消</el-button>
      </div>
    </el-dialog>
    <!-- 上传图片放大显示 -->
    <el-dialog :visible.sync="imgBigShow" append-to-body title="预览图片">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <el-dialog
      title="预览文件"
      :visible.sync="previewDialog"
      width="60%"
      append-to-body
      :before-close="handleClosePreviewDialog"
    >
      <iframe v-if="previewUrl" :src="previewUrl + '#toolbar=0'" width="100%" height="700"></iframe>
      <img v-if="previewImg" :src="previewImg" style="width: 100%; height: 100%" />
      <video v-if="previewSrc" style="width: 100%; height: 100%" controls autoplay>
        <source :src="previewSrc" :type="'video/' + videoType" />抱歉，您的浏览器不支持html5播放
      </video>
      <audio
        v-if="previewMusic"
        :src="previewMusic"
        style="width: 100%; height: 100%; min-height: 100px"
        controls
        autoplay
      ></audio>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { emitter, EventType } from '../../../src/EventEmitter'
import * as graphVerticesDetail from '@/services/graph-vertices-detail'
import { getGraphDetail } from '@/services/graph-detail'
import LazyLoadOption from './LazyLoadOption'
import * as graphDetail from '@/services/graph-detail'
import { getGraphList } from '@/services/graph-manage'
// import { getCategoryByType } from "@/services/graph-manage";
import DragUpload from './DropUpload'
import * as sortManage from '@/services/sort-manage'
import {
  deleteFile,
  uploadFile,
  verticesNeo4jSeniorQuery,
} from '@/services/sort-manage'
export default {
  props: {
    dialogTattle: {
      type: String,
      default: '',
    },
    entityInfo: {
      type: Object,
      default: {},
    },
  },
  components: {
    LazyLoadOption,
    DragUpload,
  },
  data() {
    var validateName = (rule, value, cb) => {
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g
      if (value.match(reg)) {
        cb(new Error('只能包含英文、中文、数字和下划线'))
      } else {
        cb()
      }
    }
    var validateProp = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('属性名不能为空'))
      } else {
        let count = 0
        window.vertPropList.forEach((item) => {
          if (item.name === value) {
            count++
          }
        })
        if (count > 1) {
          cb(new Error('属性名不能重复'))
        }
        cb()
      }
      cb()
    }
    return {
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
      },
      rules2: {
        name: [{ required: true, message: '请选择实体分类', trigger: 'blur' }],
      },
      tempForm: {
        名称: true,
        实体分类: false,
      },
      searchKey: [],
      newVerticesData: {
        //  新增编辑实体数据
        name: null,

        categoryName: '', // 实体详情的实体分类
        idStr: null,
        propertiesJson: [
          // {
          //   //实体属性（转JSON）
          //   name: "", //属性名
          //   value: "", //属性值
          //   primary: false //主键
          // }
        ],
        labelsList: [], //实体标签（转逗号分割字符串）
        type: '', //实体分类
        longitude: '',
        latitude: '',
      },
      imgList: [],
      imgListArr: [],
      avatar: '', //新增的图片url
      imgBigShow: false, //图片放大弹窗
      dialogImageUrl: '',
      latitude: this.entityInfo.latitude, //纬度
      longitude: this.entityInfo.longitude, //经度
      allPropsList: [], //实体属性下拉框数据
      allLabelsList: [], //实体标签下拉框数据
      allTypeList: [], //实体分类下拉框数据
      treeData: [],
      attributeIsNull: false, //实体属性是否可为空
      dialogrules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
      advancedSearchQuery: {
        advancedSearchFlag: true,
        categoryName: '',
        gid: 0,
        graphName: '',
        moreCondition: [
          {
            operator: '且',
            moreConditions: [
              {
                conditionsTypeEnum: 'prop',
                conditionsEnum: 'FUZZY',
                key: '名称',
                value: '',
                valueType: 'String',
                operator: '且',
              },
            ],
          },
        ],
        searchContent: '', // 普通搜索的内容
        title: '', // 后端需要的字段
      }, // 高级搜索数据对象
      dialogVisible: true,
      previewUrl: '',
      previewImg: '',
      previewSrc: '',
      previewMusic: '',
      videoType: 'mp4',
      previewDialog: false,
      blob: null,
      previewLoading: false,
      iconList: ['file-word', 'file-pdf', 'file-excel', 'file-txt', 'file-img'], // 各种文件类型图片的class
      percentage: 0,
      uploading: false,
      btnPermission: {},
      reFresh: true,
      prevSearchInfo: {},
      prevName: '',
      fileData: [],
      temp: '',
      name: '',
      accepts: '',
      verticesListLoading: false,
      loadingText: '加载中....',
    }
  },

  computed: {
    ...mapState('graphInfo', ['id', 'graphType']),
  },

  created() {
    this.getCategory()
    this.nullPropsSearch()
    this.allLabels() //标签
    this.relationPropsGet() //属性下拉
  },

  methods: {
    //获取图谱所有结点属性
    async relationPropsGet() {
      let res = await graphVerticesDetail
        .relationPropsGet(this.id)
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取图谱所有结点属性请求失败',
          })
        })
      if (!res.data.success) {
        this.$message({
          type: 'error',
          message: res.data.msg,
        })
        return
      } else if (res.data.success) {
        if (res.data.object) {
          let list = res.data.object
          // 实体高级搜索属性下拉框数据
          this.searchKey = JSON.parse(JSON.stringify(res.data.object))
          this.allPropsList = list.filter((item) => {
            if (
              item === 'name' ||
              item === '名称' ||
              item === 'docs' ||
              item === 'avatar' ||
              item === '实体分类' ||
              item[0] === '_' ||
              item === 'id' ||
              item === 'pk_id'
            ) {
              return false
            }
            return true
          })
        }
      }
    },

    //获取空值属性设置
    async nullPropsSearch() {
      let res = await graphVerticesDetail.nullPropsSearch(this.id).catch(() => {
        this.$message({
          type: 'error',
          message: '获取空值请求失败',
        })
      })
      if (!res.data.success) {
        this.$message({
          type: 'error',
          message: res.data.msg,
        })
        return
      } else if (res.data.success) {
        if (res.data.object) {
          this.attributeIsNull = res.data.object
        }
      }
    },
    //获取图谱所有标签
    async allLabels() {
      let res = await graphVerticesDetail.allLabels(this.id).catch(() => {
        this.$message({
          type: 'error',
          message: '获取图谱所有标签请求失败',
        })
      })
      if (!res.data.success) {
        this.$message({
          type: 'error',
          message: res.data.msg,
        })
        return
      } else if (res.data.success) {
        if (res.data.object) {
          let some = res.data.object.indexOf('DATAEXA_OBJECT')
          if (some === -1) {
            this.allLabelsList = res.data.object
          } else {
            res.data.object.splice(some, 1)
            this.allLabelsList = res.data.object
          }
        }
      }
    },
    async getCategory() {
      const res = await sortManage.nodeCategoryQuery(this.id)
      let data = res.data
      let treeData = []
      for (const item of data) {
        if (item.parentId === 0) {
          treeData.push({
            id: item.id,
            label: item.name,
            children: [],
            ...item,
          })
        }
      }
      this.formatTree(treeData, data)
      // this.treeData = [
      //   {
      //     id: -1,
      //     label: "所有",
      //     children: treeData,
      //     parentsName: "",
      //   },
      // ];
      this.treeData = treeData
    },

    // 递归返回的数据，形成树结构
    formatTree(treeData, data) {
      for (const item of treeData) {
        for (const item2 of data) {
          if (item.id === item2.parentId) {
            item.children.push({
              id: item2.id,
              label: item2.name,
              children: [],
              ...item2,
            })
          }
        }
        this.formatTree(item.children, data)
      }
    },
    handleExceed() {
      this.$message.warning('限制上传一张图片')
      return
    },
    async uploadSectionFile(params) {
      this.$refs.upload.clearFiles()
      const file = params.raw
      const type = params.name
        .substr(params.name.lastIndexOf('.') + 1)
        .toLowerCase()
      const types = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
      if (types.indexOf(type) === -1) {
        this.imgList = []
        this.$message.warning('不支持上传该格式的图片')
        return
      }
      if (params.size > 20 * 1024 * 1024) {
        this.imgList = []
        this.$message.warning('图片大小已超出20M，请重新选择')
        return
      }
      let formData = new FormData()
      formData.append('uploadFiles', file)
      const res = await uploadFile(formData)
      if (res.data.avatar) {
        this.avatar = res.data.avatar
        if (this.avatar) {
          this.imgList.push({
            name: '',
            url: this.avatar,
          })
        }
      } else {
        this.$message.error('图片上传失败')
        this.imgList = []
      }
    },
    async handleRemove() {
      await deleteFile({
        fileUrls: this.imgList[0].url,
      })
      this.$refs.upload.clearFiles()
      this.imgList = []
      this.avatar = ''
      this.newVerticesData.propertiesJson.forEach((item, index) => {
        if (item.name === 'avatar') {
          this.newVerticesData.propertiesJson.splice(index, 1)
        }
      })
    },
    async uploadFile(file) {
      if (file.length === 0) return

      if (file.length > 50) return this.$message.error('文件数量不能超过50个')

      if (this.compareFileSize(file)) {
        return this.$message.info('上传的所有文件大小之和不能大于1G')
      }

      let files = this.compareOneFileSize(file)
      if (files.length === 0) return

      if (file.length > 0) {
        let formData = new FormData()
        files.forEach((item) => {
          formData.append('uploadFiles', item)
        })
        this.uploading = true
        const that = this
        const res = await uploadFile(formData, function (progressEvent) {
          const p = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          )
          that.percentage = p
        })
        if (JSON.stringify(res.data) !== '{}') {
          let { data } = res
          for (const key in data) {
            if (key !== 'avatar') {
              let last = data[key].lastIndexOf('.')
              let type = data[key].substr(last + 1)
              this.fileData.push({
                url: data[key],
                name: ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(type)
                  ? key
                  : key,
                icon: this.makeIcons('.' + type),
              })
            }
          }
        } else {
          this.$message.error('文件上传失败')
        }
        this.percentage = 0
        this.uploading = false
      }
    },
    //整体文件大小超过1G的，将取消上传，并给予提示
    compareFileSize(files) {
      let filesSizes = 0
      files.forEach((it) => {
        filesSizes += it.size
      })
      return filesSizes > 1024 * 1024 * 1024
    },
    //单个文件超过100M的以及过滤不支持的格式，将取消上传，并给予提示
    compareOneFileSize(file) {
      let pare = file
      let files = []
      const reg = /\.txt$|\.doc$|\.docx$|\.pdf$|\.xlsx$|\.xls$|\.png$|\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.mp4$|\.webm$|\.mp3$|\.wav$/
      let flag = pare.some((item) => {
        return !reg.test(item.name.toLowerCase())
      })
      files = pare.filter((item) => {
        return reg.test(item.name.toLowerCase())
      })
      if (flag) {
        this.$message.warning('存在不支持的文件，已被过滤')
      }
      return files
    },
    //放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.imgBigShow = true
    },
    handleKey(type) {
      this.tempForm[type] = !this.tempForm[type]
    },
    selectTreeFilterNode(value) {
      this.$refs.selectTree && this.$refs.selectTree.filter(value)
    },
    nodeClick(data) {
      this.categoryId = data.id !== -1 ? data.parentId + '>' + data.id : ''
      this.categoryId = data.parentId !== 0 ? this.categoryId : String(data.id)
      this.newVerticesData.categoryName = data.name
      this.newVerticesData.type = data.name
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    clearCategory() {
      this.categoryId = ''
    },
    selectTreeBlur(show) {
      // 下拉框隐藏时，取消过滤
      show || (this.$refs.selectTree && this.$refs.selectTree.filter())
    },
    showMore(index) {
      this.newVerticesData.propertiesJson[index].hidden = !this.newVerticesData
        .propertiesJson[index].hidden
    },
    //新增表单
    addNewFrom(index) {
      this.newVerticesData.propertiesJson.splice(index + 1, 0, {
        name: '', //属性名
        value: '', //属性值
        primary: false, //主键
      })
      window.propList = this.newVerticesData.propertiesJson
    },

    //删除表单
    delFrom(index) {
      this.newVerticesData.propertiesJson.splice(index, 1)
    },

    //主键切换(钥匙)
    primarySwitching(index) {
      // this.newVerticesData.propertiesJson.forEach(item => {
      //   item.primary = false;
      // });
      this.newVerticesData.propertiesJson[index].primary = !this.newVerticesData
        .propertiesJson[index].primary
    },

    //用于判断，当前文件的格式，来控制显示什么图标，代码需要优化
    makeIcons(name) {
      name = name.toLowerCase()
      if (name === '') return ''
      if (/\.txt$/.test(name)) {
        return 'file-txt'
      } else if (/\.doc$|.docx$/.test(name)) {
        return 'file-word'
      } else if (/\.pdf$/.test(name)) {
        return 'file-pdf'
      } else if (/\.xlsx$|\.xls$/.test(name)) {
        return 'file-excel'
      } else if (/\.png$|\.jpg$|\.jpeg$|\.gif$|\.bmp$/.test(name)) {
        return 'file-img'
      } else if (/\.mp4$|\.webm$/.test(name)) {
        return 'file-video'
      } else if (/\.mp3$|\.wav$/.test(name)) {
        return 'file-music'
      } else {
        return 'file'
      }
    },

    //删除文件
    async deleteFile(index) {
      this.$confirm('确定删除该文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        const res = await deleteFile({
          fileUrls: this.fileData[index].url,
        })
        this.fileData.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    //删除所有文件
    async deleteAllFile() {
      if (this.fileData.length > 0 || this.imgList.length > 0) {
        let urls = []
        this.fileData.forEach((item) => {
          urls.push(item.url)
        })
        this.imgList.forEach((item) => {
          urls.push(item.url)
        })
        const res = await deleteFile({
          fileUrls: String(urls),
        })
        if (res.status === 200) {
          this.fileData = []
        }
      }
    },
    async preview(file) {
      this.fileName = file.name
      this.previewLoading = true
      const type = file.url.slice(file.url.lastIndexOf('.') + 1).toLowerCase()
      if (/pdf$/.test(type)) {
        this.previewUrl = file.url
      } else if (/jpg$|png$|jpeg$|gif$|bmp$/.test(type)) {
        this.previewImg = file.url
      } else if (/mp4$|webm$/.test(type)) {
        this.previewSrc = file.url
        this.videoType = type
      } else if (/mp3$|wav$/.test(type)) {
        this.previewMusic = file.url
      } else {
        const res = await sortManage.neo4jFilePreview(file.url, 0, null)
        this.blob = new Blob([res.data], {
          type: 'application/pdf',
        })
        this.previewUrl = URL.createObjectURL(this.blob)
      }
      this.previewDialog = true
      this.previewLoading = false
    },
    handleClosePreviewDialog() {
      this.previewDialog = false
      this.previewUrl = ''
      this.previewImg = ''
      this.previewSrc = ''
      this.previewMusic = ''
      this.videoType = 'mp4'
      URL.revokeObjectURL(this.blob)
    },
    //修改和新增的保存
    addVertices() {
      this.$refs['newVerticesData'].validate(async (valid) => {
        if (valid) {
          this.advancedSearchQuery.advancedSearchFlag = true
          this.dialogLoading = true
          if (this.dialogTattle === '新增实体') {
            // 新增默认添加name、名称、实体分类属性，有上传图片与文档默认添加docs与avatar属性到propertiesJson
            this.newVerticesData.propertiesJson.push({
              name: 'name',
              value: this.newVerticesData.name,
              primary: this.tempForm['名称'],
            })
            this.newVerticesData.propertiesJson.push({
              name: '名称',
              value: this.newVerticesData.name,
              primary: this.tempForm['名称'],
            })
            this.newVerticesData.propertiesJson.push({
              name: '实体分类',
              value: this.newVerticesData.categoryName,
              primary: this.tempForm['实体分类'],
            })
            this.newVerticesData.propertiesJson.push({
              name: '_实体分类ID',
              value: this.categoryId,
              primary: false,
            })
            this.newVerticesData.propertiesJson.push({
              name: '经度',
              value: this.longitude,
              primary: false,
            })
            this.newVerticesData.propertiesJson.push({
              name: '纬度',
              value: this.latitude,
              primary: false,
            })
            this.newVerticesData.propertiesJson = this.newVerticesData.propertiesJson.filter(
              (item) => item.name != 'docs'
            )
            if (this.fileData.length > 0) {
              this.newVerticesData.propertiesJson.push({
                name: 'docs',
                value: this.fileData,
                primary: false,
              })
            }
            if (this.imgList.length > 0) {
              this.newVerticesData.propertiesJson.push({
                name: 'avatar',
                value: this.avatar,
                primary: false,
              })
            }
            this.newVerticesData.propertiesJson.forEach((item) => {
              if (item.key === '名称') {
                item.value = this.newVerticesData.name
                item.primary = this.tempForm['名称']
              }
            })
            let someKey = true

            this.newVerticesData.propertiesJson.forEach((item) => {
              if (item.primary === true) {
                someKey = false
              }
            })
            if (someKey) {
              this.$message({
                type: 'error',
                message: '请至少选择一个主键！',
              })
              return
            }
          }

          // 在编辑时判断是否有实体分类、名称、name、avatar和docs属性，没有就自动添加
          let hasCategory = false
          let hasNameCn = false
          let hasName = false
          let hasAvatar = false
          let hasDocs = false
          this.newVerticesData.propertiesJson.forEach((item) => {
            if (item.name === '实体分类') {
              hasCategory = true
            }
            if (item.name === '名称') {
              hasNameCn = true
            }
            if (item.name === 'name') {
              hasName = true
            }
            if (item.name === 'avatar') {
              hasAvatar = true
            }
            if (item.name === 'docs') {
              hasDocs = true
            }
          })
          if (!hasCategory) {
            this.newVerticesData.propertiesJson.push({
              name: '实体分类',
              value: this.newVerticesData.categoryName,
              primary: this.tempForm['实体分类'],
            })
            this.newVerticesData.propertiesJson.push({
              name: '_实体分类ID',
              value: this.categoryId,
              primary: false,
            })
          } else {
            this.newVerticesData.propertiesJson.forEach((item) => {
              if (item.name === '实体分类') {
                item.value = this.newVerticesData.categoryName
              }
              if (item.name === '_实体分类ID') {
                item.value = this.categoryId
              }
            })
          }
          if (!hasNameCn) {
            this.newVerticesData.propertiesJson.push({
              name: '名称',
              value: this.newVerticesData.name,
              primary: this.tempForm['名称'],
            })
          } else {
            this.newVerticesData.propertiesJson.forEach((item) => {
              if (item.name === '名称') {
                item.value = this.newVerticesData.name
              }
            })
          }
          if (!hasName) {
            this.newVerticesData.propertiesJson.push({
              name: 'name',
              value: this.newVerticesData.name,
              primary: this.tempForm['名称'],
            })
          } else {
            this.newVerticesData.propertiesJson.forEach((item) => {
              if (item.name === 'name') {
                item.value = this.newVerticesData.name
              }
            })
          }
          if (this.imgList.length > 0) {
            if (!hasAvatar) {
              this.newVerticesData.propertiesJson.push({
                name: 'avatar',
                value: this.avatar,
                primary: false,
              })
            } else {
              this.newVerticesData.propertiesJson.forEach((item) => {
                if (item.name === 'avatar') {
                  item.value = this.avatar
                }
              })
            }
          }
          this.newVerticesData.propertiesJson = this.newVerticesData.propertiesJson.filter(
            (item) => item.name != 'docs'
          )
          if (this.fileData.length > 0) {
            this.newVerticesData.propertiesJson.push({
              name: 'docs',
              value: this.fileData,
              primary: false,
            })
          }

          let someProperties = JSON.stringify(
            this.newVerticesData.propertiesJson
          )
          let someId
          if (this.dialogTattle === '新增实体') {
            someId = -1
          } else {
            someId = this.newVerticesData.idStr
          }
          let someLabelList
          let some = this.newVerticesData.labelsList.indexOf('DATAEXA_OBJECT')
          if (some === -1) {
            if (this.graphType === 'Neo4j') {
              this.newVerticesData.labelsList.push('DATAEXA_OBJECT')
              someLabelList = this.newVerticesData.labelsList.toString()
            } else if (
              this.graphType === 'JanusHBase' ||
              this.graphType === 'SeraphServer'
            ) {
              let someIndex = this.newVerticesData.labelsList.indexOf(
                'DATAEXA_OBJECT'
              )
              if (someIndex != -1) {
                this.newVerticesData.labelsList.splice(someIndex, 1)
                someLabelList = this.newVerticesData.labelsList.toString()
              } else {
                someLabelList = this.newVerticesData.labelsList.toString()
              }
            }
          } else {
            if (
              this.graphType === 'JanusHBase' ||
              this.graphType === 'SeraphServer'
            ) {
              let someIndex = this.newVerticesData.labelsList.indexOf(
                'DATAEXA_OBJECT'
              )
              if (someIndex != -1) {
                this.newVerticesData.labelsList.splice(someIndex, 1)
              }
            }
            someLabelList = this.newVerticesData.labelsList.toString()
          }
          let reqBody = {
            atlasId: parseInt(this.id),
            id: someId, //新增实体是-1，其余代表修改
            name: this.newVerticesData.name || null,
            propertiesJson: someProperties,
            labelStr: someLabelList,
            type: this.newVerticesData.type,
            graphType: this.graphType,
          }
          let res = await graphVerticesDetail
            .verticesUpdate(reqBody)
            .catch(() => {
              this.$message({
                type: 'error',
                message: '提交请求失败',
              })
              this.dialogLoading = false
            })
          if (!res.data.success) {
            this.$message({
              type: 'error',
              message: res.data.msg,
            })
            this.dialogLoading = false
            return
          } else if (res.data.success) {
            if (res.data.object) {
              if (this.dialogTattle === '新增实体') {
                this.$message({
                  type: 'success',
                  message: '新增实体成功！',
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '编辑实体成功！',
                })
              }
              //   this.graphVerticesGet("search");
              //   this.examineListQuery();
              this.emitClosedEvent()
            } else {
              if (this.dialogTattle === '新增实体') {
                this.$message({
                  type: 'success',
                  message: '新增实体已进入审核阶段！',
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '编辑实体已进入审核阶段！',
                })
              }
              //   this.graphVerticesGet("search");
              //   this.examineListQuery();
              this.emitClosedEvent()
            }
            this.newVerticesData = {
              name: null,
              idStr: null,
              propertiesJson: [
                {
                  //实体属性（转JSON）
                  name: '', //属性名
                  value: '', //属性值
                  primary: true, //主键
                },
              ],
              labelsList: [], //实体标签（转逗号分割字符串）
              type: '', //实体分类
            }
            this.fileData = []
            this.avatar = ''
            this.imgList = []
            //更改信息到地图上
            this.$emit('changeEntity', {
              val: res.data.object.id,
              state: someId,
              entity: res.data.object,
            })
          }
        } else {
          return false
        }
      })
    },
    //编辑显示在界面上
    async editEntity(id) {
      this.verticesListLoading = true
      let res = await graphVerticesDetail
        .vertexDetailView(id, this.id)
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取实体详细信息请求失败',
          })
        })
      if (!res.data.success) {
        this.$message({
          type: 'error',
          message: res.data.msg,
        })
        return
      } else if (res.data.success) {
        this.verticesListLoading = false
        this.newVerticesData.propertiesJson = []
        this.newVerticesData.avatar = res.data.object.properties.avatar
        if (res.data.object.properties) {
          let props = res.data.object.properties
          for (let prop in props) {
            if (typeof props[prop] === 'string') {
              props[prop] = props[prop].replace(/[\n\r\t]+/g, '<br />')
            }
            if (prop !== 'category') {
              this.newVerticesData.propertiesJson.push({
                name: prop, //属性名
                value: props[prop], //属性值
                primary: false, //主键
                hidden: props[prop].length > 200, //内容字数大于200，提供判断是否显示所有内容
              })
            }
            if (prop === 'docs') {
              this.fileData = JSON.parse(props[prop])
              this.fileData.forEach((item) => {
                item.type = item.name.slice(item.name.lastIndexOf('.') + 1)
                item.icon = this.makeIcons('.' + item.type)
              })
            }
            if (prop === 'avatar') {
              this.avatar = props[prop]
              this.imgList = [
                {
                  name: '',
                  url: props[prop],
                },
              ]
            }
            if (prop === '实体分类') {
              this.newVerticesData.categoryName = props[prop]
            }
            if (prop === '经度') {
              this.longitude = props[prop]
            }
            if (prop === '纬度') {
              this.latitude = props[prop]
            }
            if (prop === '_实体分类ID') {
              this.categoryId = props[prop]
            }
            if (prop === 'name' || prop === '名称') {
              this.newVerticesData.name = props[prop]
            }
          }
        }
        this.newVerticesData.idStr = res.data.object.idStr
        this.newVerticesData.name = res.data.object.name
        if (!res.data.object.labelsList) {
          res.data.object.labelsList = []
        }
        let some = res.data.object.labelsList.indexOf('DATAEXA_OBJECT')
        if (some === -1) {
          this.newVerticesData.labelsList = res.data.object.labelsList
        } else {
          res.data.object.labelsList.splice(some, 1)
          this.newVerticesData.labelsList = res.data.object.labelsList
        }
        this.newVerticesData.type = res.data.object.type
        window.vertPropList = this.newVerticesData.propertiesJson
      }
    },
    emitClosedEvent() {
      this.$emit('before-close')
    },
    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>
<style scoped lang="scss">
$panel-height: 80vh;

$head-color: #3a3939;
$border-color: #eee;

.graph-select {
  margin: 24px;
  label {
    font-weight: 500;
  }
}
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
/deep/ .el-upload--picture-card {
  background: none !important;
}
.search-input {
  width: 220px;
}
.advanced-search {
  border: 0;
}
.activate-primary {
  color: #fbb30b;
}

.inactivate-primary {
  color: #bbbbbb;
}

.addDialog {
  width: 84.3%;
  border: 1px dashed #dcdcdc;
  // margin-left: 8%;
}

.editDialog {
  width: 84.3%;
  border: 1px dashed #dcdcdc;
}
.addDialogSelect {
  width: 84.3%;
}
.editDialogSelect {
  width: 84.3%;
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
.changeDialog {
  /deep/.el-dialog__body {
    padding: 38px 0px 24px 35px !important;
  }
}
.add-change-width,
.edit-change-width {
  width: 41.5%;
  .el-select {
    width: 100%;
  }
}
.add-change-width {
  width: 39.5%;
}
.tab-container {
  margin: 0 24px;
  border-bottom: 1px solid #eee;
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
.button-group {
  text-align: center;
  margin-top: 2px;
  margin-bottom: 24px;
}
.item-margin-bottom {
  margin-bottom: 20px;
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
.classify-box {
  padding-bottom: 36px;
  border: 1px solid #dcdcdc;
}
.search-box {
  border-bottom: 1px solid #dcdcdc;
  padding: 10px 0;
}
.classify {
  margin-left: 20px;
}
.filter-tree {
  margin-top: 20px;
  margin-left: 12px;
}
.advanced-search .el-form {
  margin-top: -13px;
}
.content-container {
  display: flex;
  margin: 0 24px 24px 24px !important;

  .title {
    font-style: normal;
    font-weight: 700;
    color: $head-color;
  }

  .panel {
    min-height: calc(#{$panel-height} - 140px);
    background: #ffffff;

    .head {
      padding: 2px 10px;
      border-bottom: 1px solid $border-color;

      .head-title {
        float: left;
        padding: 10px 0;
        font-style: normal;
        font-weight: 501;
        margin-right: 100px;
        color: $head-color;
      }

      .head-btn {
        float: right;
      }
    }

    .body {
      padding: 15px 10px;
    }
  }

  .tree-filter {
    & /deep/ .el-input__inner {
      border-radius: 4px;
    }
  }

  .tree-content {
    margin-top: 15px;
    padding: 6px;
    // height: calc(#{$panel-height} - 50px); // 不是很优雅，减掉的数字是大概减的
    overflow: auto;
  }

  .node-detail {
    margin: 0 20px;
  }
}
.clearfix {
  height: 60px !important;
  padding: 14px 16px 0px !important;
}
.change-mar-top {
  margin-top: 20px !important;
}
.main-box {
  display: flex;
  flex: 1;
}
.main-right-box {
  border-left: 1px solid rgba(232, 232, 232, 0.6);
}
.search-position {
  position: relative;
  cursor: pointer;
  top: 8px;
}
/deep/ .el-drawer__header {
  padding-bottom: 24px;
  margin-bottom: 0;
  background: #fafafa;

  span,
  .el-drawer__close-btn {
    outline: none;
  }
}
/deep/ .el-drawer__body {
  overflow: auto;
}
.info-name {
  font-size: 24px;
  font-weight: bold;
  line-height: 23px;
  color: #1890ff;
  letter-spacing: 2px;
  opacity: 1;
}
.img-wrap {
  text-align: center;
  padding: 20px 0;
  img {
    // width: 100%;
    max-width: 400px;
  }
}
.info-wrap {
  padding: 24px !important;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.property-wrap {
  height: calc(100% - 24px);
  overflow: auto;
  padding: 0;
  padding-right: 24px !important;
  position: relative;
  margin-top: 24px;
}
.property-title {
  position: sticky;
  top: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: #333333;
  opacity: 1;
  // margin-bottom: 16px;
  padding: 10px 0 10px 24px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
}
.property-list {
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  padding: 20px 16px;
  width: 100%;
  height: 90%;
  overflow: auto;
  padding-right: 24px;
  // border-left: 1px solid #ccc;
  // border-bottom: 1px solid #ccc;

  .property-item {
    // font-size: 16px;

    .property-name {
      margin: 0 0 18px;
      display: inline-block;
      width: 100%;
      // height: 48px;
      font-size: 14px;
      font-weight: 500;
      line-height: 24px;
      color: #333333;
      opacity: 1;
    }
    .property-key {
      display: inline-block;
      width: 70px;
      vertical-align: top;
      text-align: right;
      font-weight: bold;
    }
    .property-value {
      display: inline-block;
      word-break: break-all;
      white-space: pre-wrap;
      width: calc(100% - 70px);
      // height: 80px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #999999;
      opacity: 1;
      padding: 0 0 0 12px;
    }
  }
}
.dialog-footer {
  float: right;
  margin: 20px;
  bottom: 0;
}
// /deep/ .el-dialog__header {
//   border-bottom: 0;
// }
.hidden {
  display: none;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.text-hidden {
  display: inline-block;
  height: 200px;
  overflow: hidden;
}
.tip-type {
  width: 285px;
  height: 16px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 16px;
  color: rgba(153, 153, 153, 1);
  opacity: 1;
}
.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.3em;
  fill: currentColor;
  overflow: hidden;
}
.info-key {
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.file-icon {
  display: inline-block;
  width: 25px;
  height: 25px;
  background-size: 100% 100%;
  vertical-align: middle;
}
.file-txt {
  background-image: url('~@/assets/icon/txt.png');
}
.file-zip {
  background-image: url('~@/assets/icon/zip.png');
}
.file-pdf {
  background-image: url('~@/assets/icon/pdf.png');
}
.file-word {
  background-image: url('~@/assets/icon/word.png');
}
.file-excel {
  background-image: url('~@/assets/icon/excel.png');
}
.file-img {
  background-image: url('~@/assets/icon/img.png');
}
.file-video {
  background-image: url('~@/assets/icon/video.png');
}
.file-music {
  background-image: url('~@/assets/icon/music.png');
}
.file-file {
  background-image: url('~@/assets/icon/file.png');
}
.more-format {
  display: inline-block;
  width: 20px;
  height: 25px;
  background-color: #999;
  color: #fff;
  vertical-align: middle;
  text-align: center;
  font-size: 25px;
  line-height: 25px;
  cursor: pointer;
  border-radius: 3px;
}
</style>

<style lang="scss" scoped>
.map-search-add {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
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
        content: '';
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
</style>
