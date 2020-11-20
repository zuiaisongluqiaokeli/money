<template>
  <div class="ExportOption">
    <div class="title-button dfs">
      <span>选择要导出的内容</span>
      <div>
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" size="median" @click="exportAll">全部导出</el-button>
      </div>
    </div>
    <div class="cards">
      <div class="row">
        <el-card class="card" header="图片">
          <div class="card-head">
            <div class="dfs">
              <div class="left">
                <el-input v-model="imgFileName"></el-input>
                <span>.png</span>
              </div>
              <div>
                <el-button type="primary" @click="exportImage">导出</el-button>
                <el-button v-if="save" type="success" size="median" @click="saveImage">保存</el-button>
              </div>
            </div>
          </div>
          <div class="img-bg">
            <img :class="[optionForm.theme==='dark'?'img-dark-bg':'img-light-bg']" :src="img">
          </div>
        </el-card>
        <el-card class="card" header="数据">
          <div class="card-head">
            <div class="dfs">
              <div class="left">
                <el-input v-model="xlsFileName"></el-input>
                <span>.xls</span>
              </div>
              <el-button type="primary" @click="exportXls">导出</el-button>
            </div>
          </div>
          <div class="body">
            <el-table :data="tableData" border height="100%">
              <el-table-column type="index" label="序号" width="70px"></el-table-column>
              <el-table-column v-for="val in tableField" :prop="val" :key="val" :label="val"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
      <div class="row">
        <el-card class="card" header="配置">
          <div class="card-head">
            <div class="dfs">
              <div class="left">
                <el-input v-model="jsonFileName"></el-input>
                <span>.json</span>
              </div>
              <div class="right">
                <el-button @click="copyText(json)">复制代码</el-button>
                <el-button type="primary" @click="exportJSON">导出</el-button>
              </div>
            </div>
          </div>
          <div class="body">
            <div class="code">{{json}}</div>
          </div>
        </el-card>
        <textarea id="export-code-textarea" style="display: none"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    canvasToBase64,
    copyOption,
    downloadImage,
    downloadString,
    formatJSON,
    getHTMLCode,
    getJSCode
  } from './js/util'
  import XLSX from 'xlsx'

  export default {
    name    : 'ExportOption',
    props   : {
      optionForm: {
        type    : Object,
        required: true
      },
      canvas    : {
        type    : HTMLCanvasElement,
        required: true
      },
      tableData : {
        type    : Array,
        required: true
      },
      save      : {
        type: Function
      }
    },
    data () {
      return {
        img         : '',
        imgType     : 'png',
        imgFileName : '',
        xlsFileName : '',
        json        : '',
        jsonFileName: '',
      }
    },
    computed: {
      tableField () {
        return Object.keys(this.tableData[0])
      },
    },
    methods : {
      saveImage () {
        this.save({ img: canvasToBase64(this.canvas, this.imgType) })
      },
      goBack () {
        this.$emit('return')
      },
      exportAll () {
        this.exportImage()
        this.exportXls()
        this.exportJSON()
      },
      setImg () {
        this.img = canvasToBase64(this.canvas, this.imgType)
      },
      setJSON () {
        const option = copyOption(this.optionForm)
        this.json = formatJSON(JSON.stringify(option))
      },
      exportImage () {
        downloadImage(this.canvas, this.imgType, this.imgFileName + '.' + this.imgType)
      },
      exportXls () {
        const ws = XLSX.utils.json_to_sheet(this.tableData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'SheetJS')
        XLSX.writeFile(wb, this.xlsFileName + '.xls')
      },
      copyText (txt) {
        const textarea = document.getElementById('export-code-textarea')
        textarea.value = txt
        textarea.style.display = 'block'
        this.$nextTick(() => {
          textarea.select()
          document.execCommand('copy')
          textarea.style.display = 'none'
        })
      },
      exportJSON () {
        downloadString(this.json, 'application/json', this.jsonFileName + '.json')
      }
    },
    created () {
      const type = this.optionForm.type
      delete this.optionForm.id
      delete this.optionForm.chart
      const today = new Date()
      const month = today.getMonth() + 1 >= 10 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1)
      const day = today.getDate() >= 10 ? today.getDate() : ('0' + today.getDate())
      const date = today.getFullYear() + '' + month + '' + day
      this.imgFileName = type + '-' + date
      this.xlsFileName = type + '-' + date
      this.jsonFileName = type + '-' + date
      this.setImg()
      this.setJSON()
    }
  }
</script>

<style scoped lang="scss">
  .ExportOption {
    padding: 20px 50px;

    .dfs {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title-button {
      padding-bottom: 20px;

      span {
        font-size: 20px;
        color: var(--color-text-regular);
      }
    }

    .img {
      display: block;
      width: 100%;
    }

    .row {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;

      .card {
        width: calc(50% - 10px);

        .card-head {
          padding-bottom: 20px;
        }

        .title {
          font-size: 20px;
          padding-bottom: 20px;
          color: var(--color-text-regular);
        }

        .left {
          display: flex;
          align-items: center;
          color: var(--color-text-regular);

          span {
            flex-shrink: 0;
            margin-left: 10px;
          }
        }

        .body {
          height: 420px;
          overflow: auto;
        }

        .code {
          white-space: pre;
        }

        .img-light-bg {
          display: block;
          width: 100%;
          background-color: white;
        }

        .img-dark-bg {
          display: block;
          width: 100%;
        }
      }
    }
  }
</style>
