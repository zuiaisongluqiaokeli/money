<template>
    <div class>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-copy"></i> tab选项卡
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="8" class="left">
                    <span>输入之后调用每个数的检索，然后拿到内容（每个字母底下都其实是一个树）</span>
                    <el-input
                        v-model="filterText"
                        clearable
                        placeholder="请输入分类名称进行过滤"
                        prefix-icon="el-icon-search"
                    ></el-input>
                    <PinyinCountry
                        ref="indexList"
                        :data="powerTreeData"
                        :filter-method="filterMethod"
                    >
                        <template slot-scope="{ label, children }">
                            <el-tree
                                :ref="'tree' + label"
                                key="power"
                                class="filter-tree"
                                accordion
                                :data="children"
                                :filter-node-method="filterPowerNode"
                                highlight-current
                                node-key="id"
                                @node-click="setCurNode"
                            >
                                <span slot-scope="{ node }" class="custom-tree-node">
                                    <span>{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </template>
                    </PinyinCountry>
                </el-col>
                <el-col :span="16">
                    <el-row class="rightHeight">
                        <span>{{ `国家:${node.label}` }}</span>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import PinyinCountry from './PinyinCountry/index';
import powerTreeData from '@/utils/country';
export default {
    name: 'tabs',
    components: {
        PinyinCountry
    },

    watch: {
        filterText(val) {
            this.$refs.indexList.filter(val);
        }
    },
    data() {
        return {
            filterText: '',
            powerTreeData: powerTreeData,
            node:{label:""}
        };
    },
    methods: {
        filterMethod(val, { label }) {
            const tree = this.$refs[`tree${label}`];
            tree.filter(val);
            return !tree.isEmpty;
        },
        filterPowerNode(value, data) {
            if (!value) return true; //显示全部
            return data.label.indexOf(value) !== -1; //显示当前匹配的
        },
        setCurNode(node) {
            this.node.label = node.label
            // 重复点击没反应
            if (this.curNode && node.id === this.curNode.id) return;
            this.curNode = Object.assign({}, node, {
                children: []
            });
        }
    },
    created() {}
};
</script>

<style scoped>
.container {
    padding: 0px;
}
.left {
    padding: 20px;
    border-right: 1px solid #eee;
}
.message-title {
    cursor: pointer;
}
.handle-row {
    margin-top: 30px;
}
.rightHeight{
    height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgb(238, 238, 238);
}
</style>

