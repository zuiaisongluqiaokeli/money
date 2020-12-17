增删改查：（增加一个实体/修改一个实体/获取一个实体/删除全部实体）
this.viewer.entities.add({})  
this.viewer.entities.getById('')   
this.viewer.removeById('') 
this.viewer.entities.removeAll()  
this.viewer.entities.values.forEach(item=>{})//地图上标记点的所有实体
this.viewer.entities.remove(this.entity); //删除当前实体
//指定集合操作 Data.forEach(item=>this.viewer.entities.add())
//勾选中的实体删除或隐藏的时候先勾选到空白，因为有poper没有被销毁会直接报移动位置错误

标记：一次性创建空的实体移动给其经纬度，左键点击销毁监听事件，触发全局的左键监听
全局的左键监听：带出实体信息依据是否有标记字段进入新增/修改；
移动：用当前该实体执行一次性移动方法，左键点击销毁监听，触发全局的左键监听
移动过程中取消: 如果是标记或者未知位置的移动直接删除实体；如果是已知位置的实体则恢复到之前的位置；
新增：保存成功删除地图上原本的实体新建一个用后端返回ID作为该实体的信息，添加到全局数据，掉渲染接口
修改：全局数据添加去重，更新渲染
删除：删除全局中该数据，销毁地体上实体，更新渲染
搜索：批量绘制数据，更新渲染
左下侧面板：全局数据分类成有经纬度与无经纬度
未知未知: 相当于已有的信息实体去移动更新经纬度
切换雷达：因为该属性存放在另一个数组中；如果数组空先添加，如果有判断数组中是否有该属性，做添加或者切换
测量工具：两个经纬度点绘制一条直线，鼠标移动的时候不断删除上一个经纬度加入下一个；左键真实绘制出每次的最后一个经纬度点
绘制飞行线：给测量工具加入第一个点数据，运行结束真实节点显现出最后一次额经纬度位置
绘制交互线：给定两个点经纬度id等
czl轨迹线：隐藏当前有轨迹线的实体，根据后端参数批量绘制线条，绘制假的实体随时间移动;当前时间大于结束时间重置并清空加的数据显示真的点
地图上点只需要id与经纬度，全局数据需要ID和分组名称和其余参数

//地面光照
var terrainProvider = Cesium.createWorldTerrain({
    requestVertexNormals: true
});
viewer.terrainProvider = terrainProvider;
viewer.scene.globe.enableLighting = true;
//水面效果
var terrainProvider = Cesium.createWorldTerrain({
    requestWaterMask: true
});
viewer.terrainProvider = terrainProvider;
//阴影
viewer.shadows = true
viewer.terrainShadows = true