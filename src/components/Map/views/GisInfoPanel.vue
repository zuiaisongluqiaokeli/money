<template>
    <div class="GisInfoPanel" :class="[panelShow ? 'show-panel' : 'hide-panel']">
        <transition name="el-fade-in-linear">
            <div class="tab-button" @click="panelShow = !panelShow" v-show="!panelShow">
                <div class="text">
                    <i class="iconfont icon-left3"></i>
                    信息面板
                </div>
            </div>
        </transition>
        <div class="panel-content">
            <div class="top"></div>
            <div class="body">
                <div class="content">
                    <div class="close-banner">
                        <i class="text iconfont icon-right3" @click="panelShow = false"></i>
                        <i class="text iconfont" :class="[fixed ? 'icon-ding' : 'icon-ding-normal']" @click="fixedPanel"></i>
                    </div>
                    <el-collapse :value="['1', '2', '3']">
                        <el-collapse-item name="1" title="基本信息">
                            <div class="collapse-body avatar-name" v-show="nameAndAvatar.length > 0">
                                <div class="avatar">
                                    <img :src="nameAndAvatar[1]" v-if="nameAndAvatar[1]" :onerror="errorImg" />
                                    <img v-else :src="defaultImgSrc" />
                                </div>
                                <p class="name">{{ nameAndAvatar[0] }}</p>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="2" title="属性">
                            <div class="collapse-body">
                                <div v-for="val in properties" :key="val[0]" class="properties">
                                    <span class="label">{{ val[0] }}：</span>
                                    <span class="value">{{ val[1] }}</span>
                                </div>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="3" title="标签">
                            <div class="labels collapse-body">
                                <el-tag style="margin-right: 10px" size="mini" v-for="val in labels" :key="val">{{ val }}</el-tag>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { emitter, EventType } from '../src/EventEmitter';
import { mapState } from 'vuex';

export default {
    name: 'GisInfoPanel',
    data() {
        return {
            panelShow: false,
            fixed: false,
            selectedEntity: null,
            errorImg: 'this.src="' + './img/gis/location.png"',
            defaultImgSrc: './img/gis/location.png'
        };
    },
    computed: {
        ...mapState('map', ['gisEntities']),
        entitidy() {
            const e = this.selectedEntity;
            console.log('选中的实体', this.selectedEntity);
            if (e) {
                return this.gisEntities.filter((v) => v.id === e.id.id)[0];
            } else {
                return undefined;
            }
        },
        labels() {
            return this.entity ? this.entity.labels.filter((v) => v !== 'DATAEXA_OBJECT') : [];
        },
        properties() {
            const nameMap = {
                latitude: '纬度',
                longitude: '经度'
            };
            return this.entity
                ? Object.keys(this.entity.properties)
                      .filter((v) => ['avatar', 'name', 'keyVertexId', 'weight', 'color', 'r_doc', 'locus'].indexOf(v) < 0)
                      .map((k) => [nameMap[k] ? nameMap[k] : k, this.entity.properties[k]])
                : [];
        },
        nameAndAvatar() {
            return this.entity ? [this.entity.properties.name, this.entity.properties.avatar] : [];
        }
    },
    methods: {
        fixedPanel() {
            this.fixed = !this.fixed;
            let message = '面板已锁住';
            if (!this.fixed) {
                message = '面板已解锁';
            }
            this.$message.warning({
                message,
                duration: 1500
            });
        },
        onFocus() {
            console.log('dsdsa');
        }
    },
    created() {
        emitter.on(
            EventType.CLICK_BLANK,
            () => {
                this.selectedEntity = null;
                !this.fixed && (this.panelShow = false);
            },
            this
        );
        emitter.on(
            EventType.CLICK_ENTITY,
            (val) => {
                this.selectedEntity = val;
                this.panelShow = true;
            },
            this
        );
    },
    beforeDestroy() {
        emitter.off(EventType.CLICK_BLANK);
        emitter.off(EventType.CLICK_ENTITY);
    }
};
</script>

<style scoped lang="scss">
.GisInfoPanel {
    position: fixed;
    top: 3.58rem;
    right: 0;
    width: 23rem;
    height: calc(100vh - 3.58rem);
    background-color: var(--background-color-panel);
    border-top: 2px var(--color-dark) solid;
    transition: all 0.5s;

    .text {
        color: var(--color-text-regular);
        cursor: pointer;

        &:hover {
            color: var(--color-text-primary);
        }
    }

    .tab-button {
        position: absolute;
        top: calc(50vh - 8.43rem);
        left: -31px;
        width: 31px;
        box-sizing: border-box;
        cursor: pointer;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        background-color: var(--background-color-panel);
        padding: 12px 8px;
    }

    .panel-content {
        display: flex;
        flex-direction: column;
        height: 100%;

        .top {
            flex-shrink: 0;
        }

        .body {
            flex-grow: 1;
            overflow: auto;

            .content {
                .close-banner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px;
                }

                /deep/ .el-collapse-item__header {
                    padding-left: 16px;
                    padding-right: 16px;
                    color: var(--color-text-regular);
                }

                .collapse-body {
                    padding-right: 16px;
                    padding-left: 16px;
                }

                .properties {
                    display: flex;
                    color: var(--color-text-regular);
                    margin: 4px 0;
                    flex-wrap: wrap;

                    // div {
                    //   padding-bottom: 10px;
                    // }

                    .label {
                        display: block;
                        width: 100px;
                        color: var(--color-text-primary);
                        font-weight: var(--font-weight-primary-bold);
                        font-size: var(--font-size-base);
                    }
                    .value {
                        display: block;
                        flex: 1;
                        word-break: break-word;
                    }
                }

                .labels {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .avatar-name {
                    .avatar {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 8.3rem;
                        background-color: var(--background-color-item);
                        img {
                            display: block;
                            width: 8.3rem;
                            height: 100%;
                        }
                    }
                    .name {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
}

.show-panel {
    right: 0;
}

.hide-panel {
    right: -23rem;
}
</style>
