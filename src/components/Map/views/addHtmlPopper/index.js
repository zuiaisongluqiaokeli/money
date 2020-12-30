import Vue from "vue";
import HtmlPopper from "./HtmlPopper";

const HtmlPopperConstructor = Vue.extend(HtmlPopper);

class addHtmlPopper {
  constructor(options) {
    this.instance = new HtmlPopperConstructor(options);
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

export { addHtmlPopper };

export default addHtmlPopper;
