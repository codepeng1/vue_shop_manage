<template>
  <quill-editor v-model="content" />
</template>

<script>
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