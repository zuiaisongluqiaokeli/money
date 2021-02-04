import Vue from "vue";
import labelPopper from "./labelPopper";

const LablePopperConstructor = Vue.extend(labelPopper);
class addLabelPopper {
  constructor(options) {
    this.instance = new LablePopperConstructor(options);
    this.appendTo();
  }
  //JS式的创建与销毁
  appendTo() {
    this.instance.$mount();
    document.body.appendChild(this.instance.$el);
  }

  destroy() {
    this.instance.$destroy();
    this.instance = null;
  }
}

export {
  addLabelPopper
};

export default addLabelPopper;
