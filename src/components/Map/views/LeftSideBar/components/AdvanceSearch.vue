<template>
  <div class="advanced-search">
    <el-form ref="childForm" :model="advancedSearchQuery">
      <div
        v-for="(searchItem, searchIndex) in advancedSearchQuery.moreCondition"
        :key="searchIndex"
        class="form-flex"
      >
        <el-form-item v-if="searchIndex > 0" class="search-btn">
          <el-button type="text" @click="selectAndOr(searchItem)">{{
            searchItem.operator
          }}</el-button>
        </el-form-item>
        <div class="search-one" :class="{ 'is-first-item': searchIndex === 0 }">
          <div>
            <span class="search-brackets">(</span>
          </div>
          <div
            v-for="(aryItem, aryIndex) in searchItem.moreConditions"
            :key="aryIndex"
            class="search-div"
          >
            <el-form-item v-if="aryIndex > 0" class="search-btn">
              <el-button type="text" @click="selectAndOr(aryItem)">{{
                aryItem.operator
              }}</el-button>
            </el-form-item>
            <div class="search-two">
              <el-form-item class="search-name">
                <el-select
                  v-model="aryItem.conditionsTypeEnum"
                  :title="showTitle(aryItem.conditionsTypeEnum, searchType)"
                  @change="selectName(aryItem, searchIndex, aryIndex)"
                >
                  <el-option
                    v-for="(item, index) in searchType"
                    :key="index"
                    :value="item.value"
                    :label="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="aryItem.conditionsTypeEnum === 'prop'"
                key="prop"
                class="search-name"
              >
                <el-select
                  v-model="aryItem.key"
                  :title="aryItem.key"
                  filterable
                  allow-create
                  save-when-blur
                  default-first-option
                >
                  <!-- <el-option
                  v-for="item in searchKey"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option> -->
                  <LazyLoadOption
                    :options="searchKey"
                    :search="true"
                    :model-value="aryItem.key"
                  ></LazyLoadOption>
                </el-select>
              </el-form-item>
              <el-form-item class="search-type">
                <el-select
                  v-model="aryItem.conditionsEnum"
                  :title="
                    showTitle(
                      aryItem.conditionsEnum,
                      searchRelationAry[searchIndex][aryIndex]
                    )
                  "
                >
                  <el-option
                    v-for="item in searchRelationAry[searchIndex][aryIndex]"
                    :key="item.value"
                    :value="item.value"
                    :label="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="search-ipt">
                <!-- <el-select
                v-model="aryItem.value"
                allow-create
                filterable
                default-first-option
                clearable
                :placeholder="placeholder"
              >
                <el-option
                  v-for="item in searchName"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select> -->
                <el-input
                  v-model="aryItem.value"
                  clearable
                  :placeholder="placeholder"
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="searchItem.moreConditions.length > 1"
                class="search-add"
              >
                <i
                  class="el-icon-remove-outline"
                  @click="
                    reduceSearchContent(searchItem, searchIndex, aryIndex)
                  "
                ></i>
              </el-form-item>
            </div>
          </div>
          <div class="search-div">
            <el-form-item class="search-add">
              <i
                class="el-icon-circle-plus-outline"
                @click="addSearchContent(searchItem, searchIndex)"
              ></i>
            </el-form-item>
          </div>
          <div>
            <span class="search-brackets">)</span>
          </div>
          <div class="search-div">
            <el-form-item class="search-add">
              <i
                class="el-icon-remove-outline"
                @click="reduceRow(searchIndex)"
              ></i>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div class="search-three">
      <el-button type="text" @click="addNewContent">
        <i class="el-icon-plus" />
        新增组合
      </el-button>
    </div>
  </div>
</template>

<script>
import LazyLoadOption from "./LazyLoadOption/index";
export default {
  name: "AdvanceSearch",
  components: { LazyLoadOption },
  props: {
    searchType: {
      type: Array,
      default() {
        return [];
      }
    },
    searchRelation: {
      type: Array,
      default() {
        return [];
      }
    },
    searchKey: {
      type: Array,
      default() {
        return [];
      }
    },
    searchName: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default() {
        return "输入或请选择";
      }
    },
    advancedSearchQuery: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      searchRelationAry: [[]]
    };
  },
  created() {
    this.searchRelationAry[0].push(this.searchRelation);
  },
  methods: {
    addSearchContent(ary, searchIndex) {
      this.searchRelationAry[searchIndex].push(this.searchRelation);
      let obj = {
        conditionsTypeEnum: "",
        conditionsEnum: "",
        key: "",
        value: "",
        valueType: "String",
        operator: "且"
      };
      obj.conditionsTypeEnum = this.searchType[0].value;
      obj.conditionsEnum = this.searchRelation[0].value;
      ary.moreConditions.push(obj);
    },
    reduceSearchContent(ary, searchIndex, aryIndex) {
      ary.moreConditions.splice(aryIndex, 1);
      this.searchRelationAry[searchIndex].splice(aryIndex, 1);
    },
    reduceRow(index) {
      this.advancedSearchQuery.moreCondition.splice(index, 1);
      this.searchRelationAry.splice(index, 1);
    },
    // 新增组合
    addNewContent() {
      this.searchRelationAry.push([this.searchRelation]);
      let obj = {
        operator: "且",
        moreConditions: [
          {
            conditionsTypeEnum: "",
            conditionsEnum: "",
            key: "",
            value: "",
            valueType: "String",
            operator: "且"
          }
        ]
      };
      obj.moreConditions[0].conditionsTypeEnum = this.searchType[0].value;
      obj.moreConditions[0].conditionsEnum = this.searchRelation[0].value;
      this.advancedSearchQuery.moreCondition.push(obj);
    },
    selectAndOr(item) {
      if (item.operator === "且") {
        this.$set(item, "operator", "或");
      } else if (item.operator === "或") {
        this.$set(item, "operator", "且");
      }
    },
    selectName(ary, searchIndex, aryIndex) {
      ary.value = "";
      let RelationName = this.searchType.find(
        item => ary.conditionsTypeEnum === item.value
      ).key;
      if (ary.conditionsTypeEnum !== "prop") {
        ary.key = "";
        this.searchRelationAry[searchIndex][aryIndex] = this.searchRelation;
        if (ary.conditionsTypeEnum === "label" || RelationName === "关系名称") {
          this.searchRelationAry[searchIndex][aryIndex] = [
            { key: "等于", value: "EQ" },
            { key: "不等于", value: "NOTEQ" }
          ];
        }
      } else {
        this.searchRelationAry[searchIndex][aryIndex] = [
          { key: "等于", value: "EQ" },
          { key: "模糊等于", value: "FUZZY" },
          { key: "不等于", value: "NOTEQ" },
          { key: "大于", value: "GT" },
          { key: "小于", value: "LT" },
          { key: "大于等于", value: "GE" },
          { key: "小于等于", value: "LE" }
        ];
      }
      ary.conditionsEnum = this.searchRelationAry[searchIndex][
        aryIndex
      ][0].value;
    },
    showTitle(value, arr) {
      return arr.find(item => item.value === value).key;
    }
  }
};
</script>

<style lang="scss" scoped>
.advanced-search {
  border-top: 1px solid #e8e8e8;
  .el-form {
    margin-top: 10px;
    .search-div {
      display: flex;
    }
    .search-brackets {
      line-height: 32px;
      margin: 0px 9.5px;
    }
    .el-form-item {
      margin: 0px 4px 12px 4px;
    }
    .search-name {
      width: 25%;
      .el-select {
        width: 100%;
      }
    }
    .search-type {
      width: 25%;
      .el-select {
        width: 100%;
      }
    }
    .search-ipt {
      width: 50%;
      .el-select {
        width: 100%;
      }
    }
    .search-add {
      .el-icon-circle-plus-outline,
      .el-icon-remove-outline {
        font-size: 16px;
        color: #999;
        cursor: pointer;
      }
    }
  }
  .is-first-item {
    margin-top: 20px;
    margin-left: 25px;
  }
}
.form-flex {
  display: flex;
  margin-bottom: 8px;
}
.search-one {
  display: flex;
  flex-wrap: wrap;
}
.search-two {
  max-width: 440px;
  display: flex;
}
.search-three {
  margin: 0 0 20px 30px;
}
</style>
