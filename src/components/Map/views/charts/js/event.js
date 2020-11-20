import Vue from 'vue'

export const eventBus = new Vue()

export const EVENT_UPDATE_CONFIG = 'updateConfig'
export const EVENT_UPDATE_SERIES_LIST = 'update series list'
export const EVENT_UPDATE_SIZE = 'update size'
export const EVENT_UPDATE_THEME = 'update theme'
export const EVENT_RE_RENDER = 're-render'
export const EVENT_UPDATED = 'updated'
export const EVENT_PAINT = 'paint'
export const EVENT_FORCE_UPDATE='force update'
