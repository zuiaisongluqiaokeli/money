
import Vue from "vue";
import selectBox from "./selectBox";

const selectBoxConstruct = Vue.extend(selectBox);

class SelectEntityBox {
  constructor(options) {
    this.instance = new selectBoxConstruct(options);
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

export { SelectEntityBox };

export default SelectEntityBox;
