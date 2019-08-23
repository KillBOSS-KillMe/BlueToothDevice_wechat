// components/mask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    flag: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideMask() {
      this.triggerEvent('mask', {flag: false})
    }
  }
})
