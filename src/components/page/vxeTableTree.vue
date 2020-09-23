<template>
    <div>
        <vxe-toolbar :refresh="{query: reload}" export print custom>
            <template v-slot:buttons>
                <vxe-button @click="validEvent">校验</vxe-button>
                <vxe-button @click="fullValidEvent">完整校验</vxe-button>
                <vxe-button @click="insertEvent">新增</vxe-button>
                <vxe-button @click="insertAtEvent">插入到选中的行</vxe-button>
                <vxe-button @click="removeEvent">移除选中</vxe-button>
                <el-input placeholder="请输入列名" v-model="columnName" style="width:140px;"></el-input>
                <vxe-button @click="insertColumnEvent">插入列</vxe-button>
                <vxe-button @click="$refs.xTree.setAllTreeExpansion(true)">展开所有</vxe-button>
                <vxe-button @click="$refs.xTree.clearTreeExpand()">关闭所有</vxe-button>
                <vxe-button @click="saveEvent">保存</vxe-button>
            </template>
        </vxe-toolbar>
        <vxe-table
            resizable
            show-footer
            ref="xTree"
            max-height="400"
            :loading="loading"
            :tree-config="tableTreeConfig"
            :edit-rules="validRules"
            :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
            @checkbox-change="selectChangeEvent"
            :checkbox-config="{labelField: 'id',highlight: true, range: true}"
            :footer-method="footerMethod"
            :data="tableData"
        >
            <vxe-table-column type="checkbox" width="120" tree-node></vxe-table-column>
            <vxe-table-column
                field="name"
                title="名称"
                :formatter="formatName"
                :edit-render="{name: 'input', autoselect: true}"
            ></vxe-table-column>
            <vxe-table-column
                field="level"
                title="级别"
                :edit-render="{name: 'input', autoselect: true}"
            ></vxe-table-column>
            <vxe-table-column
                field="age"
                title="年龄"
                :edit-render="{name: 'input', autoselect: true}"
            ></vxe-table-column>
            <vxe-table-column
                field="rate"
                title="分数"
                :edit-render="{name: 'input', autoselect: true}"
            ></vxe-table-column>
            <vxe-table-column
                field="date"
                title="修改日期"
                sortable
                remote-sort
                :edit-render="{name: 'input', autoselect: true}"
            ></vxe-table-column>
            <vxe-table-column
                :field="item.field"
                :title="item.title"
                v-for="(item,index) in treeColumn"
                :key="index"
                :edit-render="{name: 'input', autoselect: true}"
            ></vxe-table-column>
        </vxe-table>
    </div>
</template>

<script>
import XEUtils from 'xe-utils';
export default {
    data() {
        return {
            loading: false,
            tableData: [],
            selectedRow: [],
            columnName: '',
            treeColumn: [],
            tableTreeConfig: {
                children: 'children',
                iconOpen: 'el-icon-circle-plus',
                iconClose: 'el-icon-remove',
                expandAll: false // 默认是否全部展开
            },
            //更改图标
            refresh: {
                icon: 'fa fa-refresh',
                iconLoading: 'fa fa-spinner fa-spin'
            },
            import: {
                icon: 'fa fa-upload'
            },
            export: {
                icon: 'fa fa-download'
            },
            print: {
                icon: 'fa fa-print'
            },
            zoom: {
                iconIn: 'fa fa-arrows-alt',
                iconOut: 'fa fa-expand'
            },
            custom: {
                icon: 'fa fa-cog'
            },
            validRules: {
                name: [
                    { required: true, message: 'app.body.valid.rName' },
                    { min: 3, max: 50, message: '文件名长度在 3 到 50 个字符' }
                ]
            }
        };
    },
    created() {
        this.loading = true;
        this.findList().then(data => {
            this.tableData = this.getGroupSummary(data);
            this.loading = false;
        });
    },
    methods: {
        findList() {
            return new Promise(resolve => {
                setTimeout(() => {
                    let list = [
                        {
                            name: '一班',
                            level: '',
                            age: '',
                            rate: '',
                            children: [
                                { name: 'test7', rate: 9, age: 24, level: 1 },
                                { name: 'test6', rate: 14, age: 20, level: 3 },
                                {
                                    name: '第一组',
                                    level: '',
                                    age: '',
                                    rate: '',
                                    children: [
                                        { name: 'test85', rate: 13, age: 32, level: 1 },
                                        { name: 'test37', rate: 9, age: 29, level: 4 },
                                        { name: 'test93', rate: 22, age: 28, level: 5 },
                                        { name: 'test90', rate: 55, age: 26, level: 2 }
                                    ]
                                },
                                { name: 'test32', rate: 11, age: 21, level: 1 }
                            ]
                        },
                        {
                            name: '二班',
                            level: '',
                            age: '',
                            rate: '',
                            children: [
                                { name: 'test15', rate: 13, age: 32, level: 1 },
                                { name: 'test44', rate: 9, age: 29, level: 4 },
                                {
                                    name: '第一组',
                                    level: '',
                                    age: '',
                                    rate: '',
                                    children: [
                                        { name: 'test37', rate: 9, age: 29, level: 4 },
                                        { name: 'test93', rate: 22, age: 28, level: 5 }
                                    ]
                                },
                                {
                                    name: '第二组',
                                    level: '',
                                    age: '',
                                    rate: '',
                                    children: [
                                        { name: 'test74', rate: 11, age: 32, level: 5 },
                                        { name: 'test99', rate: 23, age: 18, level: 4 },
                                        {
                                            name: '第一排',
                                            level: '',
                                            age: '',
                                            rate: '',
                                            children: [
                                                { name: 'test48', rate: 77, age: 29, level: 4 },
                                                { name: 'test38', rate: 34, age: 21, level: 2 }
                                            ]
                                        },
                                        { name: 'test16', rate: 22, age: 26, level: 5 }
                                    ]
                                },
                                { name: 'test91', rate: 16, age: 27, level: 5 },
                                {
                                    name: '第三组',
                                    level: '',
                                    age: '',
                                    rate: '',
                                    children: [
                                        { name: 'test77', rate: 11, age: 35, level: 1 },
                                        { name: 'test89', rate: 40, age: 18, level: 4 },
                                        { name: 'test10', rate: 22, age: 20, level: 2 }
                                    ]
                                }
                            ]
                        },
                        {
                            name: '三班',
                            level: '',
                            age: '',
                            rate: '',
                            children: [
                                { name: 'test6', rate: 3, age: 22, level: 2 },
                                { name: 'test2', rate: 5, age: 25, level: 3 },
                                { name: 'test42', rate: 17, age: 35, level: 4 }
                            ]
                        }
                    ];
                    resolve(list);
                }, 1000);
            });
        },
        formatName({ row }) {
            return row.children && row.children.length ? `${row.name} (${row.num}人)` : row.name;
        },
        // 计算逻辑
        handleSummary(children) {
            return {
                num: XEUtils.sum(children, 'num'),
                level: Math.floor(XEUtils.sum(children, 'level')),
                age: parseInt(XEUtils.mean(children, 'age')),
                rate: XEUtils.sum(children, 'rate')
            };
        },
        getGroupSummary(data) {
            XEUtils.eachTree(
                data,
                (row, index, items, path, parent, nodes) => {
                    let children = row.children;
                    if (children && children.length) {
                        // 合计子节点
                        Object.assign(row, this.handleSummary(children));
                    } else {
                        row.num = 1;
                        if (index === items.length - 1) {
                            // 全量汇总
                            for (let len = nodes.length - 2; len >= 0; len--) {
                                Object.assign(nodes[len], this.handleSummary(nodes[len].children));
                            }
                        }
                    }
                },
                this.tableTreeConfig
            );
            XEUtils.eachTree(
                data,
                row => {
                    let children = row.children;
                    if (children && children.length) {
                        // 动态增加一行汇总
                        children.push({
                            name: `合计 (${row.name})`,
                            level: row.level,
                            age: row.age,
                            rate: row.rate
                        });
                    }
                },
                this.tableTreeConfig
            );
            return data;
        },
        validEvent() {
            this.$refs.xTree.validate(errMap => {
                if (errMap) {
                    this.$XModal.message({ status: 'error', message: '校验不通过！' });
                } else {
                    this.$XModal.message({ status: 'success', message: '校验成功！' });
                }
            });
        },
        fullValidEvent() {
            this.$refs.xTree.fullValidate(errMap => {
                if (errMap) {
                    let msgList = [];
                    Object.values(errMap).forEach(errList => {
                        errList.forEach(params => {
                            let { row, column, rules } = params;
                            let matchObj = XEUtils.findTree(this.tableData, item => item === row, this.treeConfig);
                            let seq = matchObj.path
                                .filter(item => item !== this.treeConfig.children)
                                .map(item => Number(item) + 1)
                                .join('.');
                            rules.forEach(rule => {
                                msgList.push(`第 ${seq} 行 ${column.title} 校验错误：${rule.message}`);
                            });
                        });
                    });
                    this.$XModal.message({
                        status: 'error',
                        message: () => {
                            return [
                                <div class="red" style="max-height: 400px;overflow: auto;">
                                    {msgList.map(msg => {
                                        return <div>{msg}</div>;
                                    })}
                                </div>
                            ];
                        }
                    });
                } else {
                    this.$XModal.message({ status: 'success', message: '校验成功！' });
                }
            });
        },
        selectChangeEvent(records) {
            this.selectedRow = records;
        },
        insertEvent() {
            let xTree = this.$refs.xTree;
            xTree
                .createRow({
                    name: '新数据',
                    date: XEUtils.toDateString(new Date(), 'yyyy-MM-dd'),
                    isNew: true
                })
                .then(newRow => {
                    // 插入到第一行
                    this.tableData.unshift(newRow);
                    xTree.syncData().then(() => xTree.setActiveRow(newRow));
                });
        },
        insertAtEvent() {
            if (this.selectedRow.length != 1) {
                return this.$message.warning('请选中一行数据');
            }
            let xTree = this.$refs.xTree;
            xTree
                .createRow({
                    name: '新数据',
                    date: XEUtils.toDateString(new Date(), 'yyyy-MM-dd'),
                    isNew: true
                })
                .then(newRow => {
                    // 插入到 id 为 11000 的节点位置中
                    let rowNode = XEUtils.findTree(this.tableData, item => item.id === '11000', this.treeConfig);
                    if (rowNode) {
                        rowNode.items.splice(rowNode.index, 0, newRow);
                        xTree.syncData().then(() => xTree.setActiveRow(newRow));
                    }
                });
        },
        insertColumnEvent(val) {
            this.treeColumn.push({ field: val, title: val });
        },
        removeEvent() {
            let xTree = this.$refs.xTree;
            let removeRecords = xTree.getCheckboxRecords();
            removeRecords.forEach(row => {
                let matchObj = XEUtils.findTree(this.tableData, item => item === row, this.treeConfig);
                if (matchObj) {
                    let { items, index } = matchObj;
                    // 从树节点中移除
                    let restRow = items.splice(index, 1)[0];
                    this.removeList.push(restRow);
                }
            });
            xTree.syncData();
        },
        reload() {
            // 清除所有状态
            this.$refs.xTree.clearAll();
            return this.findList();
        },
        footerMethod({ columns, data }) {
            return [
                columns.map((column, columnIndex) => {
                    if (columnIndex === 0) {
                        return `合计 (${XEUtils.sum(data, 'num')}人)`;
                    }
                    switch (column.property) {
                        case 'level':
                            return `总共 ${Math.floor(XEUtils.sum(data, 'level'))}`;
                        case 'age':
                            return `平均年龄 ${parseInt(XEUtils.mean(data, 'age'))}`;
                        case 'rate':
                            return `总分 ${XEUtils.sum(data, 'rate')}`;
                    }
                    return '-';
                })
            ];
        },
        saveEvent() {
            console.log(this.tableData);
        }
    }
};
</script>