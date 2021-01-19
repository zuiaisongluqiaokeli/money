<template>
    <div class="dimensionExpand">
        <el-dialog
            title="按维度拓展"
            :close-on-click-modal="false"
            :visible="dimensionExpandShow"
            @close="closeModal"
            :modal-append-to-body="false"
            class="small-dialog"
        >
            <div class="content">
                <p>关系维度</p>
                <div class="checkBox">
                    <el-input-number v-model="num" controls-position="right" :min="1" :max="10"></el-input-number>
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
    name: 'dimensionExpand',
    data() {
        return {
            num: 1,
            radioList: ['左上', '向上', '右上', '向右', '右下', '向下', '左下', '向左', '自由'],
            radio: '自由'
        };
    },
    computed: {
        ...mapState('map', ['dimensionExpandShow', 'menuTypes']),
        ...mapState('userInfo', ['frontendConfig', 'expandFilter'])
    },
    watch: {
        dimensionExpandShow(n) {
            this.num = this.expandFilter.dimension;
        }
    },
    methods: {
        // 拓展
        expand() {
            if (!this.num)
                return this.$message.error({
                    message: '请输入拓展维度',
                    duration: 1500
                });
            // sativis.vertice(this.vertice.id).root = true
            // sativis.getVertices().forEach((v) => (v.fixed = true))
            this.changeLoading(true);
            this.extendVertice({
                vertice: this.gisRightSelectedEntity,
                // key: this.gisRightSelectedEntity.id, 少了key
                types: '',
                type: 'dimension',
                expand: this.num
            });
            this.closeModal();
            gisvis.emitter.emit(EventType.POPPER_SHOW);
        },
        // 关闭
        closeModal() {
            this.radio = '自由';
            this.changeDimensionExpandShow(false);
        },
        ...mapState('map', ['changeDimensionExpandShow', 'gisRightSelectedEntity']),
        ...mapMutations('home', ['changeLoading']),
        ...mapActions('canvasInfo', ['extendVertice'])
    }
};
</script>
<style lang="sass" scope>
</style>
<style>
.dimensionExpand .el-checkbox,
.dimensionExpand .el-radio {
    margin-right: 0;
    margin-bottom: 0.5rem;
    width: 25%;
}
</style>

<style lang="scss" scope>
.dimensionExpand {
    /deep/ .el-dialog {
        .el-dialog__body {
            display: block !important;
        }
    }
}

.dimensionExpand {
    .content {
        p {
            font-size: 1.15rem;
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
