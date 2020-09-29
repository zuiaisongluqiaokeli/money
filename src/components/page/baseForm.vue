<template>
    <div ref="print">
        <div class="crumbs no-print">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 表单 </el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="dialogForm" :model="dialogForm" label-width="300px" :rules="dialogFormRules">
                    <el-form-item label="下拉树结构(插件封装，得到的是ID)">
                        <treeselect
                            size="small"
                            noResultsText="暂无数据"
                            :multiple="true"
                            :options="treeData"
                            :normalizer="normalizer"
                            placeholder="Select your favourite(s)..."
                            v-model="dialogForm.selectTree"
                            search-nested
                        />
                    </el-form-item>
                    <el-form-item label="下拉树结构(自己封装)">
                        <SelectTree
                            :data="treeData"
                            :propSet="treeProps"
                            @change="getTreeeValue"
                            nodeKey="value"
                            v-model="dialogForm.treeValue"
                            style="width: 300px"
                        />
                    </el-form-item>
                    <el-form-item label="下拉树结构(不用封装)" prop="treeName">
                        <label slot="label">下拉树结构</label>
                        <label slot="label" style="color: blue">(自己封装)</label>
                        <label slot="label">
                            <el-tooltip class="item" effect="light" :content="`你选中的数据是:${dialogForm.treeName}`" placement="top">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </label>
                        <el-dropdown trigger="click" placement="bottom-start" style="border: 0">
                            <span class="el-dropdown-link">
                                <el-input
                                    v-model="dialogForm.treeName"
                                    placeholder="请选择"
                                    clearable
                                    @clear="cleartreeName"
                                    ref="inputWidth"
                                    style="width: 300px"
                                ></el-input>
                            </span>
                            <!-- :style="{ width: selectWidth } -->
                            <el-dropdown-menu slot="dropdown" style="width: 300px">
                                <el-tree
                                    :data="treeData"
                                    ref="treeTypeSelect"
                                    node-key="id"
                                    :props="treeProps"
                                    @node-click="getTypeSelectTree"
                                    :expand-on-click-node="false"
                                ></el-tree>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="下拉树结构(多选不用封装)">
                        <el-dropdown trigger="click" placement="bottom-start" style="border: 0">
                            <span class="el-dropdown-link">
                                <el-input v-model="dialogForm.treeCheckName" placeholder="请选择"></el-input>
                            </span>
                            <el-dropdown-menu slot="dropdown" style="width: 20%">
                                <el-tree
                                    ref="treeCheckBox"
                                    show-checkbox
                                    :data="treeData"
                                    node-key="id"
                                    :props="treeProps"
                                    @check-change="getTypeSelectCheckTree"
                                    :expand-on-click-node="false"
                                ></el-tree>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="菜单图标">
                        <el-popover placement="bottom-start" width="450" trigger="click" @show="$refs['iconSelect'].reset()">
                            <IconSelect ref="iconSelect" @selected="selected" />
                            <el-input slot="reference" v-model="dialogForm.icon" style="width: 450px" placeholder="点击选择图标" readonly>
                                <SvgIcon
                                    v-if="dialogForm.icon"
                                    slot="prefix"
                                    :icon-class="dialogForm.icon"
                                    class="el-input__icon"
                                    style="height: 32px; width: 16px"
                                />
                                <i slot="prefix" class="el-icon-search el-input__icon" />
                            </el-input>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="dialogForm.date1"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker placeholder="选择时间" v-model="dialogForm.date2" style="width: 100%"></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-date-picker
                            v-model="dialogForm.date"
                            :default-time="['00:00:00', '23:59:59']"
                            type="daterange"
                            range-separator=":"
                            size="small"
                            style="width: 200px"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        />
                    </el-form-item>
                    <el-form-item label="城市级联">
                        <el-cascader :options="treeData" :props="{ checkStrictly: true }" v-model="dialogForm.cities"></el-cascader>
                    </el-form-item>
                    <el-form-item label="输入框输入过滤">
                        <el-autocomplete
                            v-model="dialogForm.inputSearch"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="下拉里面的内容懒加载（详细看LazyLoadOption组件）">
                    </el-form-item>
                    <el-form-item label="全选功能">
                        <el-select v-model="dialogForm.chooseData" multiple placeholder="请选择" class="height:100%" size="small">
                            <el-option label="全选" value="全选" :disabled="dialogForm.chooseData.length > 1"></el-option>
                            <el-option
                                v-for="item in chooseData"
                                :key="item.value"
                                :label="item.label"
                                :disabled="dialogForm.chooseData.join(',') == '全选'"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="只能输入两位小树">
                        <el-input @input="inputNumberTofixed" v-model="dialogForm.inputNumberTofixed"></el-input>
                    </el-form-item>
                    <el-form-item label="属性" style="width:1000px">
                        <el-row type="flex" justify="space-between" style="margin-bottom:10px;" v-for="(item,index) in dialogForm.addDynamicForm" :key="index">
                            <el-col :span="10"><el-input v-model="item.name"></el-input></el-col>
                            <el-col :span="10"><el-input v-model="item.value"></el-input></el-col>
                            <el-col :span="2"><i class="el-icon-circle-plus-outline" @click="addDynamicForm"></i></el-col>
                            <el-col :span="2"><i class="el-icon-remove-outline" @click="deleteDynamicForm(index)"></i></el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="树结构(得到对象或ID)">
                        <el-card>
                            <el-tree
                                :data="tree"
                                show-checkbox
                                node-key="id"
                                @check-change="treeCheckChange"
                                @node-click="treeNodeClick"
                                :expand-on-click-node="false"
                                ref="tree"
                                highlight-current
                                :props="defaultProps"
                            ></el-tree>
                        </el-card>
                        <el-card>
                            <el-tree
                                @node-click="treeNodeClick"
                                ref="reference"
                                :data="tree"
                                node-key="id"
                                :props="defaultProps"
                                :expand-on-click-node="false"
                            >
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span class="name">{{ node.label }}</span>
                                    <span class="btn">
                                        <el-tooltip class="item" :open-delay="1000" effect="light" content="新增子节点" placement="top">
                                            <el-button
                                                type="text"
                                                icon="el-icon-plus"
                                                size="mini"
                                                @click="() => dialogOpen(data, 'WebResMngrMenuAdd')"
                                            >
                                                <!-- 新增子节点 -->
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" :open-delay="1000" effect="light" content="编辑" placement="top">
                                            <el-button
                                                type="text"
                                                icon="el-icon-edit-outline"
                                                size="mini"
                                                @click="() => dialogOpen(data, 'WebResMngrMenuMod')"
                                            >
                                                <!-- 编辑 -->
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" :open-delay="1000" effect="light" content="删除" placement="top">
                                            <el-button
                                                type="text"
                                                style="color: red"
                                                icon="el-icon-minus"
                                                size="mini"
                                                @click="() => dialogOpen(data)"
                                            >
                                                <!-- 删除 -->
                                            </el-button>
                                        </el-tooltip>
                                    </span>
                                </span>
                            </el-tree>
                        </el-card>
                    </el-form-item>
                    <el-form-item class="no-print">
                        <el-button type="primary" @click="getCheckedNodes">拿取数选中的值</el-button>
                        <el-button type="primary" @click="setCheckedKeys">设置数选中的值</el-button>
                        <el-button type="primary" @click="jumpDialog('edit')">页面跳转编辑数据</el-button>
                        <el-button type="primary" @click="openTabDialog">tab栏封装</el-button>
                        <el-button type="primary" @click="openStepDialog">step封装(全屏等待)</el-button>
                        <el-button type="primary" @click="printPage">打印页面</el-button>
                    </el-form-item>
                    <el-form-item label="公交站显示屏"
                        >嵌套三元表达式： :class="active==index?'yellow':item.state?'green':'gray'"</el-form-item
                    >
                    <el-form-item label="审批流组件">
                        <WorkFlowTable ref="WorkFlowTable" @print="printWorkFlowTable" :approvalCallBack="approvalCallBack" />
                    </el-form-item>
                    <el-form-item label="手风琴需要value与name值一样，才能展开,并且国家可以多选">
                        <el-collapse v-for="(item, index) in dialogForm.classify" :key="index" class="country" :value="item.value">
                            <el-collapse-item :title="item.name" :name="item.value">
                                <div class="category-box flex-h">
                                    <span
                                        v-for="(subitem, subIndex) in item.list"
                                        :key="subitem.id"
                                        :class="
                                            (index == 1 || index == 2) && item.checked === subitem.id ? 'on' : subitem.status ? 'on' : ''
                                        "
                                        class="category-item"
                                        @click="classifyFn(item.value, subitem.id, subIndex, subitem.status)"
                                        >{{ subitem.name }}</span
                                    >
                                    <span class="category-item">更多</span>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form-item>
                    <el-form-item label="cron表达式(在具体的时间做什么事)" style="margin-top: -10px; margin-bottom: 0px">
                        <Cron v-if="showCronBox" v-model="dialogForm.cronExpression" @closeDialog="showCronBox = false"></Cron>
                        <span style="color: #e6a23c; font-size: 12px"
                            >corn从左到右（用空格隔开）：秒 分 小时 月份中的日期 月份 星期中的日期 年份</span
                        >
                    </el-form-item>
                    <el-form-item label="Cron">
                        <el-input v-model="dialogForm.cronExpression" auto-complete="off">
                            <el-button
                                slot="append"
                                :icon="showCronBox ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                                @click="showCronBox = !showCronBox"
                                title="打开图形配置"
                            ></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="10"
                style="text-align: right"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
            <!-- 富文本框 -->
            <div>
                <el-card style="height: 610px">
                    <quill-editor v-model="content" ref="myQuillEditor" style="height: 500px" :options="editorOption"></quill-editor>
                </el-card>
            </div>

            <el-dialog title="tab" :visible.sync="dialogTabVisible" width="80%" :close-on-click-modal="false" :before-close="handleClose">
                <TabDialog v-if="dialogTabVisible" ref="TabDialog" />
            </el-dialog>
            <el-dialog
                title="step(v-show显示,下一步保存切换掉下一步方法)"
                :visible.sync="dialogStepVisible"
                width="80%"
                :close-on-click-modal="false"
                :before-close="handleClose"
            >
                <StepDialog v-if="dialogStepVisible" ref="StepDialog" />
            </el-dialog>
        </div>
    </div>
</template>

<script>
import treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import SelectTree from './SelectTree';
import WorkFlowTable from './WorkFlowTable';
import StepDialog from '../StepDialog/stepDialog';
import TabDialog from '../TabDialog/tabDialog';
//菜单图标........
import SvgIcon from '@/components/SvgIcon/index';
import IconSelect from './IconSelect';
//icon表达式
import Cron from './Cron';
//富文本编辑器......
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';
//..........
export default {
    name: 'baseform',
    components: { treeselect, StepDialog, TabDialog, quillEditor, IconSelect, SvgIcon, SelectTree, WorkFlowTable, Cron },
    //弹框开着的时候阻止跳转
    beforeRouteLeave(to, from, next) {
        if (this.dialogStepVisible) {
            const answer = window.confirm('页面尚未保存，是否离开本页？');
            if (answer) {
                next();
            } else {
                next(false);
            }
        } else {
            next();
        }
    },
    computed: {
        async selectWidth() {
            await this.$nextTick();
            return this.$refs.inputWidth.$el.clientWidth.toString() + 'px';
        }
    },
    watch: {
        dialogForm: {
            deep: true,
            handler(val) {}
        },
        'dialogForm.chooseData'(val) {},
        'dialogForm.arr': {
            deep: true,
            handler(val) {}
        }
    },
    data() {
        return {
            total: 30,
            dialogStepVisible: false,
            dialogTabVisible: false,
            content: null,
            editorOption: {},
            dialogFormRules: {
                treeName: [{ required: true, trigger: 'change', message: '请选择' }]
            },
            normalizer(node) {
                return {
                    id: node.value,
                    label: node.label,
                    children: node.children
                };
            },
            treeProps: {
                value: 'id',
                label: 'label',
                children: 'children'
            },
            treeData: [
                {
                    value: 'guangdong',
                    label: '广东省',
                    children: [
                        {
                            value: 'guangzhou',
                            label: '广州市',
                            children: [
                                {
                                    value: 'tianhe',
                                    label: '天河区'
                                },
                                {
                                    value: 'haizhu',
                                    label: '海珠区'
                                }
                            ]
                        },
                        {
                            value: 'dongguan',
                            label: '东莞市',
                            children: [
                                {
                                    value: 'changan',
                                    label: '长安镇'
                                },
                                {
                                    value: 'humen',
                                    label: '虎门镇'
                                }
                            ]
                        }
                    ]
                },
                {
                    value: 'hunan',
                    label: '湖南省',
                    children: [
                        {
                            value: 'changsha',
                            label: '长沙市',
                            children: [
                                {
                                    value: 'yuelu',
                                    label: '岳麓区'
                                }
                            ]
                        }
                    ]
                }
            ],
            dialogForm: {
                name: '',
                region: '',
                date: '',
                date1: '',
                date2: '',
                icon: '',
                delivery: true,
                type: ['步步高'],
                resource: '小天才',
                desc: '',
                cities: [],
                size: '',
                current: '',
                treeValue: '',
                treeName: '',
                treeCheckName: '',
                treeCheckId: '',
                treeId: '',
                treeLabel: '',
                selectTree: ['changsha'],
                chooseData: [],
                inputSearch: '',
                addDynamicForm:[{name:"",value:""}],
                //手风琴标签数据
                classify: [
                    {
                        name: '国别',
                        value: 'country',
                        checked: 0,
                        list: [
                            { id: 0, name: '中国', status: false },
                            { id: 1, name: '美国', status: false },
                            { id: 2, name: '英国', status: false },
                            { id: 3, name: '法国', status: false },
                            { id: 4, name: '德国', status: false },
                            { id: 5, name: '苏/俄', status: false },
                            { id: 7, name: '印度', status: false },
                            { id: 8, name: '韩国', status: false },
                            { id: 9, name: '日本', status: false }
                        ]
                    },
                    {
                        name: '智库',
                        value: 'library',
                        checked: 0,
                        list: [
                            { id: 0, name: '兰德公司' },
                            { id: 1, name: '国观智库' },
                            { id: 2, name: '瞭望智库' },
                            { id: 3, name: '国观智库' },
                            { id: 4, name: '上海国际问题研究院' },
                            { id: 5, name: '战略与国际研究中心' }
                        ]
                    },
                    {
                        name: '分类',
                        value: 'fenlei',
                        checked: 0,
                        list: [
                            { id: 0, name: '政治' },
                            { id: 1, name: '经济' },
                            { id: 2, name: '科技' },
                            { id: 3, name: '地理' },
                            { id: 4, name: '战略' },
                            { id: 5, name: '预警' },
                            { id: 6, name: '科研项目' }
                        ]
                    }
                ],
                cronExpression: ''
            },
            chooseData: [
                {
                    label: 'apple',
                    value: 'apple'
                },
                {
                    label: 'hello',
                    value: 'helllo'
                }
            ],
            tree: [
                {
                    id: 1,
                    label: '一级 1',
                    children: [
                        {
                            id: 4,
                            label: '二级 1-1',
                            children: [
                                {
                                    id: 9,
                                    label: '三级 1-1-1'
                                },
                                {
                                    id: 10,
                                    label: '三级 1-1-2'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    label: '一级 2',
                    children: [
                        {
                            id: 5,
                            label: '二级 2-1'
                        },
                        {
                            id: 6,
                            label: '二级 2-2'
                        }
                    ]
                },
                {
                    id: 3,
                    label: '一级 3',
                    children: [
                        {
                            id: 7,
                            label: '二级 3-1'
                        },
                        {
                            id: 8,
                            label: '二级 3-2'
                        }
                    ]
                }
            ],
            restaurants: [
                { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
                { value: 'Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
                { value: '新旺角茶餐厅', address: '上海市普陀区真北路988号创邑金沙谷6号楼113' },
                { value: '泷千家(天山西路店)', address: '天山西路438号' },
                { value: '胖仙女纸杯蛋糕（上海凌空店）', address: '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
                { value: '贡茶', address: '上海市长宁区金钟路633号' },
                { value: '豪大大香鸡排超级奶爸', address: '上海市嘉定区曹安公路曹安路1685号' },
                { value: '茶芝兰（奶茶，手抓饼）', address: '上海市普陀区同普路1435号' },
                { value: '十二泷町', address: '上海市北翟路1444弄81号B幢-107' },
                { value: '星移浓缩咖啡', address: '上海市嘉定区新郁路817号' }
            ],
            defaultProps: {
                children: 'children',
                label: 'label',
                value: 'id'
            },
            showCronBox: false
        };
    },
    methods: {
        inputNumberTofixed(value) {
            this.dialogForm.inputNumberTofixed = this.$twoNumReg(value);
        },
        treeNodeClick(data, node, template) {
            console.log(data, node, template);
        },
        treeCheckChange(data, node, template) {
            console.log(data);
        },
        getTreeeValue(val) {
            console.log(val);
            console.log(this.dialogForm.treeValue);
            // this.dialogForm.treeValue = val.value;
            // this.dialogForm.treeLabel = val.label;
        },
        dialogOpen() {},
        printWorkFlowTable() {
            this.$print(this.$refs.WorkFlowTable);
        },
        approvalCallBack() {
            // api().then(res=>{
            //     this.getTable()
            // })
        },
        printPage() {
            this.$nextTick(() => {
                this.$print(this.$refs.print);
            });
        },
        handleSizeChange(val) {
            this.dialogForm.size = val;
        },
        handleCurrentChange(val) {
            this.dialogForm.current = val;
        },
        getConfigResult(res) {
            // 接收回调函数返回数据的方法
            console.log(res);
        },
        getTypeSelectTree(val) {
            this.dialogForm.treeName = val.label;
            this.dialogForm.treeId = val.id;
        },
        cleartreeName() {
            this.dialogForm.treeName = '';
            this.dialogForm.treeId = '';
            this.$refs.treeTypeSelect.setCheckedKeys([]);
        },
        addDynamicForm(){
            this.dialogForm.addDynamicForm.push({name:"",value:""})
        },
        deleteDynamicForm(index){
            this.dialogForm.addDynamicForm.splice(index,1)
        },
        getTypeSelectCheckTree(val) {
            let arr1 = [],
                arr2 = [];
            this.$refs.treeCheckBox.getCheckedNodes().forEach((item) => {
                arr1.push(item.id);
                arr2.push(item.label);
            });
            this.dialogForm.treeCheckName = arr2.join(',');
            this.dialogForm.treeCheckId = arr1.join(',');
        },
        // 选中图标
        selected(name) {
            this.dialogForm.icon = name;
        },
        websocketToLogin() {
            // 【agentData：发送的参数；this.getConfigResult：回调方法】
            this.socketApi.sendSock(getPlaceRevenue, this.getConfigResult);
        },
        jumpDialog(type) {
            switch (type) {
                case 'create':
                    this.$router.push({
                        path: '/jumpDialog',
                        query: { type: 'create' }
                    });
                    break;
                case 'edit':
                    this.$router.push({
                        path: '/jumpDialog',
                        query: { id: 10, type: 'edit' }
                    });
                    break;
                default:
                    break;
            }
        },
        openTabDialog() {
            this.dialogTabVisible = true;
        },
        openStepDialog() {
            let loading = this.$loading({ text: '请等待', fullScreen: true });
            setTimeout(() => {
                loading.close();
                this.dialogStepVisible = true;
            }, 2000);
        },
        //分页选,弹窗点击确定
        savepageDialogSave() {
            let selectedRow = this.selectedRow.filter((item, index, arr) => {
                let arr1 = [];
                arr.forEach((ele) => {
                    arr1.push(ele.id);
                });
                return arr1.indexOf(item.id);
            });
        },
        getpageData() {
            return new Promise(async (resolve, reject) => {
                let res = await api();
                resolve();
            });
        },
        getpageCurrentChange() {
            this.getpageData().then(() => {
                let res = res.filter((item) => selectedRow.some(ele.id == item.id));
                this.$refs.table.toggleRowSelection(res, true);
            });
        },
        //切换手风琴点中
        classifyFn(value, id, subIndex) {
            switch (value) {
                case 'country':
                    if (this.dialogForm.classify[0].list[subIndex].status) this.dialogForm.classify[0].list[subIndex].status = false;
                    else {
                        this.dialogForm.classify[0].list[subIndex].status = ture;
                    }
                    break;
                case 'library':
                    this.dialogForm.classify[1].checked = id;
                    break;
                default:
                    this.dialogForm.classify[2].checked = id;
            }
        },
        //......................
        handleClose() {
            this.dialogTabVisible = false;
            this.dialogStepVisible = false;
        },
        getCheckedNodes() {
            console.log(this.$refs.tree.getCheckedNodes);
        },
        setCheckedKeys() {
            this.$refs.tree.setCheckedKeys([3]);
        },
        //输入框输入过滤
        querySearchAsync(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 3000 * Math.random());
        },
        createStateFilter(queryString) {
            return (state) => {
                return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
            };
        },
        handleSelect(item) {
            console.log(item);
        }
    },
    created() {
        console.log('会话保存的另一种方式 sessionStorage.name', sessionStorage.name);
        // var x1 = api({})
        // var x2 = api({})
        // Promise.all([x1,x2]).then(([x1,x2])=>{
        //     this.arr1 = x1.data
        //     this.arr2 = x1.data
        // })
        ({ dialogForm: this.dialogForm } = this.$options.data()); //重置数据
    }
};
</script>

<style scoped lang="scss">
form.el-form {
    margin: auto;
}
.vue-treeselect__control {
    line-height: 30px;
    font-size: 13px;
}
.custom-tree-node {
    width: calc(100% - 24px);
    display: flex;
    justify-content: space-between;
}
.category-item {
    padding: 3px 10px;
    font-size: 12px;
    color: #666;
    border: 1px solid #dcdcdc;
    cursor: pointer;
    margin-bottom: 12px;
    margin-right: 10px;
}
.category-item:hover,
.category-item.on {
    border-color: #1890ff;
    background: url(../../assets/img/icon_check.png) no-repeat right bottom;
    background-size: 14px 12px;
}
.el-collapse.country {
    margin: auto;
}
</style>