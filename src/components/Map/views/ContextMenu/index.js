import Vue from "vue";
import ContextMenuTemplate from "./ContextMenu";

const ContextMenuConstructor = Vue.extend(ContextMenuTemplate);

class ContextMenu {
  constructor(options, appendTo) {
    this.instance = new ContextMenuConstructor(options);
    this.appendTo(appendTo);
  }

  appendTo(el) {
    this.instance.$mount();

    if (el) {
      el.appendChild(this.instance.$el);
    } else {
      document.body.appendChild(this.instance.$el);
    }
  }

  destroy() {
    this.instance.$destroy();
    this.instance = null;
  }
}

export default ContextMenu;
