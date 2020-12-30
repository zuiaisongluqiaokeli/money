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
    <div class="panel-content" v-if="show">
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
          <el-row style="text-align: right; padding-right: 20px">
            <el-button type="text" @click="editDialog">编辑</el-button>
          </el-row>
          <el-collapse :value="['1', '2', '3', '4']">
            <el-collapse-item name="1" title="实体信息">
              <div class="collapse-body avatar-name">
                <div class="avatar">
                  <img
                    :src="newVerticesData.avatar"
                    v-if="newVerticesData.avatar"
                    :onerror="errorImg"
                  />
                  <img v-else :src="defaultImgSrc" />
                  <span>{{ newVerticesData.name }}</span>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2" title="属性">
              <div class="collapse-body">
                <div class="properties">
                  <span class="label">实体名称</span>
                  <span
                    :class="nameShow&&newVerticesData.name.length>100 ? 'text-hidden' : 'value'"
                    v-html="newVerticesData.name"
                  ></span>
                  <span
                    v-if="nameShow&&newVerticesData.name.length>100"
                    style="margin:0;cursor:pointer;color:#188cff;text-align:center;width:100%"
                    @click="nameShow=!nameShow"
                  >
                    <i class="iconfont close-btn icon-down1" title="显示更多"></i>
                  </span>
                  <span
                    v-if="!nameShow&&newVerticesData.name.length>100"
                    style="margin:0;cursor:pointer;color:#188cff;text-align:center;width:100%"
                    @click="nameShow=!nameShow"
                  >
                    <i class="iconfont close-btn icon-up2" title="收起"></i>
                  </span>
                </div>
                <div class="properties">
                  <span class="label">实体分类</span>
                  <span class="value">{{ categoryName}}</span>
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
                      item.name !== 'longitude'&&
                      item.name !== 'locus'
                    "
                  >
                    <el-tooltip effect="dark" :content="item.name" placement="top-start">
                      <div class="description">
                        <span class="label">{{ item.name }}</span>
                      </div>
                    </el-tooltip>
                    <span :class="item.hidden ? 'text-hidden' : 'value'" v-html="item.value"></span>
                    <span
                      v-if="item.hidden"
                      style="margin:0;cursor:pointer;color:#188cff;text-align:center;width:100%"
                      @click="showMore(index)"
                    >
                      <i class="iconfont close-btn icon-down1" title="显示更多"></i>
                    </span>
                    <span
                      v-if="!item.hidden && item.value.length > 100"
                      style="margin:0;cursor:pointer;color:#188cff;text-align:center;width:100%"
                      @click="showMore(index)"
                    >
                      <i class="iconfont close-btn icon-up2" title="收起"></i>
                    </span>
                  </template>
                </div>
                <div class="properties">
                  <span class="label">详细属性</span>
                  <el-button type="text" @click="seeDetail('详细属性')">查看详细</el-button>
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
                  style="width: 100%; font-size: 14px"
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
                    <div>
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
    <!-- 查看详细内容弹窗 -->
    <el-dialog
      append-to-body
      class="map-info-panel-dialog detail-dialog"
      :title="detailDialogTitle"
      :visible.sync="detailDialogVisible"
      width="500px"
    >
      <el-form
        class="dialog-form"
        label-width="10px"
        v-if="
          detailDialogTitle == '部署装备' || detailDialogTitle == '详细属性'
        "
      >
        <el-form-item v-for="(item, index) in seeDetailData" :key="index">
          <div class="seeDetailData">
            <el-tooltip effect="dark" :content="item.name" placement="top-start">
              <div class="description">
                <span class="label">{{ item.name }}</span>
              </div>
            </el-tooltip>
            <span class="value" v-html="item.value"></span>
          </div>
        </el-form-item>
      </el-form>
      <el-radio-group v-model="checkedRadio" v-if="detailDialogTitle == '隶属'">
        <el-radio
          v-for="(item, index) in radioData"
          :label="item.id"
          :key="index"
          class="radio"
        >{{ item.name }}</el-radio>
      </el-radio-group>
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import { emitter, EventType } from '../src/EventEmitter'
import * as graphVerticesDetail from '@/services/graph-vertices-detail'
import * as sortManage from '@/services/sort-manage'
import { geoNodeFindGroupData } from '@/assets/api/map'
export default {
  name: 'GisInfoPanel',
  data() {
    return {
      show: false,
      fixed: false,
      previewUrl: '',
      previewImg: '',
      previewSrc: '',
      previewMusic: '',
      videoType: 'mp4',
      previewDialog: false,
      nameShow: true,
      blob: null,
      previewLoading: false,
      selectedEntity: {},
      errorImg: 'this.src="' + './img/gis/location.png"',
      defaultImgSrc: 'img/gis/location.png',
      seeDetailData: [],
      detailDialogTitle: '',
      radioData: [], //隶属
      detailDialogVisible: false,
      checkedRadio: '',
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
      },
      entityId: '',
      categoryName: '暂未分类', // 实体详情的实体分类
      fileData: [],
    }
  },
  computed: {
    ...mapState('graphInfo', ['id', 'graphType', 'name']),
    ...mapGetters('map', ['gisEntityIds', 'gisLinesIds']),
    ...mapGetters('graphInfo', ['graphName']),
    ...mapState('map', ['gisEntities']),
    // entity() {
    //   if (this.selectedEntity) {
    //     console.log(
    //       "选中实体属性",
    //       this.selectedEntity.id.properties.getValue()
    //     );
    //     // return this.gisEntities.filter(
    //     //   (item) => item.id === this.selectedEntity.id.id
    //     // )[0]; //所有的实体列表
    //     let form = this.selectedEntity.id.properties.getValue();
    //     form.id = this.selectedEntity.id.id;
    //     return form;
    //   } else {
    //     return undefined;
    //   }
    // },
    // labels() {
    //   if (this.entity.hasOwnProperty("labels")) {
    //     return this.entity.labels.filter((item) => item != "DATAEXA_OBJECT");
    //   } else {
    //     return [];
    //   }
    // },
    // properties() {
    //   const nameMap = {
    //     latitude: "纬度",
    //     longitude: "经度",
    //   };
    //   return this.entity
    //     ? Object.keys(this.entity)
    //         .filter(
    //           (v) =>
    //             [
    //               "avatar",
    //               "name",
    //               "keyVertexId",
    //               "weight",
    //               "color",
    //               "r_doc",
    //               "locus",
    //               "id",
    //             ].indexOf(v) < 0
    //         )
    //         .map((k) => [nameMap[k] ? nameMap[k] : k, this.entity[k]])
    //     : [];
    // },
    // nameAndAvatar() {
    //   return this.entity ? [this.entity.name, this.entity.avatar] : [];
    // },
  },
  methods: {
    ...mapMutations('map', ['setselectedVertices']),
    //记得改标记实体的ID
    async setSelectedEntity(val) {
      ;(this.nameShow = true), (this.entityId = val.id.entityId)
      if (val.id.hasOwnProperty('entityId') && val.id.entityId !== '') {
        // 拿之前的数据+现在的经纬度 发送数据
        let result = await graphVerticesDetail.vertexDetailView(
          val.id.entityId,
          this.id
        )
        let propertiesJson = result.data.object.propsList.map((item) => ({
          name: item.key,
          value: item.value,
          primary: false,
        }))
        propertiesJson.forEach((item) => {
          if (item.name == 'name' || item.name == '名称') {
            item.primary = true
          }
        })
        propertiesJson.push({
          name: '纬度',
          value: val.id.properties.getValue().lat,
          primary: false,
        })
        propertiesJson.push({
          name: '经度',
          value: val.id.properties.getValue().lng,
          primary: false,
        })
        let newResult = await graphVerticesDetail.verticesUpdate({
          atlasId: parseInt(this.id),
          id: val.id.entityId,
          name: this.graphName,
          propertiesJson: JSON.stringify(propertiesJson),
          labelStr: result.data.object.labelsList.toString(),
          type: this.newVerticesData.type,
          graphType: this.graphType,
        })
        if (newResult.data.success == false) {
          this.$message.error(newResult.data.msg)
          return
        }
        newResult.data.object.properties.latitude =
          newResult.data.object.properties.纬度
        newResult.data.object.properties.longitude =
          newResult.data.object.properties.经度
        newResult.data.object.properties.实体分类 =
          (newResult.data.object.properties.hasOwnProperty('实体分类') &&
            newResult.data.object.properties.实体分类) ||
          '暂未分类'
        gisvis.viewer.entities.getById(val.id.entityId).newAdd = false //标记或者未知位置添加时候的标记
        emitter.emit(EventType.LEGEND_DATA_CHANGE, [newResult.data.object]) //重新分组
        let res = await graphVerticesDetail
          .vertexDetailView(val.id.entityId, this.id)
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
          this.setselectedVertices(res.data.object)
          this.newVerticesData.propertiesJson = []
          this.newVerticesData.avatar =
            (res.data.object.properties.hasOwnProperty('avatar') &&
              res.data.object.properties.avatar) ||
            'img/location.png'
          if (res.data.object.properties) {
            let props = res.data.object.properties
            this.fileData = [] //清空
            this.categoryName = '暂未分类'
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
                this.newVerticesData.name =
                  (props.hasOwnProperty('name') && props.name) ||
                  (props.hasOwnProperty('名称') && props.名称)
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
          this.show = true
        }
      }
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
    showMore(index) {
      this.newVerticesData.propertiesJson[index].hidden = !this.newVerticesData
        .propertiesJson[index].hidden
    },
    fixedPanel() {
      this.fixed = !this.fixed
      let message = '面板已锁住'
      if (!this.fixed) {
        message = '面板已解锁'
      }
      this.$message.warning({
        message,
        duration: 1500,
      })
    },
    clickTabButton(event) {
      if (this.entityId) this.show = !this.show
    },
    close() {
      this.entityId = ''
      this.selectedEntity = null
      !this.fixed && (this.show = false)
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
    editDialog() {
      emitter.emit(EventType.EDIT_CLICK_ENTITY, this.entityId)
    },
    async seeDetail(item) {
      this.seeDetailData = this.newVerticesData.propertiesJson
      this.detailDialogTitle = item
      this.detailDialogVisible = true
    },
    async getGroupData() {
      const res = await geoNodeFindGroupData(this.graphName)
      const { success, object, msg } = res.data

      if (!success) {
        this.$message.error(msg)
      }

      return object || []
    },
    removeEntity() {},
  },
  async created() {
    emitter.on(EventType.CLICK_BLANK, this.close, this)
    emitter.on(EventType.CLICK_ENTITY, this.setSelectedEntity, this)
    //this.radioData = await this.getGroupData();  //隶属数据
  },
  beforeDestroy() {
    emitter.off(EventType.CLICK_BLANK, this.close)
    emitter.off(EventType.CLICK_ENTITY, this.setSelectedEntity)
  },
}
</script>

<style scoped lang="scss">
.GisInfoPanel {
  position: fixed;
  top: 3.58rem;
  right: 0;
  width: 23rem;
  height: calc(100vh - 3.58rem);
  background-color: var(--background-color-panel);
  border-top: 2px var(--color-dark) solid;
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
    top: calc(50vh - 12.43rem);
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
          .list-item {
            display: flex;
            align-items: center;
            margin: 7px;
            justify-content: space-between;
            .item-title {
              font-size: 14px;
              margin-left: 8px;
            }
            div {
              width: 89%;
              .file-name {
                cursor: pointer;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #02b3fc;
                width: 80%;
                display: inline-block;
                vertical-align: middle;
              }
            }
          }
        }

        .properties {
          display: flex;
          color: var(--color-text-regular);
          flex-wrap: wrap;
          font-size: 14px;
          margin: 2px 0;
          .label {
            display: block;
            text-align: left;
            width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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

.show-panel {
  right: 0;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
.text-hidden {
  display: inline-block;
  height: 100px;
  overflow: hidden;
}
.hide-panel {
  right: -23rem;
}
/deep/ .el-collapse-item__arrow {
  margin: 0 0px 0 auto;
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
.seeDetailData {
  display: flex;
  color: var(--color-text-regular);
  margin: 4px 0;
  flex-wrap: wrap;
  font-size: 14px;
  .label {
    display: block;
    text-align: left;
    width: 125px;
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
</style>
