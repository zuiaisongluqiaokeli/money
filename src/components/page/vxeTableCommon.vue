//全表搜索
//编辑表格 edit-config row/cell  :edit-render="{name: 'input',}
//编辑时默认选中 autoselect
//自动输入保留2位 digits
//表格内容验证  edit-rules
//表格联动
//表格选中 this.$refs.xTree.getCheckboxRecords()
//拖动选中区域 :checkbox-config="{labelField: 'id',highlight: true, range: true}"
<template>
    <div>
        <vxe-toolbar :refresh="{query: reload}" export print custom>
            <template v-slot:buttons>
                <vxe-button @click="showFooter = !showFooter">显示/隐藏表尾</vxe-button>
                <vxe-input v-model="filterName" type="search" placeholder="试试全表搜索"></vxe-input>
                <vxe-button @click="validEvent">校验</vxe-button>
                <vxe-button @click="fullValidEvent">完整校验</vxe-button>
                <vxe-button @click="addRow">插入一行</vxe-button>
                <vxe-button @click="$refs.xTable.removeCheckboxRow()">删除选中行</vxe-button>
                <vxe-input v-model="columnTitle" placeholder="输入列名"></vxe-input>
                <vxe-button @click="addColumn()">插入一列</vxe-button>
                <vxe-button @click="saveTable()">保存</vxe-button>
            </template>
        </vxe-toolbar>

        <vxe-table
            class="mytable-footer"
            border
            resizable
            ref="xTable"
            height="400"
            show-overflow
            :show-footer="showFooter"
            :edit-rules="validRules"
            :edit-config="{trigger: 'click', mode: 'row'}"
            :footer-method="footerMethod"
            :footer-cell-class-name="footerCellClassName"
            :data="tableData"
        >
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column type="seq" width="60" fixed="left"></vxe-table-column>
            <vxe-table-column
                field="name"
                title="name"
                sortable
                :edit-render="{name: 'input', autoselect: true}"
            ></vxe-table-column>
            <vxe-table-column field="role" title="role" :edit-render="{name: 'input',}"></vxe-table-column>
            <vxe-table-column field="sex" title="sex" :edit-render="{name: 'input',}"></vxe-table-column>
            <vxe-table-column field="age" title="age" :edit-render="{name: 'input',}"></vxe-table-column>

            <vxe-table-column
                field="amount"
                title="Amount"
                :edit-render="{name: 'input', props: {type: 'float', digits: 2}}"
            >
                <template v-slot="{ row }">￥{{ row.amount }}</template>
            </vxe-table-column>
            <vxe-table-column
                field="attr3"
                title="Project type"
                :edit-render="{name: '$select', options: ptypeList, props: {clearable: true}, events: {change: ptypeChangeEvent}}"
            ></vxe-table-column>
            <vxe-table-column
                field="attr4"
                title="Project name"
                :edit-render="{name: '$select', options: pnameList, props: {clearable: true}}"
            ></vxe-table-column>
            <vxe-table-column
                field="date"
                title="Date"
                :edit-render="{name: '$input', props: {type: 'date'}}"
            ></vxe-table-column>
            <vxe-table-column
                field="week"
                title="Week"
                :edit-render="{name: '$input', props: {type: 'week'}}"
            ></vxe-table-column>
            <vxe-table-column
                :field="item.field"
                :title="item.title"
                :key="index"
                v-for="(item,index) in columnArr"
                :edit-render="{name: '$input',}"
            ></vxe-table-column>
        </vxe-table>
    </div>
</template>
<script>
import XEUtils from 'xe-utils';
import Sortable from 'sortablejs';
export default {
    data() {
        const nameValid = ({ cellValue }) => {
            return new Promise((resolve, reject) => {
                if (cellValue) {
                    if (!/^\w+$/.test(cellValue)) {
                        reject(new Error('名称格式不正确，必须字母或数字'));
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        };
        const roleValid = ({ cellValue }) => {
            if (cellValue && !['前端', '后端', '设计师', '项目经理', '测试'].includes(cellValue)) {
                return Promise.reject(new Error('角色输入不正确'));
            }
        };
        return {
            showFooter: true,
            filterName: '', //试试全表搜索
            columnTitle: '',
            columnArr: [],
            tableData: [
                {
                    name: 'am',
                    isNew: true,
                    _XID: 'row_89',
                    role: null,
                    sex: '0',
                    age: null,
                    amount: '12',
                    attr3: '1',
                    attr4: '1',
                    date: '2020-05-01',
                    week: '2020-04-27'
                }
            ],
            validRules: {
                name: [{ required: true, message: 'app.body.valid.rName' }, { validator: nameValid }],
                role: [{ validator: roleValid }],
                sex: [
                    { required: true, message: '性别必须填写' },
                    { pattern: /^[0,1]{1}$/, message: '格式不正确' }
                ],
                age: [{ pattern: '^[0-9]{0,3}$', message: '格式不正确' }]
            },
            ptypeList: [
                {
                    label: '项目1',
                    value: '1'
                },
                {
                    label: '项目2',
                    value: '2'
                },
                {
                    label: '项目3',
                    value: '3'
                }
            ],
            pnameList: []
        };
    },
    //普通 型搜索
    computed: {
        list() {
            const filterName = XEUtils.toString(this.filterName)
                .trim()
                .toLowerCase();
            if (filterName) {
                const filterRE = new RegExp(filterName, 'gi');
                const searchProps = ['name', 'role', 'age', 'amount'];
                const rest = this.tableData.filter(item =>
                    searchProps.some(
                        key =>
                            XEUtils.toString(item[key])
                                .toLowerCase()
                                .indexOf(filterName) > -1
                    )
                );
                return rest.map(row => {
                    const item = Object.assign({}, row);
                    searchProps.forEach(key => {
                        item[key] = XEUtils.toString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`);
                    });
                    return item;
                });
            }
            return this.tableData;
        }
    },
    //tree 型搜索
    computed: {
        list() {
            const filterName = XEUtils.toString(this.filterName)
                .trim()
                .toLowerCase();
            if (filterName) {
                const filterRE = new RegExp(filterName, 'gi');
                const options = { children: 'children' };
                const searchProps = ['name', 'size', 'type', 'date'];
                const rest = XEUtils.searchTree(
                    this.tableData,
                    item =>
                        searchProps.some(
                            key =>
                                XEUtils.toString(item[key])
                                    .toLowerCase()
                                    .indexOf(filterName) > -1
                        ),
                    options
                );
                XEUtils.eachTree(
                    rest,
                    item => {
                        searchProps.forEach(key => {
                            item[key] = XEUtils.toString(item[key]).replace(
                                filterRE,
                                match => `<span class="keyword-lighten">${match}</span>`
                            );
                        });
                    },
                    options
                );
                // 搜索之后默认展开所有子节点
                this.$nextTick(() => {
                    this.$refs.xTree.setAllTreeExpansion(true);
                });
                return rest;
            }
            return this.tableData;
        }
    },
    created() {
        //每次对象都得深拷贝
        for (let index = 0; index < 10; index++) {
            this.tableData.push(JSON.parse(JSON.stringify(this.tableData[0])))
        }
    },

    methods: {
        reload() {
            // 清除所有状态
            this.$refs.xTable.clearAll();
            // return this.findList();
        },
        async validEvent() {
            const errMap = await this.$refs.xTable.validate().catch(errMap => errMap);
            if (errMap) {
                this.$XModal.message({ status: 'error', message: '校验不通过！' });
            } else {
                this.$XModal.message({ status: 'success', message: '校验成功！' });
            }
        },
        async fullValidEvent() {
            const errMap = await this.$refs.xTable.fullValidate().catch(errMap => errMap);
            if (errMap) {
                let msgList = [];
                Object.values(errMap).forEach(errList => {
                    errList.forEach(params => {
                        let { rowIndex, column, rules } = params;
                        rules.forEach(rule => {
                            msgList.push(`第 ${rowIndex} 行 ${column.title} 校验错误：${rule.message}`);
                        });
                    });
                });
                this.$XModal.message({
                    status: 'error',
                    message: () => {
                        return [
                            <div class="red" style="max-height: 400px;overflow: auto;">
                                {msgList.map(msg => (
                                    <div>{msg}</div>
                                ))}
                            </div>
                        ];
                    }
                });
            } else {
                this.$XModal.message({ status: 'success', message: '校验成功！' });
            }
        },
        ptypeChangeEvent({ row }) {
            // 类型切换时更新级联的下拉数据
            row.attr4 = '';
            switch (row.attr3) {
                case '1':
                    this.pnameList = [{ label: '项目1', value: '1' }];
                    break;
                case '2':
                    this.pnameList = [{ label: '项目2', value: '2' }];
                    break;
                case '3':
                    this.pnameList = [{ label: '项目3', value: '3' }];
                    break;
                default:
                    break;
            }
        },
        footerCellClassName({ $rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if ($rowIndex === 0) {
                    return 'col-blue';
                } else {
                    return 'col-red';
                }
            }
        },
        addRow() {
            let xTable = this.$refs.xTable;
            xTable
                .createRow({
                    name: '新数据',
                    isNew: true
                })
                .then(newRow => {
                    // 插入到第一行
                    this.tableData.push(newRow);
                    xTable.syncData().then(() => xTable.setActiveRow(newRow));
                });
        },
        addColumn() {
            this.columnArr.push({ title: this.columnTitle, field: 'a' });
        },
        footerMethod({ columns, data }) {
            const means = [];
            const sums = [];
            const others = [];
            columns.forEach((column, columnIndex) => {
                if (columnIndex === 0) {
                    means.push('平均');
                    sums.push('和值');
                    others.push('其他');
                } else {
                    let meanCell = null;
                    let sumCell = null;
                    let otherCell = '-';
                    switch (column.property) {
                        case 'age':
                        case 'rate':
                            meanCell = parseInt(XEUtils.mean(data, column.property));
                            sumCell = XEUtils.sum(data, column.property);
                            break;
                        case 'sex':
                            otherCell = '无';
                            break;
                    }
                    means.push(meanCell);
                    sums.push(sumCell);
                    others.push(otherCell);
                }
            });
            // 返回一个二维数组的表尾合计
            return [means, sums, others];
        },
        saveTable() {
            console.log(this.tableData);
        }
    }
};
</script>

<style scoped>
.keyword-lighten {
    color: #000;
    background-color: #ffff00;
}
</style>