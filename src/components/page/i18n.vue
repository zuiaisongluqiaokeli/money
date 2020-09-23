<template>
    <div>
        {{1+Number($store.getters.money)}}
        <div
            v-for="(item,index) in list"
            :key="index"
            @click="pageRoute(item.money,index)"
        >{{item.id}}---{{item.money}}</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            money: 0,
            list: [
                {
                    id: '12987122',
                    name: '王小虎',
                    amount1: '234',
                    money: '3.2',
                    amount3: 10
                },
                {
                    id: '12987123',
                    name: '王小虎',
                    amount1: '165',
                    money: '4.43',
                    amount3: 12
                },
                {
                    id: '12987124',
                    name: '王小虎',
                    amount1: '324',
                    money: '1.9',
                    amount3: 9
                },
                {
                    id: '12987125',
                    name: '王小虎',
                    amount1: '621',
                    money: '2.2',
                    amount3: 17
                },
                {
                    id: '12987126',
                    name: '王小虎',
                    amount1: '539',
                    money: '4.1',
                    amount3: 15
                }
            ] // table数据
        };
    },
    methods: {
        moneyAdd(val) {
            this.$store.state.theme.money = val
        },
        //跳转页面零钱活动，回调地址方法
        pageRoute(val, index) {
            switch (index) {
                case 0:
                    this.$router.push({
                        path: '/charts',
                        query: { funct: this.moneyAdd, type: '0', money: val }
                    });
                    break;

                default:
                    break;
            }
        }
    }
};
</script>