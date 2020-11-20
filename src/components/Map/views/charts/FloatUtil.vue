<template>
  <div class="FloatUtil">
    <img :src="undoImge" :class="{disabled:isLastDisabled}" title="撤销" @click="last">
    <img :src="recoveryImg" :class="{disabled:isNextDisabled}" title="恢复" @click="next">
    <img :src="resetImg" :class="{disabled:isResetDisabled}" title="重置为默认" @click="reset">
  </div>
</template>

<script>
  import { EVENT_FORCE_UPDATE, EVENT_PAINT, EVENT_UPDATED, eventBus } from './js/event'
  import { copyOption } from './js/util'
  import { mapState } from 'vuex'

  export default {
    name    : 'FloatUtil',
    props   : {
      history     : {
        type    : Array,
        required: false
      },
      historyIndex: {
        type   : Number,
        default: 0
      }
    },
    data () {
      return {
        optionHistory: [],
        currentIndex : -1,
        fromLast     : false,
        fromNext     : false,
        fromHistory  : false,
      }
    },
    computed: {
      isLastLimit () {
        return this.currentIndex <= 0
      },
      isNextLimit () {
        return this.currentIndex >= this.optionHistory.length - 1
      },
      isLastDisabled () {
        return this.optionHistory.length <= 1 || this.isLastLimit
      },
      isNextDisabled () {
        return this.optionHistory.length <= 1 || this.isNextLimit
      },
      isResetDisabled () {
        return this.currentIndex === 0
      },
      ...mapState('home', ['themeType']),
      isBlack(){
        return this.themeType==='black'
      },
      undoImge(){
        return this.isBlack?require('@/assets/img/chart/undo.svg'):require('@/assets/img/chart/undo-black.png')
      },
      recoveryImg(){
        return this.isBlack?require('@/assets/img/chart/recovery.svg'):require('@/assets/img/chart/recovery-black.png')
      },
      resetImg(){
        return this.isBlack?require('@/assets/img/chart/reset.svg'):require('@/assets/img/chart/reset-black.png')
      }
    },
    methods : {
      getOptionHistory () {
        return [this.optionHistory, this.currentIndex]
      },
      onUpdated (option) {
        if (this.fromHistory) {
          this.fromHistory = false
          return
        }
        if (this.fromLast || this.fromNext) {
          this.fromLast = false
          this.fromNext = false
          eventBus.$emit(EVENT_FORCE_UPDATE)
          return
        }
        // this.optionHistory=[...this.optionHistory.slice(0,this.currentIndex+1)]
        this.optionHistory.splice(this.currentIndex + 1, this.optionHistory.length - this.currentIndex)
        this.optionHistory.push(copyOption(option))
        this.currentIndex = this.optionHistory.length - 1
      },
      last () {
        if (this.isLastDisabled) return
        this.fromLast = true
        const option = this.optionHistory[--this.currentIndex]
        option.chart = this
        eventBus.$emit(EVENT_PAINT, copyOption(option))
      },
      next () {
        if (this.isNextDisabled) return
        this.fromNext = true
        const option = this.optionHistory[++this.currentIndex]
        option.chart = this
        eventBus.$emit(EVENT_PAINT, copyOption(option))
      },
      reset () {
        if (this.isResetDisabled) return
        const option = this.optionHistory[0]
        eventBus.$emit(EVENT_PAINT, copyOption(option))
      }
    },
    created () {
      this.currentIndex = this.historyIndex
      if (this.history.length > 0) {
        this.optionHistory = Object.assign([], this.history)
        this.fromHistory = true
      }
      eventBus.$on(EVENT_UPDATED, this.onUpdated)
    },
    beforeDestroy () {
      eventBus.$off(EVENT_UPDATED, this.onUpdated)
    }
  }
</script>

<style scoped lang="scss">
  .FloatUtil {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    padding: 15px 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    img {
      display: block;
      line-height: 0;
      width: 16px;
      height: 16px;
      margin-right: 24px;
      cursor: pointer;
    }

    .disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }
</style>
