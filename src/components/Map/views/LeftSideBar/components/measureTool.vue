<template>
    <div id="map-switch" class="map-switch">
        <el-button type="primary" icon="el-icon-add" @click="measureLineSpace">测量距离</el-button>
        <el-button type="primary" icon="el-icon-add" @click="measureAreaSpace">测量面积</el-button>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { emitter, EventType } from "../../../src/EventEmitter";
export default {
    name: '',
    props: {

    },
    data() {
        return { 
            label: true,
            track: true,
        }
    },
    methods: {
        measureLineSpace(){
            gisvis.emitter.emit(EventType.MeasureLineSpace)
        },
        measureAreaSpace(){
            gisvis.emitter.emit(EventType.MeasureAreaSpace)
        }
    },
    mounted() {

    }
}
</script>

<style lang="scss" scoped>
.map-switch {
    max-height: 385px;
    // 外层容器有padding，滚动调滚不到最顶或最底部，做些处理
    margin: -12px 0;
    padding: 8px 0;
    overflow: auto;
    div { 
        margin: 5px 0;
    }
}
</style>
