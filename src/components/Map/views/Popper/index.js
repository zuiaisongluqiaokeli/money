import Vue from "vue";
import PopperTemplate from "./Popper";

const PopperConstructor = Vue.extend(PopperTemplate);

class Popper {
  constructor(options) {
    this.instance = new PopperConstructor(options);
    this.appendTo();
  }

  appendTo() {
    this.instance.$mount();
    document.body.appendChild(this.instance.$el);
  }

  destroy() {
    this.instance.$destroy();
    this.instance = null;
  }
}

export { Popper };

export default Popper;
