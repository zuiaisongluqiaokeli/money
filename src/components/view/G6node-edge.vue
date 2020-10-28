<template>
    <Graph :vertex-id="vertexId" :graph-name="graphName" :infoData="infoData" ref="Graph"></Graph>
</template>
<script>
import Graph from '@/components/Graph';
export default {
    components: { Graph },
    data() {
        return {
            vertexId: 0,
            graphName: '',
            //这里的ID和start,end一定是字符串切记
            infoData: {
                id: '0',
                name: '3c011fbd-13d1-483b-a45b-409623e721f2',
                vertices: [
                    { id: '26', labels: ['DATAEXA_OBJECT', 'Person'], properties: { name: '鲁班', born: 1997, 创造: '鲁班一号' } },
                    { id: '30', labels: ['DATAEXA_OBJECT', 'Person'], properties: { name: '大明' } },
                    { id: '31', labels: ['DATAEXA_OBJECT', 'Person'], properties: { name: '小明' } },
                    { id: '32', labels: ['DATAEXA_OBJECT', 'Person'], properties: { name: '中明' } }
                ],
                edges: [
                    { id: '7', start: '31', end: '32', type: '父亲', properties: {}, propertiesList: [], edgeIds: [] },
                    { id: '44', start: '32', end: '30', type: '爸爸', properties: {}, propertiesList: [], edgeIds: [] }
                ]
            }
        };
    }
};
</script>