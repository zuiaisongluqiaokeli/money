<template>
  <div class="tool-tag">
    <div class="body">
      <div class="main-box">
        <div class="tab-content">
          <el-form ref="form" label-width="50px">
            <el-form-item label="标签">
              <el-select
                v-model="verticeFilter.labels"
                :popper-append-to-body="false"
                class="name"
                clearable
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择标签"
              >
                <el-option
                  v-for="model in allLabels"
                  :key="model"
                  :label="model"
                  :value="model"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-for="(item, natureIndex) in verticeFilter.props"
              :key="natureIndex"
              :label="natureIndex === 0 ? '属性' : ''"
            >
              <el-select
                v-model="item.key"
                :popper-append-to-body="false"
                allow-create
                filterable
                placeholder="请选择属性"
                class="select-input"
              >
                <el-option
                  v-for="item in allProperties"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.operation"
                :popper-append-to-body="false"
                placeholder="请选择操作符"
                class="select-input"
              >
                <el-option
                  v-for="item in relPropList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-model="item.value"
                class="select-input"
                placeholder="请输入内容"
              ></el-input>
              <!-- <el-autocomplete v-model="item.value"
                              :fetch-suggestions="getPropValueOptions"
                              placeholder="请输入内容"
                              :trigger-on-focus="false"
                              @focus="getFocusData(verticeFilter.labels, item.key)"
                              class="select-input">
              </el-autocomplete>-->
              <el-button
                type="text"
                icon="el-icon-close"
                class="danger"
                v-show="verticeFilter.props.length > 1"
                @click="deletItem(natureIndex)"
              ></el-button>
              <el-button
                type="text"
                icon="el-icon-plus"
                v-show="natureIndex + 1 === verticeFilter.props.length"
                @click="additem(natureIndex)"
              ></el-button>
            </el-form-item>
          </el-form>
          <el-form ref="form" class="set" label-width="50px">
            <el-form-item label="尺寸">
              <el-input-number
                v-model="verticeSet.size"
                :min="1"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="颜色">
              <div class="color-select">
                <el-select
                  v-model="verticeSet.color"
                  :popper-append-to-body="false"
                  clearable
                  popper-class="tool-tag-select"
                  placeholder="请选择颜色"
                >
                  <el-option
                    v-for="item in tagColors"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                    <span
                      :style="{ 'background-color': item }"
                      class="color-block"
                    ></span>
                    <span style="float: right;">{{ item }}</span>
                  </el-option>
                </el-select>
                <div
                  v-if="verticeSet.color"
                  class="color"
                  :style="{ backgroundColor: verticeSet.color }"
                ></div>
              </div>
            </el-form-item>
            <el-form-item label="图标">
              <div class="icon-select">
                <el-select
                  v-model="verticeSet.avatar"
                  clearable
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="val in iconList"
                    :key="val.name"
                    :label="val.name"
                    :value="val.src"
                  ></el-option>
                </el-select>
                <img v-if="verticeSet.avatar" :src="verticeSet.avatar" />
              </div>
            </el-form-item>
            <el-form-item label="范围">
              <div class="range-setting">
                <el-switch
                  class="switch"
                  v-model="verticeSet.range.enable"
                ></el-switch>
                <div v-show="verticeSet.range.enable">
                  <div class="range-item">
                    属性：
                    <el-select
                      v-model="verticeSet.range.property"
                      :popper-append-to-body="false"
                      allow-create
                      filterable
                      placeholder="请选择属性"
                      size="small"
                    >
                      <el-option
                        v-for="item in allProperties"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="range-item">
                    范围：
                    <el-input
                      class="range-input"
                      v-model="verticeSet.range.value"
                      size="small"
                    ></el-input>
                    公里
                  </div>
                  <div class="range-item">
                    颜色：
                    <el-select
                      v-model="verticeSet.range.color"
                      :popper-append-to-body="false"
                      clearable
                      popper-class="tool-tag-select"
                      placeholder="请选择颜色"
                      size="small"
                    >
                      <el-option
                        v-for="item in tagColors"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                        <span
                          :style="{ 'background-color': item }"
                          class="color-block"
                        ></span>
                        <span style="float: right;">{{ item }}</span>
                      </el-option>
                    </el-select>
                    <div
                      v-if="verticeSet.range.color"
                      class="color"
                      :style="{ backgroundColor: verticeSet.range.color }"
                    ></div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="show-btn">
        <el-checkbox v-model="reset" class="reset">重置</el-checkbox>
        <el-button size="small" type="primary" @click="showVertice"
          >展示</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import * as d3 from "d3";

export default {
  name: "Setting",
  props: ["show"],
  data() {
    return {
      verticeFilter: {
        labels: [], // 标签
        props: [
          // 属性
          {
            key: "", // 属性名
            operation: "", // 关系
            value: "" // 结果名
          }
        ]
      },
      reset: false,
      verticeSet: {
        size: 1,
        prop: "",
        text: "",
        color: "",
        animation: "",
        avatar: "",
        range: {
          property: "",
          enable: true,
          value: 100,
          color: ""
        }
      },
      iconList: [
        { name: "定位", src: "./img/gis/location.png" },
        { name: "人", src: "./img/gis/walk.png" },
        { name: "自行车", src: "./img/gis/bicycle.png" },
        { name: "航空母舰", src: "./img/gis/aircraft-carrier.png" },
        { name: "潜艇", src: "./img/gis/submarine.png" },
        { name: "驱逐舰", src: "./img/gis/destroyer.png" },
        { name: "巡洋舰", src: "./img/gis/cruiser.png" },
        { name: "渔船", src: "./img/gis/fisher.png" },
        { name: "货船", src: "./img/gis/barge.png" },
        { name: "轮船", src: "./img/gis/ship.png" },
        { name: "基地", src: "./img/gis/base.png" },
        { name: "飞机", src: "./img/gis/airplane.png" },
        { name: "直升机", src: "./img/gis/copter.png" },
        { name: "机场", src: "./img/gis/airport.png" },
        { name: "加油站", src: "./img/gis/gas-station.png" },
        { name: "酒店", src: "./img/gis/hotel.png" },
        { name: "汽车", src: "./img/gis/car.png" },
        { name: "货车", src: "./img/gis/truck.png" },
        { name: "公交车", src: "./img/gis/bus.png" },
        { name: "公交站", src: "./img/gis/bus-stop.png" },
        { name: "停车场", src: "./img/gis/Parking-Lot.png" },
        { name: "山", src: "./img/gis/mountain.png" },
        { name: "超市", src: "./img/gis/supermarket.png" },
        { name: "学校", src: "./img/gis/school.png" },
        { name: "商店", src: "./img/gis/store.png" },
        { name: "游乐园", src: "./img/gis/amusement-park.png" },
        { name: "银行", src: "./img/gis/bank.png" },
        { name: "电影院", src: "./img/gis/cinema.png" },
        { name: "城市", src: "./img/gis/city.png" },
        { name: "法院", src: "./img/gis/court.png" },
        { name: "工厂", src: "./img/gis/factory.png" },
        { name: "政府", src: "./img/gis/government.png" },
        { name: "医院", src: "./img/gis/hospital.png" },
        { name: "居民楼", src: "./img/gis/house.png" },
        { name: "地铁站", src: "./img/gis/metro.png" },
        { name: "火车站", src: "./img/gis/train-station.png" },
        { name: "码头", src: "./img/gis/wharf.png" },
        { name: "警察局", src: "./img/gis/police-office.png" }
      ],
      operations: ["等于", "大于", "小于", "不等于"],
      relPropList: [
        { label: "等于", value: "=" },
        { label: "大于", value: ">" },
        { label: "小于", value: "<" },
        { label: "不等于", value: "<>" }
      ], // 筛选关系
      tagColors: [
        "#ac725e",
        "#d06b64",
        "#f83a22",
        "#fa573c",
        "#ff7537",
        "#ffad46",
        "#42d692",
        "#16a765",
        "#7bd148",
        "#b3dc6c",
        "#fbe983",
        "#fad165",
        "#92e1c0",
        "#91e7ef",
        "#c2e3ff",
        "#eb7487",
        "#f691b2",
        "#cd74e6",
        "#a47ae2",
        "#5b7997"
      ]
    };
  },
  components: {},
  computed: {
    ...mapState("map", ["gisEntities"]),
    ...mapGetters("map", ["allLabels", "allProperties"])
  },
  watch: {
    show(n) {
      if (!n) {
        this.verticeFilter = {
          labels: [], // 标签
          props: [
            // 属性
            {
              key: "", // 属性名
              operation: "", // 关系
              value: "" // 结果名
            }
          ]
        };
        this.verticeSet = {
          color: "",
          animation: ""
        };
      }
    }
  },
  methods: {
    ...mapMutations("canvasInfo", ["setClearTag"]),
    ...mapActions("canvasInfo", ["revertCanvas"]),
    ...mapMutations('map',['updateInitTack']),
    // 实体搜索添加属性
    additem: function(natureIndex, index) {
      this.verticeFilter.props.push({
        name: "",
        rel: "",
        value: ""
      });
    },
    deletItem(natureIndex, index) {
      this.verticeFilter.props.splice(natureIndex, 1);
    },
    //所有实体与设置的属性
    getFilters(vertices, filters) {
      // 标签过滤节点
      let verticeByLabel = [];
      verticeByLabel = vertices.filter(v =>
        filters.labels.some(l => v.labels.includes(l))
      );
      let length = filters.props.length;
      let verticeByProp = vertices.filter(vertice => {
        let flag = false;

        for (let i = 0; i < length; i++) {
          let p = filters.props[i];

          if (vertice.properties[p.key] === undefined) continue;

          switch (p.operation) {
            case "=":
              flag = vertice.properties[p.key] + "" === p.value;
              break;
            case "<":
              flag = vertice.properties[p.key] < +p.value;
              break;
            case ">":
              flag = vertice.properties[p.key] > +p.value;
              break;
            case "<>":
              flag = vertice.properties[p.key] + "" !== p.value;
              break;
          }
          if (flag) break;
        }
        return flag;
      });
      return Array.from(new Set(verticeByLabel.concat(verticeByProp)));
    },
    //重置或修改样式
    showVertice() {
      this.updateInitTack(true)
      if(this.reset){
        //拿当前有id值的进行改造
        this.gisEntities.filter(item=>gisvis.viewer.entities.getById(item.id)).forEach(e=>{
          gisvis.viewer.entities.getById(e.id).billboard && (gisvis.viewer.entities.getById(e.id).billboard.scale = 1)
          gisvis.viewer.entities.getById(
            e.id
          ).label.scale = 1;
          gisvis.viewer.entities.getById(
            e.id
          ).label.pixelOffset = new Cesium.Cartesian2(0, 24);
          gisvis.viewer.entities.getById(e.id).billboard.color = Cesium.Color.fromCssColorString(
            "#ffcc33"
          )
          gisvis.viewer.entities.getById(e.id).billboard.image.setValue('./img/gis/location.png')
          gisvis.viewer.entities.getById(e.id).ellipse = undefined
        })
      }
      console.log(1111)
      let entities = this.getFilters(this.gisEntities, this.verticeFilter);
      entities.forEach(e => {
        gisvis.viewer.entities.getById(
          e.id
        ).billboard.scale = this.verticeSet.size;
        gisvis.viewer.entities.getById(
          e.id
        ).label.scale = this.verticeSet.size;
        gisvis.viewer.entities.getById(
          e.id
        ).label.pixelOffset = new Cesium.Cartesian2(0, 24*this.verticeSet.size);
        this.verticeSet.color &&
          (gisvis.viewer.entities.getById(
            e.id
          ).billboard.color = Cesium.Color.fromCssColorString(
            this.verticeSet.color
          ));
        this.verticeSet.avatar &&
          gisvis.viewer.entities
            .getById(e.id)
            .billboard.image.setValue(this.verticeSet.avatar);
      });
      if (this.verticeSet.range.enable) {
        let params = {
          entities: entities,
          areaProperty: this.verticeSet.range.property,
          radius: this.verticeSet.range.value,
          color: this.verticeSet.range.color
        };
        gisvis.emitter.emit("gis-scope-render", params);
      } else {
        entities.forEach(e => {
          if (gisvis.viewer.entities.getById(e.id).ellipse) {
            gisvis.viewer.entities.getById(e.id).ellipse.show.setValue(false);
          }
        });
      }
    }
  },
  mounted() {
    // this.iconList.forEach(val=>val.src.indexOf('data')<0&&(val.src=window.location.origin+'/'+val.src))
  }
};
</script>

<style lang="scss" scoped>
.tool-tag {
  max-height: 426px;
  margin: -12px 0;
  padding: 12px 0;

  .body {
    width: 500px;
    margin: 0 10px;

    .main-box {
      .tab-content {
        .select-input + .select-input {
          margin-left: 16px;
        }

        .select-input ~ button {
          margin-left: 16px;
        }

        .select-input {
          width: 114px;

          &.el-checkbox {
            width: initial;
          }
        }

        .danger {
          color: var(--color-danger);
        }

        .set {
          padding-top: 10px;
          border-top: 1px solid var(--border-color-base);
        }

        .el-select {
          &.name {
            width: 100%;
          }
        }
        .icon-select,
        .color-select {
          display: flex;
          align-items: center;
          img,
          .color {
            width: 30px;
            height: 30px;
            margin-left: 10px;
          }
        }
        .range-setting {
          .range-item {
            margin-top: 10px;
            display: flex;
          }
          .range-input {
            width: 200px;
            margin-right: 20px;
          }
          .color {
            width: 30px;
            height: 30px;
            margin-left: 10px;
          }
        }
      }
    }

    /deep/ .popper__arrow {
      display: none;
    }

    /deep/ .show-btn {
      margin-right: 10px;
      text-align: right;
      .reset {
        float: left;
      }
    }

    .active {
      color: var(--color-text-primary) !important;
    }
  }


  /deep/ input::-webkit-input-placeholder {
    color: var(--color-text-placeholder);
    font-size: var(--font-size-extra-small);
  }

  /deep/ input:-moz-placeholder {
    color: var(--color-text-placeholder);
    font-size: var(--font-size-extra-small);
  }

  /deep/ input::placeholder {
    color: var(--color-text-placeholder);
    font-size: var(--font-size-extra-small);
    // padding: 4px;
    // background-color: #2b2b2b5e;
  }

  /deep/ input:-ms-input-placeholder {
    color: var(--color-text-placeholder);
    font-size: var(--font-size-extra-small);
  }
}
</style>
