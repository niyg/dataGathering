import './ripples.css'

export default {
  inserted(el, binding) {
    el.style.position = 'relative'
    if (JSON.stringify(el.classList).includes('el-button--default')) {
      el.classList.add('ripple-default-wrap')
    } else {
      el.classList.add('ripple-wrap')
    }
    el.addEventListener('click', el, false)
  },
  update(el, binding) {
    el.removeEventListener('click', el, false)
    el.addEventListener('click', el, false)
  },
  unbind(el) {
    el.removeEventListener('click', el, false)
  }
}
