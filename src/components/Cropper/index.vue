<template>
  <div class="cropper-wrapper">
    <div class="img-box">
      <img
        :id="imgId"
        class="cropper-image"
        alt=""
      >
    </div>
    <div class="right-con">
      <div
        v-if="preview"
        :id="previewId"
        class="preview-box"
      />
      <div class="button-box">
        <slot>
          <el-upload
            :show-file-list="false"
            :auto-upload="false"
            :on-change="beforeUpload"
            accept="image/png,image/gif,image/jpg,image/jpeg"
            action=""
          >
            <el-button style="width: 150px;" type="primary">
              上传图片
            </el-button>
          </el-upload>
        </slot>
        <div v-show="insideSrc" style="margin-top: 10px;">
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="rotate"
          >
            <svg-icon icon-class="rotate" />
          </el-button>
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="shrink"
          >
            <svg-icon icon-class="shrink" />
          </el-button>
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="magnify"
          >
            <svg-icon icon-class="magnify" />
          </el-button>
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="scale('X')"
          >
            <svg-icon icon-class="scaleX" />
          </el-button>
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="scale('Y')"
          >
            <svg-icon icon-class="scaleY" />
          </el-button>
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="move(0, -moveStep)"
          >
            <svg-icon icon-class="top" />
          </el-button>
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="move(-moveStep, 0)"
          >
            <svg-icon icon-class="left" />
          </el-button>
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="move(0, moveStep)"
          >
            <svg-icon icon-class="bottom" />
          </el-button>
          <el-button
            v-waves
            type="primary"
            class="svg-item"
            @click="move(moveStep, 0)"
          >
            <svg-icon icon-class="right" />
          </el-button>
          <div>
            <el-button
              style="width: 150px;margin-top: 10px;"
              type="primary"
              @click="crop"
            >
              {{ cropButtonText }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
export default {
  name: 'Cropper',
  props: {
    src: {
      type: String,
      default: ''
    },
    preview: {
      type: Boolean,
      default: true
    },
    moveStep: {
      type: Number,
      default: 4
    },
    cropButtonText: {
      type: String,
      default: '裁剪'
    }
  },
  data() {
    return {
      cropper: null,
      insideSrc: ''
    }
  },
  computed: {
    imgId() {
      return `cropper${this._uid}`
    },
    previewId() {
      return `cropper_preview${this._uid}`
    }
  },
  watch: {
    src(src) {
      this.replace(src)
    },
    insideSrc(src) {
      this.replace(src)
    }
  },
  mounted() {
    this.$nextTick(() => {
      const dom = document.getElementById(this.imgId)
      this.cropper = new Cropper(dom, {
        preview: `#${this.previewId}`,
        checkCrossOrigin: true
      })
      this.replace(this.src)
    })
  },
  methods: {
    beforeUpload(file) {
      const fileType = 'image/png,image/jpg,image/jpeg'
      if (fileType.includes(file.raw.type)) {
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = (event) => {
          this.insideSrc = event.srcElement.result
        }
        return false
      } else {
        this.$message.warning('请上传正确的图片格式')
      }
    },
    replace(src) {
      this.cropper.replace(src)
      this.insideSrc = src
    },
    rotate() {
      this.cropper.rotate(90)
    },
    shrink() {
      this.cropper.zoom(-0.1)
    },
    magnify() {
      this.cropper.zoom(0.1)
    },
    scale(d) {
      this.cropper[`scale${d}`](-this.cropper.getData()[`scale${d}`])
    },
    move(...argu) {
      this.cropper.move(...argu)
    },
    crop() {
      const base64 = this.cropper.getCroppedCanvas().toDataURL('image/png')
      this.$emit('on-crop', base64)
    }
  }
}
</script>

<style lang="less" scoped>
.bg{
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
}
.cropper-wrapper{
  // width: 600px;
  height: 340px;
  .img-box{
    height: 340px;
    width: 430px;
    border: 1px solid #ebebeb;
    display: inline-block;
    .bg;
    img{
      max-width: 100%;
      display: block;
    }
  }
  .right-con{
    display: inline-block;
    width: 170px;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 10px;
    .preview-box{
      height: 150px !important;
      width: 100% !important;
      overflow: hidden;
      border: 1px solid #ebebeb;
      .bg;
    }
    .button-box{
      padding: 10px 0 0;
    }
  }
}
.svg-item {
  width: 33%;
  border-radius: 5px;
  margin: 0 !important;
  height: 30px;
  font-size: 18px;
  svg {
    position: relative;
    left: -5px;
    top: -5px;
  }
}
</style>
