import router from '@/router'
export default {
  inserted: function(el, binding, vnode) {
    const hasBtnRoles = router.currentRoute.meta.btnRoles
    // const result = hasBtnRoles.some(item => {
    //   return item === binding.value
    // })
    // if (!result) {
    //   el.parentNode.removeChild(el)
    // }
  }
}
