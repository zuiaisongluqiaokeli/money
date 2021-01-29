<template>
  <div class="typeExpand">
    <el-dialog
      title="按属性显示"
      :close-on-click-modal="false"
      visible
      @close="$emit('close')"
      :modal-append-to-body="false"
      class="small-dialog"
    >
      <div class="content">
        <el-row>
          <el-col :span="4">
            <p>属性名称:</p>
          </el-col>
          <el-col :span="10">
            <el-input v-model="propertyName" placeholder="请输入属性名称"></el-input>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <div class="checkBox">
          <el-checkbox-group v-model="checkedTypes" @change="change">
            <el-checkbox
              v-for="type in menuTypes"
              :label="type"
              :title="type.name"
              :key="type.name"
            >{{type.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="saveDragInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { emitter, EventType } from '../src/EventEmitter'
import { newExtendVertice, verticalLayer } from '@/assets/api/expand'
export default {
  computed: {
    ...mapState('map', ['gisRightSelectedEntity']),
  },
  data() {
    return {
      checkAll: false,
      checkedTypes: [],
      menuTypes: [],
      allMenuTypes: [],
      isIndeterminate: false,
      propertyName: '',
    }
  },
  watch: {
    propertyName(val) {
      if (val) {
        this.menuTypes = this.allMenuTypes.filter(
          (item) => item.name.indexOf(val) > -1
        )
        if (this.menuTypes.length == 1) {
          this.checkedTypes = this.checkedTypes.concat(this.menuTypes)
          this.propertyName = ''
        }
      } else {
        this.menuTypes = this.allMenuTypes
      }
    },
  },
  created() {
    this.menuTypes = this.allMenuTypes = this.$store.state.map.dragInfoProperties.filter(
      (item) =>
        item.name !== '实体分类' &&
        item.name !== '名称' &&
        item.name !== 'avatar' &&
        item.name !== 'docs' &&
        item.name !== 'name' &&
        item.name[0] !== '_' &&
        item.name !== 'pk_id' &&
        item.name !== 'id' &&
        item.name !== 'latitude' &&
        item.name !== 'longitude' &&
        item.name !== 'locus' &&
        item.hidden !== true
    )
  },
  methods: {
    change() {
      if (this.propertyName) this.propertyName = ''
    },
    saveDragInfo() {
      let arr = gisvis.dragPopperArr
      gisvis.emitter.emit(EventType.deleteAllBubbles)
      gisvis.emitter.emit(EventType.addAllBubbles, {
        multiple: false,
        oneArr: [this.gisRightSelectedEntity],
        properties: this.checkedTypes,
      })
      //如果没有数组就添加，有的话数组里面找不到对应的面板就创建面板否则销毁,并且面板每次只显示一个
      // if (arr.length == 0) {
      //   gisvis.emitter.emit(EventType.addAllBubbles, {
      //     multiple: false,
      //     oneArr: [this.gisRightSelectedEntity],
      //   })
      // } else {
      //   if (!arr.some((item) => item.id == this.gisRightSelectedEntity.id)) {
      //     gisvis.emitter.emit(EventType.deleteAllBubbles)
      //     gisvis.emitter.emit(EventType.addAllBubbles, {
      //       multiple: false,
      //       oneArr: [this.gisRightSelectedEntity],
      //     })
      //   } else {
      //     gisvis.emitter.emit(EventType.deleteAllBubbles)
      //   }
      // }
      this.$emit('close')
    },
  },
}
</script>
<style lang="sass" scope>
.typeExpand
  .content
    p
      font-size: var(--smallFontSize)
    p:first-child
      margin-top: 0
    .checkBox
      margin-left: 1rem
</style>
<style>
.typeExpand .el-checkbox,
.typeExpand .el-radio {
  margin-right: 0;
  margin-bottom: 0.5rem;
  width: 33.33333%;
}
</style>
<style lang="scss" scope>
.typeExpand {
  /deep/ .el-dialog {
    .el-dialog__body {
      display: block !important;
    }
  }

  /deep/ .el-checkbox__input {
    line-height: 1.4;
  }

  /deep/ .el-checkbox__label {
    overflow: hidden;
    white-space: nowrap;
    width: calc(100% - 10px);
    text-overflow: ellipsis;
    line-height: 1;
  }
}
</style>
