<template>
  <div class="SelectData">
    <div class="container">
      <div class="left">
        <el-table :data="tableData" border highlight-current-row height="100%">
          <el-table-column type="index" label="序号" width="70px" align="center"></el-table-column>
          <el-table-column v-for="val in fields" :column-key="val" :key="val" :prop="val" :label="val"
                           show-overflow-tooltip align="center"></el-table-column>
        </el-table>
      </div>
      <div class="center"></div>
      <div class="right">
        <div class="text">请选择字段（最少两个）</div>
        <div class="table">
          <el-table ref="selectableTable" :data="exampleData" border @selection-change="onSelectionChange"
                    height="100%">
            <el-table-column type="selection" label="全部" min-width="40px" align="center"></el-table-column>
            <el-table-column prop="prop" label="字段" align="center"></el-table-column>
            <el-table-column prop="value" label="示例" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-button icon="el-icon-download" type="warning" plain @click="readOption">导入配置文件</el-button>
      <el-button @click="goBack" type="info">返回</el-button>
      <el-button type="primary" @click="finish">下一步</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name    : 'SelectData',
    props   : {
      tableData       : {
        type    : Array,
        required: true
      },
      fields          : {
        type    : Array,
        required: true
      },
      defaultSelection: {
        type    : Array,
        required: false
      }
    },
    data () {
      return {
        selectionProps: [],
      }
    },
    computed: {
      exampleData () {
        const res = [], data = this.tableData[0]
        for (let i = 0; i < this.fields.length; i++) {
          const field = this.fields[i]
          res.push({ prop: field, value: data[field] })
        }
        return res
      }
    },
    methods : {
      readOption () {
        const input = document.createElement('input')
        input.type = 'file'
        const _this = this
        const message = this.$message
        input.onchange = () => {
          const file = input.files[0]
          const fs = new FileReader()
          fs.onload = function () {
            const text = this.result
            try {
              const option = JSON.parse(text)
              _this.$emit('next', option)
            } catch (e) {
              console.error(e)
              message.error('不是有效的配置文件')
            }
          }
          fs.readAsText(file)
        }
        input.click()
      },
      goBack () {
        this.$emit('return')
      },
      onSelectionChange (val) {
        this.selectionProps = val
      },
      finish () {
        if (this.selectionProps.length < 2) {
          this.$message.warning('请至少选择2个字段')
          return
        }
        this.$emit('next', this.selectionProps.map(val => val.prop))
      },
      selectable () {
        return this.selectionProps.length < 4
      },
      toggleRowSelection (val) {
        const ref = this.$refs.selectableTable
        val.forEach(item => {
          ref.toggleRowSelection(item, true)
        })
      }
    },
    mounted () {
      if (this.defaultSelection) {
        const propList = []
        this.defaultSelection.forEach(val => propList.push(this.exampleData.filter(item => item.prop === val)[0]))
        this.selectionProps.push(...propList)
        this.toggleRowSelection(this.selectionProps)
      }
    }
  }
</script>

<style scoped lang="scss">
  .SelectData {
    padding: 2%;
    height: 100%;

    .container {
      display: flex;
      height: calc(99% - 32px);

      .left {
        flex-grow: 1;
        height: 100%;
        overflow: auto;
      }

      .center {
        width: 2%;
        height: 100%;
      }

      .right {
        width: 20%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .text {
          color: var(--color-text-regular);
          flex-shrink: 0;
          padding-bottom: 10px;
        }

        .table {
          flex-grow: 1;
          overflow: auto;
        }
      }
    }

    .bottom {
      text-align: right;
      margin-top: 1%;
    }
  }
</style>
