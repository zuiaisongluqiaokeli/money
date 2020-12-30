import Vue from "vue";
import dragPopperVue from "./dragPopper";

const dragPopperrConstructor = Vue.extend(dragPopperVue);

class dragPopper {
  constructor(options) {
    this.instance = new dragPopperrConstructor(options);
    this.appendTo();
  }
  //JS式的创建与销毁
  appendTo() {
    this.instance.$mount();
    document.getElementById("popperWrap").appendChild(this.instance.$el);
  }

  destroy() {
    this.instance.$destroy();
    this.instance = null;
  }
}

export { dragPopper };

export default dragPopper;
