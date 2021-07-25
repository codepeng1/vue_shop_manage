import Vue from "vue";
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  // 富文本编辑器的值
  editorContent: ''
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store