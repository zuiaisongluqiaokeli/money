<template>
  <div class="RangeSetting">
    <el-dialog
      title="设置"
      visible
      width="400px"
      :modal="false"
      :before-close="cancel"
    >
      <el-form label-width="80px">
        <el-form-item label="范围">
          <el-input-number v-model="range" :controls="false"></el-input-number>
          <span style="margin-left: 10px">公里</span>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="labels"
            multiple
            collapse-tags
            filterable
            :filter-method="filterMethod"
          >
            <el-option
              v-for="val in allLabels"
              :label="val"
              :key="val"
              :value="val"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="footer" slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="finish">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "RangeSetting",
  props: {
    cancel: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      range: 100,
      labels: [],
      keyword: "",
    };
  },
  computed: {
    ...mapState("map", [
      "rangeSetting",
      "gisRightSelectedEntity",
      "gisEntities",
      "gisLabelShow",
    ]),
    ...mapGetters("graphInfo", ["graphName"]),
    ...mapGetters("map", ["allLabels","gisEntityIds"]),
    // labelList() {
    //   if (this.keyword) {
    //     return this.allLabels
    //       .filter((val) => val.indexOf(this.keyword) >= 0)
    //       .slice(0, 200);
    //   } else {
    //     //return this.totalLabels.slice(0,200)
    //   }
    //},
  },
  methods: {
    filterMethod(keyword) {
      this.keyword = keyword;
    },
    ...mapMutations("map", [
      "setRangeSetting",
      "updateGisEntities",
      "changeGisRightSelectedEntity",
    ]),
    ...mapMutations("home", ["changeLoading"]),
    finish() {
      console.log("所有实体",this.gisEntities);
      // this.changeLoading(true)
      this.setRangeSetting({ range: this.range, labels: this.labels });
      let vertices = this.gisEntities.filter(
        (e) => e.id === this.gisRightSelectedEntity.id
      );
      let vertex = vertices[0];

      let params = {
        lat: vertex.properties.latitude,
        lng: vertex.properties.longitude,
        scanColor: Cesium.Color.fromCssColorString("#00c6ab"),
        radius: this.range * 1000,
      };

      gisvis.emitter.emit("gis-scope-render", params);
      if (gisvis.contextMenu) {
        gisvis.contextMenu.destroy();
        gisvis.contextMenu = null;
      }
      this.cancel();
      //找扩展元素并重绘
      setTimeout(() => {
        this.$api
          .getGisExpand(this.graphName, vertex, this.range, this.labels)
          .then((res) => {
            this.changeLoading(false);
            if (res.data.success) {
              if (res.data.object) {
                let result = res.data.object;
                //找余下的
                let entities = result.vertices.filter((v) => {
                  return !this.gisEntityIds.includes(v.id);
                });
                if (entities.length) {
                  this.updateGisEntities([].concat(entities, this.gisEntities));
                  let gisData = {
                    entities: entities,
                    labelShow: this.gisLabelShow,
                  };
                  gisvis.emitter.emit("gis-render-data", gisData);

                  this.changeGisRightSelectedEntity(null);
                } else {
                  gisvis.viewer.entities.removeById("marsRadarScan");
                  // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
                  //   i.enabled = false;
                  // });
                  this.$message.success({ message: "无搜索结果" });
                }
              } else {
                gisvis.viewer.entities.removeById("marsRadarScan");
                this.$message.success({ message: "无搜索结果" });
                // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
                //   i.enabled = false;
                // });
              }
            } else {
              // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
              //   i.enabled = false;
              // });
              gisvis.viewer.entities.removeById("marsRadarScan");
              this.$message.error({
                message: res.data.msg || res.data.errorMsg || "搜索失败",
                duration: 1500,
              });
            }
          })
          .catch(() => {
            gisvis.viewer.entities.removeById("marsRadarScan");
            this.$message.error({
              message: "服务端异常，请联系管理员",
              duration: 1500,
            });
          });
      }, 2000);
    },
  },
  created() {
    if (this.rangeSetting) {
      this.range = this.rangeSetting.range;
      this.labels = this.rangeSetting.labels;
    }
  },
};
</script>

<style scoped lang="scss">
.RangeSetting {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;

  .footer {
    text-align: right;
  }

  /deep/ .el-dialog {
    min-height: 250px;
  }
}
</style>
