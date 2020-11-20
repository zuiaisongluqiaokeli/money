<template>
    <div class="collapse-item" :class="{sub}">
        <div class="title" @click="clickTitle" :class="{disabled:collapseDisabled}">
            <div class="left">
                <i class="el-icon-arrow-right icon" :class="{active:isExpand}"></i>
                <span>{{title}}</span>
            </div>
            <div @click.stop="clickSwitch">
                <el-switch v-if="showSwitch" v-model="switchValue" :disabled="disabled" :size="sub?'mini':'small'"
                           @change="onSwitchChange"></el-switch>
            </div>
        </div>
        <el-collapse-transition>
            <div v-show="isExpand">
                <slot></slot>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
  export default {
    name    : 'CollapseItem',
    model   : {
      prop : 'value',
      event: 'change'
    },
    props   : {
      title        : {
        type    : String,
        required: true
      },
      value        : {
        type   : Boolean,
        default: false
      },
      showSwitch   : {
        type   : Boolean,
        default: false
      },
      sub          : {
        type   : Boolean,
        default: false
      },
      defaultExpand: {
        type   : Boolean,
        default: true
      },
      disabled     : {
        type   : Boolean,
        default: false
      }
    },
    data () {
      return {
        switchValue: true,
        expand     : true
      }
    },
    computed: {
      collapseDisabled () {
        return this.disabled || (!this.switchValue && this.showSwitch)
      },
      isExpand () {
        return this.expand && !this.disabled
      }
    },
    watch   : {
      value () {
        this.switchValue = this.value
      },
    },
    methods : {
      onSwitchChange () {
        this.$emit('change', this.switchValue)
        this.$emit('update')
      },
      clickSwitch () {
        this.expand = this.switchValue
      },
      clickTitle () {
        !this.collapseDisabled && (this.expand = !this.expand)
      }
    },
    created () {
      this.switchValue = this.value
      this.expand = this.defaultExpand && !this.collapseDisabled
    }
  }
</script>

<style scoped lang="scss">
    .collapse-item {
        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding-bottom: 20px;
            color: var(--color-text-regular);

            .icon {
                transition: all 0.3s linear;
                margin-right: 10px;
                transform: translateY(-2px);
            }

            .active {
                transform: translateY(-2px) rotate(90deg);
            }

            span {
                font-size: 14px;
            }
        }

        .disabled {
            opacity: 0.5;
            cursor: default;
        }
    }

    .sub {
        padding-left: 20px;

        .title span {
            font-size: 14px;
        }
    }
</style>
