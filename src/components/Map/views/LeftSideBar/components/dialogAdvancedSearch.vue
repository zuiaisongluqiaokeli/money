<template>
  <div class="search-modal" id="search-dialog">
    <el-dialog
      title="高级搜索"
      class="dialog"
      :visible="true"
      width="1085px"
      :close-on-click-modal="false"
      :before-close="emitClosedEvent"
    >
      <div class="dialog-body">
        <el-backtop target=".el-dialog__body"></el-backtop>
        <el-row class="row" v-loading="treeLoading" element-loading-text="正在获取数据，请稍后...">
          <el-col style="overflow: hidden" :span="5">
            <div class="tree-filter">
              <el-input
                v-model="filterText"
                class="search"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
              ></el-input>
            </div>
            <el-tree
              ref="tree"
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              highlight-current
              node-key="id"
              :expand-on-click-node="false"
              :default-expanded-keys="defaultExpandedKeys"
              @node-click="queryNode"
            ></el-tree>
          </el-col>
          <el-col :span="18" class="main-right-box" style="overflow: hidden" :offset="1">
            <div class="panel" style="height: 100%">
              <div class="head clearfix">
                <div style="display: inline-block">
                  <el-form :inline="true" @submit.native.prevent>
                    <el-form-item>
                      <el-input
                        v-model="advancedSearchQuery.searchContent"
                        clearable
                        class="search-input"
                        placeholder="请输入实体名称"
                        :disabled="showAdvancedSearch"
                        @keyup.enter.native="findVertices"
                        @clear="findVertices"
                      >
                        <i slot="prefix" class="el-icon-search" @click="findVertices"></i>
                      </el-input>
                    </el-form-item>
                    <el-button v-if="graphType === 'Neo4j'" type="text" @click="changeSearch">
                      {{ showAdvancedSearch ? "普通搜索" : "高级搜索" }}
                      <i
                        v-if="showAdvancedSearch"
                        class="el-icon-arrow-up"
                      ></i>
                      <i v-if="!showAdvancedSearch" class="el-icon-arrow-down"></i>
                    </el-button>
                  </el-form>
                </div>
              </div>
              <el-collapse-transition>
                <div v-show="showAdvancedSearch">
                  <AdvanceSearch
                    v-if="reFresh"
                    ref="advanceSearch"
                    :advanced-search-query="advancedSearchQuery"
                    :search-type="searchType"
                    :search-relation="searchRelation"
                    :search-key="searchKey"
                    :search-name="searchName"
                    :placeholder="placeholder"
                  ></AdvanceSearch>
                  <div class="button-group">
                    <el-button type="primary" size="small" @click.native.prevent="advanceQuery">查 询</el-button>
                    <el-button @click.native.prevent="clearContent" size="small">重 置</el-button>
                  </div>
                </div>
              </el-collapse-transition>
              <div class="tableTitle">
                <span>查询结果列表</span>
                <span>已选中{{ totalSelection }}条</span>
              </div>
              <el-table
                :data="verticesListData"
                highlight-current-row
                ref="table"
                style="width: 100%"
                @selection-change="handleSelectChange"
                show-overflow-tooltip
                :header-cell-style="{ 'text-align': 'left' }"
                :cell-style="{ 'text-align': 'left' }"
                row-key="id"
              >
                <el-table-column type="selection" width="30" :reserve-selection="true"></el-table-column>
                <el-table-column label="实体名称" width="175" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span
                      class="btn-color"
                      @click="lookDetail(scope.row)"
                      style="cursor: pointer;color:#02b3fc;"
                    >{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fullCategoryName"
                  label="实体分类"
                  width="175"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="longitude" label="经度" width="175" show-overflow-tooltip></el-table-column>
                <el-table-column prop="latitude" label="纬度" show-overflow-tooltip></el-table-column>
              </el-table>
              <el-pagination
                class="pagination"
                background
                @size-change="changeSize"
                @current-change="changeCurrent"
                :current-page.sync="listQuery1.page"
                :page-size="listQuery1.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="listQuery1.total"
              ></el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="footer" slot="footer">
        <el-button type="primary" size="small" @click="dialogSave">确定</el-button>
        <el-button type="default" size="small" @click="emitClosedEvent">取消</el-button>
      </div>
      <!-- 遮罩层 -->
      <div v-if="drawerDialog" class="add-pop-up-windows"></div>
      <div
        class="GisInfoPanel"
        :class="[drawerDialog ? 'show-panel' : 'hide-panel']"
        v-if="drawerDialog"
        append-to-body
      >
        <!-- <transition name="el-fade-in-linear">
          <div class="tab-button" @click="drawerDialog=!drawerDialog">
            <div class="text">
              <i class="iconfont icon-left3"></i>
              信息面板
            </div>
          </div>
        </transition>-->
        <div class="panel-content">
          <div class="top"></div>
          <div class="body">
            <div class="content">
              <div slot="title" class="slot-title">
                <span>信息面板</span>
                <i class="el-icon-close" @click="drawerDialog = !drawerDialog"></i>
              </div>
              <el-collapse :value="['1', '2', '3', '4']">
                <el-collapse-item name="1" title="实体信息">
                  <div class="collapse-body avatar-name">
                    <div class="avatar">
                      <img
                        :src="newVerticesData.avatar"
                        v-if="newVerticesData.avatar"
                        :onerror="errorImg"
                      />
                      <img v-else src="img/location.png" />
                      <span>{{ newVerticesData.name }}</span>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="2" title="属性">
                  <div class="collapse-body">
                    <div class="properties">
                      <span class="label">实体名称</span>
                      <span class="value">{{ newVerticesData.name }}</span>
                    </div>
                    <div class="properties">
                      <span class="label">实体分类</span>
                      <span class="value">
                        {{
                        categoryName || "暂未分类"
                        }}
                      </span>
                    </div>
                    <div
                      v-for="(item, index) in newVerticesData.propertiesJson"
                      :key="index"
                      class="properties"
                    >
                      <template
                        v-if="
                          item.name !== '实体分类' &&
                            item.name !== '名称' &&
                            item.name !== 'avatar' &&
                            item.name !== 'docs' &&
                            item.name !== 'name' &&
                            item.name[0] !== '_' &&
                            item.name !== 'pk_id' &&
                            item.name !== 'id' &&
                            item.name !== 'latitude' &&
                            item.name !== 'longitude'
                        "
                      >
                        <span class="label">{{ item.name }}</span>
                        <span :class="item.hidden ? 'text-hidden' : 'value'" v-html="item.value"></span>
                        <span
                          v-if="item.hidden"
                          style="margin:0;cursor:pointer;color:#188cff;text-align:center;width:100%"
                          @click="showMore(index)"
                        >
                          <i class="el-icon-arrow-down" title="显示更多"></i>
                        </span>
                        <span
                          v-if="!item.hidden && item.value.length > 100"
                          style="margin:0;cursor:pointer;color:#188cff;text-align:center;width:100%"
                          @click="showMore(index)"
                        >
                          <i class="el-icon-arrow-up" title="收起"></i>
                        </span>
                      </template>
                    </div>
                    <!-- <div class="properties">
                  <span class="label">部署装备：</span>
                  <el-button type="text" @click="seeDetail('部署装备')">
                    查看详细
                  </el-button>
                </div>
                <div class="properties">
                  <span class="label">隶属：</span>
                  <el-button type="text" @click="seeDetail('隶属')">
                    查看详细
                  </el-button>
                    </div>-->
                  </div>
                </el-collapse-item>
                <el-collapse-item name="3" title="标签">
                  <div class="labels collapse-body">
                    <div
                      v-if="newVerticesData.labelsList.length > 0"
                      style="width: 96%; font-size: 14px"
                    >
                      <el-tag
                        style="margin: 10px 5px"
                        size="mini"
                        v-for="val in newVerticesData.labelsList"
                        :key="val"
                      >{{ val }}</el-tag>
                    </div>
                    <div v-else>暂无标签</div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="4" title="相关文档">
                  <div class="labels collapse-body">
                    <div v-if="fileData.length > 0" style="width: 96%; font-size: 14px">
                      <div
                        v-for="(item, index) in fileData"
                        :key="index"
                        class="list-item"
                        :title="item.name"
                      >
                        <div style="cursor: pointer; color: #02b3fc">
                          <span :class="item.icon" class="file-icon"></span>
                          <span class="file-name" @click="preview(item)">
                            {{
                            item.name.substr(0, item.name.lastIndexOf("."))
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-else>暂无相关文档！</div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
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
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { emitter, EventType } from '../../../src/EventEmitter'
import AdvanceSearch from './AdvanceSearch'
import * as graphDetail from '@/services/graph-detail'
import * as graphVerticesDetail from '@/services/graph-vertices-detail'
import * as sortManage from '@/services/sort-manage'
export default {
  data() {
    return {
      defaultExpandedKeys: [-1],
      previewUrl: '',
      previewImg: '',
      previewSrc: '',
      previewMusic: '',
      videoType: 'mp4',
      previewDialog: false,
      blob: null,
      filterText: '',
      treeData: [],
      showAdvancedSearch: false, // 高级搜索判断
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      nodeName: '',
      drawerDialog: false,
      verticesListData: [],
      selectRows: [],
      node: {},
      totalSelection: 0,
      reFresh: true,
      listQuery1: {
        //实体列表的分页器
        page: 1, //页码
        size: 10, //每页显示数据量
        total: 0, //总条数
      },
      verticesListLoading: false, //实体列表loading
      loadingText: '', //实体列表loading文字
      treeLoading: false,
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
                key: '',
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
      searchType: [
        { key: '名称', value: 'name' },
        { key: '标签', value: 'label' },
        { key: '属性', value: 'prop' },
      ],
      searchRelation: [
        { key: '等于', value: 'EQ' },
        { key: '模糊等于', value: 'FUZZY' },
        { key: '不等于', value: 'NOTEQ' },
        // { key: "大于", value: "GT" },
        // { key: "小于", value: "LT" },
        // { key: "大于等于", value: "GE" },
        // { key: "小于等于", value: "LE" }
      ],
      searchKey: [],
      fileData: [],
      searchName: [],
      placeholder: '请输入内容',
      categoryId: '',
      categoryName: '',
      errorImg: 'this.src="' + './img/gis/location.png"',
      searchCategory: '',
      newVerticesData: {
        //  新增编辑实体数据
        name: null,
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
        prevSearchInfo: {},
      },
    }
  },
  components: {
    AdvanceSearch,
  },
  computed: {
    ...mapState('graphInfo', ['id', 'graphType']),
    ...mapGetters('graphInfo', ['graphName']),
    ...mapState('map', ['gisLabelShow']),
  },
  async created() {
    this.verticesListLoading = true
    this.loadingText = '正在获取数据，请稍候...'
    this.relationPropsGet()
    this.getCategory()
    this.getPropMapping() //获取字段映射
    //获取图谱所有结点属性
  },
  watch: {
    filterText(newval) {
      this.$refs.tree.filter(newval)
    },
  },
  methods: {
    ...mapMutations('home', ['openSearchDialog']),
    //高级搜索对应的属性名称列表
    async relationPropsGet() {
      let res = await graphVerticesDetail.relationPropsGet(this.id)
      if (res.data.success) {
        this.searchKey = res.data.object
      }
    },
    //显示树
    async getCategory() {
      this.treeLoading = true
      const res = await sortManage.nodeCategoryQuery(this.id)
      let data = res.data
      data.sort((a, b) => {
        return a.sortOrder - b.sortOrder
      })
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
      this.treeData = [
        {
          id: -1,
          label: '所有',
          children: treeData,
          parentsName: '',
        },
      ]
      this.queryNode({
        id: -1,
        label: '所有',
        children: treeData,
        parentsName: '',
      })
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
    //获取字段映射
    async getPropMapping() {
      const res = await graphDetail.getPropMapping(this.id)
      if (res && res.data && res.data.success) {
        this.advancedSearchQuery.title = res.data.object.title
      } else {
        this.$message.error('获取数据失败')
      }
    },
    //过滤搜索
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async queryNode(node) {
      this.nodeName = node.name
      this.node = node
      this.searchCategory =
        node.parentName === '' ? node.name : node.parentName + '>' + node.name
      this.nodeClick(node)
      this.advanceQuery()
    },
    nodeClick(data) {
      this.categoryId = data.id !== -1 ? data.parentId + '>' + data.id : ''
      this.categoryId = data.parentId !== 0 ? this.categoryId : String(data.id)
      this.categoryName = data.name
      this.newVerticesData.type = data.name //给弹窗用
    },
    // 高级搜索
    async changeSearch() {
      this.showAdvancedSearch = !this.showAdvancedSearch
      this.advancedSearchQuery.advancedSearchFlag = true
      // this.advancedSearchQuery.advancedSearchFlag = !this.advancedSearchQuery
      //   .advancedSearchFlag;
      this.advancedSearchQuery.searchContent = ''
      let ary = [
        {
          conditionsTypeEnum: '',
          conditionsEnum: '',
          key: '',
          value: '',
          valueType: 'String',
          operator: '且',
        },
      ]
      this.advancedSearchQuery.moreCondition = [
        {
          operator: '且',
          moreConditions: ary,
        },
      ]
    },
    // 重置
    clearContent() {
      this.reFresh = false
      let advanceSearch = this.$refs.advanceSearch
      advanceSearch.searchRelationAry = this.searchRelation
      let ary = [
        {
          conditionsTypeEnum: 'prop',
          conditionsEnum: 'FUZZY',
          key: '',
          value: '',
          valueType: 'String',
          operator: '且',
        },
      ]
      this.advancedSearchQuery.moreCondition = [
        {
          operator: '且',
          moreConditions: ary,
        },
      ]
      this.listQuery1.page = 1
      this.advancedSearchQuery.advancedSearchFlag = true
      this.$nextTick(() => {
        this.reFresh = true
      })
      this.handleFilter('search')
      this.verticesListLoading = false
    },
    // 高级搜索查询
    advanceQuery() {
      if (!this.verticesListLoading) this.verticesListLoading = true
      this.listQuery1.page = 1
      this.advancedSearchQuery.advancedSearchFlag = true
      this.handleFilter('search')
      this.verticesListLoading = false
    },
    async handleFilter(type) {
      // this.advancedSearchQuery.graphName = this.graphName;
      this.verticesListLoading = true
      this.treeLoading = true
      let params
      //区分是普通搜索还是高级搜索
      if (type !== 'search') {
        this.prevSearchInfo.graphName = this.graphName
        this.advancedSearchQuery = JSON.parse(
          JSON.stringify(this.prevSearchInfo)
        )
        params = this.prevSearchInfo
      } else {
        this.advancedSearchQuery.graphName = this.graphName
        ;(this.advancedSearchQuery.categoryName = this.nodeName || ''),
          (this.prevSearchInfo = JSON.parse(
            JSON.stringify(this.advancedSearchQuery)
          ))
        params = JSON.parse(JSON.stringify(this.advancedSearchQuery))

        if (params.moreCondition.length === 0) {
          //高级没有选信息默认赋值
          params.moreCondition.push({
            operator: '且',
            moreConditions: [
              {
                conditionsTypeEnum: 'name',
                conditionsEnum: 'FUZZY',
                key: '',
                value: '',
                valueType: 'String',
                operator: '且',
              },
            ],
          })
        }
        if (this.advancedSearchQuery.searchContent) {
          //高级搜索有输入框
          params.moreCondition[0].moreConditions.push({
            conditionsTypeEnum: 'name',
            conditionsEnum: 'FUZZY',
            key: '',
            value: this.advancedSearchQuery.searchContent,
            valueType: 'String',
            operator: '且',
          })
        }
        if (this.node) {
          params.moreCondition.forEach((item) => {
            item.moreConditions.push({
              conditionsTypeEnum: 'prop',
              conditionsEnum: 'LEFT',
              key: '实体分类',
              value: this.searchCategory.includes('undefined')
                ? ''
                : this.searchCategory,
              valueType: 'String',
              operator: '且',
            })
          })
        }
        let conditionsDTO = JSON.parse(JSON.stringify(params))
        conditionsDTO = JSON.parse(JSON.stringify(conditionsDTO))
        conditionsDTO.moreCondition.forEach((item) => {
          item.moreConditions = item.moreConditions.filter((ele) => {
            if (ele.conditionsTypeEnum == 'prop') {
              return ele.key !== '' && ele.value !== ''
            } else {
              return ele.value !== ''
            }
          })
        })
        let res = await sortManage.verticesNeo4jSeniorQuery(
          this.listQuery1.page - 1,
          this.listQuery1.size,
          conditionsDTO
        )
        this.verticesListData = res.data.data
        this.verticesListData.forEach((item) => {
          if (item.properties.hasOwnProperty('经度') && item.properties.经度) {
            item.longitude = item.properties.经度 //给表格用
            item.latitude = item.properties.纬度
            item.properties.longitude = item.properties.经度 //绘图用
            item.properties.latitude = item.properties.纬度
          } else {
            item.longitude = '暂无'
            item.latitude = '暂无'
            item.properties.longitude = undefined
            item.properties.latitude = undefined
          }
          if (item.fullCategoryName == '' || item.fullCategoryName == 'null')
            item.fullCategoryName = '暂未分类'
          item.properties.实体分类 = item.fullCategoryName //分类用
          //this.$refs.table.toggleRowSelection(item);
        })
        this.listQuery1.total = res.data.totalCounts || 0
        this.treeLoading = false
        this.verticesListLoading = false
      }
    },
    //多选实体
    handleSelectChange(val) {
      var list = [].concat(JSON.parse(JSON.stringify(val)))
      list = list.filter((item, index, arr) => {
        let arrIds = arr.map((ele) => ele.id)
        return arrIds.indexOf(item.id) == index
      })
      this.selectRows = list
      this.totalSelection = list.length
    },
    //查询实体列表
    findVertices() {
      this.verticesListLoading = true
      this.loadingText = '正在获取数据，请稍候...'
      this.listQuery1.page = 1
      this.graphVerticesGet('search')
      this.verticesListLoading = false
    },
    //获取实体列表数据
    graphVerticesGet(type) {
      this.verticesListLoading = true
      if (this.graphType === 'Neo4j') {
        if (type === 'search') {
          this.handleFilter('search')
        } else {
          this.handleFilter()
        }
      } else {
        if (type === 'search') {
          this.JanusGraphVerticesGet('search')
        } else {
          this.JanusGraphVerticesGet()
        }
      }
    },
    showMore(index) {
      this.newVerticesData.propertiesJson[index].hidden = !this.newVerticesData
        .propertiesJson[index].hidden
    },
    //获取实体列表数据
    async JanusGraphVerticesGet(type) {
      let searchContent
      if (type !== 'search') {
        this.advancedSearchQuery.searchContent = this.prevName
        searchContent = this.prevName
      } else {
        this.prevName = this.advancedSearchQuery.searchContent
        searchContent = this.advancedSearchQuery.searchContent
      }
      this.loadingText = '正在获取数据，请稍候...'
      this.verticesListLoading = true
      let res = await graphVerticesDetail
        .graphVerticesGet(
          this.listQuery1.page - 1,
          this.listQuery1.size,
          this.id,
          searchContent
        )
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取数据请求失败',
          })
        })
      this.verticesListData = res.data.object.data
      this.verticesListData.forEach((item) => {
        if (item.properties.hasOwnProperty('经度') && item.properties.经度) {
          item.longitude = item.properties.经度 //给表格用
          item.latitude = item.properties.纬度
          item.properties.longitude = item.properties.经度 //绘图用
          item.properties.latitude = item.properties.纬度
        } else {
          item.longitude = '暂无'
          item.latitude = '暂无'
          item.properties.longitude = undefined
          item.properties.latitude = undefined
        }
        if (item.fullCategoryName == '' || item.fullCategoryName == 'null')
          item.fullCategoryName = '暂未分类'
        item.properties.实体分类 = item.fullCategoryName //分类用
        //this.$refs.table.toggleRowSelection(item);
      })
      this.listQuery1.total = res.data.object.totalCounts || 0
      this.verticesListLoading = false
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
    async lookDetail(row) {
      let res = await graphVerticesDetail
        .vertexDetailView(row.id, this.id)
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
                hidden: props[prop].length > 100, //内容字数大于200，提供判断是否显示所有内容
              })
            }
            if (prop === 'docs') {
              this.fileData = JSON.parse(props[prop])
              this.fileData.forEach((item) => {
                item.type = item.name.slice(item.name.lastIndexOf('.') + 1)
                item.icon = this.makeIcons(item.name)
              })
            }
            if (prop === 'avatar') {
              this.avatar = props[prop]
            }
            if (prop === '实体分类') {
              this.categoryName = props[prop]
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
        this.drawerDialog = true
      }
    },
    //用于判断，当前文件的格式，来控制显示什么图标，代码需要优化
    makeIcons(name) {
      name = name.toLowerCase()
      if (name === '') return ''
      name = name.toLowerCase()
      if (/\.txt$/.test(name)) {
        return 'file-txt'
      } else if (/\.doc$|\.docx$/.test(name)) {
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
    changeSize(val) {
      this.listQuery1.size = val
      this.graphVerticesGet('search')
    },
    changeCurrent(val) {
      this.listQuery1.page = val
      this.graphVerticesGet('search')
    },
    dialogSave() {
      if (this.selectRows.length == 0) {
        this.$message.error('请选择搜索实体')
        return
      }
      console.log('搜索的实体数据', this.selectRows)
      //有经纬度就绘制没有不绘制都渲染到左下面板
      emitter.emit(EventType.RENDER_DATA, {
        entities: this.selectRows,
        labelShow: this.gisLabelShow,
      })
      this.openSearchDialog(false)
      this.$message.success('搜索成功')
    },
    /**
     * 触发关闭事件
     */
    emitClosedEvent() {
      this.openSearchDialog(false)
    },
  },
}
</script>

<style lang="scss" scoped>
.show-panel {
  right: 0;
}
.hide-panel {
  right: -23rem;
}
/deep/ .el-table .cell {
  white-space: nowrap;
}
/deep/ .el-pager li.active {
  color: var(--color-text-primary);
}
.pagination {
  margin: 10px 0;
  text-align: right;
}
.tableTitle {
  display: flex;
  justify-content: space-between;
}
// color: var(--color-text-primary);
.tree-filter {
  & /deep/ .el-input__inner {
    border-radius: 4px;
  }
}
/deep/ .el-table th > .cell {
  padding-left: 14px;
  padding-right: 14px;
}
/deep/ .el-tree {
  margin-top: 20px;
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
/deep/ pagination-container {
  position: absolute;
  right: 0;
}
.map-search-add {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.dialog {
  .dialog-body {
    position: relative;
    display: flex;
    flex-direction: column;

    .row {
      height: 100%;

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
  .main-right-box {
    padding-left: 31px;
    margin-left: 30px;
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: var(--border-color-base);
  }
  .panel {
    min-height: calc(80vh - 140px);
    .head {
      .head-title {
        float: left;
        padding: 10px 0;
        font-style: normal;
        font-weight: 501;
        margin-right: 100px;
        color: #e9e9e9;
      }

      .head-btn {
        float: right;
      }
    }

    .body {
      padding: 15px 10px;
    }
  }
}
.text-hidden {
  display: inline-block;
  height: 100px;
  overflow: hidden;
}
/deep/ .el-collapse-item__arrow {
  margin: 0 0px 0 auto;
}
/deep/ .pagination-container {
  position: absolute;
  right: 0;
}
/depp/ .el-tooltip__popper {
  width: 30% !important;
}
.button-group {
  text-align: center;
  margin-bottom: 20px;
}
.add-pop-up-windows {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 998;
}
.file-icon {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin-right: 6px;
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
/deep/ .el-backtop {
  right: 10%;
  bottom: 29%;
}
.GisInfoPanel {
  position: absolute;
  top: 0rem;
  right: 0;
  width: 20rem;
  height: calc(100% - 0rem);
  background-color: var(--background-color-panel);
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  z-index: 999;
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
        .slot-title {
          height: 54px;
          display: flex;
          align-items: center;
          font-size: 20px;
          justify-content: space-between;
          padding: 0 14px;
          color: var(--color-text-primary);
        }
        .collapse-body {
          padding-right: 16px;
          padding-left: 16px;
          .list-item {
            display: flex;
            align-items: center;
            margin: 7px 0;
            justify-content: space-between;
            .item-title {
              font-size: 14px;
              margin-left: 8px;
            }
          }
        }

        .properties {
          display: flex;
          color: var(--color-text-regular);
          flex-wrap: wrap;
          font-size: 14px;
          .label {
            display: block;
            text-align: left;
            width: 100px;
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
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            height: 8.3rem;
            img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: contain;
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
</style>
