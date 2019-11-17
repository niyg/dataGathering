import directive from './directives'

const importDirective = Vue => {
  /**
   * 弹窗拖拽指令 v-drag
   */
  Vue.directive('drag', directive.drag)
  /**
   * 按钮水波纹指令 v-waves
   */
  Vue.directive('waves', directive.waves)
  /**
   * 按钮涟漪指令 v-ripples
   */
  Vue.directive('ripples', directive.ripples)
  /**
   * 权限指令 v-permission
   */
  Vue.directive('permission', directive.permission)
}

export default importDirective
