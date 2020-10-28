<template>
    <div class="tree">
        <div class="menuTop">
          <div class="topBtnLeft">
            <div class="title">菜单树</div>
            <div>
              <el-button plain @click="dialogOpen()" class="addNewNode" style="margin-right:20px;">新增节点</el-button>
            </div>
        </div>
        <div class="topBtnRight"></div>
        </div>
        <div class="treebox">
            <div class="trees">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
                <el-tree
                    @node-click="nodeClick"
                    ref="tree"
                    @node-drop="handleDrop"
                    :data="treeData"
                    node-key="menuId"
                    :props="treeConfig"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="name">{{ node.label }}</span>
                        <span class="btn">
                            <el-tooltip
                                class="item"
                                :open-delay="500"
                                effect="light"
                                content="新增子节点"
                                placement="top"
                            >
                                <el-button
                                    type="text"
                                    icon="el-icon-plus"
                                    size="mini"
                                    @click="() => dialogOpen(data,'WebResMngrMenuAdd')"
                                >
                                    <!-- 新增子节点 -->
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                :open-delay="500"
                                effect="light"
                                content="编辑"
                                placement="top"
                            >
                                <el-button
                                    type="text"
                                    icon="el-icon-edit-outline"
                                    size="mini"
                                    @click="() => dialogOpen(data,'WebResMngrMenuMod')"
                                >
                                    <!-- 编辑 -->
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                :open-delay="500"
                                effect="light"
                                content="删除"
                                placement="top"
                            >
                                <el-button
                                    type="text"
                                    style="color:red"
                                    icon="el-icon-minus"
                                    size="mini"
                                    @click="() => del(data)"
                                >
                                    <!-- 删除 -->
                                </el-button>
                            </el-tooltip>
                        </span>
                    </span>
                </el-tree>
            </div>
            <div class="treeInfo">
                <div class="itemBox" v-if="infodata">
                    <div class="title">菜单详情>></div>
                    <div class="item" v-if="infodata.menuNo">
                        <label>菜单编号:</label>
                        <span>{{infodata.menuNo}}</span>
                    </div>
                    <div class="item" v-if="infodata.menuName">
                        <label>菜单名称:</label>
                        <span>{{infodata.menuName}}</span>
                    </div>
                    <div class="item" v-if="infodata.level">
                        <label>菜单层级:</label>
                        <span>{{infodata.level}}</span>
                    </div>
                    <div class="item" v-if="infodata.parentMenuNo">
                        <label>父菜单:</label>
                        <span>{{infodata.parentMenuNo==="0"?"顶级菜单":infodata.parentMenuNo}}</span>
                    </div>
                    <div class="item" v-if="infodata.menuType">
                        <label>菜单类型:</label>
                        <span>{{infodata.menuType}}</span>
                    </div>
                    <div class="item" v-if="infodata.renderType">
                        <label>组件类型:</label>
                        <span>{{infodata.renderType==='01'?'内部组件':'外部组件'}}</span>
                    </div>
                    <div class="item" v-if="infodata.component" style="width: 90%;">
                        <label>组件名称:</label>
                        <span>{{infodata.component}}</span>
                    </div>
                    <div class="item" v-if="infodata.icon">
                        <label>菜单图标:</label>
                        <svg-icon :icon-class="infodata.icon"></svg-icon>
                    </div>
                    <div class="item" v-if="infodata.path">
                        <label>菜单路径:</label>
                        <span>{{infodata.path}}</span>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            :close-on-click-modal="false"
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="700px"
            :before-close="handleClose"
            center
        >
            <el-form
                size="small"
                :model="formData"
                ref="ruleForm"
                label-position="right"
                class="pageForm"
                :rules="rules"
            >
                <div class="demo-input-suffi">
                    <el-form-item label="菜单名称:" prop="menuName" :label-width="formLabelWidth">
                        <el-input placeholder="请输入菜单名称" v-model="formData.menuName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="菜单编号:" prop="menuNo" :label-width="formLabelWidth">
                        <el-input
                            :disabled="dialogType==='WebResMngrMenuMod'"
                            placeholder="请输入菜单编号"
                            v-model="formData.menuNo"
                            clearable
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="demo-input-suffi">
                    <el-form-item label="菜单类型:" prop="menuType" :label-width="formLabelWidth">
                        <el-select v-model="formData.menuType" placeholder="请选择菜单类型">
                            <el-option
                                v-for="item in menuType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="组件类型:" prop="renderType" :label-width="formLabelWidth">
                        <el-select
                            :disabled="isMod"
                            clearable
                            v-model="formData.renderType"
                            placeholder="请选择组件类型"
                        >
                            <el-option
                                v-for="item in renderType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="demo-input-suffi">
                    <el-form-item
                        label="组件名称:"
                        prop="component"
                        :label-width="formLabelWidth"
                        style="width:90%"
                    >
                        <el-input
                            :disabled="isMod"
                            placeholder="请输入组件名称"
                            v-model="formData.component"
                            clearable
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="demo-input-suffi">
                    <el-form-item label="菜单路径:" prop="path" :label-width="formLabelWidth">
                        <el-input placeholder="请输入菜单路径" v-model="formData.path" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标:" :label-width="formLabelWidth">
                        <el-input placeholder="请输入菜单图标" v-model="formData.icon" clearable></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleClose">取 消</el-button>
                <el-button size="small" type="primary" @click="save('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
 
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'tree',
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    data() {
        return {
            isMod: false,
            dialogVisible: false,
            id: 1,
            formLabelWidth: '85px',
            formData: {
                menuNo: '',
                menuName: '',
                menuType: '',
                parentMenuNo: '',
                component: '',
                path: '',
                renderType: '',
                icon: '',
                nickName: '',
                extendUrl: '',
                isHidden: 0
            },
            menuType: [
                {
                    value: 'WEB',
                    label: 'WEB菜单'
                },
                {
                    value: 'APP',
                    label: 'APP菜单'
                }
            ],
            renderType: [
                {
                    value: '01',
                    label: '内部组件'
                },
                {
                    value: '02',
                    label: '外部链接'
                }
            ],
            parentMenu: [
                {
                    value: '0',
                    label: '----顶级菜单----'
                }
            ],
            rules: {
                menuNo: [{ required: true, message: '请输入菜单编号', trigger: 'blur' }],
                menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                menuType: [{ required: true, message: '请输入菜单类型', trigger: 'blur' }],
                parentMenuNo: [{ required: true, message: '请输入父菜单ID', trigger: 'blur' }],
                component: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
                path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
                renderType: [{ required: true, message: '请输入组件类型', trigger: 'blur' }],
                icon: [{ required: true, message: '请输入菜单图标', trigger: 'blur' }],
                nickName: [{ required: true, message: '请输入菜单别名', trigger: 'blur' }],
                extendUrl: [{ required: true, message: '请输入外部URL', trigger: 'blur' }]
            },
            filterText: '',
            treeData: [
                {
                    label: '一级 1',
                    children: [
                        {
                            label: '二级 1-1',
                            children: [
                                {
                                    label: '三级 1-1-1'
                                }
                            ]
                        }
                    ]
                },
                {
                    label: '一级 2',
                    children: [
                        {
                            label: '二级 2-1',
                            children: [
                                {
                                    label: '三级 2-1-1'
                                }
                            ]
                        },
                        {
                            label: '二级 2-2',
                            children: [
                                {
                                    label: '三级 2-2-1'
                                }
                            ]
                        }
                    ]
                },
                {
                    label: '一级 3',
                    children: [
                        {
                            label: '二级 3-1',
                            children: [
                                {
                                    label: '三级 3-1-1'
                                }
                            ]
                        },
                        {
                            label: '二级 3-2',
                            children: [
                                {
                                    label: '三级 3-2-1'
                                }
                            ]
                        }
                    ]
                }
            ],
            treeConfig: {
                // label: 'menuName'
                children: 'children',
                label: 'label'
            },
            dialogData: null,
            dialogType: '', // 弹窗类型
            dialogTitle: '', // 弹窗标题
            activeData: null, // 选中数据
            infodata: null //右侧的详情菜单信息
        };
    },
    created() {
        //this.getData()
    },
    methods: {
        //节点点击右侧出现详细信息
        nodeClick(data) {
            this.infodata = data;
        },
        //输入框查找结点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //得到下拉树结构的菜单权限
        getData() {
            this.$store.dispatch('WebResMngrMenuQuery').then(() => {
                this.ResMngrMenuQuery.list.forEach((item) => {
                    item.expand = false;
                });
                this.ResMngrMenuQuery.list.forEach((element) => {
                    this.parentMenu.push({
                        value: element.menuNo,
                        label: element.menuName
                    });
                });
                this.treeData = this.menuFormat(this.ResMngrMenuQuery.list);
            });
        },
        //窗口打开，三种点击对应一个窗口
        dialogOpen(data, type) {
            this.formData = {};
            this.dialogType = type; //增加或修改
            switch (type) {
                case 'WebResMngrMenuAdd':
                    if (data) {
                        this.dialogTitle = '添加子节点';
                        this.formData.parentMenuNo = data.menuNo;
                    } else {
                        this.dialogTitle = '添加一级节点';
                        this.formData.parentMenuNo = '0';
                    }
                    this.isMod = false;
                    this.dialogVisible = true;
                    break;
                case 'WebResMngrMenuMod':
                    this.dialogTitle = '编辑';

                    if (!data.children) {
                        this.isMod = false;
                    } else {
                        this.isMod = true;
                    }
                    this.dialogVisible = true;
                    this.editInfo(data.menuId);
                    break;

                default:
                    break;
            }
        },
        //保存信息
        save(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch(this.dialogType, this.formData).then(() => {
                        this.$message({
                            message: this.dialogType === 'WebResMngrMenuMod' ? '修改成功' : '保存成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.formData = {};
                        this.getData();
                    });
                } else {
                    this.$message.error('请填入完整信息');
                    return false;
                }
            });
        },
        editInfo(menuId) {
            this.parentMenu = [];
            this.$store.dispatch('WebResMngrMenuId', { menuId: menuId }).then(() => {
                this.formData = this.ResMngrMenuInfo;
                var level = 0;
                // 获取当前等级
                this.ResMngrMenuQuery.list &&
                    this.ResMngrMenuQuery.list.forEach((element) => {
                        if (this.ResMngrMenuInfo.parentMenuNo === element.menuNo) {
                            level = element.level;
                            return false;
                        }
                    });
                // 0为顶级 如果为顶级 就设置顶级菜单
                if (level === 0) {
                    this.parentMenu.push({
                        value: '0',
                        label: '----顶级菜单----'
                    });
                }
                // level 过滤小于当前level的数据
                this.ResMngrMenuQuery.list &&
                    this.ResMngrMenuQuery.list.forEach((element) => {
                        if (element.menuId !== this.ResMngrMenuInfo.menuId) {
                            if (element.level <= level) {
                                this.parentMenu.push({
                                    value: element.menuNo,
                                    label: element.menuName
                                });
                            }
                        }
                    });
            });
        },
        menuFormat(data, children) {
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            var map = {};
            data.forEach(function (item) {
                map[item.menuNo] = item;
            });
            var val = [];
            data.forEach(function (item) {
                // 以当前遍历项，的pid,去map对象中找到索引的id
                var parent = map[item.parentMenuNo];
                // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                    val.push(item);
                }
            });
            return val;
        },
        del(data) {
            this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    var delData = [];
                    delData.push(data.menuId);
                    var webResIds = delData.join(',');
                    this.$store.dispatch('WebResMngrMenuDel', webResIds).then(() => {
                        this.getData();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        ///拖拽成功完成时触发的事件
        handleDrop(draggingNode, dropNode, dropType) {
            switch (dropType) {
                case 'inner':
                    draggingNode.data.parentMenuNo = dropNode.data.menuNo;
                    break;
                default:
                    draggingNode.data.parentMenuNo = dropNode.data.parentMenuNo;
                    break;
            }
            this.$confirm('此操作将改变菜单位置, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$store.dispatch('WebResMngrMenuMod', draggingNode.data).then(() => {
                        this.$message({
                            message: '调整成功',
                            type: 'success'
                        });
                        this.getData();
                    });
                })
                .catch(() => {
                    this.getData();
                    this.$message({
                        type: 'info',
                        message: '我在想想'
                    });
                });
        },
        handleClose() {
            this.dialogVisible = false;
        }
    },
    computed: {
        ...mapGetters(['ResMngrMenuQuery', 'ResMngrMenuInfo'])
    }
};
</script>
<style scoped>
.topBtn {
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
}
.title {
    height: 74px;
    display: flex;
    align-items: center;
    margin-left: 30px;
    font-size: 20px;
    font-weight: 400;
}
.tree {
    margin-bottom: -20px;
    text-align: left;
    background: #fff;
}
.tree .addMenuOne {
    margin-bottom: 10px;
}
.tree .treebox {
    display: flex;
    padding: 0 20px;
    border-top: 1px solid #eee;
}
.topBtnLeft {
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-right: 1px solid #eee;
}
.trees {
    width: 380px;
    padding-top: 20px;
    border-right: 1px solid #eee;
}
.el-tree {
    height: 340px;
}
/deep/ .el-tree {
    overflow-y: hidden;
}
.custom-tree-node {
    width: calc(100% - 36px);
    display: flex;
}
.custom-tree-node .name {
    line-height: 28px;
    text-align: left;
    flex: 1;
}
.custom-tree-node .btn .el-button {
    padding: 0;
    line-height: 28px;
    border: none;
}
.treeInfo {
    width: 45%;
    flex: 1;
    margin-left: 28px;
}
.treeInfo .title {
    text-align: left;
    width: 100%;
    font-size: 16px;
    border-bottom: 1px solid #e5e5e5;
    line-height: 44px;
    color: #333333;
}
.treeInfo .itemBox {
    position: relative;
    background: #f1f1f1;
    padding: 0 20px;
    margin-top: 20px;
}
.treeInfo .itemBox .item {
    line-height: 48px;
    text-align: left;
    width: 50%;
    box-sizing: border-box;
    padding-right: 10px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.treeInfo .itemBox .item label {
    font-size: 15px;
    color: #606266;
}
.treeInfo .itemBox .item span {
    font-size: 15px;
    color: #777;
}
.treeInfo .itemBox .item:after {
    content: '';
    display: inline;
    clear: both;
}
.treeInfo .itemBox::before {
    content: '';
    width: 0;
    height: 0;
    border-width: 15px 15px 15px 0;
    border-style: solid;
    border-color: transparent #f1f1f1 transparent transparent;
    position: absolute;
    left: -15px;
}
.treeInfo .itemBox::after {
    content: '';
    display: block;
    clear: both;
}
</style>


