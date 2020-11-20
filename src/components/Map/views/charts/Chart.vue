<template>
  <div class="chart">
    <div :id="option.id" :class="{'light-theme':option.theme!=='dark'}"></div>
  </div>
</template>

<script>
  import * as G2Plot from '@antv/g2plot'
  import {
    EVENT_PAINT,
    EVENT_RE_RENDER,
    EVENT_UPDATE_CONFIG,
    EVENT_UPDATE_SERIES_LIST, EVENT_UPDATE_SIZE,
    EVENT_UPDATED,
    eventBus
  } from './js/event'
  import { copyOption, defaultColorList, updateSeriesList } from './js/util'

  export default {
    name   : 'Chart',
    props  : {
      option: {
        type    : Object,
        required: true
      },
      type  : {//Line,Bar...
        type    : String,
        required: true
      }
    },
    data () {
      return {
        plot     : null,
        timer    : null,
        oldOption: {},
        reRender : false,
        colorList: defaultColorList()
      }
    },
    methods: {
      sizeHasChange (option) {
        if (!this.oldOption) return false
        const el=document.getElementsByClassName('chart')[0]
        el.style.width=option.width+'px'
        el.style.height=option.height+'px'
        return this.oldOption.width !== option.width || this.oldOption.height !== option.height
      },
      getCanvasAndData () {
        const el = document.querySelector('#' + this.option.id + '>canvas')
        const canvas = document.createElement('canvas')
        canvas.width = el.width
        canvas.height = el.height
        const ctx = canvas.getContext('2d')
        ctx.putImageData(el.getContext('2d').getImageData(0, 0, el.width, el.height), 0, 0)
        return [canvas, this.plot.getData()]
      },
      getColorList () {
        const seriesList = this.option.seriesList
        if (seriesList.length === 0) {
          if (this.option.color[0] === '') {
            return this.colorList.slice(0, 1)
          } else {
            return this.option.color
          }
        }
        if (seriesList.length === this.option.color.length) return this.option.color
        if (seriesList.length <= this.colorList.length) {
          return this.colorList.slice(0, seriesList.length)
        } else {
          let len = seriesList.length, res = [...this.option.color.filter(val=>val!=='')], colorLen = this.colorList.length
          while (res.length < len) {
            const bias = len - res.length
            res.push(...this.colorList.slice(0, bias > colorLen ? colorLen : bias))
          }
          return res
        }
      },
      setColors () {
        if (this.isWaterfall) return
        const color = this.getColorList()
        if (color !== this.option.color) {
          this.option.color.splice(0, this.option.color.length)
          this.option.color = color
        }
      },
      consoleOption () {
        const option = copyOption(this.option)
        console.log(option)
        if (!this.oldOption) {
          this.oldOption = option
        } else {
          const change = {}
          let bool = true
          Object.keys(this.oldOption).forEach(key => change[key] = [JSON.stringify(this.oldOption[key])])
          Object.keys(option).forEach(key => {
            if (change[key]) {
              change[key].push(JSON.stringify(option[key]))
            } else {
              change[key] = [null, JSON.stringify(option[key])]
            }
            change[key].push(change[key][0] !== change[key][1])
            bool = bool && change[key][0] === change[key][1]
          })
          this.oldOption = option
          console.log('变化', !bool, change)
        }
      },
      updateConfig () {
        this.render()
      },
      repaint () {
        this.reRender = true
        this.render()
      },
      render () {
        if (this.timer) return
        this.timer = setTimeout(() => {
          this.paint()
          this.timer = null
        }, 100)
      },
      paint (option) {
        if (option) {
          Object.assign(this.option, option)
        } else {
          option = this.option
        }
        this.sizeHasChange(option) && this.$emit('updateSize', option.width, option.height, false)
        let seriesChanged = updateSeriesList(option, this)
        this.setColors(option, this)
        if (!this.plot) {
          this.plot = new G2Plot[this.type](option.id, option)
          this.plot.render()
        } else if (this.reRender) {
          this.plot.destroy()
          this.plot = new G2Plot[this.type](option.id, option)
          this.plot.render()
        } else if (this.plot) {
          this.plot.updateConfig(option)
          this.plot.render()
        }
        // this.consoleOption()
        eventBus.$emit(EVENT_UPDATED, copyOption(option))
        if (seriesChanged) {
          eventBus.$emit(EVENT_UPDATE_SERIES_LIST)
        }
      }
    },
    mounted () {
      this.paint()
      eventBus.$on(EVENT_UPDATE_CONFIG, this.updateConfig)
      eventBus.$on(EVENT_RE_RENDER, this.repaint)
      eventBus.$on(EVENT_PAINT, this.paint)
      // eventBus.$on('changeData', (data) => {
      //   plot.changeData(data)
      // })
    },
    beforeDestroy () {
      this.plot.destroy()
      this.plot=null
      eventBus.$off(EVENT_UPDATE_CONFIG, this.updateConfig)
      eventBus.$off(EVENT_RE_RENDER, this.repaint)
      eventBus.$off(EVENT_PAINT, this.paint)
    }
  }
</script>

<style scoped>
  .light-theme {
    background-color: white !important;
  }
</style>
