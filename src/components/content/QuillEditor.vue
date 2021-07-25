<template>
  <quill-editor v-model="content" />
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'QuillEditor',
  components: {
    quillEditor,
  },
  computed: {
    content: {
      get() {
        return this.$store.state.editorContent
      },
      set(v) {
        this.$store.commit('editContent', v)
      },
    },
  },
}
</script>

<style lang="less" scoped>
</style>