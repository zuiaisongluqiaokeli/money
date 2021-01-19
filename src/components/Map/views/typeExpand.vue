<template>
    <div class="typeExpand">
        <el-dialog
            title="按类型拓展"
            :close-on-click-modal="false"
            :visible="typeExpandShow"
            @close="closeModal"
            :modal-append-to-body="false"
            class="small-dialog"
        >
            <div class="content">
                <p>关系名称</p>
                <div class="checkBox">
                    <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange"
                    >全选</el-checkbox>
                    <el-checkbox-group v-model="checkedTypes" @change="handleCheckedTypesChange">
                        <el-checkbox
                            v-for="type in menuTypes"
                            :label="type.name"
                            :title="type.title"
                            @mouseenter.native="handleMouseEnter($event, type)"
                            :key="type.name"
                        >{{type.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeModal">取 消</el-button>
                <el-button type="primary" @click="expand">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { emitter, EventType } from '../src/EventEmitter';
export default {
    data() {
        return {
            checkAll: false,
            checkedTypes: [],
            isIndeterminate: false,
            radioList: ['左上', '向上', '右上', '向右', '右下', '向下', '左下', '向左', '自由'],
            radio: '自由'
        };
    },
    computed: {
        ...mapState('map', ['typeExpandShow', 'gisRightSelectedEntity']),
        ...mapState('map', {
            menuTypes: function (state) {
                return state.menuTypes.map((i) => {
                    this.$set(i, 'title', '');
                    return i;
                });
            }
        }),
        ...mapState('userInfo', ['frontendConfig', 'expandFilter'])
    },
    watch: {
        typeExpandShow(n) {
            this.checkedTypes = [];
            this.isIndeterminate = false;
            this.menuTypes.forEach((v) => (this.expandFilter.relationType.includes(v.name) ? this.checkedTypes.push(v.name) : ''));
            if (this.checkedTypes.length) this.isIndeterminate = true;
        }
    },
    methods: {
        handleMouseEnter(e, type) {
            let labelEle = e.target.lastChild;
            if (labelEle.clientWidth < labelEle.scrollWidth) {
                type.title = type.name;
            }
        },
        handleCheckAllChange(val) {
            this.checkedTypes = val ? this.menuTypes.map((v) => v.name) : [];
            this.isIndeterminate = false;
        },
        handleCheckedTypesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.menuTypes.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.menuTypes.length;
        },
        // 拓展
        expand() {
            if (!this.checkedTypes.length)
                return this.$message.error({
                    message: '至少选择一个关系进行拓展',
                    duration: 1500
                });
            // sativis.vertice(this.vertice.id).root = true
            // sativis.getVertices().forEach((v) => (v.fixed = true))
            this.changeLoading(true);
            this.extendVertice({
                vertice: this.gisRightSelectedEntity,
                types: this.checkedTypes.join(','),
                type: 'type'
            });
            this.closeModal();
            gisvis.emitter.emit(EventType.POPPER_SHOW);
        },
        // 关闭
        closeModal() {
            this.radio = '自由';
            this.checkAll = false;
            this.isIndeterminate = true;
            this.changeTypeExpandShow(false);
        },
        ...mapMutations('map', ['changeTypeExpandShow']),
        ...mapMutations('home', ['changeLoading']),
        ...mapActions('canvasInfo', ['extendVertice'])
    }
};
</script>
<style>
.typeExpand .el-checkbox,
.typeExpand .el-radio {
    margin-right: 0;
    margin-bottom: 0.5rem;
    width: 33.33333%;
}
</style>
<style lang="scss" scope>
.typeExpand {
    /deep/ .el-dialog {
        .el-dialog__body {
            display: block !important;
        }
    }

    /deep/ .el-checkbox__input {
        line-height: 1.4;
    }

    /deep/ .el-checkbox__label {
        overflow: hidden;
        white-space: nowrap;
        width: calc(100% - 10px);
        text-overflow: ellipsis;
        line-height: 1;
    }
}

.dimensionExpand {
    .content {
        p {
            font-size: var(--smallFontSize);
        }
        p:first-child {
            margin-top: 0;
        }
        .checkBox {
            margin-left: 1rem;
        }
    }
}
</style>
