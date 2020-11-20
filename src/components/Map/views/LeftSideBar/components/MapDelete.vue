<template>
  <div id="map-delete"
       class="map-delete">
    <div class="delete-item"
      v-for="item in deleteOptions"
      :key="item.text"
      @click="handlerDelete(item.command)">
      <span>{{item.text}}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name : 'MapDelete',
  props: {

  },
  data () {
    return {
      deleteOptions: [{
        command: 'deleteAll',
        text   : '清空地图',
      }, {
        command: 'delete',
        text   : '删除',
      }]
      
    }
  },
  components: {

  },
  computed: {

  },
  watch: {
    
  },
  methods: {
    ...mapMutations('map',['updateGisEntities']),
    handlerDelete (command) {
      if(command === 'deleteAll'){
        this.updateGisEntities([])
        gisvis.viewer.entities.removeAll()
        console.log('deleteAll');
      }else{
        console.log('delete')
      }
    },
  },
  mounted () {
    
  }
}
</script>

<style lang="scss" scoped>
.map-delete {
  max-height: 385px;
  // 外层容器有padding，滚动调滚不到最顶或最底部，做些处理
  margin: -12px 0;
  padding: 8px 0;
  overflow: auto;

  .delete-item {
    display: flex;
    align-items: center;
    padding: 7px 15px;
    cursor: pointer;

    span {
      margin-left: 10px;
      user-select: none;
    }

    &:hover {
      background-color: #ffffff0a;
    }
  }
}
  
</style>
