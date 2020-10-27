<template>
    <div class="map-search-add">
        <el-dialog title="分类" class="dialog" append-to-body :visible.sync="dialogVisible" @closed="emitClosedEvent">
            <div class="dialog-body">
                <el-row class="row">
                    <!-- 编制选择 -->
                    <el-col :span="11" class="col">
                        <div class="wrap">
                            <div class="title">编制选择：</div>
                            <div class="content">
                                <MapCategory class="map-category" :click-method="handleCategoryClick" />
                            </div>
                        </div>
                    </el-col>
                    <!-- 装备选择 -->
                    <el-col :span="11" :offset="2" class="col">
                        <div class="wrap">
                            <div class="title">装备选择：</div>
                            <div class="content">
                                <MapMark class="map-mark" :click-method="handleMarkClick" />
                            </div>
                        </div>
                    </el-col>
                    <!-- 当前选择 -->
                    <el-row class="current-selected">
                        <el-col :span="11">
                            当前选择：{{ treeSelected.value }}
                            <i class="el-icon-delete delete" @click="cancelSelected('treeSelected')"> </i>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            当前选择：{{ markSelected.value }}
                            <i class="el-icon-delete delete" @click="cancelSelected('markSelected')"> </i>
                        </el-col>
                    </el-row>
                </el-row>
            </div>
            <div class="footer" slot="footer">
                <el-button type="primary" @click="searchAndAdd">搜索并添加</el-button>
                <el-button type="default" @click="emitClosedEvent">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import MapMark from './MapMark';
import MapCategory from './MapCategory';
// import { knowledgeEquipmentSearch } from "@/assets/api/map";
import { transferPropsKey, getTransferredKeys, processGroupData, processCategoryData } from '../../../src/Methods';

import { emitter, EventType } from '../../../src/EventEmitter';

export default {
    components: { MapMark, MapCategory },

    directives: {},

    props: {},

    data() {
        return {
            dialogVisible: true,
            treeSelected: {
                value: '',
                data: {}
            },
            markSelected: {
                value: '',
                data: {}
            }
        };
    },

    computed: {
        ...mapState('graphInfo', ['name'])
    },

    watch: {},

    created() {},

    mounted() {},

    methods: {
        ...mapActions('3dMap', ['addMapData']),
        /**
         * 类型搜索
         */
        async knowledgeEquipmentSearch(group, type, country) {
            const graphName = this.name;
            const res = await knowledgeEquipmentSearch(graphName, group, type, country);
            const { data } = res;
            const { success, object, msg } = data;

            success ? this.$message.success(msg) : this.$message.error(msg);

            return object || [];
        },
        /**
         * 点击分类
         */
        handleCategoryClick(data) {
            const { label } = data;

            this.treeSelected = {
                value: label,
                data: data
            };
        },
        /**
         * 点击标记图例
         */
        handleMarkClick(data) {
            const { group, groupType, type } = data;

            this.markSelected = {
                value: group ? groupType : type,
                data: data
            };
        },
        /**
         * 搜索并添加
         */
        async searchAndAdd() {
            let { type } = this.markSelected.data;
            const { group } = this.markSelected.data;
            const { label: country } = this.treeSelected.data;

            if (group) {
                type = '';
            } else if (!type && !country) {
                this.$message.error('请选择搜索条件');

                return;
            }

            const result = await this.knowledgeEquipmentSearch(group, type, country);

            if (result) {
                const { group } = this.markSelected.data;

                const data = group ? processGroupData(result) : processCategoryData(result, { flat: true });
                console.log('搜索并添加的最后一个数据', [...data].pop());

                emitter.emit(EventType.RENDER_DATA, data);
                // this.addMapData(data);
                this.emitClosedEvent();
            }
        },
        /**
         * 触发关闭事件
         */
        emitClosedEvent() {
            this.$emit('before-close');
        },
        /**
         * 取消选择数据
         */
        cancelSelected(type) {
            ({ [type]: this[type] } = this.$options.data());
        }
    }
};
</script>

<style lang="scss" scoped>
.map-search-add {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
}

.dialog {
    .dialog-body {
        height: 60vh;
        position: relative;
        display: flex;
        flex-direction: column;

        .row {
            height: 100%;

            &::before {
                content: '';
                width: 2px;
                height: 100%;
                position: absolute;
                top: 0;
                left: calc(50% - 1px);
                background-color: var(--border-color-base);
            }

            .col {
                height: 100%;
            }
        }

        .wrap {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .title {
            margin-bottom: 8px;
        }

        .content {
            height: 100%;
            position: relative;
        }

        .map-category {
            position: absolute;
            top: 0;
            left: 0;
        }

        .map-mark {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .current-selected {
            width: 100%;
            position: absolute;
            bottom: -24px;
            background-color: var(--background-color-dialog);

            .delete {
                margin-left: 8px;
                cursor: pointer;

                &:hover {
                    color: var(--color-text-primary);
                }
            }
        }
    }

    .footer {
    }
}
</style>
