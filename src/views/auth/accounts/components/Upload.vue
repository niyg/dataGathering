<template>
  <div>
    <cropper
      :src="src"
      :crop-button-text="'确认提交'"
      @on-crop="handleCroped"
    />
  </div>
</template>

<script>
import Cropper from '_c/Cropper'
export default {
  components: {
    Cropper
  },
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleCroped(val) {
      this.$emit('on-crop', val)
    }
  }
}
</script>

<style>
</style>
