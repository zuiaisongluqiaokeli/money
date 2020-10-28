<template>
    <div id="wrapper">
        <div class="timebox yuebox" id="yueBox"></div>
        <div class="timebox riqiBox" id="riqiBox"></div>
        <div class="timebox hourbox" id="hourbox"></div>
        <div class="timebox minutebox" id="minutebox"></div>
        <div class="timebox secondbox" id="secondbox"></div>
    </div>
</template>

<script>
export default {
    methods: {
        /*
         * 找所有的东西标签函数
         * */
        findSiblings(tag) {
            let parent = tag.parentNode;
            let childs = parent.children;
            let sb = [];
            for (let i = 0; i <= childs.length - 1; i++) {
                if (childs[i] !== tag) {
                    sb[sb.length] = childs[i];
                }
            }
            return sb;
        },

        /*
         * 去掉所有兄弟的类
         * */
        removeSiblingClass(tag) {
            let sb = this.findSiblings(tag);
            for (let i = 0; i <= sb.length - 1; i++) {
                sb[i].className = '';
            }
        },

        /*
         * 初始化月份函数
         * */
        initMonth() {
            for (let i = 1; i <= 12; i++) {
                let span = document.createElement('span');
                span.innerHTML = i + '月';
                yueBox.appendChild(span);
            }
        },

        // 初始化日期
        initDate() {
            for (let i = 1; i <= 31; i++) {
                let span = document.createElement('span');
                span.innerHTML = i + '日';
                riqiBox.appendChild(span);
            }
        },

        // 初始化小时，分钟，秒
        initHour() {
            for (let i = 0; i <= 23; i++) {
                let h = i;
                let span = document.createElement('span');
                if (h < 10) {
                    h = '0' + h;
                }
                span.innerHTML = h + '点';
                hourbox.appendChild(span);
            }
        },
        initMinute() {
            for (let i = 0; i <= 59; i++) {
                let f = i;
                let span = document.createElement('span');
                if (f < 10) {
                    f = '0' + f;
                }
                span.innerHTML = f + '分';
                minutebox.appendChild(span);
            }
        },
        initSecond() {
            for (let i = 0; i <= 59; i++) {
                let miao = i;
                let span = document.createElement('span');
                if (miao < 10) {
                    miao = '0' + miao;
                }
                span.innerHTML = miao + '秒';
                secondbox.appendChild(span);
            }
        },

        // 时间文字样式切换函数
        changeTime(tag) {
            tag.className = 'on';
            this.removeSiblingClass(tag);
        },

        /*
         * 初始化日历函数
         * */
        initRili() {
            this.initMonth(); // 初始化月份
            this.initDate(); // 初始化日期
            this.initHour(); // 小时
            this.initMinute();
            this.initSecond();
        },

        /*
         * 展示当前时间
         * 参数：mydate 时间对象
         * */
        showNow(mydate) {
            let yue = mydate.getMonth();
            let riqi = mydate.getDate();
            let hour = mydate.getHours();
            let minute = mydate.getMinutes();
            let second = mydate.getSeconds();
            // 时间文字样式切换函数
            this.changeTime(yueBox.children[yue]);
            this.changeTime(riqiBox.children[riqi - 1]);
            this.changeTime(hourbox.children[hour]);
            this.changeTime(minutebox.children[minute]);
            this.changeTime(secondbox.children[second]);
        },

        // 展示时间圆圈函数
        // tag：目标
        // num：数字数量
        // dis：圆圈半径
        textRound(tag, num, dis) {
            let span = tag.children;
            for (let i = 0; i <= span.length - 1; i++) {
                span[i].style.transform = 'rotate(' + (360 / span.length) * i + 'deg)  translateX(' + dis + 'px)';
            }
        },
        /*
         * 旋转指定“圆圈”指定度数
         * */
        rotateTag(tag, deg) {
            tag.style.transform = 'rotate(' + deg + 'deg)';
        },

        main() {
            this.initRili(); // 初始化日历

            setInterval(()=>{
                let mydate = new Date();
                this.showNow(mydate); // 展示当前时间
            }, 1000);

            //  n秒后，摆出圆形
            setTimeout(()=> {
                wrapper.className = 'wrapper';
                this.textRound(yueBox, 12, 40);
                this.textRound(riqiBox, 31, 80);
                this.textRound(hourbox, 24, 120);
                this.textRound(minutebox, 60, 160);
                this.textRound(secondbox, 60, 200);
                setInterval(()=>{
                    let mydate = new Date();
                    this.rotateTag(yueBox, -30 * mydate.getMonth());
                    this.rotateTag(riqiBox, (-360 / 31) * (mydate.getDate() - 1));
                    this.rotateTag(hourbox, (-360 / 24) * mydate.getHours());
                    this.rotateTag(minutebox, -6 * mydate.getMinutes());
                    this.rotateTag(secondbox, -6 * mydate.getSeconds());
                }, 1000);
            }, 6000);
        }
    },
    mounted() {
        let wrapper = document.getElementById('wrapper');
        let yueBox = document.getElementById('yueBox');
        let riqiBox = document.getElementById('riqiBox');
        let hourbox = document.getElementById('hourbox');
        let minutebox = document.getElementById('minutebox');
        let secondbox = document.getElementById('secondbox');
        //this.main();
    }
};
</script>
<style lang="stylus" scoped>
html {
  background: #000;
  color: #666;
  font-size: 12px;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
}

span {
  display: block;
  float: left;
}

.on {
  color: #fff;
}

.wrapper {
  width: 200px;
  height: 200px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -100px;
  margin-left: -100px;
}

.wrapper .timebox {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 0;
  left: 0;
  border-radius: 100%;
  transition: all 0.5s;
}

.timebox span {
  transition: all 0.5s;
  float: left;
}

.wrapper .timebox span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 40px;
  height: 18px;
  margin-top: -9px;
  margin-left: -20px;
  text-align: right;
}
</style>
