<template>
    <div class="RangeSetting">
        <el-dialog title="设置范围" visible width="400px" :modal="false" :before-close="close">
            <el-form label-width="80px">
                <el-form-item label="范围">
                    <el-input-number v-model="range" :controls="false" style="width:200px" placeholder="请输入范围"></el-input-number>
                    <span style="margin-left: 10px">公里</span>
                </el-form-item>
            </el-form>
            <div class="footer" slot="footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="dialogSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
export default {
    name: "RangeSetting",
    props: {
        close: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            range: 500,
            labels: [],
            keyword: "",
        };
    },
    computed: {
        ...mapState("map", [
            "rangeSetting",
            "gisRightSelectedEntity",
            "gisEntities",
            "allEntityBackEnd",
            "gisLabelShow",
        ]),
        ...mapGetters("graphInfo", ["graphName"]),
        ...mapGetters("map", ["allLabels", "gisEntityIds"]),
    },
    methods: {
        ...mapMutations("map", [
            "setRangeSetting",
            "updateGisEntities",
            "setAttackShow",
            "changeGisRightSelectedEntity",
        ]),
        ...mapMutations("home", ["changeLoading"]),
        dialogSave() {
            gisvis.emitter.emit('gis-scope-search', {
                lon: this.gisRightSelectedEntity.properties.lng.getValue(),
                lat: this.gisRightSelectedEntity.properties.lat.getValue(), //纬度
                r: Number(this.range),
                scanColor: Cesium.Color.GREEN,
                interval: 4000, //时间
                name: this.gisRightSelectedEntity.id.toString(),  //只能标识名字，用名字当作ID
            });
            setTimeout(()=>{
                gisvis.viewer.scene.postProcessStages.removeAll();
            },6000)
            // setTimeout(() => {
            //   this.$api
            //     .getGisExpand(
            //       this.graphName,
            //       this.gisRightSelectedEntity.id,
            //       this.range,
            //       []
            //     )
            //     .then((res) => {
            //       if (res.data.success) {
            //         if (res.data.object) {
            //           let result = res.data.object;
            //           //找余下的
            //           let entities = result.vertices.filter((v) => {
            //             return !this.allEntityBackEnd
            //               .map((item) => item.id)
            //               .includes(v.id);
            //           });
            //           if (entities.length) {
            //             result.vertices.forEach((item) => {
            //               item.properties.latitude = item.properties.纬度;
            //               item.properties.longitude = item.properties.经度;
            //             });
            //             let gisData = {
            //               entities: result.vertices,
            //               labelShow: true,
            //             };
            //             gisvis.emitter.emit("gis-render-data", gisData);
            //           } else {
            //             gisvis.viewer.entities.removeById("marsRadarScan");
            //             this.$message.success({ message: "无搜索结果" });
            //           }
            //         } else {
            //           gisvis.viewer.entities.removeById("marsRadarScan");
            //           this.$message.success({ message: "无搜索结果" });
            //         }
            //       } else {
            //         gisvis.viewer.entities.removeById("marsRadarScan");
            //         this.$message.error({
            //           message: res.data.msg || res.data.errorMsg || "搜索失败",
            //           duration: 1500,
            //         });
            //       }
            //     })
            //     .catch(() => {
            //       gisvis.viewer.entities.removeById("marsRadarScan");
            //       this.$message.error({
            //         message: "服务端异常，请联系管理员",
            //         duration: 1500,
            //       });
            //     });
            // }, 1000);
            if (gisvis.contextMenu) {
                gisvis.contextMenu.destroy();
                gisvis.contextMenu = null;
            }
            this.close();
        },
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
        min-height: 150px;
    }
    /deep/ .el-form-item {
        margin-bottom: 0;
    }
}
</style>
