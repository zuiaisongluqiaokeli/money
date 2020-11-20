<template>
  <div>
    <input
      ref="dragFile"
      type="file"
      class="dragFile"
      :accept="accepts"
      :webkitdirectory="showFolder"
      multiple
      :disabled="loading"
      @change="changeFile"
    />
    <div class="flex-style">
      <div
        ref="dragArea"
        v-loading="loading"
        class="drag-area"
        @click.prevent.stop="uploadFiles"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          <span>将文件<span v-show="fileWay">夹</span>拖到此处，或</span
          ><em>点击上传</em>
        </div>
      </div>
      <el-button type="text" class="folder-button" @click="uploadFolders"
        >上传文件夹</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    fileWay: {
      type: Boolean,
      default: false
    },
    accepts: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      showFolder: this.fileWay
    };
  },
  watch: {
    fileWay(nv) {
      this.initDrop();
      return nv;
    }
  },
  mounted() {
    this.initDrop();
  },
  methods: {
    uploadFolders() {
      this.showFolder = true;
      this.$nextTick(() => {
        this.clickFileFlod();
      });
    },
    changeFile(val) {
      this.transferFiles(Array.from(val.target.files));
    },
    dealWithFiles(files) {
      let newFiles = Array.from(files);
      if (newFiles.length === 0) return;
      this.transferFiles(newFiles);
    },
    dealWithFolders(items) {
      if (items.length > 1) {
        this.loading = false;
        return this.$message.info("一次只允许上传一个文件夹");
      }
      var item = items[0].webkitGetAsEntry();
      if (item) {
        this.checkFolders(item);
      }
    },
    // 判断是否为文件夹
    checkFolders(item) {
      if (item.isDirectory) {
        let result = this.traverseFileTree(item);
        setTimeout(() => {
          this.transferFiles(result);
        }, 3 * 1000);
      } else {
        this.loading = false;
        this.$message.info("只支持上传文件夹");
      }
    },
    traverseFileTree(item) {
      let res = [];
      var internalProces = (item, path, res) => {
        if (item.isFile) {
          item.file(file => {
            file.path = path + file.name;
            var newFile = new File([file], file.path, { type: file.type });
            res.push(newFile);
          });
        } else if (item.isDirectory) {
          var dirReader = item.createReader();
          dirReader.readEntries(
            entries => {
              for (let i = 0; i < entries.length; i++) {
                internalProces(entries[i], path + item.name + "/", res);
              }
            },
            function(e) {
              console.log(e);
            }
          );
        }
      };

      internalProces(item, "", res);
      return res;
    },
    uploadFiles() {
      this.showFolder = false;
      this.$nextTick(() => {
        this.clickFileFlod();
      });
    },
    clickFileFlod() {
      this.$refs.dragFile.click();
    },
    initDrop() {
      var dragNow = this.$refs.dragArea;
      dragNow.ondragenter = function(e) {
        e.preventDefault();
      };

      dragNow.ondragover = function(e) {
        e.preventDefault();
        dragNow.style.border = "2px dashed #188cff";
      };

      dragNow.ondragleave = function(e) {
        e.preventDefault();
        dragNow.style.border = "1px dashed #d9d9d9";
      };

      dragNow.ondrop = e => {
        e.preventDefault();
        this.loading = true;
        dragNow.style.border = "1px dashed #d9d9d9";
        this.fileWay === false
          ? this.dealWithFiles(e.dataTransfer.files)
          : this.dealWithFolders(e.dataTransfer.items);
      };
    },
    transferFiles(files) {
      this.$emit("upload-entity-file", files);
      this.loading = false;
      let dragFiles = this.$refs.dragFile;
      dragFiles.value = "";
      let dragAreas = this.$refs.dragArea;
      dragAreas.value = "";
    }
  }
};
</script>
<style lang="scss" scoped>

/deep/ i.el-icon-upload {
    font-size: 67px;
    color: #c0c4cc;
    margin: 21px 0 16px;
    line-height: 50px;
}
.upload-style {
  font-size: 50px;
  color: #bbbbbb;
  margin-top: 27px;
}
.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.3em;
  fill: currentColor;
  overflow: hidden;
}

.drag-area {
  background: none;
  width: 370px;
  height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  text-align: center;
  color: #666;
  em {
    color: #188cff;
    font-style: normal;
  }
}

.drag-area:hover {
  border: 1px dashed #188cff;
  cursor: pointer;
}

.dragFile {
  display: none;
}

.flex-style {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  .folder-button {
    padding-bottom: 0px;
    padding-left: 5px;
  }
}
</style>
