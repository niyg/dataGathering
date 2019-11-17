<template>
  <div class="search-wrap">
    <el-form
      ref="ruleForm"
      :inline="inline"
      :model="formInline"
      :label-position="labelPosition"
      :label-width="labelWidth"
      :label-suffix="labelSuffix"
      :hide-required-asterisk="hideRequiredAsterisk"
      :inline-message="inlineMessage"
      :status-icon="statusIcon"
      :validate-on-rule-change="validateOnRuleChange"
      :size="size"
      :disabled="disabled"
      @submit.native.prevent
    >
      <el-form-item
        v-for="(item, $index) in data"
        :key="$index"
        :label="item.label"
        :prop="item.field"
        :rules="item.rules"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="formInline[item.field]"
          :placeholder="item.placeholder"
          :clearable="item.clearable"
        />

        <el-select
          v-if="item.type === 'select'"
          v-model="formInline[item.field]"
          :placeholder="item.placeholder"
          :clearable="item.clearable"
          :filterable="item.filterable"
        >
          <el-option
            v-for="citem in item.options"
            :key="item.optionValue ? citem[item.optionValue] : citem.value"
            :label="item.optionLabel ? citem[item.optionLabel] : citem.label"
            :value="item.optionValue ? citem[item.optionValue] : citem.value"
          />
        </el-select>

        <el-switch v-if="item.type === 'switch'" v-model="formInline[item.field]" />

        <el-radio-group v-if="item.type === 'radio'" v-model="formInline[item.field]">
          <el-radio
            v-for="citem in item.options"
            :key="item.optionValue ? citem[item.optionValue] : citem.value"
            :label="item.optionValue ? citem[item.optionValue] : citem.value"
          >{{ item.optionLabel ? citem[item.optionLabel] : citem.label }}</el-radio>
        </el-radio-group>

        <el-date-picker
          v-if="item.type === 'daterange'"
          v-model="formInline[item.field]"
          type="daterange"
          :onPick="item.onPick"
          :value-format="item.valueFormat||'timestamp'"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item v-show="data.length > 0">
        <el-button type="primary" v-waves @click="submitForm('ruleForm')">查询</el-button>
        <el-button v-if="showReset" v-waves @click="resetForm('ruleForm')">重置</el-button>
        <el-button v-if="showExport" @click="exprotForm('ruleForm')">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    // 需要渲染的数据
    data: {
      type: Array,
      default: () => []
    },
    // 表单展示的风格
    inline: {
      type: Boolean,
      default: true
    },
    // 表单域标签的位置
    labelPosition: {
      type: String,
      default: 'right'
    },
    // 表单域标签的宽度
    labelWidth: {
      type: String,
      default: ''
    },
    // 表单域标签的后缀
    labelSuffix: {
      type: String,
      default: ''
    },
    // 是否显示必填字段的标签旁边的红色星号
    hideRequiredAsterisk: {
      type: Boolean,
      default: true
    },
    // 是否显示校验错误信息
    showMessage: {
      type: Boolean,
      default: true
    },
    // 是否以行内形式展示校验信息
    inlineMessage: {
      type: Boolean,
      default: false
    },
    // 是否在输入框中显示校验结果反馈图标
    statusIcon: {
      type: Boolean,
      default: false
    },
    // 是否在 rules 属性改变后立即触发一次验证
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    // 用于控制该表单内组件的尺寸
    size: {
      type: String,
      default: ''
    },
    // 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示重置按钮
    showReset: {
      type: Boolean,
      default: true
    },
    showExport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formInline: {}, // 表单数据
      timeFormat: 'yyyy-MM-dd'
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      for (const item of this.data) {
        this.$set(this.formInline, item.field, item.value)
      }
    },
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('search-submit', this.formInline)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('search-reset', this.formInline)
    },
    exprotForm(formName) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('search-export', this.formInline)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-wrap {
  background-color: @content-bg;
  padding: 20px 20px 0 20px;
}
</style>
