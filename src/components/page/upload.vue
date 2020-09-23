<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>图片上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div
            class
        >(导入文件带进度条，导入excel显示表格，导入文件提示，下载模板) https://blog.csdn.net/weixin_36617251/article/details/102738284</div>

        <div class="container">
            <div
                class="content-title"
            >手动上传(limit的个数控制on-change(用来显示文件名),auto-upload="false",submit到before-upload再到on-success)</div>
            <el-button
                size="small"
                type="primary"
                @click="dialogShow=true;uploadForm.fileName=''"
            >手动上传</el-button>
            <el-dialog
                title="手动上传"
                :visible.sync="dialogShow"
                width="40%"
                :close-on-click-modal="false"
            >
                <el-form
                    :model="uploadForm"
                    label-width="180px"
                    :inline="true"
                    style="text-align:center"
                >
                    <el-form-item label="导入文件">
                        <el-input v-model="uploadForm.fileName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-upload
                            ref="upload"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :auto-upload="false"
                            :before-upload="beforeUpload"
                            :http-request="uploadRequest"
                            :on-change="fileChange"
                        >
                            <el-button size="small" type="primary">手动上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <el-row style="text-align:center;">
                    <el-button type="primary" @click="$refs.upload.submit()">确定</el-button>
                </el-row>
            </el-dialog>

            <div class="content-title">上传附件((必须用name,url格式)</div>
            <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :auto-upload="true"
                :file-list="fileList"
                :show-file-list="true"
                :before-upload="beforeUpload"
                :http-request="uploadFileRequest"
                :on-remove="removeFile"
            >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <ul>
                <li v-for="(item,index) in fileList" :key="index">
                    <a :href="item.url" :download="item.name" target="_blank">
                        <i class="el-icon-document"></i>
                        {{item.name}}
                    </a>
                </li>
            </ul>
            <div class="content-title">上传图片</div>
            <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :auto-upload="true"
                :before-upload="beforeImgUpload"
                list-type="picture-card"
                :file-list="imgList"
                :on-remove="removeImageFile"
                :on-success="uploadImgRequest"
            >
                <i class="el-icon-plus"></i>
            </el-upload>
            <!-- 查看的时候显示这个 -->
            <div>查看的时候返显的</div>
            <div>
                <img
                    style="width:100px;height:100px;"
                    @click="blowup"
                    :src="item.url"
                    v-for="(item,index) in imgList"
                    :key="index"
                />
            </div>
            <el-dialog
                title="图片大图"
                :visible.sync="dialogImgShow"
                width="40%"
                :close-on-click-modal="false"
            >
                <div style="text-align:center;">
                    <img :src="imgUrl" style="width:100%;height:100%" />
                </div>
            </el-dialog>
            <!-- 大图展示 -->
            <div>大图展示预览效果</div>
            <div class="demo-image__preview">
                <el-image
                    style="width: 100px; height: 100px"
                    :src="item.url"
                    v-for="(item,index) in imgList"
                    :key="index"
                    :preview-src-list="previewImgList"
                ></el-image>
            </div>

            <div class="content-title">支持拖拽</div>
            <div class="plugins-tips">
                Element UI自带上传组件。
                访问地址：
                <a
                    href="http://element.eleme.io/#/zh-CN/component/upload"
                    target="_blank"
                >Element UI Upload</a>
            </div>
            <el-upload
                class="upload-demo"
                drag
                action="http://jsonplaceholder.typicode.com/api/posts/"
                multiple
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <div class="content-title">支持裁剪</div>
            <div class="plugins-tips">
                vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
                访问地址：
                <a
                    href="https://github.com/Agontuk/vue-cropperjs"
                    target="_blank"
                >vue-cropperjs</a>
            </div>
            <div class="crop-demo">
                <img :src="cropImg" class="pre-img" />
                <div class="crop-demo-btn">
                    选择图片
                    <input
                        class="crop-input"
                        type="file"
                        name="image"
                        accept="image/*"
                        @change="setImage"
                    />
                </div>
            </div>

            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                <vue-cropper
                    ref="cropper"
                    :src="imgSrc"
                    :ready="cropImage"
                    :zoom="cropImage"
                    :cropmove="cropImage"
                    style="width:100%;height:300px;"
                ></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import request from '@/utils/request';
export default {
    name: 'upload',
    data: function () {
        return {
            dialogShow: false,
            imgUrl: '',
            dialogImgShow: false,
            uploadForm: { fileName: '' },
            defaultSrc: require('../../assets/img/img.jpg'),
            fileList: [],
            fileUrl: '', //发送给后端的路径
            previewImgList: [require('../../assets/img/img.jpg')],
            imgList: [{ url: require('../../assets/img/img.jpg') }],
            file: [],
            isConfirm: true,
            imgSrc: '',
            cropImg: '',
            dialogVisible: false
        };
    },
    components: {
        VueCropper
    },
    methods: {
        //拿去图片绝对路径,手动上传......................
        getBaseUrl() {},
        fileChange(file, fileList) {
            this.uploadForm.fileName = file.name;
        },
        beforeUpload(file) {
            const Xls = file.name.split('.');
            const islt20 = file.size / 1024 / 1024 < 20;
            if (Xls[1] == 'xls' || Xls[1] == 'xlsx') {
            } else {
                this.$message.warning('只能上传xls或者xlsx格式的文件');
                return;
            }
            if (!islt20) {
                this.$message.warning('文件大小不能超过20M');
                return;
            }
            this.file = file;
        },
        async uploadRequest() {
            let formData = new FormData();
            formData.append('file', this.file);
            return;
            let res = await request({
                baseURL: '',
                url: '',
                methods: 'post',
                data: formData
            });
            if (res.resultCode == '00') {
                this.$message.success(res.resultData.message);
            } else {
                this.$message.error(res.resultData.message);
            }
        },
        removeFile(file, files) {
            this.fileList = this.fileList.filter((item) => item.url != file.url);
            this.fileUrl = this.fileList.map((item) => item.url); //传给后端
        },
        async uploadFileRequest() {
            let formData = new FormData();
            formData.append('file', this.file);
            let res = await request({
                baseURL: '',
                url: '',
                methods: 'post',
                data: formData
            });
            if (res.resultCode == '00') {
                this.fileList.push({ name: res.resultData[0].name, url: res.resultData[0].url });
                this.fileUrl = this.fileList.map((item) => item.url); //传给后端
            } else {
                this.$message.error(res.resultData.message);
            }
        },

        beforeImgUpload(file) {
            let types = ['image/jpeg', 'image/jpg', 'image/png'];
            const isImage = types.includes(file.type);
            const islt20 = file.size / 1024 / 1024 < 20;
            if (!isImage) {
                this.$message.warning('只能上传JPG,JPEG,IMG格式的文件');
                return;
            }
            if (!islt20) {
                this.$message.warning('图片大小不能超过20M');
                return;
            }
            this.file = file;
            return true;
        },
        removeImageFile(file, files) {
            this.imgList = this.imgList.filter((item) => item.url != file.url);
            this.previewImgList = this.imgList.map((item) => item.url); //传给后端
        },
        async uploadImgRequest() {
            let formData = new FormData();
            formData.append('file', this.file);
            let res = await request({
                baseURL: '',
                url: '',
                methods: 'post',
                data: formData
            });
            if (res.resultCode == '00') {
                this.imgList.push({ name: res.resultData[0].name, url: res.resultData[0].url });
                this.previewImgList = this.imgList.map((item) => item.url);
            } else {
                this.$message.error(res.resultData.message);
            }
        },
        blowup(event) {
            //图片的点击拿到的是event
            this.imgUrl = event.target.src;
            this.dialogImgShow = true;
        },

        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                this.dialogVisible = true;
                this.imgSrc = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        },
        cropImage() {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        cancelCrop() {
            this.dialogVisible = false;
            this.cropImg = this.defaultSrc;
        }
    },
    created() {
        this.cropImg = this.defaultSrc;
    }
};
</script>

<style scoped>
.content-title {
    height: 80px;
    line-height: 80px;
    color: #409eff;
}
.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo {
    display: flex;
    align-items: flex-end;
}
.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>