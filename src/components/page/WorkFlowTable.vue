<template>
    <div>
        <el-table
            ref="mainTable"
            :data="mainData"
            :border="true"
            :span-method="objectSpanMethod"
            size="small"
        >
            <el-table-column
                v-for="item in mainTitle"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                align="center"
            ></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <div v-if="mainData.length!=0 && scope.row.isApp=='01'">
                        <div>{{scope.row.appTypeName}}</div>
                    </div>
                    <div v-else-if="gettrue(scope)">
                        <el-button
                            @click="tableOperation('approver',scope,row)"
                            type="text"
                            size="small"
                        >批准</el-button>
                        <el-button
                            @click="tableOperation('reject',scope,row)"
                            type="text"
                            size="small"
                        >拒绝</el-button>
                        <el-button
                            v-if="scope.row.isCanEntrust=='01'"
                            @click="tableOperation('entrust',scope,row)"
                            type="text"
                            size="small"
                        >委托</el-button>
                    </div>
                    <div v-else>--</div>
                </template>
            </el-table-column>
        </el-table>
        <el-button
            @click="tableOperation('history')"
            style="margin:10px;"
            type="text"
            size="small"
        >历史审批记录</el-button>
        <el-button
            @click="recall()"
            style="margin:10px"
            v-if="mainData.length!=0&&userId==mainData[0].approverIds&&mainData[mainData.length-1].isApp=='00'"
            type="text"
            size="small"
        >撤回</el-button>

        <el-dialog
            title="title"
            :visible.sync="secondDialog"
            width="80%"
            :close-on-click-modal="false"
            append-to-body
        >
            <div v-if="title == '历史详情'">
                <div class="basemargin">
                    <el-table :data="datailData">
                        <el-table-column
                            v-for="item in detailTile"
                            :key="item.prop"
                            :label="item.label"
                            :prop="item.prop"
                            align="center"
                        ></el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-if="title == '批准流成'">
                <div class="basemargin">
                    <el-input v-model="remark" type="textarea" :row="6" placeholder="请填写批准说明"></el-input>
                </div>
            </div>
            <div v-if="title == '拒绝流程'">
                <el-radio-group v-model="radio" style="margin:10px 0">
                    <el-radio label="1">直接拒绝</el-radio>
                    <el-radio label="2">返回给上一级</el-radio>
                </el-radio-group>
                <div class="basemargin">
                    <el-input v-model="remark" type="textarea" :row="6" placeholder="请填写拒绝说明"></el-input>
                </div>
            </div>
            <div v-else>
                <div class="basemargin">
                    <el-input v-model="remark" type="textarea" :row="6" placeholder="请填写委托说明"></el-input>
                </div>
                <el-row :gutter="20" style="margin:20px 0">
                    <el-form ref="searchform" v-model="searchform" label-width="80px" size="small">
                        <el-col :span="8">
                            <el-form-item class="search-input" label="用户名称：">
                                <el-input v-model="searchform.userName" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item class="search-input" label="登录名：">
                                <el-input v-model="searchform.loginName" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button @click="entrustPersonSearch()" size="small">查询</el-button>
                            <el-button @click="entrustPersonReset()" size="small">重置</el-button>
                        </el-col>
                    </el-form>
                </el-row>
                <el-row style="margin:20px 0">
                    <el-table ref="Table" :data="detailData" @selection-change="radioSelect">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column
                            v-for="item in detailTile"
                            :key="item.prop"
                            :label="item.label"
                            :prop="item.prop"
                            align="center"
                        ></el-table-column>
                    </el-table>
                </el-row>
                <!-- <el-pagination
                    style="text-align:right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="searchform.size"
                    :current-page="searchform.current"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                ></el-pagination> -->
            </div>

            <div style="text-align:center;margin-top:15px;">
                <el-button v-if="title!='历史详情'" size="small" @click="saveSecondDialog">确定</el-button>
                <el-button @click="secondDialog=false" size="small">{{title == '历史详情'?'返回':"取消"}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
//api
export default {
    props: {
        approvalCallback: {
            type: Function,
            default: null
        }
    },
    components: {},
    data() {
        return {
            userId: '',
            spanArr: [],
            position: 0,
            secondDialog: false,
            mainData: [],
            detailTile: [],
            mainTitle: [
                { prop: 'nname', label: '审批岗位' },
                { prop: 'orgName', label: '审批机构' },
                { prop: 'approverIdsName', label: '审批人' },
                { prop: 'appContent', label: '审批意见' },
                { prop: 'updateTime', label: '审批时间' }
            ],
            datailTile: [],
            detailData: [],
            referForm: {},
            radio: '1',
            remark: '',
            searchform: {
                userName: '',
                loginName: '',
                size: 10,
                current: 1
            },
            total: 0,
            tableSelect: [],
            title: '',
            form: {},
            passingOrder: ''
        };
    },
    methods: {
        gettrue(scope) {
            return this.mainData.length != 0 && this.userId == scope.row['approverIds'] && scope.row.orders == this.passingOrder;
        },
        maindataget(form) {
            this.form = form;
            selectRecordByBusId(this.form)
                .then(res => {
                    let arr = [];
                    res.data.forEach(v => {
                        if (v.updateTime) {
                            v.updateTime = formatDate(v.updateTime);
                        } else {
                            v.updateTime = '--';
                        }
                        if (v.isApp == '00') {
                            arr.push(v.orders);
                            this.passingOrder = Math.min.apply(null, arr);
                        }
                    });
                    this.mainData = res.data;
                    this.getSpanArr(this.mainData);
                })
                .then(() => {
                    if (this.form.print == '01') {
                        this.$emit('print');
                    }
                });
        },
        //合并的数据放在一个数组里形式例如[3,0,0,2,0]
        getSpanArr(tableData) {
            this.spanArr = [];
            this.position = 0
            tableData.forEach((item,index)=>{
                if(index==0){
                    this.spanArr.push(1)
                    this.position=0
                }else{
                    if(tableData[index].nname==tableData[index-1].nname){
                        this.spanArr[this.position]+=1
                        this.spanArr.push(0)
                    }else{
                        this.spanArr.push(1)
                        this.position=index
                    }
                }
            })
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    column: _col
                };
            }
            //依此类推
            // if (columnIndex == 1) {
            //     const _row = this.spanArr[rowIndex];
            //     const _col = _row > 0 ? 1 : 0;
            //     return {
            //         rowspan: _row,
            //         column: _col
            //     };
            // }
        },
        radioSelect(val) {
            if (val.length > 1) {
                this.$refs.Table.clearSelection();
                this.$refs.Table.toggleRowSelection(val.pop());
            } else {
                this.tableSelect = JSON.parse(JSON.stringify(val));
            }
        },
        tableOperation(type, data) {
            if (type != 'history') {
                this.referForm = JSON.parse(JSON.stringify(data));
                switch (type) {
                    case 'approver':
                        this.title = '批准流程';
                        break;
                    case 'reject':
                        this.title = '拒绝流程';
                    case 'entrust':
                        this.title = '委托流程';
                        this.detailTile = [
                            { prop: 'userNo', label: '用户编号' },
                            { prop: 'userName', label: '用户名称' },
                            { prop: 'loginName', label: '登录名' },
                            { prop: 'orgName', label: '所属部门' }
                        ];
                        this.searchform.nId = this.referForm.nId;
                        this.personSearch(this.searchform);
                        break;
                    case 'history':
                        this.title = '历史详情';
                        this.detailTile = [
                            { prop: 'nname', label: '审批岗位' },
                            { prop: 'orgName', label: '审批机构' },
                            { prop: 'approverIdsName', label: '审批人' },
                            { prop: 'appContent', label: '审批意见' },
                            { prop: 'updateTime', label: '审批时间' },
                            { prop: 'appTypeName', label: '操作' }
                        ];
                        selectRecordByBusId(this.form).then(res => {
                            res.data.forEach(v => {
                                if (v.updateTime) {
                                    v.updateTime = formatDate(v.updateTime);
                                } else {
                                    v.updateTime = '--';
                                }
                            });
                            this.detailData = res.data;
                        });
                        break;
                }
                this.secondDialog = true;
            }
        },
        saveSecondDialog() {
            if (this.remark == '') {
                this.$message({
                    type: 'warning',
                    message: '请填写说明'
                });
                return false;
            }
            let form = {};
            switch (this.title) {
                case '批准流程':
                    form.appResult = '00';
                    form.appType = '01';
                    break;
                case '拒绝流程':
                    form.appResult = '01';
                    if (this.radio == '1') {
                        form.appType = '05';
                    } else {
                        form.appType = '02';
                    }
                    break;
                case '批准流程':
                    form.appResult = '01';
                    form.appType = '03';
                    if (this.tableSelect.length == 0) {
                        this.$message({
                            type: 'warning',
                            message: '请选择委托人'
                        });
                        return false;
                    }
                    form.entrustUser = this.tableSelect[0].userNo;
                    break;
                default:
                    break;
            }
            doApproval(form).then(res => {
                if (res.data.result == 'true') {
                    this.approvalCallback(res.data);
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    selectRecordByBusId(this.form).then(res => {
                        res.data.forEach(v => {
                            if (v.updateTime) {
                                v.updateTime = formatDate(v.updateTime);
                            } else {
                                v.updateTime = '--';
                            }
                        });
                        this.mainData = res.data;
                        this.getSpanArr(this.mainData);
                    });
                    this.secondDialog = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            });
        },
        recall() {
            this.$confirm('此操作撤回该流程，是否继续，”提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let form = {};
                doApproval(form).then(res => {
                    if (res.data.result == 'true') {
                        this.approvalCallback(res.data);
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        });
                        this.approvalCallback(res.data);
                        selectRecordByBusId(this.form).then(res => {
                            res.data.forEach(v => {
                                if (v.updateTime) {
                                    v.updateTime = formatDate(v.updateTime);
                                } else {
                                    v.updateTime = '--';
                                }
                            });
                            this.mainData = res.data;
                            this.getSpanArr(this.mainData);
                        });
                    }
                });
            });
        },
        personSearch(form) {
            api(form)
                .then(res => {
                    this.detailData = res.data.records;
                    this.total = res.data.total;
                })
                .then(res => {
                    if (this.tableSelect.length != 0) {
                        this.detailData.map((v, i) => {
                            if (v == this.tableSelect[0]) {
                                this.$refs.Table.toggleRowSelection(v, true);
                            }
                        });
                    }
                });
        },
        entrustPersonSearch() {
            this.personSearch(this.searchform);
        },
        entrustPersonReset() {
            for (const key in this.searchform) {
                this.searchform[key] = '';
            }
            this.searchform.size = 10;
            this.searchform.current = 1;
            this.entrustPersonSearch(this.searchform);
        },
        sizeSeacrchFn(val) {
            this.searchform.size = val;
            this.personSearch(this.searchform);
        },
        currentSearch(val) {
            this.searchform.current = val;
            this.personSearch(this.searchform);
        }
    },
    watch: {
        secondDialog: {
            handler(newVal) {
                if (this.secondDialog == false) {
                    this.radio = '1';
                    this.remark = '';
                    this.tableSelect = [];
                }
            }
        }
    }
};
</script>