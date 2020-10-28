<template>
    <div @click="clickFun($event)">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格(只管一行数据,N行是框架自己循环的; item.label item.prop scope.$index
                    scope.row scope.row[item.prop])
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div style="height: 80px; line-height: 80px; color: #409eff">
                动态表格（可以拖拽,单点切换选中效果,展示不同的框需要判断,vxe直接点击的时候可以设置）
            </div>
            <div style="margin-bottom: 20px">
                <el-input
                    v-model="addTableColVal"
                    ref="addTableColVal"
                    style="display: inline-block; width: 150px; padding-right: 20px"
                    placeholder="输入列名"
                ></el-input>
                <el-button type="primary" @click="addTableCol()">增加动态列(只有封装为循环才可以动态添加)</el-button>
                <el-button type="primary" @click="saveTable">保存查看数据</el-button>
            </div>

            <el-form :model="tableData" :rules="tableDataRules" ref="tableForm" class="tableData">
                <el-table
                    :data="tableData.data"
                    ref="table"
                    border
                    :row-key="getRowKey"
                    @row-click="tableRowClick"
                    :span-method="objectSpanMethod"
                    style="width: 95%"
                    :row-style="rowClass"
                    @selection-change="selectRowChange"
                    v-loading="loading"
                    element-loading-text="加载中..耐心等待"
                >
                    <el-table-column
                        type="selection"
                        width="45"
                        :reserve-selection="true"
                        align="center"
                        :selectable="checkBoxDisable"
                    ></el-table-column>
                    <el-table-column label="闪烁的点" width="100" align="center">
                        <template>
                            <span class="approval"></span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="item.label" v-for="(item, index) in tableData.col" :key="index" align="center">
                        <template slot-scope="scope">
                            <!-- 表格验证加红点标题 -->
                            <template slot="header">
                                <span class="star">*</span>
                                <span class="starName">{{ item.label }}</span>
                            </template>
                            <!-- 是输入类型才需要验证 -->
                            <!-- <template v-if="item.type!='input'" align="center">
                                <span>{{scope.row[item.prop]}}</span>
                            </template>-->
                            <template align="center">
                                <el-form-item :prop="'data.' + scope.$index + '.' + item.prop" :rules="tableDataRules.input">
                                    <el-input
                                        v-tooltip="{ content: scope.row[item.prop], color:'#fff', bgColor: 'black',pos: 'top' }"
                                        v-model="scope.row[item.prop]"
                                        suffix-icon="el-icon-edit"
                                    ></el-input>
                                </el-form-item>
                            </template>
                            <!-- <template slot-scope='scope'>
                                {{scope.row.create_time | dataFormat}}
                            </template>-->
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支持拖拽" width="80">
                        <template>
                            <el-button type="primary" icon="el-icon-rank"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </div>
        <!-- 每天都要吃香香 -->
        <div class="container">
            <div style="color: #409eff">item.prop代表属性名，scope.row[item.prop]代表属性值</div>
            <div style="height: 80px; line-height: 80px">每天都要吃香香</div>
            <el-table :data="daysTable" border style="width: 95%" class="daysClass">
                <el-table-column align="center" label="餐次/星期" prop="week" :render-header="titleChange"></el-table-column>
                <el-table-column :label="item.label" v-for="(item, index) in daysColumn" :key="index" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row[item.prop]">
                            <el-button type="text" @click="openDialog(scope.$index, item.prop, scope.row[item.prop])">
                                {{ scope.row[item.prop] }}
                                <i class="el-icon-edit el-icon--right"></i>
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button type="primary" @click="openDialog(scope.$index, item.prop)">选择食物</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="每天都要吃香香" :visible.sync="dialogShow" v-if="dialogShow" width="80%" :close-on-click-modal="false">
            <el-transfer
                style="display: flex; justify-content: center"
                v-if="dialogShow"
                v-model="daysCheckedFood"
                :data="daysAllFood"
                :titles="['食品列表', '已选食品']"
                :button-texts="['到左边', '到右边']"
                :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
            ></el-transfer>
            <el-row style="text-align: center; margin-top: 30px">
                <el-button type="primary" @click="dialogSave()">确定</el-button>
                <el-button type="primary" @click="dialogShow = false">取消</el-button>
            </el-row>
        </el-dialog>

        <div class="container" style="display: flex; justify-content: space-between">
            <div>
                <div style="color: #409eff">分页勾选(已勾选的与弹窗当前数据比对，取消传出上一次确定勾选的)</div>
                <el-table :data="toggleTable" border>
                    <el-table-column label="个数" prop="number" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" @click="editToggleTable(scope.$index)">修改个数</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog
                title="切换表格个数"
                :visible.sync="toggleTableDialog"
                v-if="toggleTableDialog"
                width="40%"
                :close-on-click-modal="false"
            >
                <el-table :data="toggleTable" ref="toggleTable" border style="width: 100%" @selection-change="toggleTableSelection">
                    <el-table-column type="selection" width="45" align="center"></el-table-column>
                    <el-table-column label="兜兜" prop="doudou" align="center"></el-table-column>
                </el-table>
                <el-row style="text-align: center; margin-top: 30px">
                    <el-button type="primary" @click="dialogToggleTable()">确定</el-button>
                    <el-button type="primary" @click="dialogToggleTableCancel">取消</el-button>
                </el-row>
            </el-dialog>
            <div style="width: 40px"></div>
            <div>
                <div style="color: #409eff">
                    深度监听表格的研究(1.递归监听报错只有一种情况：一次循环中被设置的元素设置了两次以上不同的值2.修改绑定值的时候不监听3.不用所有行都被监听)
                </div>
                <el-table :data="watchDeepTable" border ref="watchDeepTable">
                    <el-table-column label="买卖状态" prop="state" align="center"></el-table-column>
                    <el-table-column label="数量" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.number"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="单价" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.price"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="$$$$" prop="money" align="center"></el-table-column>
                </el-table>
            </div>
        </div>

        <div class="container">
            <div style="height: 80px; line-height: 80px">表格下拉树结构(自己封装组件)</div>
            <TreeTable :data="treeTable" :columns="columns" border @emitDetail="emitDetail"></TreeTable>
        </div>

        <div class="container">
            <div style="height: 80px; line-height: 80px">研发项目预算报告(不会竖着写show-summary的写法,着重表格合并写法)</div>
            <vxe-table
                border
                :span-method="mergeRowMethod"
                size="medium"
                :edit-config="{ trigger: 'click', mode: 'cell' }"
                :data="reportData"
            >
                <vxe-table-column field="rowNum" title="rowNum" width="150" align="center"></vxe-table-column>
                <vxe-table-column
                    field="address"
                    title="address"
                    width="250"
                    align="center"
                    :edit-render="{ name: '$input', props: { disabled: true } }"
                ></vxe-table-column>
                <vxe-table-column
                    field="name"
                    align="center"
                    title="name"
                    width="250"
                    :edit-render="{ name: 'input', props: { type: 'float', digits: 2 } }"
                ></vxe-table-column>
                <vxe-table-column
                    field="weather"
                    title="weather"
                    align="center"
                    width="250"
                    :edit-render="{ name: 'input', props: { type: 'float', digits: 2 } }"
                ></vxe-table-column>
                <vxe-table-column
                    field="other"
                    align="center"
                    title="other"
                    :edit-render="{ name: 'input', props: { type: 'float', digits: 2 } }"
                ></vxe-table-column>
                <vxe-table-column field="totalNumber" align="center" title="总计"></vxe-table-column>
            </vxe-table>
        </div>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import Sortable from 'sortablejs';
import TreeTable from './TreeTable';
import XEUtils from 'xe-utils';
export default {
    name: 'basetable',
    components: {
        TreeTable
    },
    watch: {
        //选中就高亮
        selectlistRow: {
            deep: true,
            handler(val) {
                this.selectRow = [];
                if (val.length > 0) {
                    val.forEach((item, index) => {
                        this.selectRow.push(this.tableData.data.indexOf(item));
                    });
                }
            }
        },
        //这样会报错，左面的money一直来回变值
        watchDeepTable: {
            deep: true,
            handler(val) {
                val.forEach((item) => {
                    if (item.number && this.watchDeepTableState) {
                        item.money = 2 * item.number;
                    }
                    // if(item.state){
                    //     item.money = 2 * item.number;
                    // }
                    if (item.price && this.watchDeepTableState) {
                        item.money = item.number * item.price;
                    }
                });
            }
        },
        reportData: {
            deep: true,
            immediate: true,
            handler(val) {
                val.forEach((item, index) => {
                    if (index == 3 || index == 5 || index == 6 || index == 7)
                        item.totalNumber = Number(item.address) + Number(item.name) + Number(item.weather) + Number(item.other);
                });
            }
        }
    },
    data() {
        const generateData = (_) => {
            const data = [];
            for (let i = 1; i <= 15; i++) {
                data.push({
                    key: i,
                    label: `好吃的食物${i}`
                });
            }
            return data;
        };
        return {
            dialogShow: false,
            daysAllFood: generateData(), //所有的食物
            daysCheckedFood: [], //设置选中用value
            addTableColVal: '',
            reportData: [
                { rowNum: '企业研究开发项目情况', address: '企业研究开发项目名称', name: '项目开发预算报告', weather: '', totalNumber: 0 },
                { rowNum: '企业研究开发项目情况', address: '企业研究开发研发奶茶', name: '2018年', weather: '', totalNumber: 0 },
                {
                    rowNum: '企业研究开发项目情况',
                    address: '总金额',
                    name: '其中：争取国家',
                    weather: '企业自筹投入',
                    other: '其他渠道投入',
                    totalNumber: 0
                },
                { rowNum: '企业研究开发项目情况', address: '20.00', name: '0.00', weather: '4.00', other: '0.00', totalNumber: 0 },
                { rowNum: '项目本年度预算支出', address: '费用项目', name: '2020年', weather: '2021年', other: '合计', totalNumber: 0 },
                { rowNum: '一内部研究开发额', address: '3.00', name: '0.00', weather: '13.00', other: '0.00', totalNumber: 0 },
                { rowNum: '其中：1.', address: '0.00', name: '0.00', weather: '0.00', other: '0.00', totalNumber: 0 },
                { rowNum: '&nbsp;&nbsp;2.', address: '0.00', name: '0.00', weather: '0.00', other: '0.00', totalNumber: 0 }
            ],
            toggleTable: [
                { number: 0, doudou: '兜兜1' },
                { number: 0, doudou: '兜兜2' },
                { number: 0, doudou: '兜兜3' },
                { number: 0, doudou: '兜兜4' }
            ],
            toggleTableIndex: 0,
            toggleTableDialog: false,
            watchDeepTableState: false,
            toggleTableSelectionData: [],
            lastToggleTableSelection: [], //上一次确定选择的数据
            watchDeepTable: [
                { money: 1, number: 1, state: '0', price: 2 },
                { money: 1, number: 1, state: '0', price: 2 },
                { money: 1, number: 1, state: '0', price: 2 },
                { money: 1, number: 1, state: '0', price: 2 }
            ],
            loading: true,
            tableData: {
                data: [
                    {
                        rowNum: 1,
                        address: '兜兜这行不可以点击哦',
                        name: '牛奶味',
                        weather: '豆浆',
                        phone: '0771-5201314',
                        start: '2016-11-22',
                        end: '2018-04-10',
                        label: '1'
                    },
                    {
                        rowNum: 1,
                        address: '棒棒糖',
                        name: '牛奶味',
                        weather: '草莓味',
                        phone: '0771-520131',
                        start: '2016-11-2',
                        end: '2018-04-1',
                        label: '1'
                    },
                    {
                        rowNum: 2,
                        address: '棒棒糖',
                        name: '牛奶味',
                        weather: '豆浆',
                        phone: '0771-5201314',
                        start: '2016-11-22',
                        end: '2018-04-10',
                        label: '1'
                    },
                    {
                        rowNum: 3,
                        address: '棒棒糖',
                        name: '牛奶味',
                        weather: '豆浆',
                        phone: '0771-5201314',
                        start: '2016-11-22',
                        end: '2018-04-10',
                        label: '1'
                    },
                    {
                        rowNum: 4,
                        address: '棒棒糖',
                        name: '牛奶味',
                        weather: '豆浆',
                        phone: '0771-5201314',
                        start: '2016-11-22',
                        end: '2018-04-10',
                        label: '1'
                    },
                    {
                        rowNum: 5,
                        address: '棒棒糖',
                        name: '牛奶味',
                        weather: '豆浆',
                        phone: '0771-5201314',
                        start: '2016-11-22',
                        end: '2018-04-10',
                        label: '1'
                    }
                ],
                copy: [
                    {
                        rowNum: 1,
                        x: '棒棒糖',
                        z: '牛奶味',
                        a: '豆浆'
                    },
                    {
                        rowNum: 1,
                        x: '西安',
                        z: '小',
                        a: '草莓味'
                    }
                ],
                col: [
                    { label: '巧克力', prop: 'rowNum', type: 'input' },
                    { label: '棒棒糖', prop: 'address', type: 'button' },
                    { label: '甜甜圈', prop: 'name', type: 'input' },
                    { label: '豆浆', prop: 'phone', type: 'button' },
                    { label: '奶茶', prop: 'start', type: 'input' }
                ]
            },
            tableDataRules: {
                input: { required: true, message: '不能为空', trigger: 'blur' }
            },
            daysTable: [
                {
                    breakfast: '',
                    lunch: '',
                    supper: '',
                    week: '星期一'
                },
                {
                    breakfast: '',
                    lunch: '',
                    supper: '',
                    week: '星期二'
                },
                {
                    breakfast: '',
                    lunch: '',
                    supper: '',
                    week: '星期三'
                },
                {
                    breakfast: '',
                    lunch: '',
                    supper: '',
                    week: '星期四'
                },
                {
                    breakfast: '',
                    lunch: '',
                    supper: '',
                    week: '星期五'
                }
            ],
            daysColumn: [
                { label: '早餐', prop: 'lunch' },
                { label: '午餐', prop: 'breakfast' },
                { label: '晚餐', prop: 'supper' }
            ],
            dayIndex: '',
            dayColumn: '',
            selectlistRow: [],
            tableData2: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            columns: [
                {
                    text: '事件',
                    value: 'event',
                    width: 200
                },
                {
                    text: 'ID',
                    value: 'id'
                },
                {
                    text: '奶茶线',
                    value: 'timeLine'
                },
                {
                    text: '备注',
                    value: 'comment'
                }
            ],
            treeTable: [
                {
                    id: 0,
                    event: '事件1',
                    timeLine: 50,
                    comment: '无'
                },
                {
                    id: 1,
                    event: '事件1',
                    timeLine: 100,
                    comment: '无',
                    children: [
                        {
                            id: 2,
                            event: '事件2',
                            timeLine: 10,
                            comment: '无'
                        },
                        {
                            id: 3,
                            event: '事件3',
                            timeLine: 90,
                            comment: '无',
                            children: [
                                {
                                    id: 4,
                                    event: '事件4',
                                    timeLine: 5,
                                    comment: '无'
                                },
                                {
                                    id: 5,
                                    event: '事件5',
                                    timeLine: 10,
                                    comment: '无'
                                },
                                {
                                    id: 6,
                                    event: '事件6',
                                    timeLine: 75,
                                    comment: '无',
                                    children: [
                                        {
                                            id: 7,
                                            event: '事件7',
                                            timeLine: 50,
                                            comment: '无',
                                            children: [
                                                {
                                                    id: 71,
                                                    event: '事件71',
                                                    timeLine: 25,
                                                    comment: 'xx'
                                                },
                                                {
                                                    id: 72,
                                                    event: '事件72',
                                                    timeLine: 5,
                                                    comment: 'xx'
                                                },
                                                {
                                                    id: 73,
                                                    event: '事件73',
                                                    timeLine: 20,
                                                    comment: 'xx'
                                                }
                                            ]
                                        },
                                        {
                                            id: 8,
                                            event: '事件8',
                                            timeLine: 25,
                                            comment: '无'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            hello: [],
            oldList: [],
            newList: [],
            selectRow: [],
            sortable: null
        };
    },
    created() {
        // 等待所有接口执行完
        // const x1 = getApi1(url,{})
        // const x2 = getApi2(url,{})
        // Promise([x1,x2]).then(([x1,x2])=>{
        //     this.x1 = x1
        //     this.x2 = x2
        // })

        //一个数组对象去重
        this.tableData.data = this.tableData.data.filter((item, index, arr) => {
            let arrids = [];
            arr.forEach((item) => {
                arrids.push(item.rowNum);
            });
            return arrids.indexOf(item.rowNum) == index;
        });
        console.log('一个数组对象去重', this.tableData.data);
        //2个数组对象留重(注意哪个数组在前会很重要)
        this.tableData.copy = this.tableData.copy.filter((item) => {
            return this.tableData.data.some((ele) => {
                return ele.rowNum == item.rowNum;
            });
        });
        console.log('2个数组对象留重', this.tableData.copy);
        //数组排序按照某个固定字段
        this.tableData.data.sort(this.compare('rowNum'));

        //reduce累加
        let reduce = this.tableData.data.reduce((prev, item) => prev + item.rowNum, 0);
        console.log('reduce累加数组对象', reduce);

        //截取
        var str = '1234456799';
        //console.log(str.substring(1, 4)); //下标，下标
        //console.log(str.substr(1, 4)); //下标，个数
        var arr = [1, 2, 3, 4, 5, 6, 7, 78, 8, 0];
        //console.log(arr.slice(1, 4)); //下标，下标
        //console.log(arr.splice(1, 4)); //下标，个数
    },
    mounted() {
        this.loading = false;
        this.rowDrop();
        this.columnDrop();
        //一开始选中
        this.$nextTick(() => {
            this.$refs.addTableColVal.focus();
        });
    },

    methods: {
        //一开始不监听，等到触发当前页面的时候改变状态
        clickFun(event) {
            this.watchDeepTableState = true;
        },
        //过滤表格信息哪些可以选中
        checkBoxDisable(row) {
            if (row.address.indexOf('兜兜') != -1) {
                return false;
            } else {
                return true;
            }
        },
        rowClass({ row, rowIndex }) {
            if (this.selectRow.includes(rowIndex)) {
                return { 'background-color': 'rgba(185,221,249,0.75)' };
            }
        },
        //行拖拽
        rowDrop() {
            const tbody = document.querySelector('.el-table__body-wrapper tbody');
            const _this = this;
            //splice方法如果两个参数index代表删除的位置，如果三参数代表增加的位置
            Sortable.create(tbody, {
                onEnd({ newIndex, oldIndex }) {
                    const currRow = _this.tableData.data.splice(oldIndex, 1)[0];
                    _this.tableData.data.splice(newIndex, 0, currRow);
                }
            });
        },
        //列拖拽的前提条件是封装了列
        columnDrop() {
            const wrapperTr = document.querySelector('.el-table__header-wrapper tr');
            //回掉函数可封装为对象，等监听到执行
            this.sortable = Sortable.create(wrapperTr, {
                animation: 180,
                delay: 0,
                onEnd: (evt) => {
                    const oldItem = this.tableData.col[evt.oldIndex];
                    this.tableData.col.splice(evt.oldIndex, 1);
                    this.tableData.col.splice(evt.newIndex, 0, oldItem);
                }
            });
        },
        titleChange(h, { column }) {
            return h(
                'div',
                {
                    class: 'headerSetStyle'
                },
                [
                    h('span', { class: 'headerLeft' }, '星期'),
                    h('span', { class: 'headerCenter' }),
                    h('span', { class: 'headerRight' }, '餐次')
                ]
            );
        },
        tableRowClick(row) {
            row.state = !row.state;
            this.$refs.table.toggleRowSelection(row, row.state);
        },
        // 获取表格选中时的数据
        selectRowChange(val) {
            // if(val.length>1){
            //     this.$refs.table.clearSelection()
            //     this.$refs.table.toggleRowSelection(val.pop(),true)
            // }
            // else {this.selectlistRow = val}
            this.selectlistRow = val;
        },
        //动态表格增加列,对应的表格数据也要增加
        addTableCol() {
            this.tableData.col.push({ label: this.addTableColVal, prop: 'wode', type: 'button' });
            this.tableData.data.forEach((item) => {
                item.wode = '';
            });
        },
        //如果是第0列第二行的倍数，那么就合并2行一列
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 2) {
                if (rowIndex === 2) {
                    return [1, 3];
                } else if (columnIndex === 3 || columnIndex === 4) {
                    return [0, 0];
                }
            }
        },
        editToggleTable(index) {
            this.toggleTableIndex = index;
            this.toggleTableDialog = true;
            //已选择的数据与弹窗数据对比
            let commonArr = this.toggleTable.filter((item) => {
                return this.toggleTableSelectionData.some((val) => item.doudou == val.doudou);
            });
            this.$nextTick(() => {
                commonArr.forEach((item) => {
                    this.$refs.toggleTable.toggleRowSelection(item, true);
                });
            });
        },
        toggleTableSelection(val) {
            this.toggleTableSelectionData = val;
        },
        dialogToggleTable() {
            this.toggleTable[this.toggleTableIndex].number = this.toggleTableSelectionData.length;
            this.lastToggleTableSelection = [...this.toggleTableSelectionData];
            this.$set(this.toggleTable, 0, this.toggleTable[0]);
            this.toggleTableDialog = false;
        },
        dialogToggleTableCancel() {
            //传入上一次选择的个数
            this.toggleTableSelectionData = [...this.lastToggleTableSelection];
            this.toggleTableDialog = false;
        },
        mergeRowMethod({ rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex === 0) {
                    return { rowspan: 4, colspan: 1 };
                } else if (rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
                    return { rowspan: 0, colspan: 0 };
                }
            }
            if (rowIndex === 0) {
                if (columnIndex === 2) {
                    return { rowspan: 1, colspan: 3 };
                } else if (columnIndex === 3 || columnIndex === 4) {
                    return { rowspan: 0, colspan: 0 };
                }
            }
            if (rowIndex === 1) {
                if (columnIndex === 2) {
                    return { rowspan: 1, colspan: 3 };
                } else if (columnIndex === 3 || columnIndex === 4) {
                    return { rowspan: 0, colspan: 0 };
                }
            }
        },
        //前端排序
        compare(prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1);
                    val2 = Number(val2);
                }
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            };
        },
        columnClick(scope, columnName) {},
        //下拉表格树查看当前操作的行
        emitDetail(val) {
            console.log(val);
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 指定一个key标识这一行的数据
        getRowKey(row) {
            return row.rowNum;
        },
        saveTable() {
            console.log(this.tableData);
        },
        //直接路由过来假如没有携带当前数据就默认返回之前路由
        returnForm() {
            let str = this.$route.path;
            let index = this.$route.path.lastIndexOf('/');
            str = str.substring(0, index);
            this.$router.push(str);
            //this.$router.go(-1)
        },
        //设置表格的值，拿到的label值需要转为对应key
        openDialog(index, column, value) {
            this.daysCheckedFood = [];
            if (value) {
                this.daysAllFood.forEach((item) => {
                    value
                        .trim()
                        .split('。')
                        .forEach((label) => {
                            if (item.label == label) {
                                this.daysCheckedFood.push(item.key);
                            }
                        });
                });
            }
            console.log('已选择的食物', this.daysCheckedFood);
            this.dayIndex = index;
            this.dayColumn = column;
            this.dialogShow = true;
        },
        //拿到的key值需要转为对应label
        dialogSave() {
            let name = '';
            this.daysAllFood.forEach((item) => {
                this.daysCheckedFood.forEach((value) => {
                    if (item.key == value) {
                        name += item.label + '。';
                    }
                });
            });
            this.daysTable[this.dayIndex][this.dayColumn] = name;
            this.$set(this.daysTable, 0, this.daysTable[0]);
            this.dialogShow = false;
        }
    }
};
</script>

<style scoped>
/deep/ .tableData .el-input input {
    border: 0;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.sortable-ghost {
    opacity: 0.8;
    color: #fff !important;
    background: #42b983 !important;
}
.approval {
    color: #1c92ff;
    font-size: 0.7rem;
    position: relative;
    padding-left: 0.4rem;
}
.approval::before {
    content: '';
    position: absolute;
    border-radius: 50%;
    top: 0.35rem;
    left: -0.1rem;
    width: 0.3rem;
    height: 0.3rem;
    background-color: #42b983;
}
.approval::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    top: 0.35rem;
    left: -0.1rem;
    width: 0.3rem;
    height: 0.3rem;
    box-sizing: border-box;
    animation: glint2 1.2s ease-in-out 0s infinite;
    border-width: 0.05rem;
    transform: scale(1, 1);
    border-style: solid;
    border-color: rgb(8, 181, 151);
    border-image: initial;
}
@keyframes glint2 {
    to {
        transform: scale(2, 2);
    }
}
.daysClass .headerSetStyle {
    position: relative;
    width: 100%;
    height: 50px;
    vertical-align: middle;
}
.daysClass .headerSetStyle .headerLeft {
    position: absolute;
    left: 0.5rem;
    bottom: -4px;
}
.daysClass .headerSetStyle .headerCenter {
    position: absolute;
    left: 0;
    top: 25px;
    display: inline-block;
    width: 100%;
    height: 1px;
    background-color: rgba(170, 176, 189, 0.5);
    -webkit-transform: rotate(14deg);
    transform: rotate(16deg);
}
.daysClass .headerSetStyle .headerRight {
    position: absolute;
    right: 0.5rem;
    top: -4px;
}

.star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 4px;
}
.starName {
    font-size: 14px;
    font-weight: bold;
}
</style>
