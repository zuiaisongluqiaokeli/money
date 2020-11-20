import ContextMenu from "./views/ContextMenu/index";

export function listenMapEvents(context,rightClickEntity) {
  context.emitter.on('content-menu-show',()=>console.log(12121212),context)
  // context.emitter.on('gis-right-click',(params)=>{
  //   const { entity, position, create } = params;
  //   const { x, y } = position;
  //   rightClickEntity(entity)
  //   context.contextMenu = new ContextMenu({}, context.el);
  //   context.contextMenu.instance.position = {
  //     top: y + "px",
  //     left: x + "px"
  //   };
  // },context)
  // context.emitter.on('gis-context-menu-remove',()=>{
  //   context.contextMenu.destroy();
  //   context.contextMenu = null;
  // },context)
  // context.emitter.on('gis.context-menu-item-click',(data)=>{
  //   console.log(data)
  // },context)
}
